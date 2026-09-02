const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/usermodel");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

// Register
router.post("/register", async (req, res) => {
  try {
<<<<<<< Updated upstream
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
=======
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
>>>>>>> Stashed changes
      return res.status(400).json({
        message: "Provide a name, valid email, and password of at least 8 characters",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === "event_manager" ? "event_manager" : "user";
    const user = new User({
      name,
      email,
      password: hashedPassword,
<<<<<<< Updated upstream
      role: "student",
=======
      role: userRole,
>>>>>>> Stashed changes
    });

    await user.save();
    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

<<<<<<< Updated upstream
// User auth
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// Logout user
router.post("/logout", (req, res) => {
  res.status(200).json({
    message: "Logout successful",
  });
});
=======
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

>>>>>>> Stashed changes
module.exports = router;
