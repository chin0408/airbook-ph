const Booking = require("../models/Booking");

const Flight = require("../models/Flight");

const generateBookingReference = require("../utils/generateBookingReference");

const createBooking = async (req, res) => {
  try {

    const {
      userId,
      flightId,
      passengers,
      selectedSeats,
      totalAmount,
    } = req.body;

    const flight = await Flight.findById(flightId);

    if (!flight) {
      return res.status(404).json({
        message: "Flight not found",
      });
    }

    if (flight.seatsAvailable < selectedSeats.length) {
      return res.status(400).json({
        message: "Not enough available seats",
      });
    }

    const alreadyBooked = selectedSeats.some((seat) =>
      flight.bookedSeats.includes(seat)
    );

    if (alreadyBooked) {
      return res.status(400).json({
        message: "Seat already booked",
      });
    }

    const booking = await Booking.create({
      bookingReference: generateBookingReference(),
      user: userId,
      flight: flightId,
      passengers,
      selectedSeats,
      totalAmount,
    });

    flight.seatsAvailable -= selectedSeats.length;

    flight.bookedSeats.push(...selectedSeats);

    await flight.save();

    res.status(201).json(booking);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }
};

const getBookingByReference = async (req, res) => {
  try {

    const booking = await Booking.findOne({
      bookingReference: req.params.reference,
    })
      .populate("flight")
      .populate("user");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json(booking);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

const getBookingById = async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id)
      .populate("flight")
      .populate("user");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json(booking);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


const getMyBookings = async (req, res) => {

  try {

    const bookings = await Booking.find({
      user: req.user.id,
    })
      .populate("flight")
      .populate("user");

    res.status(200).json(bookings);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to fetch bookings",
    });

  }

};

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Only allow the booking owner to update
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to update this booking",
      });
    }

    const { bookingStatus, paymentStatus, ticketStatus } = req.body;

    if (bookingStatus === "CANCELLED") {
      booking.bookingStatus = "CANCELLED";
      booking.paymentStatus = "REFUNDED";
      booking.ticketStatus = "VOID";

      // Restore seats to the flight
      const flight = await Flight.findById(booking.flight);
      if (flight) {
        flight.seatsAvailable += booking.selectedSeats.length;
        flight.bookedSeats = flight.bookedSeats.filter(
          (seat) => !booking.selectedSeats.includes(seat)
        );
        await flight.save();
      }
    } else if (bookingStatus === "CONFIRMED") {
      booking.bookingStatus = "CONFIRMED";
      booking.paymentStatus = paymentStatus || "PAID";
      booking.ticketStatus = ticketStatus || "ISSUED";
    } else {
      // Allow partial updates
      if (bookingStatus) booking.bookingStatus = bookingStatus;
      if (paymentStatus) booking.paymentStatus = paymentStatus;
      if (ticketStatus) booking.ticketStatus = ticketStatus;
    }

    await booking.save();

    const updated = await Booking.findById(req.params.id)
      .populate("flight")
      .populate("user");

    res.status(200).json(updated);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getBookingById,
  getBookingByReference,
  getMyBookings,
  updateBooking,
};