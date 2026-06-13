"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getFlightById } from "@/services/flightService";
import { createBooking } from "@/services/bookingService";

function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const flightId = searchParams.get("flightId");
  const seats = searchParams.get("seats")?.split(",") || [];
  const passengerCount = Number(searchParams.get("passengers")) || seats.length;

  const [flight, setFlight] = useState(null);
  const [passengers, setPassengers] = useState(
    Array.from({ length: passengerCount }, () => ({
      firstName: "",
      lastName: "",
      passengerType: "Adult",
      gender: "",
      passportNumber: "",
    }))
  );
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);

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

  // Handle timer expiry separately to avoid setState during render
  useEffect(() => {
    if (timeLeft === 0) {
      alert("Seat hold expired. Please select seats again.");
      router.push(`/seats/${flightId}`);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (flightId) {
      getFlightById(flightId).then(setFlight).catch(console.log);
    }
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        const user = JSON.parse(storedUser);
        setContactEmail(user.email || "");
      }
    } catch (e) {
      console.log("No user data found");
    }
  }, [flightId]);

  const updatePassenger = (index, field, value) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const baseFare = flight?.baseFare || 0;
  const totalBase = baseFare * passengerCount;
  const taxes = Math.round(totalBase * 0.12);
  const fees = Math.round(totalBase * 0.03);
  const totalFare = totalBase + taxes + fees;

  const handleSubmit = async () => {
    setError("");
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].firstName || !passengers[i].lastName) {
        setError(`Please fill in all required fields for Passenger ${i + 1}`);
        return;
      }
      if (!passengers[i].gender) {
        setError(`Please select a gender for Passenger ${i + 1}`);
        return;
      }
    }
    if (!contactEmail) {
      setError("Please provide a contact email");
      return;
    }

    setLoading(true);
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser || storedUser === "undefined" || storedUser === "null") {
        setError("Please login to create a booking.");
        setLoading(false);
        return;
      }
      const user = JSON.parse(storedUser);
      const passengersWithSeats = passengers.map((p, i) => ({
        ...p,
        seatNumber: seats[i],
      }));

      const result = await createBooking({
        userId: user._id,
        flightId,
        passengers: passengersWithSeats,
        selectedSeats: seats,
        totalAmount: totalFare,
        contactEmail,
        contactPhone,
      });

      router.push(`/payment?bookingId=${result._id}&reference=${result.bookingReference}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!flight) {
    return (
      <main style={{ background: "#f8fafc", minHeight: "calc(100vh - 72px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#6b7280" }}>Loading flight details...</p>
      </main>
    );
  }

  return (
    <main style={{ background: "#f8fafc", minHeight: "calc(100vh - 72px)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 48px 64px" }}>
        {/* Timer */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
          <span style={{ fontSize: "14px", color: "#6b7280" }}>⏱ Seat hold expires in</span>
          <span style={{ fontSize: "22px", fontWeight: 800, color: "#15192e", fontFamily: "monospace" }}>
            {formatTimer(timeLeft)}
          </span>
        </div>

        {/* Page Title */}
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#15192e", marginBottom: "28px" }}>
          Passenger Details
        </h1>

        {error && (
          <div style={{ background: "#fef2f2", color: "#dc2626", fontSize: "14px", padding: "12px 16px", borderRadius: "10px", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        {/* Two Column Layout */}
        <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
          {/* Left Column — Forms */}
          <div style={{ flex: 1 }}>
            {/* Passenger Forms */}
            {passengers.map((pax, index) => (
              <div
                key={index}
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "32px",
                  marginBottom: "20px",
                  border: "1px solid #f1f5f9",
                }}
              >
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#2f5af0", marginBottom: "24px" }}>
                  <span style={{ marginRight: "8px" }}>●</span>
                  Passenger {index + 1} — Seat {seats[index]}
                </h3>

                {/* First Name / Last Name */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#6b7280", marginBottom: "8px" }}>
                      FIRST NAME *
                    </label>
                    <input
                      type="text"
                      value={pax.firstName}
                      onChange={(e) => updatePassenger(index, "firstName", e.target.value)}
                      placeholder="John"
                      style={{ width: "100%", border: "1px solid #e3e6ef", borderRadius: "10px", padding: "14px 16px", fontSize: "14px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#6b7280", marginBottom: "8px" }}>
                      LAST NAME *
                    </label>
                    <input
                      type="text"
                      value={pax.lastName}
                      onChange={(e) => updatePassenger(index, "lastName", e.target.value)}
                      placeholder="Doe"
                      style={{ width: "100%", border: "1px solid #e3e6ef", borderRadius: "10px", padding: "14px 16px", fontSize: "14px" }}
                    />
                  </div>
                </div>

                {/* Type / Gender */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#6b7280", marginBottom: "8px" }}>
                      TYPE
                    </label>
                    <select
                      value={pax.passengerType}
                      onChange={(e) => updatePassenger(index, "passengerType", e.target.value)}
                      style={{ width: "100%", border: "1px solid #e3e6ef", borderRadius: "10px", padding: "14px 16px", fontSize: "14px", background: "#ffffff" }}
                    >
                      <option value="Adult">Adult</option>
                      <option value="Child">Child</option>
                      <option value="Infant">Infant</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#6b7280", marginBottom: "8px" }}>
                      GENDER
                    </label>
                    <select
                      value={pax.gender}
                      onChange={(e) => updatePassenger(index, "gender", e.target.value)}
                      style={{ width: "100%", border: "1px solid #e3e6ef", borderRadius: "10px", padding: "14px 16px", fontSize: "14px", background: "#ffffff" }}
                    >
                      <option value="">— Select —</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                {/* Passport */}
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#6b7280", marginBottom: "8px" }}>
                    PASSPORT / ID NUMBER
                  </label>
                  <input
                    type="text"
                    value={pax.passportNumber}
                    onChange={(e) => updatePassenger(index, "passportNumber", e.target.value)}
                    placeholder="Optional"
                    style={{ width: "100%", border: "1px solid #e3e6ef", borderRadius: "10px", padding: "14px 16px", fontSize: "14px" }}
                  />
                </div>
              </div>
            ))}

            {/* Contact Information */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "32px",
                marginBottom: "28px",
                border: "1px solid #f1f5f9",
              }}
            >
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#2f5af0", marginBottom: "24px" }}>
                <span style={{ marginRight: "8px" }}>●</span>
                Contact Information
              </h3>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#6b7280", marginBottom: "8px" }}>
                  EMAIL *
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{ width: "100%", border: "1px solid #e3e6ef", borderRadius: "10px", padding: "14px 16px", fontSize: "14px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#6b7280", marginBottom: "8px" }}>
                  PHONE
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="09171234567"
                  style={{ width: "100%", border: "1px solid #e3e6ef", borderRadius: "10px", padding: "14px 16px", fontSize: "14px" }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%",
                background: "#2f5af0",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 700,
                padding: "18px",
                border: "none",
                borderRadius: "12px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Processing..." : "Continue to Payment →"}
            </button>
          </div>

          {/* Right Column — Booking Summary */}
          <div style={{ width: "300px", flexShrink: 0 }}>
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "28px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                position: "sticky",
                top: "100px",
              }}
            >
              <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#15192e", marginBottom: "20px" }}>
                Booking Summary
              </h3>

              {/* Flight info */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ color: "#6b7280" }}>Flight</span>
                  <span style={{ fontWeight: 700, color: "#15192e" }}>{flight.flightNumber}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ color: "#6b7280" }}>Route</span>
                  <span style={{ fontWeight: 700, color: "#15192e" }}>{flight.origin} — {flight.destination}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ color: "#6b7280" }}>Departure</span>
                  <span style={{ fontWeight: 700, color: "#15192e" }}>
                    {new Date(flight.departureTime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })},{" "}
                    {new Date(flight.departureTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ color: "#6b7280" }}>Seats</span>
                  <span style={{ fontWeight: 700, color: "#15192e" }}>{seats.join(", ")}</span>
                </div>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "0 0 20px" }} />

              {/* Fare breakdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ color: "#6b7280" }}>Base Fare</span>
                  <span style={{ color: "#15192e" }}>PHP {totalBase.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ color: "#6b7280" }}>Taxes (12%)</span>
                  <span style={{ color: "#15192e" }}>PHP {taxes.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ color: "#6b7280" }}>Fees (3%)</span>
                  <span style={{ color: "#15192e" }}>PHP {fees.toLocaleString()}</span>
                </div>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "0 0 16px" }} />

              {/* Total */}
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

export default function BookingPage() {
  return (
    <Suspense fallback={<div style={{ background: "#f8fafc", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}
