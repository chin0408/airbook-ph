"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/services/api";

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [bookings, setBookings] = useState([]);
  const [flights, setFlights] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [bookingStatusFilter, setBookingStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");

  // Flight CRUD state
  const [showFlightForm, setShowFlightForm] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [flightForm, setFlightForm] = useState({
    airlineCode: "", flightNumber: "", origin: "", destination: "",
    departureTime: "", arrivalTime: "", baseFare: "", seatCapacity: "", flightStatus: "SCHEDULED",
  });

  const resetFlightForm = () => {
    setFlightForm({ airlineCode: "", flightNumber: "", origin: "", destination: "", departureTime: "", arrivalTime: "", baseFare: "", seatCapacity: "", flightStatus: "SCHEDULED" });
    setEditingFlight(null);
    setShowFlightForm(false);
  };

  const tabs = ["Dashboard", "Bookings", "Flights", "Users", "Payments", "Audit Logs"];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "undefined") { router.push("/login"); return; }
    const parsed = JSON.parse(storedUser);
    if (!parsed.isAdmin) { router.push("/"); return; }
    setUser(parsed);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const [bookingsRes, flightsRes, usersRes] = await Promise.all([
        API.get("/admin/bookings", { headers }),
        API.get("/flights"),
        API.get("/admin/users", { headers }).catch(() => ({ data: [] })),
      ]);
      setBookings(bookingsRes.data);
      setFlights(flightsRes.data);
      setUsers(usersRes.data);
    } catch (error) { console.log(error); }
    finally { setLoading(false); }
  };

  const handleApprove = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");
      await API.put(`/admin/bookings/${bookingId}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (error) { alert("Failed to approve booking"); }
  };

  const handleCancel = async (bookingId) => {
    if (!confirm("Cancel this booking?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.put(`/admin/bookings/${bookingId}/cancel`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (error) { alert("Failed to cancel booking"); }
  };

  // Flight CRUD handlers
  const handleCreateFlight = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = { ...flightForm, baseFare: Number(flightForm.baseFare), seatCapacity: Number(flightForm.seatCapacity) };
      await API.post("/admin/flights", data, { headers: { Authorization: `Bearer ${token}` } });
      resetFlightForm();
      fetchData();
    } catch (error) { alert("Failed to create flight"); }
  };

  const handleEditFlight = (flight) => {
    setEditingFlight(flight._id);
    setFlightForm({
      airlineCode: flight.airlineCode || "",
      flightNumber: flight.flightNumber || "",
      origin: flight.origin || "",
      destination: flight.destination || "",
      departureTime: flight.departureTime ? flight.departureTime.slice(0, 16) : "",
      arrivalTime: flight.arrivalTime ? flight.arrivalTime.slice(0, 16) : "",
      baseFare: flight.baseFare?.toString() || "",
      seatCapacity: flight.seatCapacity?.toString() || "",
      flightStatus: flight.flightStatus || "SCHEDULED",
    });
    setShowFlightForm(true);
  };

  const handleUpdateFlight = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = { ...flightForm, baseFare: Number(flightForm.baseFare), seatCapacity: Number(flightForm.seatCapacity) };
      await API.patch(`/admin/flights/${editingFlight}`, data, { headers: { Authorization: `Bearer ${token}` } });
      resetFlightForm();
      fetchData();
    } catch (error) { alert("Failed to update flight"); }
  };

  const handleDeleteFlight = async (flightId) => {
    if (!confirm("Are you sure you want to delete this flight?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/admin/flights/${flightId}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (error) { alert("Failed to delete flight"); }
  };

  const handleFlightFormSubmit = () => {
    if (editingFlight) handleUpdateFlight();
    else handleCreateFlight();
  };

  // User CRUD handlers
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    firstName: "", lastName: "", email: "", mobileNumber: "", isAdmin: false, newPassword: "",
  });

  const resetUserForm = () => {
    setUserForm({ firstName: "", lastName: "", email: "", mobileNumber: "", isAdmin: false, newPassword: "" });
    setEditingUser(null);
    setShowUserForm(false);
  };

  const handleEditUser = (u) => {
    setEditingUser(u._id);
    setUserForm({
      firstName: u.firstName || "",
      lastName: u.lastName || "",
      email: u.email || "",
      mobileNumber: u.mobileNumber || "",
      isAdmin: u.isAdmin || false,
      newPassword: "",
    });
    setShowUserForm(true);
  };

  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const data = { ...userForm };
      if (!data.newPassword) delete data.newPassword;
      await API.patch(`/admin/users/${editingUser}`, data, { headers: { Authorization: `Bearer ${token}` } });
      resetUserForm();
      fetchData();
    } catch (error) { alert("Failed to update user"); }
  };

  const handleToggleAdmin = async (userId, currentIsAdmin) => {
    if (!confirm(`Are you sure you want to ${currentIsAdmin ? "remove admin" : "grant admin"} access?`)) return;
    try {
      const token = localStorage.getItem("token");
      await API.patch(`/admin/users/${userId}`, { isAdmin: !currentIsAdmin }, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (error) { alert("Failed to update user"); }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/admin/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    } catch (error) { alert("Failed to delete user"); }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  const totalRevenue = bookings.filter((b) => b.paymentStatus === "PAID").reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const confirmedCount = bookings.filter((b) => b.bookingStatus === "CONFIRMED").length;
  const pendingPayment = bookings.filter((b) => b.bookingStatus === "PENDING_PAYMENT").length;
  const paidCount = bookings.filter((b) => b.paymentStatus === "PAID").length;

  const filteredBookings = bookings.filter((b) => {
    if (bookingStatusFilter && b.bookingStatus !== bookingStatusFilter) return false;
    if (paymentStatusFilter && b.paymentStatus !== paymentStatusFilter) return false;
    return true;
  });

  const getBadgeStyle = (status) => {
    const map = {
      SCHEDULED: { background: "#d1fae5", color: "#065f46" },
      CONFIRMED: { background: "#d1fae5", color: "#065f46" },
      PAID: { background: "#d1fae5", color: "#065f46" },
      PENDING: { background: "#fef3c7", color: "#92400e" },
      PENDING_PAYMENT: { background: "#fef3c7", color: "#92400e" },
      CANCELLED: { background: "#fee2e2", color: "#991b1b" },
      REFUNDED: { background: "#fee2e2", color: "#991b1b" },
      ADMIN: { background: "#d1fae5", color: "#065f46" },
      USER: { background: "#e0e7ff", color: "#3730a3" },
    };
    return map[status] || { background: "#f1f5f9", color: "#4b5165" };
  };

  if (loading) {
    return (
      <main style={{ background: "#f8fafc", minHeight: "calc(100vh - 72px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#6b7280" }}>Loading admin panel...</p>
      </main>
    );
  }

  return (
    <main style={{ background: "#f8fafc", minHeight: "calc(100vh - 72px)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 16px 64px" }}>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.05em", color: "#2f5af0", marginBottom: "4px" }}>ADMIN PANEL</p>
          <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#15192e", marginBottom: "6px" }}>Operations Dashboard</h1>
          <p style={{ fontSize: "14px", color: "#6b7280" }}>Monitor bookings, payments, users, refunds, and audit activity from one place.</p>
          <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "8px" }}>Signed in as ADMIN</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "32px", flexWrap: "wrap" }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "8px 14px",
                fontSize: "13px",
                fontWeight: 600,
                borderRadius: "8px",
                border: activeTab === tab ? "none" : "1px solid #e3e6ef",
                background: activeTab === tab ? "transparent" : "#ffffff",
                color: activeTab === tab ? "#2f5af0" : "#15192e",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ═══ DASHBOARD TAB ═══ */}
        {activeTab === "Dashboard" && (
          <div>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "32px" }}>
              {[
                { label: "Total revenue", value: `PHP ${totalRevenue.toLocaleString()}.00` },
                { label: "Total bookings", value: bookings.length },
                { label: "Confirmed", value: confirmedCount },
                { label: "Pending payment", value: pendingPayment },
                { label: "Paid payments", value: paidCount },
                { label: "Total users", value: users.length },
              ].map((stat, i) => (
                <div key={i} style={{ background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "12px", padding: "20px" }}>
                  <p style={{ fontSize: "12px", color: "#8a90a8", marginBottom: "6px" }}>{stat.label}</p>
                  <p style={{ fontSize: "22px", fontWeight: 800, color: "#15192e" }}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Bookings */}
            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9", overflowX: "auto", marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#15192e" }}>Recent Bookings</h3>
                <button onClick={() => setActiveTab("Bookings")} style={{ fontSize: "13px", color: "#2f5af0", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>Open booking manager</button>
              </div>
              <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse", minWidth: "600px" }}>
                <thead>
                  <tr style={{ textAlign: "left" }}>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>PNR</th>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>FLIGHT</th>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>ROUTE</th>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>STATUS</th>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px", textAlign: "right" }}>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 5).map((b) => (
                    <tr key={b._id} style={{ borderTop: "1px solid #f8fafc" }}>
                      <td style={{ padding: "12px 0", fontWeight: 600, fontFamily: "monospace" }}>{b.bookingReference}</td>
                      <td style={{ padding: "12px 0" }}>{b.flight?.flightNumber}</td>
                      <td style={{ padding: "12px 0" }}>{b.flight?.origin} → {b.flight?.destination}</td>
                      <td style={{ padding: "12px 0" }}>{b.bookingStatus} / {b.paymentStatus}</td>
                      <td style={{ padding: "12px 0", textAlign: "right" }}>PHP {b.totalAmount?.toLocaleString()}.00</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recent Payments */}
            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9", overflowX: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#15192e" }}>Recent Payments</h3>
                <button onClick={() => setActiveTab("Payments")} style={{ fontSize: "13px", color: "#2f5af0", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>Open payments manager</button>
              </div>
              <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse", minWidth: "600px" }}>
                <thead>
                  <tr style={{ textAlign: "left" }}>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>BOOKING</th>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>PROVIDER</th>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>STATUS</th>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>AMOUNT</th>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>CREATED</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 5).map((b) => (
                    <tr key={b._id} style={{ borderTop: "1px solid #f8fafc" }}>
                      <td style={{ padding: "12px 0", fontWeight: 600, fontFamily: "monospace" }}>{b.bookingReference}</td>
                      <td style={{ padding: "12px 0" }}>stripe</td>
                      <td style={{ padding: "12px 0" }}>{b.paymentStatus}</td>
                      <td style={{ padding: "12px 0" }}>PHP {b.totalAmount?.toLocaleString()}.00</td>
                      <td style={{ padding: "12px 0" }}>{formatDate(b.createdAt)}, {formatTime(b.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ BOOKINGS TAB ═══ */}
        {activeTab === "Bookings" && (
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#15192e", marginBottom: "6px" }}>Booking Manager</h2>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>Approve, cancel, and review every booking with reason history.</p>

            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9", overflowX: "auto" }}>
              {/* Filters */}
              <div style={{ marginBottom: "24px" }}>
                <select value={bookingStatusFilter} onChange={(e) => setBookingStatusFilter(e.target.value)} style={{ width: "100%", border: "1px solid #e3e6ef", borderRadius: "10px", padding: "12px 16px", fontSize: "14px", marginBottom: "12px", color: "#4b5165" }}>
                  <option value="">All booking statuses</option>
                  <option value="PENDING_PAYMENT">Pending Payment</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <select value={paymentStatusFilter} onChange={(e) => setPaymentStatusFilter(e.target.value)} style={{ width: "100%", border: "1px solid #e3e6ef", borderRadius: "10px", padding: "12px 16px", fontSize: "14px", color: "#4b5165" }}>
                  <option value="">All payment statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>

              <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse", minWidth: "600px" }}>
                <thead>
                  <tr style={{ textAlign: "left" }}>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>PNR</th>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>PASSENGER</th>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>FLIGHT</th>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>STATUS</th>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>AMOUNT</th>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b._id} style={{ borderTop: "1px solid #f8fafc" }}>
                      <td style={{ padding: "14px 0" }}>
                        <p style={{ fontWeight: 700, fontFamily: "monospace" }}>{b.bookingReference}</p>
                        <p style={{ fontSize: "12px", color: "#9ca3af" }}>{formatDate(b.createdAt)}, {formatTime(b.createdAt)}</p>
                      </td>
                      <td style={{ padding: "14px 0" }}>{b.passengers?.[0]?.firstName} {b.passengers?.[0]?.lastName}</td>
                      <td style={{ padding: "14px 0" }}>{b.flight?.flightNumber} · {b.flight?.origin} → {b.flight?.destination}</td>
                      <td style={{ padding: "14px 0", fontSize: "12px" }}>{b.bookingStatus} / {b.paymentStatus}</td>
                      <td style={{ padding: "14px 0" }}>PHP {b.totalAmount?.toLocaleString()}.00</td>
                      <td style={{ padding: "14px 0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {b.bookingStatus !== "CONFIRMED" && b.bookingStatus !== "CANCELLED" && (
                            <button onClick={() => handleApprove(b._id)} style={{ fontSize: "13px", fontWeight: 600, color: "#15192e", background: "none", border: "none", cursor: "pointer" }}>Confirm</button>
                          )}
                          {b.bookingStatus !== "CANCELLED" && (
                            <button onClick={() => handleCancel(b._id)} style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff", background: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>Cancel</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ FLIGHTS TAB ═══ */}
        {activeTab === "Flights" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <div>
                <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#15192e", marginBottom: "6px" }}>Flight Manager</h2>
                <p style={{ fontSize: "14px", color: "#6b7280" }}>View and manage all flights.</p>
              </div>
              <button
                onClick={() => { resetFlightForm(); setShowFlightForm(true); }}
                style={{ padding: "10px 20px", fontSize: "14px", fontWeight: 700, color: "#ffffff", background: "#2f5af0", border: "none", borderRadius: "10px", cursor: "pointer" }}
              >
                + Add Flight
              </button>
            </div>

            {/* Flight Form */}
            {showFlightForm && (
              <div style={{ background: "#ffffff", borderRadius: "16px", padding: "20px", border: "1px solid #e3e6ef", overflowX: "auto", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#15192e", marginBottom: "16px" }}>
                  {editingFlight ? "Edit Flight" : "Add New Flight"}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#8a90a8", display: "block", marginBottom: "6px" }}>AIRLINE CODE</label>
                    <input placeholder="e.g. PR" value={flightForm.airlineCode} onChange={(e) => setFlightForm({ ...flightForm, airlineCode: e.target.value })} style={{ width: "100%", border: "1px solid #e3e6ef", borderRadius: "10px", padding: "10px 14px", fontSize: "14px" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#8a90a8", display: "block", marginBottom: "6px" }}>FLIGHT NUMBER</label>
                    <input placeholder="e.g. PR101-DO" value={flightForm.flightNumber} onChange={(e) => setFlightForm({ ...flightForm, flightNumber: e.target.value })} style={{ width: "100%", border: "1px solid #e3e6ef", borderRadius: "10px", padding: "10px 14px", fontSize: "14px" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#8a90a8", display: "block", marginBottom: "6px" }}>ORIGIN</label>
                    <input placeholder="e.g. MNL" value={flightForm.origin} onChange={(e) => setFlightForm({ ...flightForm, origin: e.target.value })} style={{ width: "100%", border: "1px solid #e3e6ef", borderRadius: "10px", padding: "10px 14px", fontSize: "14px" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#8a90a8", display: "block", marginBottom: "6px" }}>DESTINATION</label>
                    <input placeholder="e.g. CEB" value={flightForm.destination} onChange={(e) => setFlightForm({ ...flightForm, destination: e.target.value })} style={{ width: "100%", border: "1px solid #e3e6ef", borderRadius: "10px", padding: "10px 14px", fontSize: "14px" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#8a90a8", display: "block", marginBottom: "6px" }}>DEPARTURE TIME</label>
                    <input type="datetime-local" value={flightForm.departureTime} onChange={(e) => setFlightForm({ ...flightForm, departureTime: e.target.value })} style={{ width: "100%", border: "1px solid #e3e6ef", borderRadius: "10px", padding: "10px 14px", fontSize: "14px" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#8a90a8", display: "block", marginBottom: "6px" }}>ARRIVAL TIME</label>
                    <input type="datetime-local" value={flightForm.arrivalTime} onChange={(e) => setFlightForm({ ...flightForm, arrivalTime: e.target.value })} style={{ width: "100%", border: "1px solid #e3e6ef", borderRadius: "10px", padding: "10px 14px", fontSize: "14px" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#8a90a8", display: "block", marginBottom: "6px" }}>BASE FARE (PHP)</label>
                    <input placeholder="e.g. 1800" type="number" value={flightForm.baseFare} onChange={(e) => setFlightForm({ ...flightForm, baseFare: e.target.value })} style={{ width: "100%", border: "1px solid #e3e6ef", borderRadius: "10px", padding: "10px 14px", fontSize: "14px" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#8a90a8", display: "block", marginBottom: "6px" }}>SEAT CAPACITY</label>
                    <input placeholder="e.g. 120" type="number" value={flightForm.seatCapacity} onChange={(e) => setFlightForm({ ...flightForm, seatCapacity: e.target.value })} style={{ width: "100%", border: "1px solid #e3e6ef", borderRadius: "10px", padding: "10px 14px", fontSize: "14px" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#8a90a8", display: "block", marginBottom: "6px" }}>STATUS</label>
                    <select value={flightForm.flightStatus} onChange={(e) => setFlightForm({ ...flightForm, flightStatus: e.target.value })} style={{ width: "100%", border: "1px solid #e3e6ef", borderRadius: "10px", padding: "10px 14px", fontSize: "14px", color: "#4b5165" }}>
                      <option value="SCHEDULED">SCHEDULED</option>
                      <option value="DELAYED">DELAYED</option>
                      <option value="CANCELLED">CANCELLED</option>
                      <option value="COMPLETED">COMPLETED</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={handleFlightFormSubmit} style={{ padding: "10px 24px", fontSize: "14px", fontWeight: 700, color: "#ffffff", background: "#2f5af0", border: "none", borderRadius: "10px", cursor: "pointer" }}>
                    {editingFlight ? "Update Flight" : "Create Flight"}
                  </button>
                  <button onClick={resetFlightForm} style={{ padding: "10px 24px", fontSize: "14px", fontWeight: 600, color: "#6b7280", background: "none", border: "1px solid #e3e6ef", borderRadius: "10px", cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9", overflowX: "auto" }}>
              <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse", minWidth: "600px" }}>
                <thead>
                  <tr style={{ textAlign: "left" }}>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>FLIGHT</th>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>ROUTE</th>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>DEPARTURE</th>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>FARE</th>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>SEATS</th>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>STATUS</th>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {flights.map((f) => (
                    <tr key={f._id} style={{ borderTop: "1px solid #f8fafc" }}>
                      <td style={{ padding: "12px 0", fontWeight: 600 }}>{f.flightNumber}</td>
                      <td style={{ padding: "12px 0" }}>{f.origin} → {f.destination}</td>
                      <td style={{ padding: "12px 0" }}>{formatDate(f.departureTime)}, {formatTime(f.departureTime)}</td>
                      <td style={{ padding: "12px 0" }}>PHP {f.baseFare?.toLocaleString()}</td>
                      <td style={{ padding: "12px 0" }}>{f.seatsAvailable} / {f.seatCapacity}</td>
                      <td style={{ padding: "12px 0" }}>
                        <span style={{ ...getBadgeStyle(f.flightStatus), padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700 }}>{f.flightStatus}</span>
                      </td>
                      <td style={{ padding: "12px 0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <button onClick={() => handleEditFlight(f)} style={{ fontSize: "13px", fontWeight: 600, color: "#2f5af0", background: "none", border: "none", cursor: "pointer" }}>Edit</button>
                          <button onClick={() => handleDeleteFlight(f._id)} style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff", background: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ USERS TAB ═══ */}
        {activeTab === "Users" && (
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#15192e", marginBottom: "6px" }}>User Manager</h2>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>View and manage registered users.</p>

            {/* User Edit Form */}
            {showUserForm && (
              <div style={{ background: "#ffffff", borderRadius: "16px", padding: "20px", border: "1px solid #e3e6ef", overflowX: "auto", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#15192e", marginBottom: "16px" }}>Edit User</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "16px" }}>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#8a90a8", display: "block", marginBottom: "6px" }}>FIRST NAME</label>
                    <input value={userForm.firstName} onChange={(e) => setUserForm({ ...userForm, firstName: e.target.value })} style={{ width: "100%", border: "1px solid #e3e6ef", borderRadius: "10px", padding: "10px 14px", fontSize: "14px" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#8a90a8", display: "block", marginBottom: "6px" }}>LAST NAME</label>
                    <input value={userForm.lastName} onChange={(e) => setUserForm({ ...userForm, lastName: e.target.value })} style={{ width: "100%", border: "1px solid #e3e6ef", borderRadius: "10px", padding: "10px 14px", fontSize: "14px" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#8a90a8", display: "block", marginBottom: "6px" }}>EMAIL</label>
                    <input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} style={{ width: "100%", border: "1px solid #e3e6ef", borderRadius: "10px", padding: "10px 14px", fontSize: "14px" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#8a90a8", display: "block", marginBottom: "6px" }}>MOBILE NUMBER</label>
                    <input value={userForm.mobileNumber} onChange={(e) => setUserForm({ ...userForm, mobileNumber: e.target.value })} style={{ width: "100%", border: "1px solid #e3e6ef", borderRadius: "10px", padding: "10px 14px", fontSize: "14px" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#8a90a8", display: "block", marginBottom: "6px" }}>ROLE</label>
                    <select value={userForm.isAdmin ? "admin" : "user"} onChange={(e) => setUserForm({ ...userForm, isAdmin: e.target.value === "admin" })} style={{ width: "100%", border: "1px solid #e3e6ef", borderRadius: "10px", padding: "10px 14px", fontSize: "14px", color: "#4b5165" }}>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#8a90a8", display: "block", marginBottom: "6px" }}>RESET PASSWORD (optional)</label>
                    <input type="password" placeholder="Leave blank to keep current" value={userForm.newPassword} onChange={(e) => setUserForm({ ...userForm, newPassword: e.target.value })} style={{ width: "100%", border: "1px solid #e3e6ef", borderRadius: "10px", padding: "10px 14px", fontSize: "14px" }} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={handleUpdateUser} style={{ padding: "10px 24px", fontSize: "14px", fontWeight: 700, color: "#ffffff", background: "#2f5af0", border: "none", borderRadius: "10px", cursor: "pointer" }}>
                    Update User
                  </button>
                  <button onClick={resetUserForm} style={{ padding: "10px 24px", fontSize: "14px", fontWeight: 600, color: "#6b7280", background: "none", border: "1px solid #e3e6ef", borderRadius: "10px", cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9", overflowX: "auto" }}>
              <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse", minWidth: "600px" }}>
                <thead>
                  <tr style={{ textAlign: "left" }}>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>NAME</th>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>EMAIL</th>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>ROLE</th>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>JOINED</th>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} style={{ borderTop: "1px solid #f8fafc" }}>
                      <td style={{ padding: "12px 0", fontWeight: 600 }}>{u.firstName} {u.lastName}</td>
                      <td style={{ padding: "12px 0" }}>{u.email}</td>
                      <td style={{ padding: "12px 0" }}>
                        <span style={{ ...getBadgeStyle(u.isAdmin ? "ADMIN" : "USER"), padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700 }}>{u.isAdmin ? "ADMIN" : "USER"}</span>
                      </td>
                      <td style={{ padding: "12px 0" }}>{formatDate(u.createdAt)}</td>
                      <td style={{ padding: "12px 0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <button onClick={() => handleEditUser(u)} style={{ fontSize: "13px", fontWeight: 600, color: "#2f5af0", background: "none", border: "none", cursor: "pointer" }}>Edit</button>
                          <button onClick={() => handleToggleAdmin(u._id, u.isAdmin)} style={{ fontSize: "13px", fontWeight: 600, color: "#4b5165", background: "none", border: "none", cursor: "pointer" }}>
                            {u.isAdmin ? "Demote" : "Promote"}
                          </button>
                          <button onClick={() => handleDeleteUser(u._id)} style={{ fontSize: "13px", fontWeight: 600, color: "#ffffff", background: "#ef4444", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ PAYMENTS TAB ═══ */}
        {activeTab === "Payments" && (
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#15192e", marginBottom: "6px" }}>Payment Manager</h2>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>View all payment records.</p>
            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "20px", border: "1px solid #f1f5f9", overflowX: "auto" }}>
              <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse", minWidth: "600px" }}>
                <thead>
                  <tr style={{ textAlign: "left" }}>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>BOOKING</th>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>PROVIDER</th>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>STATUS</th>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>AMOUNT</th>
                    <th style={{ fontSize: "11px", fontWeight: 700, color: "#8a90a8", letterSpacing: "0.05em", paddingBottom: "12px" }}>CREATED</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} style={{ borderTop: "1px solid #f8fafc" }}>
                      <td style={{ padding: "12px 0", fontWeight: 600, fontFamily: "monospace" }}>{b.bookingReference}</td>
                      <td style={{ padding: "12px 0" }}>stripe</td>
                      <td style={{ padding: "12px 0" }}>
                        <span style={{ ...getBadgeStyle(b.paymentStatus), padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 700 }}>{b.paymentStatus}</span>
                      </td>
                      <td style={{ padding: "12px 0" }}>PHP {b.totalAmount?.toLocaleString()}.00</td>
                      <td style={{ padding: "12px 0" }}>{formatDate(b.createdAt)}, {formatTime(b.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═══ AUDIT LOGS TAB ═══ */}
        {activeTab === "Audit Logs" && (
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#15192e", marginBottom: "6px" }}>Audit Logs</h2>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>System activity log (coming soon).</p>
            <div style={{ background: "#ffffff", borderRadius: "16px", padding: "48px", border: "1px solid #f1f5f9", textAlign: "center" }}>
              <p style={{ color: "#9ca3af" }}>Audit logging will be available in a future update.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
