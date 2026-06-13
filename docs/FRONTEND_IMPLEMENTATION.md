# Frontend Implementation Documentation

## Version 1.0 — Figma-Aligned Rebuild

---

## Overview

The frontend has been completely rebuilt to match the approved Figma prototype. All pages now follow the exact design language, color scheme, typography, and layout from the mockups.

---

## Design System

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| Primary Blue | `#2563eb` | Buttons, links, accents |
| Primary Dark | `#1d4ed8` | Button hover states |
| Navy | `#0f172a` | Backgrounds, headers, navbar |
| Navy Light | `#1e293b` | Secondary dark backgrounds |
| Success Green | `#22c55e` | Confirmed badges, selected seats |
| Danger Red | `#ef4444` | Cancel buttons, error states |
| Warning Amber | `#f59e0b` | Pending badges |
| Seat Available | `#d1fae5` | Available seat cells |
| Seat Selected | `#22c55e` | User-selected seats |
| Seat Held | `#fbbf24` | Temporarily held seats |
| Seat Booked | `#9ca3af` | Already-booked seats |

### Typography

- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, sizes vary by hierarchy
- **Body**: Regular weight, `#1e293b` color
- **Labels**: Uppercase, extra-small, semibold, letter-spacing

### Component Patterns

- **Cards**: White bg, `rounded-xl`, subtle shadow (`shadow-sm`)
- **Buttons**: Rounded-lg, medium font weight, smooth transitions
- **Inputs**: Gray-50 background, gray-200 border, focus ring with primary color
- **Badges**: Inline-block, rounded, colored backgrounds per status

---

## Page Structure

### 1. Landing Page (`/`)

- **Hero Section**: Navy background with "Book flights. Travel smarter." headline
- **Search Form**: White card with FROM/TO dropdowns, date picker, passenger count
- **Stats Bar**: Flights live today, 3 min seat hold, Secure checkout
- **Featured Flights**: Horizontal scrollable cards showing today's available routes
- **Why AirBook PH**: 3-column feature grid (Instant Search, Secure Holds, Booking Checker)
- **CTA Section**: Dark card with "Start booking in a few clicks" + action buttons

### 2. Login Page (`/login`)

- Navy background, centered card
- AirBook PH logo above form
- Email + Password fields with uppercase labels
- "Sign In →" primary button
- Link to registration

### 3. Registration Page (`/register`)

- Navy background, centered card
- First/Last name (2-col), Email, Mobile, Password, Confirm Password
- "Create Account →" primary button
- Link to login

### 4. Flight Search Results (`/flights/search`)

- Navy background
- Route header (e.g., "MNL → CEB") with date and passenger count
- Left sidebar: Price filter slider, flight count
- Flight result cards: Airline badge, timeline visualization, price, "Select →" button

### 5. Seat Selection (`/seats/[flightId]`)

- "← Back to Results" link
- Navy flight info banner (route, date/time, flight number, price/seat)
- 20-row × 6-column seat map (A-B-C | aisle | D-E-F)
- Passenger count dropdown (1-5)
- Color-coded seats: Available (mint), Selected (green), Held (yellow), Booked (gray)
- Sidebar: Selected Seats list, count progress, estimated total, "Hold Seats (3 min)" button
- Legend at bottom

### 6. Passenger Details / Booking Form (`/booking`)

- 3-minute countdown timer
- Per-passenger form: First Name, Last Name, Type, Gender, Passport/ID
- Contact Information: Email, Phone
- Right sidebar: Booking Summary (flight, route, departure, seats, fare breakdown)
- "Continue to Payment →" button

### 7. Payment Page (`/payment`)

- Timer continues from seat hold
- Secure Payment card with lock icon
- Booking reference display
- "Pay PHP X via Stripe →" button
- Right sidebar: Order Summary with fare breakdown
- "Powered by Stripe · 256-bit SSL encryption" footer

### 8. My Bookings (`/my-bookings`)

- Header with "+ New Booking" button
- Booking cards: PNR, route, flight details, status badge, fare
- Action buttons: "Pay Now →", "View", "Cancel"

### 9. Booking Receipt (`/my-bookings/[id]`)

- "Print Receipt" button
- Receipt card with: AirBook PH header, PNR/email/booking date
- Flight details section
- Passengers and seats section
- Fare breakdown (base fare, taxes, fees, total)
- Payment and ticket status badges

### 10. Booking Checker (`/check-booking`)

- Centered form: PNR input (large monospace), Last Name input
- "Find Booking →" button
- Result card: Flight details, passengers, payment info with status badges

### 11. Admin Panel (`/admin`)

- Tabs: Dashboard, Bookings, Flights, Users, Payments, Audit Logs
- **Dashboard**: Stats cards (revenue, bookings, confirmed, pending, paid, users) + recent tables
- **Bookings**: Filter dropdowns + table with Confirm/Cancel actions
- **Flights**: Full flight table with status
- **Users**: User table with role badges
- **Payments**: Payment records table
- **Audit Logs**: Placeholder for future implementation

---

## Shared Components

### Navbar (`components/Navbar.jsx`)

- Sticky top navigation
- Navy background, white text
- Logo (blue circle with plane icon + "AirBook PH")
- Navigation links: Check Booking, My Bookings (auth), Admin (admin only)
- User avatar with first initial + name (when logged in)
- Sign Out button (when logged in)
- Login + Sign Up buttons (when logged out)
- Active link highlighting based on current path

---

## Services Layer

### `services/api.js`
- Axios instance with base URL configuration
- Automatic auth token injection via request interceptor

### `services/flightService.js`
- `getFlights()` — Get all flights
- `getFlightById(id)` — Get single flight
- `searchFlights(params)` — Search with query params

### `services/bookingService.js`
- `createBooking(data)` — Create new booking
- `getMyBookings()` — Get current user's bookings
- `getBookingById(id)` — Get single booking
- `getBookingByReference(ref)` — Lookup by PNR

---

## Backend Enhancements

### New Endpoints Added

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/users` | Admin: get all users |
| GET | `/admin/flights` | Admin: get all flights |
| PATCH | `/bookings/:id` | User: update/cancel own booking |

### Updated Responses

- Login and Register now return `isAdmin` field
- Booking cancellation restores seats to flight availability

---

## Technical Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.2.6 | Frontend framework |
| React | 19.2.4 | UI rendering |
| Tailwind CSS | 4.x | Styling |
| Axios | 1.16.0 | API communication |
| Inter Font | Latest | Typography (Google Fonts) |

---

## Environment Configuration

Frontend expects:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Falls back to `http://localhost:5000` if not set.

---

## Revision Notes

- Complete frontend rebuild to match Figma prototype
- Added fare calculation (base fare + 12% tax + 3% fees)
- Added 3-minute seat hold countdown timer
- Added admin panel with tabbed interface
- Added booking checker with PNR + last name verification
- Added travel receipt page with print support
- Improved seat map (20 rows, 6 columns, aisle gap, color legend)
- Added passenger count support (1-5 passengers)
- Backend enhanced with admin user management and booking update endpoints
