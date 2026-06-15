# AirBook PH — API Documentation

## Base URL

- **Production**: `https://airbook-ph.onrender.com`
- **Local Development**: `http://localhost:5000`

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens are returned from the `/users/login` and `/users/register` endpoints.

---

## Endpoints

### Authentication

#### Register User
```
POST /users/register
```
**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
**Response (201):**
```json
{
  "_id": "ObjectId",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "isAdmin": false,
  "token": "jwt_token_here"
}
```

#### Login User
```
POST /users/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response (200):** Same as register response.

---

### Flights

#### Get All Flights
```
GET /flights
```
**Response (200):** Array of flight objects.

#### Get Flight by ID
```
GET /flights/:id
```
**Response (200):** Single flight object with `bookedSeats` array.

---

### Bookings (Protected)

#### Create Booking
```
POST /bookings
```
**Headers:** Authorization required  
**Body:**
```json
{
  "userId": "ObjectId",
  "flightId": "ObjectId",
  "passengers": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "gender": "Male",
      "passengerType": "Adult",
      "seatNumber": "1A"
    }
  ],
  "selectedSeats": ["1A"],
  "totalAmount": 2070
}
```
**Response (201):** Booking object with generated `bookingReference`.

#### Get My Bookings
```
GET /bookings/my/bookings
```
**Headers:** Authorization required  
**Response (200):** Array of user's bookings (populated with flight and user data).

#### Get Booking by ID
```
GET /bookings/:id
```
**Response (200):** Booking object with populated flight and user.

#### Get Booking by Reference
```
GET /bookings/reference/:reference
```
**Response (200):** Booking object (used by Booking Checker page).

#### Update Booking
```
PATCH /bookings/:id
```
**Headers:** Authorization required  
**Body:**
```json
{
  "bookingStatus": "CANCELLED"
}
```
**Response (200):** Updated booking. Cancelling restores seats to the flight.

#### Delete Booking
```
DELETE /bookings/:id
```
**Headers:** Authorization required  
**Response (200):** `{ "message": "Booking deleted successfully" }`

---

### Payments (Protected)

#### Create Stripe Checkout Session
```
POST /payments/create-checkout-session
```
**Headers:** Authorization required  
**Body:**
```json
{
  "bookingId": "ObjectId"
}
```
**Response (200):**
```json
{
  "url": "https://checkout.stripe.com/...",
  "sessionId": "cs_test_..."
}
```

#### Verify Payment
```
POST /payments/verify-payment
```
**Headers:** Authorization required  
**Body:**
```json
{
  "sessionId": "cs_test_...",
  "bookingId": "ObjectId"
}
```
**Response (200):** Updates booking to CONFIRMED/PAID/ISSUED.

---

### Admin (Protected + Admin Only)

#### Get All Users
```
GET /admin/users
```

#### Update User
```
PATCH /admin/users/:id
```
**Body:** `{ "firstName", "lastName", "email", "mobileNumber", "isAdmin", "newPassword" }`

#### Delete User
```
DELETE /admin/users/:id
```

#### Get All Flights
```
GET /admin/flights
```

#### Create Flight
```
POST /admin/flights
```
**Body:**
```json
{
  "airlineCode": "PR",
  "flightNumber": "PR101-DO",
  "origin": "MNL",
  "destination": "CEB",
  "departureTime": "2026-06-15T06:00:00",
  "arrivalTime": "2026-06-15T07:15:00",
  "baseFare": 1800,
  "seatCapacity": 120
}
```

#### Update Flight
```
PATCH /admin/flights/:id
```

#### Delete Flight
```
DELETE /admin/flights/:id
```

#### Get All Bookings
```
GET /admin/bookings
```

#### Approve Booking
```
PUT /admin/bookings/:id/approve
```
Sets status to CONFIRMED/PAID/ISSUED.

#### Cancel Booking
```
PUT /admin/bookings/:id/cancel
```
Sets status to CANCELLED/REFUNDED/VOID.

---

## Status Values

| Field | Possible Values |
|---|---|
| bookingStatus | PENDING_PAYMENT, CONFIRMED, CANCELLED |
| paymentStatus | PENDING, PAID, REFUNDED |
| ticketStatus | NOT_ISSUED, ISSUED, VOID |
| flightStatus | SCHEDULED, DELAYED, CANCELLED, COMPLETED |
