"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getFlights } from "@/services/flightService";

export default function Home() {
  const router = useRouter();
  const [flights, setFlights] = useState([]);
  const [from, setFrom] = useState("MNL");
  const [to, setTo] = useState("CEB");
  const [departure, setDeparture] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Fallback sample flights when API is not connected
  const sampleFlights = [
    {
      airlineCode: "PR", origin: "MNL", destination: "CEB",
      departureTime: "2026-04-13T06:00:00", arrivalTime: "2026-04-13T07:15:00",
      baseFare: 1800, seatsAvailable: 120, flightStatus: "SCHEDULED",
    },
    {
      airlineCode: "PR", origin: "CEB", destination: "MNL",
      departureTime: "2026-04-13T08:00:00", arrivalTime: "2026-04-13T09:15:00",
      baseFare: 1800, seatsAvailable: 120, flightStatus: "SCHEDULED",
    },
    {
      airlineCode: "5J", origin: "MNL", destination: "DVO",
      departureTime: "2026-04-13T07:00:00", arrivalTime: "2026-04-13T09:00:00",
      baseFare: 2200, seatsAvailable: 120, flightStatus: "SCHEDULED",
    },
    {
      airlineCode: "5J", origin: "DVO", destination: "MNL",
      departureTime: "2026-04-13T10:00:00", arrivalTime: "2026-04-13T12:00:00",
      baseFare: 2200, seatsAvailable: 120, flightStatus: "SCHEDULED",
    },
    {
      airlineCode: "PR", origin: "MNL", destination: "CGY",
      departureTime: "2026-04-13T15:30:00", arrivalTime: "2026-04-13T17:15:00",
      baseFare: 2100, seatsAvailable: 120, flightStatus: "SCHEDULED",
    },
  ];

  useEffect(() => {
    fetchFlights();
    const today = new Date().toISOString().split("T")[0];
    setDeparture(today);

    // Check logged in user
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        const user = JSON.parse(storedUser);
        setLoggedInUser(user);
        if (user.isAdmin) {
          router.push("/admin");
        }
      }
    } catch (e) {}
  }, []);

  const fetchFlights = async () => {
    try {
      const data = await getFlights();
      setFlights(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(
      `/flights/search?from=${from}&to=${to}&date=${departure}&passengers=${passengers}`
    );
  };

  const swapLocations = () => {
    setFrom(to);
    setTo(from);
  };

  const airports = [
    { code: "MNL", name: "Manila (MNL)", full: "Ninoy Aquino International Airport" },
    { code: "CEB", name: "Cebu (CEB)", full: "Mactan-Cebu International Airport" },
    { code: "DVO", name: "Davao (DVO)", full: "Francisco Bangoy International Airport" },
    { code: "CGY", name: "Cagayan de Oro (CGY)", full: "Laguindingan Airport" },
    { code: "ILO", name: "Iloilo (ILO)", full: "Iloilo International Airport" },
    { code: "BCD", name: "Bacolod (BCD)", full: "Silay International Airport" },
    { code: "LAX", name: "Los Angeles (LAX)", full: "Los Angeles International Airport" },
    { code: "SFO", name: "San Francisco (SFO)", full: "San Francisco International Airport" },
    { code: "TPA", name: "Tampa (TPA)", full: "Tampa International Airport" },
    { code: "LHR", name: "London Heathrow (LHR)", full: "Heathrow Airport" },
    { code: "LGW", name: "London Gatwick (LGW)", full: "Gatwick Airport" },
    { code: "MAN", name: "Manchester (MAN)", full: "Manchester Airport" },
    { code: "CDG", name: "Paris (CDG)", full: "Charles de Gaulle Airport" },
  ];

  const getFlightDuration = (dep, arr) => {
    const diff = new Date(arr) - new Date(dep);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <main className="flex-1">
      {/* ═══════════════════════ HERO SECTION ═══════════════════════ */}
      <section
        className="text-white relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0c1330 0%, #1c2f6e 55%, #2a4090 100%)",
          padding: "40px 20px",
          minHeight: "auto",
        }}
      >
        {/* Glow effect */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-120px",
            width: "480px",
            height: "480px",
            borderRadius: "50%",
            background: "rgba(74, 108, 247, 0.25)",
            filter: "blur(10px)",
          }}
        />

        <div
          className="relative z-10 flex flex-col lg:flex-row justify-between items-center"
          style={{ gap: "40px", maxWidth: "1280px", margin: "0 auto" }}
        >
          {/* Left Content */}
          <div style={{ maxWidth: "600px" }}>
            <div
              className="inline-flex items-center"
              style={{
                gap: "8px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#c7d0f5",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.05em",
                padding: "8px 16px",
                borderRadius: "999px",
                marginBottom: "32px",
              }}
            >
              <span>✈</span>
              <span>DOMESTIC FLIGHTS · PHILIPPINES</span>
            </div>

            <h1
              style={{
                fontSize: "56px",
                fontWeight: 800,
                lineHeight: 1.15,
                color: "#ffffff",
                marginBottom: "24px",
              }}
            >
              Book flights.<br />Travel smarter.
            </h1>

            <p
              style={{
                fontSize: "18px",
                fontWeight: 400,
                lineHeight: 1.6,
                color: "#aab2d4",
                maxWidth: "480px",
                marginBottom: "40px",
              }}
            >
              Search real-time flights, hold seats instantly, and
              complete your booking in one smooth flow.
            </p>

            <div className="flex" style={{ gap: "16px", marginBottom: "64px" }}>
              <Link
                href="/flights/search"
                style={{
                  background: "#ffffff",
                  color: "#15192e",
                  fontSize: "15px",
                  fontWeight: 600,
                  padding: "14px 28px",
                  borderRadius: "8px",
                  textDecoration: "none",
                }}
              >
                Search Flights →
              </Link>
              <Link
                href="/check-booking"
                style={{
                  background: "transparent",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: 600,
                  padding: "14px 28px",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  borderRadius: "8px",
                  textDecoration: "none",
                }}
              >
                Check Booking
              </Link>
            </div>

            {/* Stats */}
            <div className="flex" style={{ gap: "32px" }}>
              <div>
                <p style={{ fontSize: "32px", fontWeight: 800, color: "#ffffff", marginBottom: "4px" }}>
                  {flights.length || 8}
                </p>
                <p style={{ fontSize: "14px", fontWeight: 400, color: "#aab2d4" }}>
                  Flights live today
                </p>
              </div>
              <div>
                <p style={{ fontSize: "32px", fontWeight: 800, color: "#ffffff", marginBottom: "4px" }}>
                  3 min
                </p>
                <p style={{ fontSize: "14px", fontWeight: 400, color: "#aab2d4" }}>
                  Seat hold timer
                </p>
              </div>
              <div>
                <p style={{ fontSize: "32px", fontWeight: 800, color: "#ffffff", marginBottom: "4px" }}>
                  Secure
                </p>
                <p style={{ fontSize: "14px", fontWeight: 400, color: "#aab2d4" }}>
                  Stripe checkout
                </p>
              </div>
            </div>
          </div>

          {/* Search Card */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "32px",
              width: "100%", maxWidth: "460px",
              flexShrink: 0,
              boxShadow: "0 30px 60px rgba(0, 0, 0, 0.25)",
            }}
          >
            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: "#2f5af0",
                marginBottom: "6px",
              }}
            >
              BOOK NOW
            </p>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: "#15192e",
                marginBottom: "24px",
              }}
            >
              Find your flight
            </h2>

            <form onSubmit={handleSearch}>
              {/* From / Swap / To */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto 1fr",
                  gap: "12px",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      color: "#8a90a8",
                      marginBottom: "8px",
                    }}
                  >
                    FROM
                  </label>
                  <select
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    style={{
                      width: "100%",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "#15192e",
                      border: "1px solid #e3e6ef",
                      borderRadius: "10px",
                      padding: "12px 14px",
                      background: "#ffffff",
                    }}
                  >
                    {airports.map((a) => (
                      <option key={a.code} value={a.code}>{a.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={swapLocations}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    background: "#eef2ff",
                    color: "#2f5af0",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    cursor: "pointer",
                    marginTop: "18px",
                  }}
                >
                  ⇄
                </button>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      color: "#8a90a8",
                      marginBottom: "8px",
                    }}
                  >
                    TO
                  </label>
                  <select
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    style={{
                      width: "100%",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "#15192e",
                      border: "1px solid #e3e6ef",
                      borderRadius: "10px",
                      padding: "12px 14px",
                      background: "#ffffff",
                    }}
                  >
                    {airports.map((a) => (
                      <option key={a.code} value={a.code}>{a.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Departure & Passengers */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      color: "#8a90a8",
                      marginBottom: "8px",
                    }}
                  >
                    DEPARTURE
                  </label>
                  <input
                    type="date"
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    style={{
                      width: "100%",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "#15192e",
                      border: "1px solid #e3e6ef",
                      borderRadius: "10px",
                      padding: "12px 14px",
                      background: "#ffffff",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      color: "#8a90a8",
                      marginBottom: "8px",
                    }}
                  >
                    PASSENGERS
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    style={{
                      width: "100%",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "#15192e",
                      border: "1px solid #e3e6ef",
                      borderRadius: "10px",
                      padding: "12px 14px",
                      background: "#ffffff",
                    }}
                  />
                </div>
              </div>

              {/* Airport full names */}
              <div
                className="flex justify-between"
                style={{
                  fontSize: "12px",
                  color: "#8a90a8",
                  lineHeight: 1.4,
                  marginBottom: "24px",
                  gap: "16px",
                }}
              >
                <span>{airports.find((a) => a.code === from)?.full || ""}</span>
                <span style={{ textAlign: "right" }}>
                  {airports.find((a) => a.code === to)?.full || ""}
                </span>
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  background: "#2f5af0",
                  color: "#ffffff",
                  fontSize: "15px",
                  fontWeight: 700,
                  padding: "16px",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                Search Flights →
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FEATURED FLIGHTS ═══════════════════ */}
      <section
        style={{
          background: "#f1f5f9",
          padding: "40px 20px",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <p
            style={{
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: "#2f5af0",
              marginBottom: "8px",
            }}
          >
            FEATURED FLIGHTS
          </p>
          <div className="flex items-center justify-between" style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "32px", fontWeight: 800, color: "#15192e" }}>
              Today&apos;s available routes
            </h2>
            <Link
              href="/flights/search"
              style={{ fontSize: "14px", fontWeight: 600, color: "#2f5af0", textDecoration: "none" }}
            >
              View all →
            </Link>
          </div>

          {/* Flight Cards — Horizontal Scroll */}
          <div className="flex overflow-x-auto pb-4" style={{ gap: "20px" }}>
            {(flights.length > 0 ? flights : sampleFlights).slice(0, 6).map((flight, index) => (
              <div
                key={flight._id || index}
                style={{
                  minWidth: "300px",
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "24px",
                  flexShrink: 0,
                }}
              >
                {/* Airline + Status */}
                <div className="flex items-center justify-between" style={{ marginBottom: "16px" }}>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      border: "1px solid #e3e6ef",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      color: "#4b5165",
                    }}
                  >
                    {flight.airlineCode}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      background: "#d1fae5",
                      color: "#065f46",
                      padding: "4px 10px",
                      borderRadius: "6px",
                    }}
                  >
                    {flight.flightStatus || "SCHEDULED"}
                  </span>
                </div>

                {/* Route with times */}
                <div className="flex items-start justify-between" style={{ marginBottom: "4px" }}>
                  <div>
                    <p style={{ fontSize: "24px", fontWeight: 800, color: "#15192e" }}>{flight.origin}</p>
                    <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
                      {formatTime(flight.departureTime)}
                    </p>
                    <p style={{ fontSize: "12px", color: "#9ca3af" }}>
                      {formatDate(flight.departureTime)}
                    </p>
                  </div>
                  <div style={{ textAlign: "center", paddingTop: "8px" }}>
                    <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "4px" }}>
                      {getFlightDuration(flight.departureTime, flight.arrivalTime)}
                    </p>
                    <p style={{ color: "#d1d5db", fontSize: "12px" }}>→</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "24px", fontWeight: 800, color: "#15192e" }}>{flight.destination}</p>
                    <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
                      {formatTime(flight.arrivalTime)}
                    </p>
                    <p style={{ fontSize: "12px", color: "#9ca3af" }}>
                      {formatDate(flight.arrivalTime)}
                    </p>
                  </div>
                </div>

                <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: "16px 0" }} />

                {/* Price + Book */}
                <div className="flex items-end justify-between">
                  <div>
                    <p style={{ fontSize: "12px", color: "#9ca3af" }}>From</p>
                    <p style={{ fontSize: "24px", fontWeight: 800, color: "#15192e" }}>
                      ₱{flight.baseFare.toLocaleString()}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px" }}>
                      {flight.seatsAvailable} seats left
                    </p>
                    <Link
                      href={flight._id ? `/flights/${flight._id}` : "/flights/search"}
                      style={{
                        display: "inline-block",
                        background: "#2f5af0",
                        color: "#ffffff",
                        fontSize: "13px",
                        fontWeight: 600,
                        padding: "8px 16px",
                        borderRadius: "8px",
                        textDecoration: "none",
                      }}
                    >
                      Book →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ WHY AIRBOOK PH ══════════════════ */}
      <section style={{ background: "#ffffff", padding: "60px 20px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.05em",
              color: "#2f5af0",
              marginBottom: "12px",
            }}
          >
            WHY AIRBOOK PH
          </p>
          <h2
            style={{
              fontSize: "36px",
              fontWeight: 800,
              color: "#15192e",
              marginBottom: "56px",
            }}
          >
            Built for a smooth booking journey
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "24px",
            }}
          >
            <div
              style={{
                background: "#f1f5f9",
                border: "1px solid #e8edf5",
                borderRadius: "16px",
                padding: "40px 32px",
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: "28px", marginBottom: "20px" }}>⚡</div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#15192e", marginBottom: "10px" }}>
                Instant Flight Search
              </h3>
              <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.6 }}>
                Find routes, compare schedules, and choose the best trip in seconds.
              </p>
            </div>

            <div
              style={{
                background: "#f1f5f9",
                border: "1px solid #e8edf5",
                borderRadius: "16px",
                padding: "40px 32px",
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: "28px", marginBottom: "20px" }}>🔒</div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#15192e", marginBottom: "10px" }}>
                Secure Seat Holds
              </h3>
              <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.6 }}>
                Reserve seats for 3 minutes while you complete your booking details.
              </p>
            </div>

            <div
              style={{
                background: "#f1f5f9",
                border: "1px solid #e8edf5",
                borderRadius: "16px",
                padding: "40px 32px",
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: "28px", marginBottom: "20px" }}>📋</div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#15192e", marginBottom: "10px" }}>
                Booking Checker
              </h3>
              <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: 1.6 }}>
                Quickly review any booking using just your PNR and last name.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ CTA SECTION ══════════════════ */}
      <section style={{ background: "#ffffff", padding: "0 20px 60px 20px" }}>
        <div
          className="flex flex-col md:flex-row items-center justify-between"
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            background: "linear-gradient(135deg, #0c1330 0%, #1c2f6e 100%)",
            borderRadius: "24px",
            padding: "32px 20px",
            gap: "40px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.05em",
                color: "#8a90a8",
                marginBottom: "12px",
              }}
            >
              READY TO FLY?
            </p>
            <h2
              style={{
                fontSize: "36px",
                fontWeight: 800,
                color: "#ffffff",
                marginBottom: "12px",
              }}
            >
              Start booking in a few clicks.
            </h2>
            <p style={{ fontSize: "15px", color: "#8a90a8", maxWidth: "420px", lineHeight: 1.6 }}>
              Search flights, hold your seat, and complete checkout with secure Stripe payment.
            </p>
          </div>
          <div className="flex flex-shrink-0" style={{ gap: "16px" }}>
            {!loggedInUser ? (
              <Link
                href="/register"
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#15192e",
                  background: "#ffffff",
                  padding: "14px 28px",
                  borderRadius: "8px",
                  textDecoration: "none",
                }}
              >
                Create Account
              </Link>
            ) : (
              <Link
                href="/flights/search"
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#15192e",
                  background: "#ffffff",
                  padding: "14px 28px",
                  borderRadius: "8px",
                  textDecoration: "none",
                }}
              >
                Search Flights
              </Link>
            )}
            <Link
              href="/my-bookings"
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#ffffff",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "14px 28px",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              My Bookings
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
