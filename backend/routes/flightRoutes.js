const express = require("express");

const router = express.Router();

const {
  getFlights,
  getFlightById,
} = require("../controllers/flightController");

router.get("/", getFlights);

router.get("/:id", getFlightById);

module.exports = router;