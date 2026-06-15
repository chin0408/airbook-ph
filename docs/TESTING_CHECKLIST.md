# AirBook PH — Testing Checklist

## User Authentication

- [ ] Register new user with valid data
- [ ] Register rejects duplicate email
- [ ] Register rejects short password (< 6 chars)
- [ ] Login with valid credentials
- [ ] Login rejects invalid credentials
- [ ] Logout clears token and user data
- [ ] Protected routes redirect to login when not authenticated
- [ ] Admin login redirects to /admin (not homepage)

---

## Flight Search

- [ ] Homepage loads and displays featured flights
- [ ] Search form accepts origin, destination, date, passengers
- [ ] Search results display matching flights
- [ ] Price filter slider works correctly
- [ ] "Change Search" button returns to homepage
- [ ] Clicking "Select →" navigates to seat selection
- [ ] No results message displays when no flights match

---

## Seat Selection

- [ ] Seat map displays 20 rows × 6 columns
- [ ] Available seats show in green
- [ ] Clicking a seat selects it (turns blue)
- [ ] Clicking a selected seat deselects it
- [ ] Cannot select more seats than passenger count
- [ ] Booked seats are grayed out and not clickable
- [ ] Selected Seats sidebar updates in real-time
- [ ] Estimated total calculates correctly (fare × passengers × 1.15)
- [ ] "Hold Seats" button disabled until correct number selected
- [ ] Passenger dropdown changes allowed seat count

---

## Booking / Passenger Details

- [ ] Timer counts down from 3:00
- [ ] Timer expiry alerts and redirects to seat selection
- [ ] Form validates required fields (first name, last name, gender)
- [ ] Contact email pre-fills from logged-in user
- [ ] Booking Summary sidebar shows correct flight info and fare
- [ ] "Continue to Payment" creates booking and redirects
- [ ] Booking reference is generated (6 alpha chars)
- [ ] Seats are marked as booked in the flight after booking

---

## Payment

- [ ] Payment page shows booking reference and total
- [ ] Timer continues countdown
- [ ] "Pay via Stripe" button creates checkout session
- [ ] Stripe Checkout page loads with correct amount (PHP)
- [ ] Test card 4242... completes payment successfully
- [ ] Success page shows "Payment Successful"
- [ ] Booking status updates to CONFIRMED/PAID/ISSUED
- [ ] Declined card shows appropriate error

---

## My Bookings

- [ ] Shows all user's bookings
- [ ] Booking cards display PNR, route, flight, date, seats, passengers, amount
- [ ] "Pay Now" button visible for PENDING_PAYMENT bookings
- [ ] "Cancel" button cancels booking and restores seats
- [ ] Cancelled bookings show CANCELLED status
- [ ] Clicking booking navigates to receipt page

---

## Travel Receipt

- [ ] Displays booking reference, email, booking date
- [ ] Shows payment and ticket status badges
- [ ] Flight details section shows route, departure, arrival
- [ ] Passengers and seats section lists all passengers
- [ ] Fare breakdown shows base fare, taxes, fees, total
- [ ] "Print Receipt" button triggers print dialog
- [ ] "Back to My Bookings" link works

---

## Booking Checker

- [ ] Accessible without login (guest users)
- [ ] PNR input accepts 6 uppercase characters
- [ ] Last name validation matches passenger
- [ ] Wrong last name shows error message
- [ ] Invalid PNR shows "Booking not found" error
- [ ] Results display flight details, passengers, payment info
- [ ] Status badges display correctly

---

## Admin Panel

### Dashboard
- [ ] Shows total revenue, bookings, confirmed, pending, paid, users
- [ ] Recent bookings table displays correctly
- [ ] Recent payments table displays correctly
- [ ] "Open booking manager" links to Bookings tab

### Bookings Manager
- [ ] Filter by booking status works
- [ ] Filter by payment status works
- [ ] "Confirm" button approves booking (CONFIRMED/PAID/ISSUED)
- [ ] "Cancel" button cancels booking (CANCELLED/REFUNDED/VOID)
- [ ] Table shows PNR, passenger, flight, status, amount

### Flight Manager
- [ ] "Add Flight" button shows form
- [ ] All fields have labels
- [ ] Create flight saves to database
- [ ] "Edit" pre-fills form with flight data
- [ ] Update flight saves changes
- [ ] "Delete" removes flight with confirmation
- [ ] Flight table shows all flight data

### User Manager
- [ ] Table shows name, email, role, joined date
- [ ] "Edit" shows form with user data
- [ ] Can update first name, last name, email, mobile
- [ ] Can change role (Admin/User)
- [ ] Password reset field works (optional, min 6 chars)
- [ ] "Promote"/"Demote" toggles admin status
- [ ] "Delete" removes user with confirmation

### Payments
- [ ] Shows all bookings with payment status
- [ ] PAID/PENDING/REFUNDED badges display correctly

---

## Responsive Design

- [ ] Homepage looks good on mobile (360px+)
- [ ] Hamburger menu appears on mobile
- [ ] Hamburger menu opens/closes correctly
- [ ] Search form card is fluid width on mobile
- [ ] Flight search results scroll horizontally if needed
- [ ] Seat selection sidebar stacks below map on mobile
- [ ] Booking form stacks single column on mobile
- [ ] Payment page stacks on mobile
- [ ] Receipt page grids collapse on mobile
- [ ] Admin tables scroll horizontally on mobile
- [ ] Admin tabs wrap on mobile

---

## Edge Cases

- [ ] Booking with already-booked seat shows error
- [ ] Booking with insufficient seats shows error
- [ ] API errors display user-friendly messages
- [ ] Network errors don't crash the app
- [ ] Empty states show helpful messages
- [ ] Invalid URLs show 404 page
