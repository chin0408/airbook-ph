const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

const userRoutes = require("./routes/userRoutes");
const flightRoutes = require("./routes/flightRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/users", userRoutes);
app.use("/flights", flightRoutes);
app.use("/bookings", bookingRoutes);
app.use("/admin", adminRoutes);
app.use("/payments", paymentRoutes);

app.get("/", (req, res) => {
  res.send("AIRBOOK PH API RUNNING");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});