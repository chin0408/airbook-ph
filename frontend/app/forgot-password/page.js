"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In MVP, just show confirmation. Real implementation would send email.
    setSubmitted(true);
  };

  return (
    <main
      style={{
        background: "linear-gradient(135deg, #0c1330 0%, #1c2f6e 55%, #2a4090 100%)",
        minHeight: "calc(100vh - 72px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            background: "#2f5af0",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ color: "#ffffff", fontSize: "18px" }}>✈</span>
        </div>
        <span style={{ fontSize: "20px", fontWeight: 700, color: "#ffffff" }}>AirBook PH</span>
      </div>
      <p style={{ fontSize: "14px", color: "#8a90a8", marginBottom: "32px" }}>Reset your password</p>

      {/* Card */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          padding: "40px",
          width: "100%",
          maxWidth: "440px",
          boxShadow: "0 30px 60px rgba(0, 0, 0, 0.25)",
        }}
      >
        {submitted ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✉️</div>
            <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#15192e", marginBottom: "12px" }}>
              Check your email
            </h1>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px", lineHeight: 1.6 }}>
              If an account exists for <strong>{email}</strong>, we&apos;ve sent a password reset link to your inbox.
            </p>
            <Link
              href="/login"
              style={{
                display: "inline-block",
                background: "#2f5af0",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 600,
                padding: "12px 24px",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#15192e", marginBottom: "12px" }}>
              Forgot password?
            </h1>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "28px", lineHeight: 1.6 }}>
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#6b7280", marginBottom: "8px" }}>
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={{ width: "100%", border: "1px solid #e3e6ef", background: "#f8fafc", borderRadius: "10px", padding: "14px 16px", fontSize: "15px" }}
                />
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
                Send Reset Link →
              </button>
            </form>

            <p style={{ textAlign: "center", fontSize: "14px", color: "#6b7280", marginTop: "24px" }}>
              Remember your password?{" "}
              <Link href="/login" style={{ color: "#2f5af0", fontWeight: 600, textDecoration: "none" }}>
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
