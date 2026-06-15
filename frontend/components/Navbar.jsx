"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const loadUser = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  useEffect(() => {
    loadUser();
    setMenuOpen(false);
  }, [pathname]);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setMenuOpen(false);
    router.push("/");
  };

  const linkStyle = (path) => ({
    fontSize: "15px",
    fontWeight: pathname === path ? 600 : 500,
    color: pathname === path ? "#2f5af0" : "#4b5165",
    textDecoration: "none",
    padding: pathname === path ? "6px 14px" : "6px 0",
    border: pathname === path ? "1px solid #2f5af0" : "none",
    borderRadius: "8px",
  });

  return (
    <nav
      style={{
        background: "#ffffff",
        padding: "16px 24px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid #f1f5f9",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
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
          <span style={{ fontSize: "18px", fontWeight: 700, color: "#15192e" }}>AirBook PH</span>
        </Link>

        {/* Hamburger Button (mobile) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            padding: "4px",
            color: "#15192e",
          }}
          className="hamburger-btn"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Desktop Nav Links */}
        <div className="nav-links-desktop" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <Link href="/check-booking" style={{ ...linkStyle("/check-booking"), display: user?.isAdmin ? "none" : "inline" }}>
            Check Booking
          </Link>

          {user ? (
            <>
              <Link href="/my-bookings" style={{ ...linkStyle("/my-bookings"), display: user?.isAdmin ? "none" : "inline" }}>
                My Bookings
              </Link>

              {user.isAdmin && (
                <Link href="/admin" style={linkStyle("/admin")}>
                  Admin
                </Link>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "#2f5af0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  {user.firstName?.charAt(0)}
                </div>
                <span style={{ fontSize: "14px", fontWeight: 500, color: "#15192e" }}>{user.firstName}</span>
              </div>

              <button
                onClick={handleSignOut}
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#15192e",
                  background: "transparent",
                  border: "1px solid #e3e6ef",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={linkStyle("/login")}>
                Login
              </Link>
              <Link
                href="/register"
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#ffffff",
                  background: "#2f5af0",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  textDecoration: "none",
                }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="nav-links-mobile"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            paddingTop: "16px",
            marginTop: "16px",
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <Link href="/check-booking" onClick={() => setMenuOpen(false)} style={{ ...linkStyle("/check-booking"), display: user?.isAdmin ? "none" : "block" }}>
            Check Booking
          </Link>

          {user ? (
            <>
              <Link href="/my-bookings" onClick={() => setMenuOpen(false)} style={{ ...linkStyle("/my-bookings"), display: user?.isAdmin ? "none" : "block" }}>
                My Bookings
              </Link>

              {user.isAdmin && (
                <Link href="/admin" onClick={() => setMenuOpen(false)} style={linkStyle("/admin")}>
                  Admin
                </Link>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 0" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "#2f5af0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  {user.firstName?.charAt(0)}
                </div>
                <span style={{ fontSize: "14px", fontWeight: 500, color: "#15192e" }}>{user.firstName}</span>
              </div>

              <button
                onClick={handleSignOut}
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#15192e",
                  background: "transparent",
                  border: "1px solid #e3e6ef",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "fit-content",
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} style={linkStyle("/login")}>
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#ffffff",
                  background: "#2f5af0",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  width: "fit-content",
                }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .nav-links-desktop {
            display: none !important;
          }
          .hamburger-btn {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .nav-links-mobile {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
