const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 📌 1️⃣ User Registration (Signup)
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      jobPreferences: [],
      subscribedToAlerts: true,
      fcmToken: "",
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

// 📌 2️⃣ User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

// 📌 3️⃣ Fetch User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user profile" });
  }
};

// 📌 4️⃣ Update Job Preferences
exports.updateJobPreferences = async (req, res) => {
  try {
    const { userId, jobPreferences, subscribedToAlerts } = req.body;

    await User.findByIdAndUpdate(userId, { jobPreferences, subscribedToAlerts });

    res.json({ message: "Job preferences updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update job preferences" });
  }
};

// 📌 5️⃣ Save Push Notification Token
exports.saveUserToken = async (req, res) => {
  try {
    const { userId, token } = req.body;
    await User.findByIdAndUpdate(userId, { fcmToken: token });

    res.json({ message: "Notification token saved!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save token" });
  }
};
