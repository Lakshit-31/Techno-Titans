const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const Seat = require('../models/Seat');

// Helper to generate booking reference code
const generateBookingRef = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `BMS-${randomNum}`;
};

// @desc    Create a new booking (Simulated checkout & dummy payment)
const createBooking = async (req, res, next) => {
  try {
    const { showtimeId, numTickets, seatIds, paymentMethod, maskedPaymentDetail } = req.body;

    const showtime = await Showtime.findById(showtimeId).populate('event');
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    let count = 0;
    let selectedSeats = [];
    let seatNamesList = [];

    if (Array.isArray(seatIds) && seatIds.length > 0) {
      count = seatIds.length;

      // Re-validate seats in database to prevent double-booking
      selectedSeats = await Seat.find({
        _id: { $in: seatIds },
        showtime: showtimeId,
        status: 'AVAILABLE',
      });

      if (selectedSeats.length !== seatIds.length) {
        return res.status(400).json({
          message: 'One or more selected seats are no longer available. Please choose available seats.',
        });
      }

      seatNamesList = selectedSeats.map((s) => `${s.row}${s.number}`);
    } else {
      count = parseInt(numTickets, 10);
      if (!count || count < 1) {
        return res.status(400).json({ message: 'Please select at least 1 ticket' });
      }
    }

    if (showtime.seatsAvailable < count) {
      return res.status(400).json({
        message: `Only ${showtime.seatsAvailable} ticket(s) available for this showtime`,
      });
    }

    // Atomic seat capacity decrement to prevent overbooking
    const updatedShowtime = await Showtime.findOneAndUpdate(
      { _id: showtimeId, seatsAvailable: { $gte: count } },
      { $inc: { seatsAvailable: -count } },
      { new: true }
    );

    if (!updatedShowtime) {
      return res.status(400).json({
        message: 'Booking failed due to high demand. Please try again.',
      });
    }

    const totalAmount = showtime.price * count;
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const bookingId = `BKG-${Date.now()}-${randomCode}`;
    const bookingRef = bookingId;

    const booking = new Booking({
      user: req.user._id,
      showtime: showtimeId,
      numTickets: count,
      seats: selectedSeats.map((s) => s._id),
      seatNames: seatNamesList,
      totalAmount,
      paymentMethod: paymentMethod || 'SIMULATED',
      maskedPaymentDetail: maskedPaymentDetail || '',
      status: 'CONFIRMED',
      bookingId,
      bookingRef,
    });

    const savedBooking = await booking.save();

    // Mark seats as SOLD if seats were selected
    if (selectedSeats.length > 0) {
      await Seat.updateMany(
        { _id: { $in: selectedSeats.map((s) => s._id) } },
        { status: 'SOLD', booking: savedBooking._id }
      );
    }

    const populated = await Booking.findById(savedBooking._id).populate({
      path: 'showtime',
      populate: { path: 'event' },
    });

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged in user's booking history
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'showtime',
        populate: { path: 'event', populate: { path: 'category' } },
      })
      .populate('seats')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel a booking & restore seats
const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId
      ? { $or: [{ _id: id }, { bookingId: id }, { bookingRef: id }] }
      : { $or: [{ bookingId: id }, { bookingRef: id }] };

    const booking = await Booking.findOne(query);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const bookingUserId = (booking.user._id || booking.user).toString();
    if (bookingUserId !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'CANCELLED';
    await booking.save();

    // Release seat documents if seat map was used
    if (booking.seats && booking.seats.length > 0) {
      await Seat.updateMany(
        { _id: { $in: booking.seats } },
        { status: 'AVAILABLE', booking: null }
      );
    }

    // Restore seat capacity count back to the showtime
    const showtimeId = booking.showtime._id ? booking.showtime._id : booking.showtime;
    if (showtimeId) {
      await Showtime.findByIdAndUpdate(showtimeId, {
        $inc: { seatsAvailable: booking.numTickets },
      });
    }

    res.json({ message: 'Booking cancelled successfully. Seats restored to showtime.', booking });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
};
