"use client";

import { useEffect, useState, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getFlightById } from "@/services/flightService";

export default function FlightDetails({ params }) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const passengers = searchParams.get("passengers") || "1";

  const [flight, setFlight] = useState(null);

  useEffect(() => {
    fetchFlight();
  }, []);

  const fetchFlight = async () => {
    try {
      const data = await getFlightById(resolvedParams.id);
      setFlight(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // If flight loaded, redirect to seat selection with passenger count
    if (flight) {
      router.push(`/seats/${resolvedParams.id}?passengers=${passengers}`);
    }
  }, [flight]);

  return (
    <main className="flex-1 bg-navy min-h-[calc(100vh-64px)] flex items-center justify-center">
      <p className="text-white">Redirecting to seat selection...</p>
    </main>
  );
}
