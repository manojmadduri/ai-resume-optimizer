const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  filename: String,
  originalFormat: String,
  parsedData: Object, // Stores parsed resume sections
  updatedData: Object, // Stores AI-modified resume
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Resume", ResumeSchema);
