# ✈️ AIRBOOK PH

### Technical Specifications Document (TSD)

---

# Version 1.7 (Feedback Revision Edition)

---

## 1. Title Page

| Field | Details |
|---|---|
| Project Name | AIRBOOK PH – Airline Booking System |
| Document Type | Technical Specifications Document |
| Version | 1.7 |
| Date | May 2026 |
| Authors | Chinee Marasigan & Shae Padilla |
| Project Type | Web-Based Airline Booking System |

---

## 2. Table of Contents

1. [Introduction](#3-introduction)
2. [Overall Description](#4-overall-description)
3. [Technology Stack](#5-technology-stack)
4. [Visual Mockup Reference](#6-visual-mockup-reference)
5. [Features](#7-features)
6. [Functional Requirements](#8-functional-requirements)
7. [Non-Functional Requirements](#9-non-functional-requirements)
8. [Data Requirements](#10-data-requirements)
9. [External Interface Requirements](#11-external-interface-requirements)
10. [API Endpoints](#12-api-endpoints)
11. [Security and Validation Rules](#13-security-and-validation-rules)
12. [Glossary](#14-glossary)
13. [Appendices](#15-appendices)
14. [Revision History](#16-revision-history)  

---

# 3. Introduction

## 3.1 Purpose

AIRBOOK PH is a web-based airline booking system designed to simulate a simplified airline reservation workflow. The project focuses on providing users with a secure and user-friendly booking experience through modern web technologies.

The system allows users to:

- Create and manage accounts
- Search available domestic flights
- Select seats
- Enter passenger information
- Create and manage bookings
- Retrieve itinerary details using booking references

The project also demonstrates the practical implementation of:

- RESTful API architecture
- Authentication and authorization
- MongoDB document relationships
- Responsive frontend development
- Modular backend development

---

## 3.2 Project Scope

The scope of the Minimum Viable Product (MVP) focuses on the core airline booking workflow.

### Included in MVP

- User registration and login
- Authentication using JWT
- Flight search and listing
- Seat selection
- Passenger information collection
- Booking creation
- Booking retrieval and management
- Admin flight management
- Admin booking management

### Excluded from MVP

The following features are considered future enhancements and are not part of the initial implementation:

- Online payment gateway integration
- Automated ticket generation
- Real-time seat hold expiration system
- Refund processing
- Multi-airline integration
- Email notifications

This scope limitation ensures that development remains achievable within the project timeline while maintaining a scalable architecture for future expansion.

---

## 3.3 Objectives

The project aims to:

- Provide a smooth airline booking workflow
- Prevent booking conflicts through seat tracking
- Demonstrate secure authentication practices
- Apply MongoDB referencing and embedded document concepts
- Create a responsive and modern web application
- Establish a scalable foundation for future airline system enhancements

---

# 4. Overall Description

## 4.1 Product Perspective

AIRBOOK PH is a standalone web application composed of:

- Frontend client application
- Backend REST API server
- MongoDB database

The system follows a client-server architecture where the frontend communicates with the backend API for all booking and authentication operations.

---

## 4.2 Product Functions

The system supports the following major functions:

### User Authentication

- User registration
- User login/logout
- JWT-based authentication
- Password hashing using bcrypt

### Flight Search and Retrieval

- Search flights by route and departure date
- Display available flights
- Display available seats
- View flight schedules and fares

### Booking Management

- Select seats
- Enter passenger information
- Create booking records
- Retrieve booking details
- View booking dashboard
- Cancel bookings

### Administrative Functions

- Create flights
- Update flights
- Remove flights
- Manage bookings
- Manage user accounts

---

## 4.3 User Classes and Characteristics

### Guest User

A visitor without an account.

Capabilities:

- View landing page
- Search available flights
- Access booking checker
- Register an account

Restrictions:

- Cannot create bookings
- Cannot manage itineraries

---

### Registered User

A verified customer with an account.

Capabilities:

- Login securely
- Search flights
- Select seats
- Create bookings
- Manage bookings
- View booking details

---

### Admin User

System administrator responsible for system management.

Capabilities:

- Manage flights
- Manage bookings
- Manage user records
- Monitor seat availability

---

# 5. Technology Stack

## 5.1 Frontend Technologies

| Technology | Purpose |
|---|---|
| Next.js | Frontend framework and routing |
| React | UI component rendering |
| CSS Modules | Scoped component styling |
| Axios | API communication between frontend and backend |

### Frontend Responsibilities

- Render user interface
- Handle client-side validation
- Manage user sessions
- Consume REST API endpoints
- Display booking and flight information

---

## 5.2 Backend Technologies

| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Backend server framework |

### Backend Responsibilities

- Process API requests
- Validate incoming data
- Authenticate users
- Manage business logic
- Handle booking operations
- Interact with MongoDB database

---

## 5.3 Database

| Technology | Purpose |
|---|---|
| MongoDB | NoSQL database |
| Mongoose ODM | Schema modeling and validation |

### Database Responsibilities

- Store users
- Store flights
- Store bookings
- Maintain entity relationships
- Track seat availability

---

## 5.4 Security Technologies

| Technology | Purpose |
|---|---|
| JWT | Authentication token generation |
| Bcrypt | Password hashing |

### Security Responsibilities

- Secure user authentication
- Protect private endpoints
- Encrypt user passwords
- Validate authenticated sessions

---

# 6. Visual Mockup Reference

## Figma Mockup

The frontend user interface design is based on the approved Figma prototype.

Figma Link:

https://www.figma.com/design/F4fPWoBoTkl1y6iyxX5SEI/AirBook-PH---MCP--My-Copy-?node-id=0-1&t=NzQMxCPaBmnVCtVX-1

The mockup includes:

- Landing page
- Login and registration pages
- Flight search interface
- Seat selection interface
- Passenger details form
- Booking dashboard
- Booking checker page
- Payment placeholder page
- Receipt layout

---

# 7. Features

## 7.1 MVP Features

### Secure Authentication

Provides secure account access and protected user sessions using encrypted credentials and JWT authentication.

- User registration with password hashing using bcrypt
- Login using JWT authentication
- Logout functionality
- Password encryption and validation

---

### Flight Search System

Allows users to search and browse available domestic flights based on selected routes and schedules.

- Search flights by route and schedule
- Display available flights
- Display schedules and pricing

---

### Seat Selection

Provides an interactive seat map interface for selecting and tracking available seats.

- Visual seat map interface
- Seat assignment per passenger
- Seat availability tracking

---

### Booking System

Handles passenger information collection and booking creation for selected flights.

- Passenger information collection
- Booking reference generation
- Booking storage and retrieval

---

### Booking Management

Allows users to retrieve and manage existing booking records and itineraries.

- View booking details
- Retrieve itinerary using booking reference
- Cancel bookings

---

### Responsive User Interface

Provides mobile-friendly and responsive layouts for desktop and mobile users.

- Responsive flight listings
- Mobile seat selection support
- Adaptive booking forms

---

## 7.2 Future Enhancements

### Payment Integration

Future integration with Stripe or similar payment gateway.

### Ticket Generation

Automatic ticket generation after successful payment.

### Seat Hold System

Temporary seat reservation timer before checkout completion.

---

# 8. Functional Requirements

## Use Case 1: User Registration

### Description

Allows new users to create accounts.

### Actors

- Guest User

### Preconditions

- User is not yet registered.

### Workflow

1. User enters registration details.
2. System validates required fields.
3. System checks for duplicate email.
4. Password is encrypted using bcrypt.
5. User record is stored in MongoDB.
6. System returns successful registration response.

### Expected Result

User account is successfully created.

---

## Use Case 2: User Login

### Description

Allows registered users to access the system.

### Actors

- Registered User

### Preconditions

- User account exists.

### Workflow

1. User enters email and password.
2. System validates credentials.
3. JWT token is generated.
4. Token is returned to frontend.
5. User gains authenticated access.

### Expected Result

User successfully logs into the system.

---

## Use Case 3: Flight Search

### Description

Allows users to search available flights.

### Actors

- Guest User
- Registered User

### Preconditions

- Flight records exist in the database.

### Workflow

1. User selects origin and destination.
2. User selects departure date.
3. System retrieves matching flights.
4. Available flights are displayed.

### Expected Result

User sees matching available flights.

---

## Use Case 4: Seat Selection

### Description

Allows users to select available seats.

### Actors

- Registered User

### Preconditions

- Flight has available seats.

### Workflow

1. User opens seat map.
2. System displays available seats.
3. User selects seat(s).
4. Selected seat codes are stored.

### Expected Result

Seat assignment is linked to the booking.

---

## Use Case 5: Booking Creation

### Description

Allows users to finalize booking details.

### Actors

- Registered User

### Preconditions

- Flight and seats are selected.

### Workflow

1. User enters passenger details.
2. System validates passenger information.
3. Booking reference is generated.
4. Booking record is stored.
5. Seat availability count is updated.

### Expected Result

Booking is successfully created.

---

## Use Case 6: Booking Retrieval

### Description

Allows users to retrieve booking details.

### Actors

- Guest User
- Registered User

### Preconditions

- Valid booking reference exists.

### Workflow

1. User enters booking reference and last name.
2. System validates booking information.
3. System retrieves booking details.
4. Booking itinerary is displayed.

### Expected Result

Booking information is successfully retrieved.

---

# 9. Non-Functional Requirements

## Performance

- API response time should remain fast under normal usage.
- Flight search results should load efficiently.
- Database queries should be optimized.

---

## Security

- Passwords must be hashed using bcrypt.
- JWT tokens must protect secured routes.
- Sensitive routes require authentication.
- Input validation must be implemented.

---

## Usability

- User interface must be responsive.
- Navigation should remain simple and intuitive.
- Booking workflow should minimize unnecessary steps.

---

## Reliability

- System should properly update seat availability.
- Booking records should remain consistent.
- Invalid requests should return proper error handling.

---

## Maintainability

- Backend should follow modular architecture.
- Components should be reusable.
- Database schemas should support future scalability.

---

# 10. Data Requirements

## 10.1 ERD Structure

### ERD 1 (MVP)

https://app.moqups.com/EN8380imW6sj1R9WzaXPj9HkuKREfei8/view/page/ad4e74bdc?ui=0

### Included Entities

- Users
- Flights
- Bookings

---

### ERD 2 (Future Enhancements)

https://app.moqups.com/EN8380imW6sj1R9WzaXPj9HkuKREfei8/view/page/a2c6c029b

### Included Entities

- Payment
- Ticket

---

## 10.2 Seat Assignment Design Decision

To simplify the MVP architecture, seat data is stored directly within the booking document.

Example:

```json
selectedSeats: ["4F", "5A"]
```

Passenger data is embedded inside the booking collection:

```json
passengers: [
  {
    "firstName": "Juan",
    "lastName": "Dela Cruz",
    "seatNumber": "4F",
    "passportNumber": "optional"
  }
]
```

This approach:

- Reduces database complexity
- Removes the need for separate passenger collections
- Simplifies booking retrieval
- Supports multiple passengers per booking

---

## 10.3 Users Collection

```json
{
  "_id": "ObjectId",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "Hashed String",
  "isAdmin": "boolean",
  "mobileNumber": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

---

## 10.4 Flights Collection

```json
{
  "_id": "ObjectId",
  "airlineCode": "string",
  "flightNumber": "string",
  "origin": "string",
  "destination": "string",
  "departureTime": "date",
  "arrivalTime": "date",
  "baseFare": "number",
  "seatCapacity": "number",
  "seatsAvailable": "number",
  "flightStatus": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

---

## 10.5 Bookings Collection (MVP)

```json
{
  "_id": "ObjectId",
  "bookingReference": "string",
  "userId": "ObjectId",
  "flightId": "ObjectId",
  "selectedSeats": ["string"],
  "passengers": ["object"],
  "totalFare": "number",
  "bookingStatus": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

---

## 10.6 Payment Collection (Future)

```json
{
  "_id": "ObjectId",
  "bookingId": "ObjectId",
  "paymentMethod": "string",
  "amount": "number",
  "paymentStatus": "string",
  "createdAt": "date",
  "updatedAt": "date"
}
```

---

## 10.7 Ticket Collection (Future)

```json
{
  "_id": "ObjectId",
  "paymentId": "ObjectId",
  "ticketNumber": "string",
  "isPaid": "boolean",
  "issuedAt": "date",
  "createdAt": "date",
  "updatedAt": "date"
}
```

---

## 10.8 Key Design Decisions

- MongoDB ObjectID referencing is used for entity relationships.
- Payment and Ticket entities are separated from MVP scope.
- Passenger information is embedded inside bookings.
- Seat numbers are stored as arrays of strings.
- Ticket generation occurs only after successful payment.
- Flight availability is tracked using seatsAvailable.

---

## 10.9 Entity Relationship Summary

| Relationship | Description |
|---|---|
| One User → Many Bookings | A user can create multiple bookings |
| One Flight → Many Bookings | Multiple users may book the same flight |
| Booking → Payment | Payment linked after booking creation |
| Payment → Ticket | Ticket generated after successful payment |

---

# 11. External Interface Requirements

## 11.1 User Interfaces

### Landing Page

Displays flight search functionality and featured flights.

### Login and Registration Pages

Handles secure user authentication.

### Flight Search Page

Displays available flights and schedules.

### Seat Selection Page

Displays visual seat map.

### Booking Dashboard

Displays user bookings and itinerary details.

### Booking Checker

Allows retrieval using booking reference.

---

## 11.2 API Interfaces

The backend exposes RESTful API endpoints for:

- Authentication
- Flight management
- Booking management
- User management

Frontend communicates with backend using Axios.

---

# 12. API Endpoints

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | /users/register | Register new user |
| POST | /users/login | Authenticate user |

---

## Flights

| Method | Endpoint | Description |
|---|---|---|
| GET | /flights | Retrieve flights |
| GET | /flights/:id | Retrieve flight details |

---

## Bookings

| Method | Endpoint | Description |
|---|---|---|
| POST | /bookings | Create booking |
| GET | /bookings/:id | Retrieve booking |
| GET | /bookings/reference/:bookingReference | Retrieve booking using booking reference |
| PATCH | /bookings/:id | Update booking |
| DELETE | /bookings/:id | Cancel booking |

---

## Admin – Flights

| Method | Endpoint |
|---|---|
| GET | /admin/flights |
| POST | /admin/flights |
| PATCH | /admin/flights/:id |
| DELETE | /admin/flights/:id |

---

## Admin – Bookings

| Method | Endpoint |
|---|---|
| GET | /admin/bookings |
| PATCH | /admin/bookings/:id |
| DELETE | /admin/bookings/:id |

---

## Admin – Users

| Method | Endpoint |
|---|---|
| GET | /admin/users |
| PATCH | /admin/users/:id |
| DELETE | /admin/users/:id |

---

# 13. Security and Validation Rules

## Authentication Rules

- JWT tokens required for protected routes
- Invalid tokens denied access
- Passwords stored only as hashed values

---

## Booking Rules

- Seats cannot exceed available seat count
- Passenger count must match selected seats
- Booking reference must remain unique

---

## Validation Rules

- Required fields cannot be empty
- Email must follow valid format
- Password minimum length validation
- Flight dates must be valid

---

# 14. Glossary

| Term | Definition |
|---|---|
| Booking Reference | Unique booking identifier |
| Collection | MongoDB equivalent of a table |
| Document | MongoDB record |
| Field | Individual data attribute |
| JWT | JSON Web Token used for authentication |
| API | Application Programming Interface |
| ODM | Object Data Modeling |

---

# 15. Appendices

## Version History Reference

Additional revisions and documentation updates are tracked under the Revision History section.

---

# 16. Revision History

| Version | Changes |
|---|---|
| v1.5 | Simplified MVP structure and separated future entities |
| v1.6 | Expanded functional details, elaborated workflows, improved documentation structure |
| v1.7 | Added authentication enhancements, improved MVP feature descriptions, simplified appendices, refined API documentation, and applied project feedback revisions |
