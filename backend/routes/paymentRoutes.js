const express = require("express");
const router = express.Router();

const {
  createCheckoutSession,
  handlePaymentSuccess,
} = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");

router.post("/create-checkout-session", protect, createCheckoutSession);
router.post("/verify-payment", protect, handlePaymentSuccess);

module.exports = router;
