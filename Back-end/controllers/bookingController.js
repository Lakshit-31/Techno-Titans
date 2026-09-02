const Booking = require("../models/Booking");
const Event = require("../models/Event");

exports.createBooking = async (req, res) => {
  try {
    const { eventId, numberOfTickets } = req.body;

    if (!eventId || !numberOfTickets || numberOfTickets < 1) {
      return res.status(400).json({ message: "Provide eventId and a valid numberOfTickets (>= 1)" });
    }

    // 1. Verify event exists and is published
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.status !== "published") return res.status(400).json({ message: "Event is not available for booking" });

    // 2. Atomic update to check availability and decrement available tickets
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, availableTickets: { $gte: numberOfTickets } },
      { $inc: { availableTickets: -numberOfTickets, soldTickets: numberOfTickets } },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(400).json({ message: `Cannot book ${numberOfTickets} tickets. Only ${event.availableTickets} available.` });
    }

    // 3. Create booking
    const totalAmount = updatedEvent.ticketPrice * numberOfTickets;
    const booking = new Booking({
      userId: req.user.id,
      eventId: updatedEvent._id,
      numberOfTickets,
      totalAmount,
      bookingStatus: "confirmed"
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("eventId", "title date location ticketPrice image status")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("eventId");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (booking.bookingStatus === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    // Restore tickets
    await Event.findByIdAndUpdate(booking.eventId, {
      $inc: { availableTickets: booking.numberOfTickets, soldTickets: -booking.numberOfTickets }
    });

    booking.bookingStatus = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
