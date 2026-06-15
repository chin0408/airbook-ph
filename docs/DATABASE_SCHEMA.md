# AirBook PH — Database Schema

## Database

- **Provider**: MongoDB Atlas
- **Cluster**: airbook-ph-cluster
- **Database Name**: airbookph
- **ODM**: Mongoose 9.x

---

## Collections

### Users

```javascript
{
  _id: ObjectId,
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  password: String (required, hashed with bcrypt),
  mobileNumber: String,
  isAdmin: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:** `email` (unique)

---

### Flights

```javascript
{
  _id: ObjectId,
  airlineCode: String (required),      // e.g., "PR", "5J"
  flightNumber: String (required),     // e.g., "PR101-DO", "5J201-DO"
  origin: String (required),           // IATA code: "MNL", "CEB", "LHR"
  destination: String (required),      // IATA code
  departureTime: Date (required),
  arrivalTime: Date (required),
  baseFare: Number (required),         // in PHP
  seatCapacity: Number (default: 120),
  seatsAvailable: Number (default: 120),
  bookedSeats: [String] (default: []), // e.g., ["1A", "4F"]
  flightStatus: String (default: "SCHEDULED"),
  createdAt: Date,
  updatedAt: Date
}
```

**Seat Layout:** 20 rows × 6 columns (A-B-C | aisle | D-E-F) = 120 seats total

---

### Bookings

```javascript
{
  _id: ObjectId,
  bookingReference: String (required, unique),  // 6-char alpha, e.g., "CMJKHB"
  user: ObjectId (ref: "User", required),
  flight: ObjectId (ref: "Flight", required),
  passengers: [{
    firstName: String,
    lastName: String,
    gender: String,           // "Male" or "Female"
    passengerType: String,    // "Adult", "Child", "Infant"
    seatNumber: String,       // e.g., "4F"
    passportNumber: String    // optional
  }],
  selectedSeats: [String],    // e.g., ["4F", "5A"]
  totalAmount: Number (required),  // in PHP (includes tax + fees)
  bookingStatus: String (default: "PENDING_PAYMENT"),
  paymentStatus: String (default: "PENDING"),
  ticketStatus: String (default: "NOT_ISSUED"),
  createdAt: Date,
  updatedAt: Date
}
```

**Relationships:**
- `user` → references Users collection
- `flight` → references Flights collection

---

## Entity Relationships

```
Users (1) ──────── (Many) Bookings
Flights (1) ─────── (Many) Bookings
```

- One User can have many Bookings
- One Flight can have many Bookings
- Booking references both User and Flight via ObjectId

---

## Fare Calculation

```
totalAmount = baseFare × passengerCount × 1.15
             (baseFare + 12% tax + 3% fees)
```

---

## Seeded Data

The `backend/seeders/flightSeeder.js` creates 17 flights:

**Domestic (10):**
- PR101-DO: MNL → CEB (₱1,800)
- PR102-DO: CEB → MNL (₱1,800)
- 5J201-DO: MNL → DVO (₱2,200)
- 5J202-DO: DVO → MNL (₱2,200)
- PR301-DO: MNL → CGY (₱2,100)
- 5J401-DO: MNL → ILO (₱1,600)
- PR501-DO: CEB → DVO (₱1,500)
- 5J601-DO: MNL → BCD (₱1,700)
- PR103-DO: MNL → CEB (₱1,800) [tomorrow]
- 5J203-DO: MNL → DVO (₱2,100) [tomorrow]

**International (7):**
- PR730-INT: MNL → CDG (₱45,000)
- PR118-INT: MNL → TPA (₱52,000)
- PR104-INT: MNL → SFO (₱42,000)
- PR102-INT: MNL → LAX (₱40,000)
- PR720-INT: MNL → LHR (₱48,000)
- 5J880-INT: MNL → LGW (₱44,000)
- PR740-INT: MNL → MAN (₱46,000)

Run seeder: `cd backend && node seeders/flightSeeder.js`
