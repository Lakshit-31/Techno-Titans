const Event = require("../models/Event");
const Booking = require("../models/Booking");

exports.getDashboardStats = async (req, res) => {
  try {
    const managerId = req.user.id;

    const events = await Event.find({ createdBy: managerId });
    const eventIds = events.map(e => e._id);

    const bookings = await Booking.find({ eventId: { $in: eventIds }, bookingStatus: "confirmed" });

    const totalEvents = events.length;
    const publishedEvents = events.filter(e => e.status === "published").length;
    const upcomingEvents = events.filter(e => e.date >= new Date()).length;

    let totalTickets = 0;
    let ticketsSold = 0;
    let availableTickets = 0;
    let totalRevenue = 0;

    events.forEach(e => {
      totalTickets += e.totalTickets;
      ticketsSold += e.soldTickets;
      availableTickets += e.availableTickets;
    });

    bookings.forEach(b => {
      totalRevenue += b.totalAmount;
    });

    res.json({
      totalEvents,
      publishedEvents,
      upcomingEvents,
      totalTickets,
      ticketsSold,
      availableTickets,
      totalRevenue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getManagerEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getEventBookings = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findOne({ _id: eventId, createdBy: req.user.id });
    
    if (!event) {
      return res.status(404).json({ message: "Event not found or you don't have permission" });
    }

    const bookings = await Booking.find({ eventId }).populate("userId", "name email").sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
