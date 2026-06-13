"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API from "@/services/api";

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const response = await API.get("/bookings/my/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.patch(
        `/bookings/${bookingId}`,
        { bookingStatus: "CANCELLED" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBookings();
    } catch (error) {
      alert("Failed to cancel booking");
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getBadgeStyle = (status) => {
    const styles = {
      PENDING_PAYMENT: { background: "#fef3c7", color: "#92400e" },
      CONFIRMED: { background: "#d1fae5", color: "#065f46" },
      CANCELLED: { background: "#fee2e2", color: "#991b1b" },
    };
    return styles[status] || styles.PENDING_PAYMENT;
  };

  return (
    <main style={{ background: "#f8fafc", minHeight: "calc(100vh - 72px)" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 20px 64px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#15192e" }}>My Bookings</h1>
          <Link
            href="/"
            style={{
              display: "inline-block",
              background: "#2f5af0",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 600,
              padding: "12px 20px",
              borderRadius: "10px",
              textDecoration: "none",
            }}
          >
            + New Booking
          </Link>
        </div>

        {loading ? (
          <div style={{ background: "#ffffff", borderRadius: "16px", padding: "48px", textAlign: "center", border: "1px solid #f1f5f9" }}>
            <p style={{ color: "#6b7280" }}>Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ background: "#ffffff", borderRadius: "16px", padding: "64px", textAlign: "center", border: "1px solid #f1f5f9" }}>
            <p style={{ color: "#6b7280", marginBottom: "12px" }}>You don&apos;t have any bookings yet.</p>
            <Link href="/" style={{ color: "#2f5af0", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}>
              Search for flights →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {bookings.map((booking) => (
              <div
                key={booking._id}
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "28px 32px",
                  border: "1px solid #f1f5f9",
                }}
              >
                {/* Top row: PNR + Status */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <p style={{ fontSize: "15px", fontWeight: 800, fontFamily: "monospace", letterSpacing: "0.12em", color: "#4b5165" }}>
                    {booking.bookingReference}
                  </p>
                  <span style={{ ...getBadgeStyle(booking.bookingStatus), padding: "4px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: 700 }}>
                    {booking.bookingStatus}
                  </span>
                </div>

                {/* Route */}
                <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#15192e", marginBottom: "10px" }}>
                  {booking.flight?.origin || "—"} <span style={{ color: "#9ca3af", margin: "0 6px" }}>→</span> {booking.flight?.destination || "—"}
                </h2>

                {/* Details row */}
                <div style={{ display: "flex", alignItems: "center", gap: "20px", fontSize: "13px", color: "#6b7280", marginBottom: "20px" }}>
                  <span>✈ {booking.flight?.flightNumber || "N/A"}</span>
                  <span>📅 {booking.flight?.departureTime ? formatDate(booking.flight.departureTime) : "—"}</span>
                  <span>💺 {booking.selectedSeats?.join(", ") || "—"}</span>
                  <span>👥 {booking.passengers?.length || 0} pax</span>
                </div>

                {/* Divider */}
                <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "0 0 20px" }} />

                {/* Bottom row: Price + Actions */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: "22px", fontWeight: 800, color: "#15192e" }}>
                    PHP {booking.totalAmount?.toLocaleString()}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {booking.bookingStatus === "PENDING_PAYMENT" && (
                      <Link
                        href={`/payment?bookingId=${booking._id}&reference=${booking.bookingReference}`}
                        style={{
                          display: "inline-block",
                          background: "#2f5af0",
                          color: "#ffffff",
                          fontSize: "13px",
                          fontWeight: 600,
                          padding: "10px 18px",
                          borderRadius: "8px",
                          textDecoration: "none",
                        }}
                      >
                        Pay Now →
                      </Link>
                    )}

                    {booking.bookingStatus !== "CANCELLED" && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        style={{
                          background: "#ef4444",
                          color: "#ffffff",
                          fontSize: "13px",
                          fontWeight: 600,
                          padding: "10px 18px",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
