const Flight = require("../models/Flight");

const getFlights = async (req, res) => {
  try {
    const flights = await Flight.find();

    res.status(200).json(flights);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);

    if (!flight) {
      return res.status(404).json({
        message: "Flight not found",
      });
    }

    res.status(200).json(flight);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getFlights,
  getFlightById,
};