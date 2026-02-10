const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Sign Up Controller
const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Block direct admin signup: users must request admin approval
    if (role && role.toLowerCase() === "admin") {
      return res.status(403).json({ message: "Admin access requires approval from admin: keerthigowli05@gmail.com" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Force role to 'user' for signups
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send response
    res.status(201).json({
      token,
      role: user.role,
      userId: user._id,
      user,
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Update lastLogin and increment loginCount
    try {
      await User.findByIdAndUpdate(user._id, { $inc: { loginCount: 1 }, $set: { lastLogin: new Date() } });
    } catch (err) {
      console.warn('Could not update lastLogin/loginCount:', err.message);
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send response
    res.json({
      token,
      role: user.role,
      userId: user._id,
      user,
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signup, login };
