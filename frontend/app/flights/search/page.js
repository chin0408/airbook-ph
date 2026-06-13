"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getFlights } from "@/services/flightService";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const from = searchParams.get("from") || "MNL";
  const to = searchParams.get("to") || "CEB";
  const date = searchParams.get("date") || "";
  const passengers = searchParams.get("passengers") || "1";

  const [flights, setFlights] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [maxPrice, setMaxPrice] = useState(300000);
  const [loading, setLoading] = useState(true);

  // Hardcoded sample flights for when API is not available
  const today = new Date().toISOString().split("T")[0];
  const sampleFlights = [
    {
      _id: "sample1",
      airlineCode: "PR",
      flightNumber: "PR101-DO",
      origin: "MNL",
      destination: "CEB",
      departureTime: `${today}T06:00:00`,
      arrivalTime: `${today}T07:15:00`,
      baseFare: 1800,
      seatsAvailable: 120,
      flightStatus: "SCHEDULED",
    },
    {
      _id: "sample2",
      airlineCode: "PR",
      flightNumber: "PR102-DO",
      origin: "CEB",
      destination: "MNL",
      departureTime: `${today}T08:00:00`,
      arrivalTime: `${today}T09:15:00`,
      baseFare: 1800,
      seatsAvailable: 120,
      flightStatus: "SCHEDULED",
    },
    {
      _id: "sample3",
      airlineCode: "5J",
      flightNumber: "5J201-DO",
      origin: "MNL",
      destination: "DVO",
      departureTime: `${today}T07:00:00`,
      arrivalTime: `${today}T09:00:00`,
      baseFare: 2200,
      seatsAvailable: 120,
      flightStatus: "SCHEDULED",
    },
    {
      _id: "sample4",
      airlineCode: "5J",
      flightNumber: "5J202-DO",
      origin: "DVO",
      destination: "MNL",
      departureTime: `${today}T10:00:00`,
      arrivalTime: `${today}T12:00:00`,
      baseFare: 2200,
      seatsAvailable: 120,
      flightStatus: "SCHEDULED",
    },
    {
      _id: "sample5",
      airlineCode: "PR",
      flightNumber: "PR301-DO",
      origin: "MNL",
      destination: "CGY",
      departureTime: `${today}T15:30:00`,
      arrivalTime: `${today}T17:15:00`,
      baseFare: 2100,
      seatsAvailable: 120,
      flightStatus: "SCHEDULED",
    },
  ];

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const data = await getFlights();
      if (data.length > 0) {
        setFlights(data);
        let results = data;
        if (from) results = results.filter((f) => f.origin === from);
        if (to) results = results.filter((f) => f.destination === to);
        
        // Try date filter first, but if no results, show all for that route
        if (date) {
          const dateFiltered = results.filter((f) => {
            const flightLocalDate = new Date(f.departureTime).toLocaleDateString("en-CA");
            return flightLocalDate === date;
          });
          // If date filter finds results, use them. Otherwise show all flights for the route.
          if (dateFiltered.length > 0) {
            results = dateFiltered;
          }
        }

        setFiltered(results);
      } else {
        useSampleData();
      }
    } catch (error) {
      console.log("Using sample flight data");
      useSampleData();
    } finally {
      setLoading(false);
    }
  };

  const useSampleData = () => {
    let results = sampleFlights;
    if (from) results = results.filter((f) => f.origin === from);
    if (to) results = results.filter((f) => f.destination === to);
    // Don't filter by date for sample data — always show results
    setFlights(sampleFlights);
    setFiltered(results);
  };

  const displayFlights = filtered.filter((f) => f.baseFare <= maxPrice);

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getFlightDuration = (dep, arr) => {
    const diff = new Date(arr) - new Date(dep);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <main style={{ background: "#f8fafc", minHeight: "calc(100vh - 72px)" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
        {/* Header */}
        <div className="flex items-start justify-between" style={{ marginBottom: "32px" }}>
          <div>
            <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#15192e", marginBottom: "4px" }}>
              {from} → {to}
            </h1>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>
              {formatDateDisplay(date)} · {passengers} Passenger{passengers > 1 ? "s" : ""} · {displayFlights.length} flight{displayFlights.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#2f5af0",
              background: "#ffffff",
              border: "1px solid #2f5af0",
              padding: "12px 24px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            ← Change Search
          </button>
        </div>

        <div className="flex" style={{ gap: "24px", flexWrap: "wrap" }}>
          {/* Filters Sidebar */}
          <div style={{ width: "220px", flexShrink: 0, minWidth: "200px" }}>
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "28px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#15192e", marginBottom: "20px" }}>
                Filters
              </h3>

              <div style={{ marginBottom: "24px" }}>
                <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>Max Price</p>
                <p style={{ fontSize: "20px", fontWeight: 800, color: "#2f5af0", marginBottom: "12px" }}>
                  PHP {maxPrice.toLocaleString()}
                </p>
                <input
                  type="range"
                  min="500"
                  max="300000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#2f5af0" }}
                />
                <div className="flex justify-between" style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
                  <span>PHP 500</span>
                  <span>PHP 300,000</span>
                </div>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "16px 0" }} />

              <div>
                <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>Showing</p>
                <p style={{ fontSize: "32px", fontWeight: 800, color: "#15192e", lineHeight: 1 }}>
                  {displayFlights.length}
                </p>
                <p style={{ fontSize: "13px", color: "#9ca3af" }}>of {filtered.length} flights</p>
              </div>
            </div>
          </div>

          {/* Flight Results */}
          <div style={{ flex: 1 }}>
            {loading ? (
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "48px",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "#6b7280" }}>Searching flights...</p>
              </div>
            ) : displayFlights.length === 0 ? (
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "48px",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "#6b7280", marginBottom: "8px" }}>No flights found for this route and date.</p>
                <Link href="/" style={{ color: "#2f5af0", fontSize: "14px" }}>
                  Try a different search
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {displayFlights.map((flight) => (
                  <div
                    key={flight._id}
                    style={{
                      background: "#ffffff",
                      borderRadius: "16px",
                      padding: "28px 24px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Airline badge */}
                    <div style={{ textAlign: "center", flexShrink: 0, width: "80px" }}>
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "12px",
                          background: "#eef2ff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 6px",
                        }}
                      >
                        <span style={{ fontSize: "14px", fontWeight: 700, color: "#2f5af0" }}>
                          {flight.airlineCode}
                        </span>
                      </div>
                      <p style={{ fontSize: "12px", fontWeight: 600, color: "#15192e" }}>
                        {flight.flightNumber?.replace(flight.airlineCode, "") || "101-DO"}
                      </p>
                      <p style={{ fontSize: "11px", color: "#6b7280", whiteSpace: "nowrap" }}>Direct · Economy</p>
                    </div>

                    {/* Departure */}
                    <div style={{ flexShrink: 0 }}>
                      <p style={{ fontSize: "22px", fontWeight: 700, color: "#15192e" }}>
                        {formatTime(flight.departureTime)}
                      </p>
                      <p style={{ fontSize: "13px", color: "#6b7280" }}>{flight.origin}</p>
                    </div>

                    {/* Visual timeline — stretches to fill space */}
                    <div style={{ flex: 1, display: "flex", alignItems: "center", position: "relative" }}>
                      <div
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          background: "#2f5af0",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, position: "relative", margin: "0 4px" }}>
                        <div style={{ borderTop: "2px dashed #cbd5e1", width: "100%" }} />
                        <p
                          style={{
                            position: "absolute",
                            top: "-20px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            fontSize: "11px",
                            color: "#9ca3af",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {getFlightDuration(flight.departureTime, flight.arrivalTime)}
                        </p>
                        <span
                          style={{
                            position: "absolute",
                            top: "-8px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            fontSize: "12px",
                            color: "#9ca3af",
                          }}
                        >
                          ✈
                        </span>
                      </div>
                      <div
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          background: "#2f5af0",
                          flexShrink: 0,
                        }}
                      />
                    </div>

                    {/* Arrival */}
                    <div style={{ flexShrink: 0 }}>
                      <p style={{ fontSize: "22px", fontWeight: 700, color: "#15192e" }}>
                        {formatTime(flight.arrivalTime)}
                      </p>
                      <p style={{ fontSize: "13px", color: "#6b7280" }}>{flight.destination}</p>
                    </div>

                    {/* Price + CTA */}
                    <div style={{ textAlign: "right", flexShrink: 0, minWidth: "120px" }}>
                      <div style={{ marginBottom: "8px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            background: "#d1fae5",
                            color: "#065f46",
                            fontSize: "12px",
                            fontWeight: 600,
                            padding: "4px 10px",
                            borderRadius: "6px",
                          }}
                        >
                          💺 {flight.seatsAvailable} seats left
                        </span>
                      </div>
                      <div style={{ marginBottom: "12px" }}>
                        <span style={{ fontSize: "12px", color: "#6b7280" }}>PHP </span>
                        <span style={{ fontSize: "28px", fontWeight: 800, color: "#15192e" }}>
                          {flight.baseFare.toLocaleString()}
                        </span>
                        <p style={{ fontSize: "12px", color: "#9ca3af" }}>per seat</p>
                      </div>
                      <Link
                        href={`/flights/${flight._id}?passengers=${passengers}`}
                        style={{
                          display: "inline-block",
                          background: "#2f5af0",
                          color: "#ffffff",
                          fontSize: "14px",
                          fontWeight: 600,
                          padding: "10px 20px",
                          borderRadius: "8px",
                          textDecoration: "none",
                        }}
                      >
                        Select →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function FlightSearchPage() {
  return (
    <Suspense fallback={<div style={{ background: "#f8fafc", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
