const express = require("express");
const {
  register,
  login,
  getUserProfile,
  updateJobPreferences,
  saveUserToken,
} = require("../controllers/userController");

const router = express.Router();

// 📌 User Authentication Routes
router.post("/register", register);
router.post("/login", login);
router.get("/profile", getUserProfile);

// 📌 Job Preferences & Notifications
router.post("/update-preferences", updateJobPreferences);
router.post("/save-token", saveUserToken);

module.exports = router;
