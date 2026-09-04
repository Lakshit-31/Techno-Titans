const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register a new user or organiser
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, city, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Prevent direct registration as ADMIN via API
    if (role === 'ADMIN') {
      return res.status(403).json({ message: 'Self-registration as ADMIN is prohibited' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const assignedRole = role === 'ORGANISER' ? 'ORGANISER' : 'USER';
    const organiserStatus = assignedRole === 'ORGANISER' ? 'PENDING' : null;

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password_hash: password,
      phone: phone || '',
      city: city || 'Mumbai',
      role: assignedRole,
      organiserStatus,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      role: user.role,
      organiserStatus: user.organiserStatus,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Authenticate user & get token
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password_hash');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        role: user.role,
        organiserStatus: user.organiserStatus,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user profile
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password_hash');
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// @desc    Update user profile
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.city = req.body.city || user.city;

    if (req.body.password) {
      user.password_hash = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      city: updatedUser.city,
      role: updatedUser.role,
      organiserStatus: updatedUser.organiserStatus,
      token: generateToken(updatedUser._id),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
};
