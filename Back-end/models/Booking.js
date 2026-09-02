const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  numberOfTickets: { type: Number, required: true, min: 1 },
  totalAmount: { type: Number, required: true, min: 0 },
  bookingStatus: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
  bookingDate: { type: Date, default: Date.now },
}, { timestamps: true });

bookingSchema.index({ userId: 1, createdAt: -1 });
module.exports = mongoose.model("Booking", bookingSchema);
