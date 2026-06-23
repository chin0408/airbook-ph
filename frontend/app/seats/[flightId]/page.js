"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getFlightById } from "@/services/flightService";
import BookingProgress from "@/components/BookingProgress";

export default function SeatSelectionPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [flight, setFlight] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerCount, setPassengerCount] = useState(
    Number(searchParams.get("passengers")) || 1
  );

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const data = await getFlightById(params.flightId);
        setFlight(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFlight();
  }, [params.flightId]);

  const toggleSeat = (seatNumber) => {
    if (flight?.bookedSeats?.includes(seatNumber)) return;
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else {
      if (selectedSeats.length >= passengerCount) {
        setSelectedSeats([...selectedSeats.slice(1), seatNumber]);
      } else {
        setSelectedSeats([...selectedSeats, seatNumber]);
      }
    }
  };

  const getSeatStyle = (seatNumber) => {
    if (flight?.bookedSeats?.includes(seatNumber)) {
      return { background: "#e5e7eb", color: "#9ca3af", cursor: "not-allowed", border: "1px solid #d1d5db" };
    }
    if (selectedSeats.includes(seatNumber)) {
      // Blue for selected — matches Figma
      return { background: "#2f5af0", color: "#ffffff", cursor: "pointer", border: "1px solid #1d4ed8" };
    }
    return { background: "#d1fae5", color: "#065f46", cursor: "pointer", border: "1px solid #a7f3d0" };
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  };

  const baseFare = flight?.baseFare || 0;
  const estimatedTotal = Math.round(baseFare * selectedSeats.length * 1.15);

  const handleHoldSeats = () => {
    if (selectedSeats.length !== passengerCount) {
      alert(`Please select exactly ${passengerCount} seat(s).`);
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to continue booking.");
      router.push("/login");
      return;
    }
    router.push(`/booking?flightId=${params.flightId}&seats=${selectedSeats.join(",")}&passengers=${passengerCount}`);
  };

  if (!flight) {
    return (
      <main style={{ background: "#f8fafc", minHeight: "calc(100vh - 72px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#6b7280" }}>Loading flight details...</p>
      </main>
    );
  }

  const rows = 20;
  const columnsLeft = ["A", "B", "C"];
  const columnsRight = ["D", "E", "F"];

  return (
    <main style={{ background: "#f8fafc", minHeight: "calc(100vh - 72px)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 20px 64px" }}>
        {/* Booking Progress */}
        <BookingProgress currentStep={2} />

        {/* Back button */}
        <Link
          href={`/flights/search?from=${flight.origin}&to=${flight.destination}`}
          style={{
            display: "inline-block",
            fontSize: "14px",
            fontWeight: 600,
            color: "#2f5af0",
            border: "1px solid #e3e6ef",
            padding: "10px 20px",
            borderRadius: "10px",
            textDecoration: "none",
            marginBottom: "20px",
          }}
        >
          ← Back to Results
        </Link>

        {/* Flight Info Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #0c1330 0%, #1c2f6e 55%, #2a4090 100%)",
            borderRadius: "16px",
            padding: "32px 24px",
            marginBottom: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "48px" }}>
            <h1 style={{ fontSize: "40px", fontWeight: 800, color: "#ffffff" }}>
              {flight.origin} <span style={{ color: "#94a3b8", margin: "0 4px" }}>→</span> {flight.destination}
            </h1>
            <div>
              <p style={{ fontSize: "14px", color: "#cbd5e1" }}>{formatDate(flight.departureTime)}</p>
              <p style={{ fontSize: "14px", color: "#cbd5e1" }}>
                {formatTime(flight.departureTime)} – {formatTime(flight.arrivalTime)}
              </p>
              <span
                style={{
                  display: "inline-block",
                  marginTop: "6px",
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  padding: "4px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#ffffff",
                }}
              >
                {flight.flightNumber}
              </span>
            </div>
          </div>
          {/* Price — "/ seat" inline */}
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "40px", fontWeight: 800, color: "#ffffff" }}>
              PHP {flight.baseFare.toLocaleString()}
            </span>
            <span style={{ fontSize: "16px", color: "#94a3b8", marginLeft: "4px" }}>/ seat</span>
          </div>
        </div>

        {/* Select Your Seat Header + Passengers + Selected Seats (right column) */}
        <div style={{ display: "flex", gap: "40px", alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Left Column: Title + Seat Map + Legend */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#15192e" }}>
                Select Your Seat
              </h2>
              {/* Passengers Dropdown — aligned to right of seat map area */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <label style={{ fontSize: "14px", color: "#6b7280", fontWeight: 500 }}>Passengers:</label>
                <select
                  value={passengerCount}
                  onChange={(e) => {
                    const newCount = Number(e.target.value);
                    setPassengerCount(newCount);
                    if (selectedSeats.length > newCount) {
                      setSelectedSeats(selectedSeats.slice(0, newCount));
                    }
                  }}
                  style={{
                    border: "1px solid #e3e6ef",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Column Headers */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "8px", paddingLeft: "32px" }}>
              {columnsLeft.map((col) => (
                <div key={col} style={{ width: "48px", textAlign: "center", fontSize: "13px", fontWeight: 700, color: "#6b7280" }}>
                  {col}
                </div>
              ))}
              <div style={{ width: "40px" }}></div>
              {columnsRight.map((col) => (
                <div key={col} style={{ width: "48px", textAlign: "center", fontSize: "13px", fontWeight: 700, color: "#6b7280" }}>
                  {col}
                </div>
              ))}
            </div>

            {/* Seat Grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {Array.from({ length: rows }).map((_, rowIndex) => {
                const rowNum = rowIndex + 1;
                return (
                  <div key={rowNum} style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ width: "32px", textAlign: "center", fontSize: "12px", color: "#9ca3af", fontWeight: 500 }}>
                      {rowNum}
                    </div>
                    {columnsLeft.map((col) => {
                      const seatNumber = `${rowNum}${col}`;
                      return (
                        <button
                          key={seatNumber}
                          onClick={() => toggleSeat(seatNumber)}
                          disabled={flight.bookedSeats?.includes(seatNumber)}
                          style={{
                            width: "44px",
                            height: "44px",
                            margin: "0 2px",
                            borderRadius: "8px",
                            fontSize: "11px",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            ...getSeatStyle(seatNumber),
                          }}
                        >
                          {seatNumber}
                        </button>
                      );
                    })}
                    <div style={{ width: "40px" }}></div>
                    {columnsRight.map((col) => {
                      const seatNumber = `${rowNum}${col}`;
                      return (
                        <button
                          key={seatNumber}
                          onClick={() => toggleSeat(seatNumber)}
                          disabled={flight.bookedSeats?.includes(seatNumber)}
                          style={{
                            width: "44px",
                            height: "44px",
                            margin: "0 2px",
                            borderRadius: "8px",
                            fontSize: "11px",
                            fontWeight: 600,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            ...getSeatStyle(seatNumber),
                          }}
                        >
                          {seatNumber}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "40px",
                marginTop: "40px",
                paddingTop: "24px",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "6px", background: "#d1fae5", border: "1px solid #a7f3d0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 600, color: "#065f46" }}>A</div>
                <span style={{ fontSize: "14px", color: "#4b5165" }}>Available</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "6px", background: "#2f5af0", border: "1px solid #1d4ed8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 600, color: "#ffffff" }}>A</div>
                <span style={{ fontSize: "14px", color: "#4b5165" }}>Selected</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "6px", background: "#fbbf24", border: "1px solid #f59e0b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 600, color: "#ffffff" }}>A</div>
                <span style={{ fontSize: "14px", color: "#4b5165" }}>Held</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "6px", background: "#e5e7eb", border: "1px solid #d1d5db", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 600, color: "#9ca3af" }}>A</div>
                <span style={{ fontSize: "14px", color: "#4b5165" }}>Booked</span>
              </div>
            </div>
          </div>

          {/* Right Column: Selected Seats */}
          <div style={{ width: "300px", minWidth: "280px", flexShrink: 0 }}>
            {/* Selected Seats Card */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "28px",
                boxShadow: "0 30px 60px rgba(0, 0, 0, 0.08)",
              }}
            >
              <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#15192e", marginBottom: "20px" }}>
                Selected Seats
              </h3>

              {selectedSeats.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#eef2ff",
                        border: "1px solid #c3cbe8",
                        padding: "10px 20px",
                        borderRadius: "10px",
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#154678",
                      }}
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: "14px", color: "#8a90a8", marginBottom: "14px" }}>No seats selected</p>
              )}

              <p style={{ fontSize: "14px", fontWeight: 700, color: "#8a90a8", marginBottom: "16px" }}>
                {selectedSeats.length}/{passengerCount} seat{passengerCount > 1 ? "s" : ""} selected
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#eef2ff",
                  border: "1px solid #c3cbe8",
                  borderRadius: "10px",
                  padding: "16px 18px",
                  marginBottom: "16px",
                }}
              >
                <span style={{ fontSize: "15px", fontWeight: 700, color: "#8a90a8" }}>Est. Total</span>
                <span style={{ fontSize: "20px", fontWeight: 800, color: "#154678" }}>
                  PHP {estimatedTotal.toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleHoldSeats}
                disabled={selectedSeats.length !== passengerCount}
                style={{
                  width: "100%",
                  background: selectedSeats.length === passengerCount ? "#2f5af0" : "#94a3b8",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: 700,
                  padding: "16px",
                  border: "none",
                  borderRadius: "10px",
                  cursor: selectedSeats.length === passengerCount ? "pointer" : "not-allowed",
                }}
              >
                Hold Seats (3 min)
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
