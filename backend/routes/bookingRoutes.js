const express = require("express");

const router = express.Router();

const {
  createBooking,
  getBookingById,
  getBookingByReference,
  getMyBookings,
  updateBooking,
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createBooking);

router.get("/my/bookings", protect, getMyBookings);

router.get("/reference/:reference", getBookingByReference);

router.get("/:id", getBookingById);

router.patch("/:id", protect, updateBooking);

router.delete("/:id", protect, async (req, res) => {
  try {
    const Booking = require("../controllers/bookingController");
    const booking = await require("../models/Booking").findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Restore seats
    const Flight = require("../models/Flight");
    const flight = await Flight.findById(booking.flight);
    if (flight) {
      flight.seatsAvailable += booking.selectedSeats.length;
      flight.bookedSeats = flight.bookedSeats.filter(
        (seat) => !booking.selectedSeats.includes(seat)
      );
      await flight.save();
    }

    await require("../models/Booking").findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
