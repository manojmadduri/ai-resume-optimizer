const express = require("express");
const { uploadResume, modifyResume } = require("../controllers/resumeController");
const router = express.Router();

router.post("/upload", uploadResume);
router.post("/modify", modifyResume);
router.get("/download", downloadResume);

module.exports = router;
