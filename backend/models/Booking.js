const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    flight: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flight",
      required: true,
    },

    passengers: [
      {
        firstName: String,
        lastName: String,
        gender: String,
        passengerType: String,
      },
    ],

    selectedSeats: [String],

    totalAmount: {
      type: Number,
      required: true,
    },

    bookingStatus: {
      type: String,
      default: "PENDING_PAYMENT",
    },

    paymentStatus: {
      type: String,
      default: "PENDING",
    },

    ticketStatus: {
      type: String,
      default: "NOT_ISSUED",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);