const Showtime = require('../models/Showtime');
const Event = require('../models/Event');
const Category = require('../models/Category');
const { generateSeatsForShowtime } = require('../utils/seatGenerator');

// @desc    Get showtimes for an event
const getShowtimesByEvent = async (req, res, next) => {
  try {
    const showtimes = await Showtime.find({ event: req.params.eventId }).sort({ dateTime: 1 });
    res.json(showtimes);
  } catch (err) {
    next(err);
  }
};

// @desc    Create new showtime for an event
const createShowtime = async (req, res, next) => {
  try {
    const { eventId, dateTime, price, totalSeats, hasSeatMap: requestedHasSeatMap } = req.body;

    if (!eventId || !dateTime || price === undefined) {
      return res.status(400).json({ message: 'Event ID, dateTime, and price are required' });
    }

    const event = await Event.findById(eventId).populate('category');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Ownership check
    if (event.organiser.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to add showtimes for this event' });
    }

    const isMovie = event.category?.slug === 'movies';
    const hasSeatMap = requestedHasSeatMap !== undefined ? requestedHasSeatMap : isMovie;

    let finalTotalSeats = parseInt(totalSeats, 10);
    let seatMapConfig = null;

    if (hasSeatMap) {
      seatMapConfig = {
        rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'],
        seatsPerRowLeft: 8,
        seatsPerRowRight: 8,
      };
      // If totalSeats not specified for seat map, default to total generated seats (15 * 16 = 240)
      if (!finalTotalSeats || isNaN(finalTotalSeats)) {
        finalTotalSeats = 240;
      }
    } else {
      if (!finalTotalSeats || isNaN(finalTotalSeats)) {
        finalTotalSeats = 100;
      }
    }

    const showtime = await Showtime.create({
      event: eventId,
      dateTime: new Date(dateTime),
      price: parseFloat(price),
      totalSeats: finalTotalSeats,
      seatsAvailable: finalTotalSeats,
      hasSeatMap,
      seatMapConfig,
    });

    if (hasSeatMap) {
      const generatedCount = await generateSeatsForShowtime(showtime._id, seatMapConfig);
      if (generatedCount !== finalTotalSeats) {
        showtime.totalSeats = generatedCount;
        showtime.seatsAvailable = generatedCount;
        await showtime.save();
      }
    }

    res.status(201).json(showtime);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getShowtimesByEvent,
  createShowtime,
};
