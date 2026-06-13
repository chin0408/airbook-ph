"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/users/register", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        password: formData.password,
      });

      // Auto-login after registration
      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("token", response.data.token);
      window.dispatchEvent(new Event("storage"));
      router.push("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
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
      <p style={{ fontSize: "14px", color: "#8a90a8", marginBottom: "32px" }}>Create your account</p>

      {/* Register Card */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          padding: "40px",
          width: "100%",
          maxWidth: "480px",
          boxShadow: "0 30px 60px rgba(0, 0, 0, 0.25)",
        }}
      >
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#15192e", marginBottom: "28px" }}>
          Get started
        </h1>

        {error && (
          <div style={{ background: "#fef2f2", color: "#dc2626", fontSize: "14px", padding: "12px 16px", borderRadius: "10px", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#6b7280", marginBottom: "8px" }}>
                FIRST NAME
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                required
                style={{ width: "100%", border: "1px solid #e3e6ef", background: "#f8fafc", borderRadius: "10px", padding: "14px 16px", fontSize: "14px" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#6b7280", marginBottom: "8px" }}>
                LAST NAME
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
                style={{ width: "100%", border: "1px solid #e3e6ef", background: "#f8fafc", borderRadius: "10px", padding: "14px 16px", fontSize: "14px" }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#6b7280", marginBottom: "8px" }}>
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              style={{ width: "100%", border: "1px solid #e3e6ef", background: "#f8fafc", borderRadius: "10px", padding: "14px 16px", fontSize: "14px" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#6b7280", marginBottom: "8px" }}>
              MOBILE NUMBER
            </label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="09171234567"
              style={{ width: "100%", border: "1px solid #e3e6ef", background: "#f8fafc", borderRadius: "10px", padding: "14px 16px", fontSize: "14px" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "28px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#6b7280", marginBottom: "8px" }}>
                PASSWORD
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 chars"
                required
                style={{ width: "100%", border: "1px solid #e3e6ef", background: "#f8fafc", borderRadius: "10px", padding: "14px 16px", fontSize: "14px" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#6b7280", marginBottom: "8px" }}>
                CONFIRM PASSWORD
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter"
                required
                style={{ width: "100%", border: "1px solid #e3e6ef", background: "#f8fafc", borderRadius: "10px", padding: "14px 16px", fontSize: "14px" }}
              />
            </div>
          </div>

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
            {loading ? "Creating account..." : "Create Account →"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "14px", color: "#6b7280", marginTop: "24px" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#2f5af0", fontWeight: 600, textDecoration: "none" }}>
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
