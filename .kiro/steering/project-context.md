---
inclusion: auto
---

# AirBook PH — Project Context

## Overview
Full-stack airline booking system built with Next.js 16 (frontend) + Express.js (backend) + MongoDB Atlas + Stripe.

## Live URLs
- **Frontend**: https://airbook-ph.vercel.app
- **Backend API**: https://airbook-ph.onrender.com
- **GitHub**: https://github.com/chin0408/airbook-ph

## Tech Stack
- Frontend: Next.js 16, React 19, Tailwind CSS 4, Axios, Stripe Checkout, Inter font
- Backend: Node.js, Express.js, Mongoose, JWT, bcrypt, Stripe SDK, Morgan, CORS
- Database: MongoDB Atlas (cluster: airbook-ph-cluster)
- Deployment: Vercel (frontend, root dir: `frontend/`) + Render (backend, root dir: `backend/`)

## Key Design Decisions
- Figma design is the source of truth for UI
- Color scheme: Navy (#0c1330, #1c2f6e), Blue (#2f5af0), White navbar
- Font: Inter (Google Fonts)
- Inline styles used throughout (not CSS modules)
- Admin users are redirected to /admin on login (no access to booking flow)
- Fare calculation: base fare + 12% tax + 3% fees
- Seat map: 20 rows × 6 columns (A-B-C aisle D-E-F), 120 seats total
- Stripe test mode for payments (test card: 4242 4242 4242 4242)

## Project Structure
```
airbook-ph/
├── backend/          # Express.js API
│   ├── controllers/  # adminController, bookingController, flightController, paymentController, userController
│   ├── middleware/    # authMiddleware, adminMiddleware
│   ├── models/       # Booking, Flight, User
│   ├── routes/       # admin, booking, flight, payment, user routes
│   ├── seeders/      # flightSeeder.js (17 flights: 10 domestic + 7 international)
│   └── server.js
├── frontend/         # Next.js app
│   ├── app/          # Pages (booking, check-booking, flights, login, register, seats, payment, my-bookings, admin, forgot-password)
│   ├── components/   # Navbar.jsx (hamburger menu on mobile)
│   └── services/     # api.js, flightService.js, bookingService.js
├── docs/             # Documentation (API docs, DB schema, dev guide, testing checklist)
└── README.md         # TSD v1.8
```

## Environment Variables
- Render (backend): PORT, MONGO_URI, JWT_SECRET, STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, CLIENT_URL
- Vercel (frontend): NEXT_PUBLIC_API_URL

## TSD Version: 1.8
All MVP features implemented plus: Stripe payments, seat hold timer, admin CRUD, international flights, fare breakdown, travel receipt, forgot password page.

## Stripe Account
- Country: USA (sandbox)
- Publishable Key: pk_test_51ThdabCjY5MLZvgc...
- Secret Key: sk_test_51ThdabCjY5MLZvgc...
