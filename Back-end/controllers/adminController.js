const Event = require("../models/Event");
const Booking = require("../models/Booking");
const User = require("../models/usermodel");

exports.dashboard = async (_req, res, next) => {
  try {
    const [events, confirmed, cancelled, revenue, recentBookings] = await Promise.all([
      Event.find(), Booking.countDocuments({ status: "Confirmed" }), Booking.countDocuments({ status: "Cancelled" }),
      Booking.aggregate([{ $match: { status: "Confirmed" } }, { $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
      Booking.find().sort({ createdAt: -1 }).limit(8).populate("event", "title").populate("user", "name email"),
    ]);
    res.json({ totalEvents: events.length, upcomingEvents: events.filter((event) => event.date >= new Date()).length, totalBookings: confirmed + cancelled, confirmedBookings: confirmed, cancelledBookings: cancelled, totalAvailableSeats: events.reduce((sum, event) => sum + event.availableSeats, 0), totalOccupiedSeats: events.reduce((sum, event) => sum + event.bookedSeats.length, 0), totalRevenue: revenue[0]?.total || 0, recentBookings });
  } catch (error) { next(error); }
};

exports.listBookings = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.event) filter.event = req.query.event;
    if (req.query.status) filter.status = req.query.status;
    const bookings = await Booking.find(filter).sort({ createdAt: -1 }).populate("event", "title").populate("user", "name email");
    const search = req.query.search?.toLowerCase();
    res.json(search ? bookings.filter((b) => `${b.user.name} ${b.user.email} ${b.event.title}`.toLowerCase().includes(search)) : bookings);
  } catch (error) { next(error); }
};

exports.listUsers = async (_req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 }).lean();
    const bookingCounts = await Booking.aggregate([{ $group: { _id: "$user", total: { $sum: 1 }, active: { $sum: { $cond: [{ $eq: ["$status", "Confirmed"] }, 1, 0] } } } }]);
    const counts = new Map(bookingCounts.map((item) => [item._id.toString(), item]));
    res.json(users.map((user) => ({ ...user, bookingSummary: counts.get(user._id.toString()) || { total: 0, active: 0 } })));
  } catch (error) { next(error); }
};
