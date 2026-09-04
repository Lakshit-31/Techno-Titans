const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    dateTime: {
      type: Date,
      required: [true, 'Date & Time is required'],
    },
    price: {
      type: Number,
      required: [true, 'Ticket price is required'],
      min: 0,
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats capacity is required'],
      min: 1,
    },
    seatsAvailable: {
      type: Number,
      required: true,
    },
    hasSeatMap: {
      type: Boolean,
      default: false,
    },
    seatMapConfig: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Showtime', showtimeSchema);
