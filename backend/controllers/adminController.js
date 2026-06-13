const Booking = require("../models/Booking");
const User = require("../models/User");
const Flight = require("../models/Flight");

// ═══ USERS ═══

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { firstName, lastName, email, mobileNumber, isAdmin, newPassword } = req.body;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (mobileNumber !== undefined) user.mobileNumber = mobileNumber;
    if (isAdmin !== undefined) user.isAdmin = isAdmin;

    // Admin password reset
    if (newPassword && newPassword.length >= 6) {
      const bcrypt = require("bcryptjs");
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    const updated = await User.findById(req.params.id).select("-password");
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ═══ FLIGHTS ═══

const getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find().sort({ departureTime: -1 });
    res.status(200).json(flights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createFlight = async (req, res) => {
  try {
    const {
      airlineCode, flightNumber, origin, destination,
      departureTime, arrivalTime, baseFare, seatCapacity,
    } = req.body;

    const flight = await Flight.create({
      airlineCode,
      flightNumber,
      origin,
      destination,
      departureTime,
      arrivalTime,
      baseFare,
      seatCapacity: seatCapacity || 120,
      seatsAvailable: seatCapacity || 120,
    });

    res.status(201).json(flight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ message: "Flight not found" });

    const {
      airlineCode, flightNumber, origin, destination,
      departureTime, arrivalTime, baseFare, seatCapacity, flightStatus,
    } = req.body;

    if (airlineCode) flight.airlineCode = airlineCode;
    if (flightNumber) flight.flightNumber = flightNumber;
    if (origin) flight.origin = origin;
    if (destination) flight.destination = destination;
    if (departureTime) flight.departureTime = departureTime;
    if (arrivalTime) flight.arrivalTime = arrivalTime;
    if (baseFare) flight.baseFare = baseFare;
    if (seatCapacity) flight.seatCapacity = seatCapacity;
    if (flightStatus) flight.flightStatus = flightStatus;

    await flight.save();
    res.status(200).json(flight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ message: "Flight not found" });

    await Flight.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Flight deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ═══ BOOKINGS ═══

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user")
      .populate("flight")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    booking.bookingStatus = "CONFIRMED";

    booking.paymentStatus = "PAID";

    booking.ticketStatus = "ISSUED";

    await booking.save();

    res.status(200).json({
      message: "Booking approved successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    booking.bookingStatus = "CANCELLED";

    booking.paymentStatus = "REFUNDED";

    booking.ticketStatus = "VOID";

    await booking.save();

    res.status(200).json({
      message: "Booking cancelled",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllBookings,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllFlights,
  createFlight,
  updateFlight,
  deleteFlight,
  approveBooking,
  cancelBooking,
};