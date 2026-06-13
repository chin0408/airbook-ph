"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

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
  }, [pathname]);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  return (
    <nav
      className="w-full flex items-center justify-between sticky top-0 z-50"
      style={{
        background: "#ffffff",
        padding: "18px 24px",
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <div
          className="flex items-center justify-center"
          style={{
            width: "36px",
            height: "36px",
            background: "#2f5af0",
            borderRadius: "8px",
          }}
        >
          <span className="text-white text-lg">✈</span>
        </div>
        <span style={{ fontSize: "20px", fontWeight: 700, color: "#15192e" }}>
          AirBook PH
        </span>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center flex-wrap" style={{ gap: "20px" }}>
        <Link
          href="/check-booking"
          style={{
            fontSize: "15px",
            fontWeight: pathname === "/check-booking" ? 600 : 500,
            color: pathname === "/check-booking" ? "#2f5af0" : "#4b5165",
            textDecoration: "none",
            padding: pathname === "/check-booking" ? "6px 14px" : "0",
            border: pathname === "/check-booking" ? "1px solid #2f5af0" : "none",
            borderRadius: "8px",
            display: user?.isAdmin ? "none" : "inline",
          }}
        >
          Check Booking
        </Link>

        {user ? (
          <>
            <Link
              href="/my-bookings"
              style={{
                fontSize: "15px",
                fontWeight: pathname === "/my-bookings" ? 600 : 500,
                color: pathname === "/my-bookings" ? "#2f5af0" : "#4b5165",
                textDecoration: "none",
                padding: pathname === "/my-bookings" ? "6px 14px" : "0",
                border: pathname === "/my-bookings" ? "1px solid #2f5af0" : "none",
                borderRadius: "8px",
                display: user?.isAdmin ? "none" : "inline",
              }}
            >
              My Bookings
            </Link>

            {user.isAdmin && (
              <Link
                href="/admin"
                style={{ fontSize: "15px", fontWeight: 500, color: "#4b5165", textDecoration: "none" }}
              >
                Admin
              </Link>
            )}

            {/* User avatar */}
            <div className="flex items-center gap-2">
              <div
                className="flex items-center justify-center text-sm font-bold text-white"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "#2f5af0",
                }}
              >
                {user.firstName?.charAt(0)}
              </div>
              <span style={{ fontSize: "15px", fontWeight: 500, color: "#15192e" }}>
                {user.firstName}
              </span>
            </div>

            <button
              onClick={handleSignOut}
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#15192e",
                background: "transparent",
                border: "1px solid #e3e6ef",
                padding: "10px 22px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              style={{ fontSize: "15px", fontWeight: 500, color: "#4b5165", textDecoration: "none" }}
            >
              Login
            </Link>
            <Link
              href="/register"
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#ffffff",
                background: "#2f5af0",
                padding: "10px 22px",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
