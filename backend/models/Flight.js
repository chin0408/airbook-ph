const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema(
  {
    airlineCode: {
      type: String,
      required: true,
    },

    flightNumber: {
      type: String,
      required: true,
    },

    origin: {
      type: String,
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    departureTime: {
      type: Date,
      required: true,
    },

    arrivalTime: {
      type: Date,
      required: true,
    },

    baseFare: {
      type: Number,
      required: true,
    },

    seatCapacity: {
      type: Number,
      default: 120,
    },

    seatsAvailable: {
      type: Number,
      default: 120,
    },

    bookedSeats: {
      type: [String],
      default: [],
    },

    flightStatus: {
      type: String,
      default: "SCHEDULED",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Flight", flightSchema);