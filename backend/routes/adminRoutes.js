const express = require("express");

const router = express.Router();

const {
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
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// Users
router.get("/users", protect, admin, getAllUsers);
router.patch("/users/:id", protect, admin, updateUser);
router.delete("/users/:id", protect, admin, deleteUser);

// Flights
router.get("/flights", protect, admin, getAllFlights);
router.post("/flights", protect, admin, createFlight);
router.patch("/flights/:id", protect, admin, updateFlight);
router.delete("/flights/:id", protect, admin, deleteFlight);

// Bookings
router.get("/bookings", protect, admin, getAllBookings);
router.put("/bookings/:id/approve", protect, admin, approveBooking);
router.put("/bookings/:id/cancel", protect, admin, cancelBooking);

module.exports = router;
