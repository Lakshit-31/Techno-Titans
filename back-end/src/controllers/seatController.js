const Seat = require('../models/Seat');
const Showtime = require('../models/Showtime');

// @desc    Get full live seat map for a showtime
// @route   GET /api/seats/showtime/:showtimeId
// @access  Public
const getSeatsByShowtime = async (req, res, next) => {
  try {
    const { showtimeId } = req.params;

    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }

    const seats = await Seat.find({ showtime: showtimeId }).sort({ row: 1, number: 1 });

    res.json({
      showtimeId,
      hasSeatMap: showtime.hasSeatMap,
      seats,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSeatsByShowtime,
};
