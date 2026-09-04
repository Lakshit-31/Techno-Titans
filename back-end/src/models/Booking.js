const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    showtime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Showtime',
      required: true,
    },
    numTickets: {
      type: Number,
      required: true,
      min: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    seats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seat',
      },
    ],
    seatNames: [
      {
        type: String,
      },
    ],
    paymentMethod: {
      type: String,
      enum: ['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'SIMULATED'],
      default: 'SIMULATED',
    },
    maskedPaymentDetail: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED'],
      default: 'CONFIRMED',
    },
    bookingId: {
      type: String,
      unique: true,
      sparse: true,
    },
    bookingRef: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to auto-generate unique bookingId and bookingRef before saving
bookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    this.bookingId = `BKG-${Date.now()}-${randomCode}`;
  }
  if (!this.bookingRef) {
    this.bookingRef = this.bookingId;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
