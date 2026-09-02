const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  category: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true, trim: true },
  endTime: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  ticketPrice: { type: Number, required: true, min: 0 },
  totalTickets: { type: Number, required: true, min: 1 },
  soldTickets: { type: Number, default: 0, min: 0 },
  availableTickets: { type: Number, required: true, min: 0 },
  image: { type: String, default: "" },
  status: { type: String, enum: ["draft", "published", "cancelled", "completed"], default: "published" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

eventSchema.index({ date: 1 });
module.exports = mongoose.model("Event", eventSchema);
