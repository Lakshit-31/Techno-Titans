const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

// @desc    Get platform overview analytics
const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'USER' });
    const totalOrganisers = await User.countDocuments({ role: 'ORGANISER' });
    const pendingOrganisers = await User.countDocuments({ role: 'ORGANISER', organiserStatus: 'PENDING' });
    const totalEvents = await Event.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const confirmedBookings = await Booking.find({ status: 'CONFIRMED' });
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalAmount, 0);

    res.json({
      totalUsers,
      totalOrganisers,
      pendingOrganisers,
      totalEvents,
      totalBookings,
      totalRevenue,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all registered users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password_hash').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// @desc    Update user status / role
const updateUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.body.role) {
      user.role = req.body.role;
    }
    if (req.body.organiserStatus) {
      user.organiserStatus = req.body.organiserStatus;
    }

    await user.save();
    res.json({ message: 'User status updated successfully', user });
  } catch (err) {
    next(err);
  }
};

// @desc    Get pending organiser approval requests
const getPendingOrganisers = async (req, res, next) => {
  try {
    const pending = await User.find({ role: 'ORGANISER', organiserStatus: 'PENDING' })
      .select('-password_hash')
      .sort({ createdAt: -1 });

    res.json(pending);
  } catch (err) {
    next(err);
  }
};

// @desc    Approve organiser account
const approveOrganiser = async (req, res, next) => {
  try {
    const organiser = await User.findById(req.params.id);
    if (!organiser || organiser.role !== 'ORGANISER') {
      return res.status(404).json({ message: 'Organiser account not found' });
    }

    organiser.organiserStatus = 'APPROVED';
    await organiser.save();

    res.json({ message: `Organiser '${organiser.name}' has been APPROVED`, organiser });
  } catch (err) {
    next(err);
  }
};

// @desc    Reject organiser account
const rejectOrganiser = async (req, res, next) => {
  try {
    const organiser = await User.findById(req.params.id);
    if (!organiser || organiser.role !== 'ORGANISER') {
      return res.status(404).json({ message: 'Organiser account not found' });
    }

    organiser.organiserStatus = 'REJECTED';
    await organiser.save();

    res.json({ message: `Organiser '${organiser.name}' has been REJECTED`, organiser });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all events (Admin view)
const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find({})
      .populate('category', 'name slug')
      .populate('organiser', 'name email organiserStatus')
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle feature event banner
const toggleFeatureEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.isFeatured = !event.isFeatured;
    await event.save();

    res.json({ message: `Event featured status set to ${event.isFeatured}`, event });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStats,
  getUsers,
  updateUserStatus,
  getPendingOrganisers,
  approveOrganiser,
  rejectOrganiser,
  getAllEvents,
  toggleFeatureEvent,
};
