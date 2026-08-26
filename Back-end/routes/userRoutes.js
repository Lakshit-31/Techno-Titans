const express = require("express");
const User = require("../models/usermodel");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, email, profileImage } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    if (name) {
      user.name = name;
    }
    if (email && email !== user.email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: user._id },
      });
      if (existingUser) {
        return res.status(400).json({
          message: "Email already in use",
        });
      }

      user.email = email;
    }
    if (profileImage !== undefined) {
      user.profileImage = profileImage;
    }
    await user.save();
    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;
