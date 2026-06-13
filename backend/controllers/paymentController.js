const Booking = require("../models/Booking");

const getStripe = () => {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  return stripe;
};

const createCheckoutSession = async (req, res) => {
  try {
    const stripe = getStripe();
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate("flight");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const flight = booking.flight;
    const description = `${flight.origin} → ${flight.destination} | PNR: ${booking.bookingReference}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "php",
            product_data: {
              name: `Flight ${flight.flightNumber}`,
              description: description,
            },
            unit_amount: booking.totalAmount * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&bookingId=${bookingId}`,
      cancel_url: `${process.env.CLIENT_URL}/payment?bookingId=${bookingId}&reference=${booking.bookingReference}`,
      metadata: {
        bookingId: bookingId,
        bookingReference: booking.bookingReference,
      },
    });

    res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.log("Stripe error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const handlePaymentSuccess = async (req, res) => {
  try {
    const stripe = getStripe();
    const { sessionId, bookingId } = req.body;

    // Verify the session with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const booking = await Booking.findById(bookingId);

      if (booking) {
        booking.bookingStatus = "CONFIRMED";
        booking.paymentStatus = "PAID";
        booking.ticketStatus = "ISSUED";
        await booking.save();
      }

      res.status(200).json({ message: "Payment confirmed", booking });
    } else {
      res.status(400).json({ message: "Payment not completed" });
    }
  } catch (error) {
    console.log("Payment verification error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCheckoutSession,
  handlePaymentSuccess,
};
