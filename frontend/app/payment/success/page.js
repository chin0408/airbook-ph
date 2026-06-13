"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import API from "@/services/api";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("bookingId");

  const [status, setStatus] = useState("verifying"); // verifying, success, error

  useEffect(() => {
    if (sessionId && bookingId) {
      verifyPayment();
    }
  }, [sessionId, bookingId]);

  const verifyPayment = async () => {
    try {
      const token = localStorage.getItem("token");
      await API.post(
        "/payments/verify-payment",
        { sessionId, bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus("success");
    } catch (error) {
      console.log("Verification error:", error);
      setStatus("error");
    }
  };

  return (
    <main style={{ background: "#f8fafc", minHeight: "calc(100vh - 72px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          padding: "56px 48px",
          textAlign: "center",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        {status === "verifying" && (
          <>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>⏳</div>
            <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#15192e", marginBottom: "12px" }}>
              Verifying Payment...
            </h1>
            <p style={{ fontSize: "15px", color: "#6b7280" }}>
              Please wait while we confirm your payment with Stripe.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>✅</div>
            <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#15192e", marginBottom: "12px" }}>
              Payment Successful!
            </h1>
            <p style={{ fontSize: "15px", color: "#6b7280", marginBottom: "32px", lineHeight: 1.6 }}>
              Your booking has been confirmed and your ticket has been issued. You can view your receipt below.
            </p>
            <Link
              href={`/my-bookings/${bookingId}`}
              style={{
                display: "inline-block",
                background: "#2f5af0",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 700,
                padding: "14px 28px",
                borderRadius: "10px",
                textDecoration: "none",
              }}
            >
              View Receipt →
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>⚠️</div>
            <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#15192e", marginBottom: "12px" }}>
              Verification Issue
            </h1>
            <p style={{ fontSize: "15px", color: "#6b7280", marginBottom: "32px", lineHeight: 1.6 }}>
              We couldn&apos;t verify the payment. Your booking may still be updated shortly. Please check My Bookings.
            </p>
            <Link
              href="/my-bookings"
              style={{
                display: "inline-block",
                background: "#2f5af0",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 700,
                padding: "14px 28px",
                borderRadius: "10px",
                textDecoration: "none",
              }}
            >
              Go to My Bookings
            </Link>
          </>
        )}
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div style={{ background: "#f8fafc", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Verifying payment...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
