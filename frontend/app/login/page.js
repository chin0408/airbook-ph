"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API from "@/services/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.post("/users/login", { email, password });

      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("token", response.data.token);

      window.dispatchEvent(new Event("storage"));
      
      // Redirect admin to admin panel, regular users to homepage
      if (response.data.isAdmin) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
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
      <p style={{ fontSize: "14px", color: "#8a90a8", marginBottom: "32px" }}>Sign in to your account</p>

      {/* Login Card */}
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
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#15192e", marginBottom: "28px" }}>
          Welcome back
        </h1>

        {error && (
          <div style={{ background: "#fef2f2", color: "#dc2626", fontSize: "14px", padding: "12px 16px", borderRadius: "10px", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
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

          <div style={{ marginBottom: "28px" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#6b7280", marginBottom: "8px" }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ width: "100%", border: "1px solid #e3e6ef", background: "#f8fafc", borderRadius: "10px", padding: "14px 16px", fontSize: "15px" }}
            />
            <div style={{ textAlign: "right", marginTop: "8px" }}>
              <Link href="/forgot-password" style={{ fontSize: "13px", color: "#2f5af0", fontWeight: 500, textDecoration: "none" }}>
                Forgot password?
              </Link>
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
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "14px", color: "#6b7280", marginTop: "24px" }}>
          Don&apos;t have an account?{" "}
          <Link href="/register" style={{ color: "#2f5af0", fontWeight: 600, textDecoration: "none" }}>
            Sign up free
          </Link>
        </p>
      </div>
    </main>
  );
}
