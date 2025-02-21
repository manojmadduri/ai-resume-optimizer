require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cron = require("node-cron");
const admin = require("./utils/firebaseAdmin");

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const jobRoutes = require("./routes/jobRoutes");
const userRoutes = require("./routes/userRoutes");

const { sendJobAlertsToUsers } = require("./services/jobService");

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/user", userRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

// Schedule Job Alerts (Runs Every 12 Hours)
cron.schedule("0 */12 * * *", async () => {
  console.log("🔔 Running scheduled job alert task...");
  await sendJobAlertsToUsers();
});

// Home Route
app.get("/", (req, res) => {
  res.send("✅ AI Resume Optimizer Backend Running");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
