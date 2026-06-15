# AirBook PH — Development Guide

## Prerequisites

- Node.js 18+ (recommended: 20+)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Stripe account (test mode)
- Git

---

## Getting Started

### 1. Clone the Repository

```bash
git clone git@github.com:chin0408/airbook-ph.git
cd airbook-ph
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/airbookph?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
CLIENT_URL=http://localhost:3000
```

Seed the database:

```bash
node seeders/flightSeeder.js
```

Start the backend:

```bash
npm run dev    # with nodemon (auto-restart)
npm start      # production
```

Backend runs on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Optionally create `.env.local` in `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

---

## Project Structure

```
airbook-ph/
├── backend/
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── adminController.js    # Admin CRUD operations
│   │   ├── bookingController.js  # Booking CRUD
│   │   ├── flightController.js   # Flight retrieval
│   │   ├── paymentController.js  # Stripe integration
│   │   └── userController.js     # Auth (register/login)
│   ├── middleware/
│   │   ├── adminMiddleware.js    # isAdmin check
│   │   └── authMiddleware.js     # JWT verification
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Flight.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── flightRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── userRoutes.js
│   ├── seeders/flightSeeder.js
│   ├── utils/
│   │   ├── generateBookingReference.js
│   │   └── generateToken.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── admin/page.js
│   │   ├── booking/page.js
│   │   ├── check-booking/page.js
│   │   ├── flights/[id]/page.js
│   │   ├── flights/search/page.js
│   │   ├── forgot-password/page.js
│   │   ├── login/page.js
│   │   ├── my-bookings/page.js
│   │   ├── my-bookings/[id]/page.js
│   │   ├── payment/page.js
│   │   ├── payment/success/page.js
│   │   ├── register/page.js
│   │   ├── seats/[flightId]/page.js
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js (homepage)
│   ├── components/Navbar.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── bookingService.js
│   │   └── flightService.js
│   └── package.json
├── docs/                         # Documentation
└── README.md                     # TSD v1.8
```

---

## Deployment

### Backend (Render)

- **Service Type**: Web Service
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**: PORT, MONGO_URI, JWT_SECRET, STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, CLIENT_URL

### Frontend (Vercel)

- **Framework**: Next.js
- **Root Directory**: `frontend`
- **Environment Variables**: NEXT_PUBLIC_API_URL

---

## Creating an Admin User

1. Register a normal user through the app
2. Connect to MongoDB Atlas (via Compass or shell)
3. Update the user document:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { isAdmin: true } }
)
```

Or use the existing admin account to promote users via the Admin Panel → Users tab.

---

## Stripe Test Cards

| Card Number | Result |
|---|---|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Declined |

Use any future expiry date and any 3-digit CVC.

---

## Key Workflows

### Booking Flow
1. Search flights (homepage or /flights/search)
2. Select flight → redirects to seat selection
3. Select seat(s) → Hold Seats (3 min timer starts)
4. Fill passenger details + contact info
5. Continue to Payment → Stripe Checkout
6. After payment → redirect to success page → receipt

### Admin Flow
1. Login with admin account → redirects to /admin
2. Dashboard shows stats + recent bookings/payments
3. Manage flights (CRUD), users (edit/delete/promote), bookings (approve/cancel)
