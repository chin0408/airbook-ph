const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDB = require("../config/db");
const Flight = require("../models/Flight");

dotenv.config();

connectDB();

const seedFlights = async () => {
  try {
    await Flight.deleteMany();

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    const formatDate = (date, hours, minutes) => {
      const d = new Date(date);
      d.setHours(hours, minutes, 0, 0);
      return d;
    };

    await Flight.insertMany([
      // ═══ DOMESTIC FLIGHTS ═══
      {
        airlineCode: "PR",
        flightNumber: "PR101-DO",
        origin: "MNL",
        destination: "CEB",
        departureTime: formatDate(today, 6, 0),
        arrivalTime: formatDate(today, 7, 15),
        baseFare: 1800,
      },
      {
        airlineCode: "PR",
        flightNumber: "PR102-DO",
        origin: "CEB",
        destination: "MNL",
        departureTime: formatDate(today, 8, 0),
        arrivalTime: formatDate(today, 9, 15),
        baseFare: 1800,
      },
      {
        airlineCode: "5J",
        flightNumber: "5J201-DO",
        origin: "MNL",
        destination: "DVO",
        departureTime: formatDate(today, 7, 0),
        arrivalTime: formatDate(today, 9, 0),
        baseFare: 2200,
      },
      {
        airlineCode: "5J",
        flightNumber: "5J202-DO",
        origin: "DVO",
        destination: "MNL",
        departureTime: formatDate(today, 10, 0),
        arrivalTime: formatDate(today, 12, 0),
        baseFare: 2200,
      },
      {
        airlineCode: "PR",
        flightNumber: "PR301-DO",
        origin: "MNL",
        destination: "CGY",
        departureTime: formatDate(today, 15, 30),
        arrivalTime: formatDate(today, 17, 15),
        baseFare: 2100,
      },
      {
        airlineCode: "5J",
        flightNumber: "5J401-DO",
        origin: "MNL",
        destination: "ILO",
        departureTime: formatDate(today, 9, 30),
        arrivalTime: formatDate(today, 10, 45),
        baseFare: 1600,
      },
      {
        airlineCode: "PR",
        flightNumber: "PR501-DO",
        origin: "CEB",
        destination: "DVO",
        departureTime: formatDate(today, 14, 0),
        arrivalTime: formatDate(today, 15, 30),
        baseFare: 1500,
      },
      {
        airlineCode: "5J",
        flightNumber: "5J601-DO",
        origin: "MNL",
        destination: "BCD",
        departureTime: formatDate(today, 11, 0),
        arrivalTime: formatDate(today, 12, 15),
        baseFare: 1700,
      },
      // Tomorrow domestic
      {
        airlineCode: "PR",
        flightNumber: "PR103-DO",
        origin: "MNL",
        destination: "CEB",
        departureTime: formatDate(tomorrow, 6, 0),
        arrivalTime: formatDate(tomorrow, 7, 15),
        baseFare: 1800,
      },
      {
        airlineCode: "5J",
        flightNumber: "5J203-DO",
        origin: "MNL",
        destination: "DVO",
        departureTime: formatDate(tomorrow, 8, 0),
        arrivalTime: formatDate(tomorrow, 10, 0),
        baseFare: 2100,
      },

      // ═══ INTERNATIONAL FLIGHTS ═══

      // MNL → Paris (CDG) — ~13 hours, ~₱45,000
      {
        airlineCode: "PR",
        flightNumber: "PR730-INT",
        origin: "MNL",
        destination: "CDG",
        departureTime: formatDate(tomorrow, 23, 30),
        arrivalTime: formatDate(dayAfter, 12, 30),
        baseFare: 45000,
      },

      // MNL → Tampa (TPA) — ~20 hours, ~₱52,000
      {
        airlineCode: "PR",
        flightNumber: "PR118-INT",
        origin: "MNL",
        destination: "TPA",
        departureTime: formatDate(tomorrow, 21, 0),
        arrivalTime: formatDate(dayAfter, 17, 0),
        baseFare: 52000,
      },

      // MNL → San Francisco (SFO) — ~14 hours, ~₱42,000
      {
        airlineCode: "PR",
        flightNumber: "PR104-INT",
        origin: "MNL",
        destination: "SFO",
        departureTime: formatDate(today, 22, 45),
        arrivalTime: formatDate(tomorrow, 12, 45),
        baseFare: 42000,
      },

      // MNL → Los Angeles (LAX) — ~14 hours, ~₱40,000
      {
        airlineCode: "PR",
        flightNumber: "PR102-INT",
        origin: "MNL",
        destination: "LAX",
        departureTime: formatDate(tomorrow, 23, 0),
        arrivalTime: formatDate(dayAfter, 13, 0),
        baseFare: 40000,
      },

      // MNL → London Heathrow (LHR) — ~14 hours, ~₱48,000
      {
        airlineCode: "PR",
        flightNumber: "PR720-INT",
        origin: "MNL",
        destination: "LHR",
        departureTime: formatDate(today, 22, 0),
        arrivalTime: formatDate(tomorrow, 12, 0),
        baseFare: 48000,
      },

      // MNL → London Gatwick (LGW) — ~14.5 hours, ~₱44,000
      {
        airlineCode: "5J",
        flightNumber: "5J880-INT",
        origin: "MNL",
        destination: "LGW",
        departureTime: formatDate(tomorrow, 1, 0),
        arrivalTime: formatDate(tomorrow, 15, 30),
        baseFare: 44000,
      },

      // MNL → Manchester (MAN) — ~15 hours, ~₱46,000
      {
        airlineCode: "PR",
        flightNumber: "PR740-INT",
        origin: "MNL",
        destination: "MAN",
        departureTime: formatDate(tomorrow, 22, 30),
        arrivalTime: formatDate(dayAfter, 13, 30),
        baseFare: 46000,
      },
    ]);

    console.log("✅ Flights seeded successfully (17 flights: 10 domestic + 7 international)");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedFlights();
