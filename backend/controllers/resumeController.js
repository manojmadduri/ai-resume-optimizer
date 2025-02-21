const Resume = require("../models/Resume");
const multer = require("multer");
const { processResume, scoreResume, optimizeForATS } = require("../services/aiService");
const { generateATSResumeFile } = require("../services/fileHandler");
const { sendPushNotification } = require("../services/notificationService");
const { fetchJobs, fetchIndeedJobs } = require("../services/jobService");

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("resume");

// 📌 1️⃣ Upload Resume
exports.uploadResume = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ error: "File upload failed" });

    const newResume = await Resume.create({
      userId: req.user.userId,
      filename: req.file.originalname,
      originalFormat: req.file.mimetype,
      parsedData: {}, // Placeholder for parsed resume
    });

    res.status(201).json({ message: "Resume uploaded", resumeId: newResume._id });
  });
};

// 📌 2️⃣ Modify Resume Based on Job Description
exports.modifyResume = async (req, res) => {
  const { resumeId, jobDescription } = req.body;
  const resume = await Resume.findById(resumeId);
  if (!resume) return res.status(404).json({ error: "Resume not found" });

  const updatedResume = await processResume(resume.parsedData, jobDescription);
  resume.updatedData = updatedResume;
  await resume.save();

  res.json({ message: "Resume updated successfully", updatedResume });
};

// 📌 3️⃣ AI Resume Scoring & ATS Fixes
exports.getResumeScore = async (req, res) => {
  const { resumeId, jobDescription } = req.body;
  const resume = await Resume.findById(resumeId);
  if (!resume) return res.status(404).json({ error: "Resume not found" });

  const scoringResult = await scoreResume(resume.parsedData, jobDescription);
  res.json({ message: "Scoring complete", scoringResult });
};

// 📌 4️⃣ Optimize Resume for ATS
exports.optimizeResume = async (req, res) => {
  const { resumeId, jobDescription } = req.body;
  const resume = await Resume.findById(resumeId);
  if (!resume) return res.status(404).json({ error: "Resume not found" });

  const atsOptimizedResume = await optimizeForATS(resume.parsedData, jobDescription);
  resume.updatedData = atsOptimizedResume;
  await resume.save();

  res.json({ message: "Resume optimized for ATS", atsOptimizedResume });
};

// 📌 5️⃣ Download ATS-Optimized Resume
exports.downloadATSResume = async (req, res) => {
  const { resumeId, format } = req.query;
  const resume = await Resume.findById(resumeId);
  if (!resume) return res.status(404).json({ error: "Resume not found" });

  const fileBuffer = await generateATSResumeFile(resume.updatedData, format);
  res.setHeader("Content-Disposition", `attachment; filename=ATS_Optimized_Resume.${format}`);
  res.send(fileBuffer);
};

// 📌 6️⃣ Get Matching Jobs & Send Notifications
exports.getJobMatches = async (req, res) => {
  const { userId, skills } = req.body;
  const query = skills.join(" ");

  const [linkedinJobs, indeedJobs] = await Promise.all([
    fetchJobs(query),
    fetchIndeedJobs(query),
  ]);

  const allJobs = [...linkedinJobs, ...indeedJobs];

  if (allJobs.length > 0) {
    await sendPushNotification(userId, allJobs);
  }

  res.json({ message: "Job matches retrieved", linkedinJobs, indeedJobs });
};
