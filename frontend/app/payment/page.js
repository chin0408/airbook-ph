"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import API from "@/services/api";
import BookingProgress from "@/components/BookingProgress";

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const bookingId = searchParams.get("bookingId");
  const reference = searchParams.get("reference");

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(121);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (bookingId) fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await API.get(`/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooking(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await API.post(
        "/payments/create-checkout-session",
        { bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.log("Payment error:", error);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  if (loading) {
    return (
      <main style={{ background: "#f8fafc", minHeight: "calc(100vh - 72px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#6b7280" }}>Loading payment details...</p>
      </main>
    );
  }

  const flight = booking?.flight;
  const baseFare = flight?.baseFare || 0;
  const paxCount = booking?.passengers?.length || 1;
  const totalBase = baseFare * paxCount;
  const taxes = Math.round(totalBase * 0.12);
  const fees = Math.round(totalBase * 0.03);
  const totalFare = booking?.totalAmount || totalBase + taxes + fees;

  return (
    <main style={{ background: "#f8fafc", minHeight: "calc(100vh - 72px)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 20px 64px" }}>
        {/* Booking Progress */}
        <BookingProgress currentStep={4} />

        {/* Timer */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
          <span style={{ fontSize: "14px", color: "#6b7280" }}>⏱ Seat hold expires in</span>
          <span style={{ fontSize: "22px", fontWeight: 800, color: "#15192e", fontFamily: "monospace" }}>
            {formatTimer(timeLeft)}
          </span>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Left — Secure Payment Card */}
          <div
            style={{
              flex: 1,
              background: "#ffffff",
              borderRadius: "20px",
              padding: "56px 48px",
              textAlign: "center",
              border: "1px solid #f1f5f9",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>🔒</div>
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#15192e", marginBottom: "12px" }}>
              Secure Payment
            </h1>
            <p style={{ fontSize: "15px", color: "#6b7280", marginBottom: "40px", maxWidth: "360px", margin: "0 auto 40px", lineHeight: 1.6 }}>
              You will be redirected to Stripe&apos;s secure checkout to complete your payment.
            </p>

            {/* Booking Reference + Pay Button */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", flexWrap: "wrap", marginBottom: "32px" }}>
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e3e6ef",
                  borderRadius: "12px",
                  padding: "16px 24px",
                }}
              >
                <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#8a90a8", marginBottom: "4px" }}>
                  BOOKING REFERENCE
                </p>
                <p style={{ fontSize: "22px", fontWeight: 800, fontFamily: "monospace", letterSpacing: "0.1em", color: "#15192e" }}>
                  {reference || booking?.bookingReference}
                </p>
              </div>

              <button
                onClick={handlePayment}
                style={{
                  background: "#2f5af0",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: 700,
                  padding: "18px 32px",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                Pay PHP {totalFare.toLocaleString()} via Stripe →
              </button>
            </div>

            <p style={{ fontSize: "12px", color: "#9ca3af" }}>
              Powered by Stripe · 256-bit SSL encryption
            </p>
          </div>

          {/* Right — Order Summary */}
          <div style={{ width: "300px", minWidth: "280px", flex: "1 1 300px" }}>
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "28px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#15192e", marginBottom: "20px" }}>
                Order Summary
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ color: "#6b7280" }}>Route</span>
                  <span style={{ fontWeight: 700, color: "#15192e" }}>{flight?.origin} — {flight?.destination}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ color: "#6b7280" }}>Flight</span>
                  <span style={{ fontWeight: 700, color: "#15192e" }}>{flight?.flightNumber}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ color: "#6b7280" }}>Seats</span>
                  <span style={{ fontWeight: 700, color: "#15192e" }}>{booking?.selectedSeats?.join(", ")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ color: "#6b7280" }}>Passengers</span>
                  <span style={{ fontWeight: 700, color: "#15192e" }}>{paxCount}</span>
                </div>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "0 0 20px" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ color: "#6b7280" }}>Base Fare</span>
                  <span style={{ color: "#15192e" }}>PHP {totalBase.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ color: "#6b7280" }}>Taxes</span>
                  <span style={{ color: "#15192e" }}>PHP {taxes.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ color: "#6b7280" }}>Fees</span>
                  <span style={{ color: "#15192e" }}>PHP {fees.toLocaleString()}</span>
                </div>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "0 0 16px" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "15px", fontWeight: 700, color: "#15192e" }}>Total</span>
                <span style={{ fontSize: "22px", fontWeight: 800, color: "#2f5af0" }}>
                  PHP {totalFare.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div style={{ background: "#f8fafc", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
