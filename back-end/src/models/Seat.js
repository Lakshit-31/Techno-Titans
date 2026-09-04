const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema(
  {
    showtime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Showtime',
      required: true,
      index: true,
    },
    row: {
      type: String,
      required: true,
      trim: true,
    },
    number: {
      type: Number,
      required: true,
    },
    section: {
      type: String,
      enum: ['left', 'right'],
      required: true,
    },
    seatType: {
      type: String,
      enum: ['REGULAR', 'WHEELCHAIR', 'COMPANION'],
      default: 'REGULAR',
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'SOLD'],
      default: 'AVAILABLE',
      index: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast seat lookups per showtime
seatSchema.index({ showtime: 1, row: 1, number: 1 }, { unique: true });

module.exports = mongoose.model('Seat', seatSchema);
