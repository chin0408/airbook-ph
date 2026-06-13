"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import API from "@/services/api";

export default function BookingReceiptPage({ params }) {
  const resolvedParams = use(params);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await API.get(`/bookings/${resolvedParams.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooking(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <main style={{ background: "#f8fafc", minHeight: "calc(100vh - 72px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#6b7280" }}>Loading receipt...</p>
      </main>
    );
  }

  if (!booking) {
    return (
      <main style={{ background: "#f8fafc", minHeight: "calc(100vh - 72px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#6b7280" }}>Booking not found</p>
      </main>
    );
  }

  const flight = booking.flight;
  const baseFare = flight?.baseFare || 0;
  const paxCount = booking.passengers?.length || 1;
  const totalBase = baseFare * paxCount;
  const taxes = Math.round(totalBase * 0.12);
  const fees = Math.round(totalBase * 0.03);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  const getBadgeStyle = (type, status) => {
    const styles = {
      PENDING: { background: "#fef3c7", color: "#92400e" },
      PAID: { background: "#d1fae5", color: "#065f46" },
      REFUNDED: { background: "#fee2e2", color: "#991b1b" },
      NOT_ISSUED: { background: "#e0e7ff", color: "#3730a3" },
      ISSUED: { background: "#d1fae5", color: "#065f46" },
      VOID: { background: "#fee2e2", color: "#991b1b" },
    };
    return styles[status] || styles.PENDING;
  };

  return (
    <main style={{ background: "#f8fafc", minHeight: "calc(100vh - 72px)" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 20px 64px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#2f5af0", letterSpacing: "0.05em", marginBottom: "4px" }}>
              RECEIPT
            </p>
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#15192e", marginBottom: "8px" }}>
              Travel receipt
            </h1>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>
              Use for customer proof, booking confirmation, and payment traceability.
            </p>
          </div>
          <button
            onClick={handlePrint}
            style={{
              background: "#15192e",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 600,
              padding: "12px 20px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Print Receipt
          </button>
        </div>

        {/* Receipt Card */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            padding: "40px",
            border: "1px solid #f1f5f9",
          }}
        >
          {/* Receipt Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "40px", height: "40px", background: "#f1f5f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "18px" }}>✈</span>
              </div>
              <div>
                <p style={{ fontSize: "18px", fontWeight: 700, color: "#15192e" }}>AirBook PH</p>
                <p style={{ fontSize: "13px", color: "#9ca3af" }}>Passenger travel receipt</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <span style={{ ...getBadgeStyle("payment", booking.paymentStatus), padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 700 }}>
                {booking.paymentStatus}
              </span>
              <span style={{ ...getBadgeStyle("ticket", booking.ticketStatus), padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 700 }}>
                {booking.ticketStatus}
              </span>
            </div>
          </div>

          {/* PNR / Issued For / Booked On */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "24px", marginBottom: "32px", paddingBottom: "32px", borderBottom: "1px solid #f1f5f9" }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#8a90a8", marginBottom: "4px" }}>PNR</p>
              <p style={{ fontSize: "16px", fontWeight: 800, fontFamily: "monospace", color: "#15192e" }}>{booking.bookingReference}</p>
            </div>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#8a90a8", marginBottom: "4px" }}>ISSUED FOR</p>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#15192e" }}>{booking.user?.email}</p>
            </div>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#8a90a8", marginBottom: "4px" }}>BOOKED ON</p>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#15192e" }}>{formatDate(booking.createdAt)}, {formatTime(booking.createdAt)}</p>
            </div>
          </div>

          {/* Booking Status */}
          <div style={{ marginBottom: "32px", paddingBottom: "32px", borderBottom: "1px solid #f1f5f9" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#8a90a8", marginBottom: "4px" }}>BOOKING STATUS</p>
            <p style={{ fontSize: "16px", fontWeight: 700, color: "#15192e" }}>{booking.bookingStatus}</p>
          </div>

          {/* Flight Details */}
          <div style={{ marginBottom: "32px", paddingBottom: "32px", borderBottom: "1px solid #f1f5f9" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#15192e", marginBottom: "16px" }}>Flight details</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "24px" }}>
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#8a90a8", marginBottom: "4px" }}>FLIGHT</p>
                <p style={{ fontSize: "15px", fontWeight: 600, color: "#15192e" }}>{flight?.flightNumber}</p>
              </div>
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#8a90a8", marginBottom: "4px" }}>ROUTE</p>
                <p style={{ fontSize: "15px", fontWeight: 600, color: "#15192e" }}>{flight?.origin} → {flight?.destination}</p>
              </div>
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#8a90a8", marginBottom: "4px" }}>DEPARTURE</p>
                <p style={{ fontSize: "15px", fontWeight: 600, color: "#15192e" }}>{formatDate(flight?.departureTime)}, {formatTime(flight?.departureTime)}</p>
              </div>
            </div>
            <div style={{ marginTop: "16px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#8a90a8", marginBottom: "4px" }}>ARRIVAL</p>
              <p style={{ fontSize: "15px", fontWeight: 600, color: "#15192e" }}>{formatDate(flight?.arrivalTime)}, {formatTime(flight?.arrivalTime)}</p>
            </div>
          </div>

          {/* Passengers and Seats */}
          <div style={{ marginBottom: "32px", paddingBottom: "32px", borderBottom: "1px solid #f1f5f9" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#15192e", marginBottom: "16px" }}>Passengers and seats</h3>
            {booking.passengers?.map((pax, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
                <div>
                  <p style={{ fontSize: "15px", fontWeight: 600, color: "#15192e" }}>{pax.firstName} {pax.lastName}</p>
                  <p style={{ fontSize: "12px", color: "#8a90a8", textTransform: "uppercase" }}>{pax.passengerType}</p>
                </div>
                <p style={{ fontSize: "15px", fontWeight: 600, color: "#15192e" }}>{booking.selectedSeats?.[index]}</p>
              </div>
            ))}
          </div>

          {/* Fare Breakdown */}
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#15192e", marginBottom: "16px" }}>Fare breakdown</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                <span style={{ color: "#6b7280" }}>Base fare</span>
                <span style={{ fontWeight: 600, color: "#2f5af0" }}>PHP {totalBase.toLocaleString()}.00</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                <span style={{ color: "#6b7280" }}>Taxes</span>
                <span style={{ fontWeight: 600, color: "#2f5af0" }}>PHP {taxes.toLocaleString()}.00</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                <span style={{ color: "#6b7280" }}>Fees</span>
                <span style={{ fontWeight: 600, color: "#2f5af0" }}>PHP {fees.toLocaleString()}.00</span>
              </div>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "16px 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "16px", fontWeight: 700, color: "#15192e" }}>Total paid</span>
              <span style={{ fontSize: "24px", fontWeight: 800, color: "#2f5af0" }}>
                PHP {booking.totalAmount?.toLocaleString()}.00
              </span>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <Link href="/my-bookings" style={{ fontSize: "14px", color: "#6b7280", textDecoration: "none" }}>
            Back to My Bookings
          </Link>
        </div>
      </div>
    </main>
  );
}
