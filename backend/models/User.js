const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  jobPreferences: [String], // Skills & job titles user wants alerts for
  subscribedToAlerts: { type: Boolean, default: true },
});

module.exports = mongoose.model("User", UserSchema);
