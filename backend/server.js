const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config(); // Load environment variables

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Import route files
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const activityRoutes = require("./routes/activityRoutes");
const userRoutes = require("./routes/userRoutes"); // ✅ Add this
const adminRoutes = require('./routes/adminRoutes');

const { protect } = require("./middleware/authMiddleware");

// ✅ Use routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/user", userRoutes);        // ✅ This includes /profile and /all
app.use("/api/activity", activityRoutes); // ✅ Better clarity: move activity to its own base path
app.use('/api/admin', adminRoutes);

// Sample protected route
app.get("/api/protected", protect, (req, res) => {
  res.json({ message: `Hello ${req.user.role}! Access granted.` });
});

// MongoDB connection and server start
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
