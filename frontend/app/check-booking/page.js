"use client";

import { useState } from "react";
import API from "@/services/api";

export default function CheckBookingPage() {
  const [reference, setReference] = useState("");
  const [lastName, setLastName] = useState("");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setBooking(null);
    setLoading(true);

    try {
      const response = await API.get(`/bookings/reference/${reference.toUpperCase()}`);
      const data = response.data;

      const lastNameMatch = data.passengers?.some(
        (p) => p.lastName?.toLowerCase() === lastName.toLowerCase()
      );

      if (!lastNameMatch) {
        setError("Last name does not match any passenger on this booking.");
        setLoading(false);
        return;
      }

      setBooking(data);
    } catch (err) {
      setError("Booking not found. Please check your reference and try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  const getBadgeStyle = (status) => {
    const styles = {
      PENDING_PAYMENT: { background: "#fef3c7", color: "#92400e" },
      CONFIRMED: { background: "#d1fae5", color: "#065f46" },
      CANCELLED: { background: "#fee2e2", color: "#991b1b" },
      PENDING: { background: "#fef3c7", color: "#92400e" },
      PAID: { background: "#d1fae5", color: "#065f46" },
      REFUNDED: { background: "#fee2e2", color: "#991b1b" },
      NOT_ISSUED: { background: "#e0e7ff", color: "#3730a3" },
      ISSUED: { background: "#d1fae5", color: "#065f46" },
    };
    return styles[status] || styles.PENDING;
  };

  return (
    <main style={{ background: "#f8fafc", minHeight: "calc(100vh - 72px)" }}>
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "40px 20px 64px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#15192e", marginBottom: "8px" }}>
            <span style={{ marginRight: "8px" }}>✈</span>Booking Checker
          </h1>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            Enter your booking reference and last name to retrieve your booking details.
          </p>
        </div>

        {/* Search Form Card */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "32px",
            marginBottom: "24px",
            border: "1px solid #f1f5f9",
          }}
        >
          <form onSubmit={handleSearch}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", color: "#4b5165", marginBottom: "10px" }}>
                BOOKING REFERENCE (PNR)
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value.toUpperCase())}
                placeholder="e.g. CMJKHB"
                required
                maxLength={6}
                style={{
                  width: "100%",
                  border: "1px solid #e3e6ef",
                  borderRadius: "10px",
                  padding: "16px",
                  textAlign: "center",
                  fontSize: "24px",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  color: "#15192e",
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", color: "#4b5165", marginBottom: "10px" }}>
                PASSENGER LAST NAME
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Dela Cruz"
                required
                style={{
                  width: "100%",
                  border: "1px solid #e3e6ef",
                  borderRadius: "10px",
                  padding: "14px 16px",
                  fontSize: "15px",
                  color: "#15192e",
                }}
              />
            </div>

            {error && (
              <div style={{ background: "#fef2f2", color: "#dc2626", fontSize: "14px", padding: "12px 16px", borderRadius: "10px", marginBottom: "16px" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: "#2f5af0",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 700,
                padding: "16px",
                border: "none",
                borderRadius: "10px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Searching..." : "Find Booking →"}
            </button>
          </form>
        </div>

        {/* Booking Result Card */}
        {booking && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "36px",
              border: "1px solid #f1f5f9",
            }}
          >
            {/* PNR + Status */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", paddingBottom: "20px", borderBottom: "1px solid #f1f5f9" }}>
              <p style={{ fontSize: "28px", fontWeight: 800, fontFamily: "monospace", letterSpacing: "0.08em", color: "#15192e" }}>
                {booking.bookingReference}
              </p>
              <span style={{ ...getBadgeStyle(booking.bookingStatus), padding: "5px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: 700 }}>
                {booking.bookingStatus}
              </span>
            </div>

            {/* Two Column: Flight Details + Passengers/Payment */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "40px" }}>
              {/* Flight Details */}
              <div>
                <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", color: "#2f5af0", marginBottom: "16px" }}>
                  FLIGHT DETAILS
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                    <span style={{ color: "#6b7280" }}>Route</span>
                    <span style={{ fontWeight: 700, color: "#15192e" }}>{booking.flight?.origin} → {booking.flight?.destination}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                    <span style={{ color: "#6b7280" }}>Flight</span>
                    <span style={{ fontWeight: 700, color: "#15192e" }}>{booking.flight?.flightNumber}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                    <span style={{ color: "#6b7280" }}>Departure</span>
                    <span style={{ fontWeight: 700, color: "#15192e" }}>{formatDate(booking.flight?.departureTime)}, {formatTime(booking.flight?.departureTime)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                    <span style={{ color: "#6b7280" }}>Arrival</span>
                    <span style={{ fontWeight: 700, color: "#15192e" }}>{formatDate(booking.flight?.arrivalTime)}, {formatTime(booking.flight?.arrivalTime)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                    <span style={{ color: "#6b7280" }}>Seats</span>
                    <span style={{ fontWeight: 700, color: "#15192e" }}>{booking.selectedSeats?.join(", ")}</span>
                  </div>
                </div>
              </div>

              {/* Passengers + Payment */}
              <div>
                <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", color: "#2f5af0", marginBottom: "16px" }}>
                  PASSENGERS
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
                  {booking.passengers?.map((pax, index) => (
                    <div key={index} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                      <span style={{ color: "#6b7280" }}>Pax {index + 1}</span>
                      <span style={{ fontWeight: 600, color: "#15192e" }}>
                        {pax.firstName} {pax.lastName}{" "}
                        <span style={{ color: "#9ca3af", fontSize: "12px" }}>({pax.passengerType})</span>
                      </span>
                    </div>
                  ))}
                </div>

                <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", color: "#2f5af0", marginBottom: "16px" }}>
                  PAYMENT
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                    <span style={{ color: "#6b7280" }}>Total</span>
                    <span style={{ fontWeight: 700, color: "#15192e" }}>PHP {booking.totalAmount?.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", alignItems: "center" }}>
                    <span style={{ color: "#6b7280" }}>Status</span>
                    <span style={{ ...getBadgeStyle(booking.paymentStatus), padding: "3px 10px", borderRadius: "5px", fontSize: "11px", fontWeight: 700 }}>
                      {booking.paymentStatus}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", alignItems: "center" }}>
                    <span style={{ color: "#6b7280" }}>Ticket</span>
                    <span style={{ ...getBadgeStyle(booking.ticketStatus), padding: "3px 10px", borderRadius: "5px", fontSize: "11px", fontWeight: 700 }}>
                      {booking.ticketStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
