const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    venue: {
      type: String,
      required: true,
      trim: true,
    },

    ticketPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);