import { useState, useEffect } from "react";
import API from "../utils/api";
import { requestNotificationPermission, onMessageListener } from "../utils/firebase";

const ModifyResume = () => {
  const [resumeId, setResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [updatedResume, setUpdatedResume] = useState(null);
  const [resumeScore, setResumeScore] = useState(null);
  const [optimizedResume, setOptimizedResume] = useState(null);
  const [notification, setNotification] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [jobAlerts, setJobAlerts] = useState([]);

  // Request notification permissions & listen for job alerts
  useEffect(() => {
    requestNotificationPermission().then(token => {
      if (token) {
        setUserToken(token);
        API.post("/user/save-token", { userId: "USER_ID", token });
      }
    });

    onMessageListener().then(payload => {
      setNotification(payload.notification);
    }).catch(err => console.log("Notification error: ", err));
  }, []);

  // Handle Resume Modification
  const handleModify = async () => {
    try {
      const res = await API.post("/resume/modify", { resumeId, jobDescription });
      setUpdatedResume(res.data.updatedResume);
    } catch (error) {
      alert("Modification failed");
    }
  };

  // Handle AI Resume Scoring
  const handleScore = async () => {
    try {
      const res = await API.post("/resume/score", { resumeId, jobDescription });
      setResumeScore(res.data.scoringResult);
    } catch (error) {
      alert("Scoring failed");
    }
  };

  // Handle ATS Optimization
  const handleATSOptimization = async () => {
    try {
      const res = await API.post("/resume/optimize-ats", { resumeId, jobDescription });
      setOptimizedResume(res.data.atsOptimizedResume);
    } catch (error) {
      alert("ATS optimization failed");
    }
  };

  // Handle Resume Download (ATS-Optimized)
  const handleATSDownload = async (format) => {
    const response = await API.get(`/resume/download-ats?resumeId=${resumeId}&format=${format}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ATS_Optimized_Resume.${format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Job Matching & Notifications
  const handleJobSearch = async () => {
    try {
      const skills = jobDescription.split(" ").slice(0, 5); // Extract top skills from JD
      const res = await API.post("/jobs", { userId: "USER_ID", skills });
      setJobAlerts([...res.data.linkedinJobs, ...res.data.indeedJobs]);
    } catch (error) {
      alert("Job search failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Modify Resume</h1>

      {/* Resume ID & JD Input */}
      <input type="text" placeholder="Resume ID" className="border p-2 mb-2" onChange={(e) => setResumeId(e.target.value)} />
      <textarea placeholder="Enter Job Description" className="border p-2 mb-2" onChange={(e) => setJobDescription(e.target.value)}></textarea>

      {/* Resume Modification & Scoring */}
      <button onClick={handleModify} className="bg-blue-500 text-white px-4 py-2">Modify Resume</button>
      <button onClick={handleScore} className="bg-yellow-500 text-white px-4 py-2 ml-2">Get AI Score</button>

      {/* ATS Optimization */}
      <button onClick={handleATSOptimization} className="bg-purple-500 text-white px-4 py-2 ml-2">Optimize for ATS</button>

      {/* Download ATS-Optimized Resume */}
      <button onClick={() => handleATSDownload("pdf")} className="bg-green-500 text-white px-4 py-2 mt-2">
        Download ATS PDF
      </button>
      <button onClick={() => handleATSDownload("docx")} className="bg-blue-500 text-white px-4 py-2 mt-2 ml-2">
        Download ATS DOCX
      </button>

      {/* Job Search */}
      <button onClick={handleJobSearch} className="bg-red-500 text-white px-4 py-2 mt-2 ml-2">
        Find Matching Jobs
      </button>

      {/* Display Results */}
      {updatedResume && <pre className="mt-4 bg-gray-100 p-4">{JSON.stringify(updatedResume, null, 2)}</pre>}
      {resumeScore && <pre className="mt-4 bg-yellow-100 p-4">AI Score: {resumeScore}</pre>}
      {optimizedResume && <pre className="mt-4 bg-gray-100 p-4">{JSON.stringify(optimizedResume, null, 2)}</pre>}

      {/* Job Alerts Display */}
      {jobAlerts.length > 0 && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h2 className="text-xl mb-2">Matching Jobs</h2>
          <ul>
            {jobAlerts.map((job, index) => (
              <li key={index} className="border p-2 mb-2">
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p>{job.company} - {job.location}</p>
                <a href={job.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">Apply Here</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Push Notification Display */}
      {notification && (
        <div className="mt-4 bg-yellow-100 p-4 rounded">
          <strong>{notification.title}</strong>
          <p>{notification.body}</p>
        </div>
      )}
    </div>
  );
};

export default ModifyResume;
