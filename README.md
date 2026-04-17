# AIRBOOK PH

Full-stack airline booking system for MCP Side Project 1.

This repository contains the Technical Specification Document (TSD), project references, and development files for the AIRBOOK PH Airline Booking System.

---

# Technical Specifications Document

## 1. Title Page

- **Project Name**: **AIRBOOK PH** Airline Booking System
- **Version**: 1.3 (Revised)
- **Date**: April 17, 2026
- **Author(s)**: Chinee Marasigan, Shae Padilla

## 2. Table of Contents

1. [Introduction](#3-introduction)
2. [Overall Description](#4-overall-description)
3. [Visual Mockup Reference](#5-visual-mockup-reference)
4. [Features](#6-features)
5. [Functional Requirements](#7-functional-requirements)
6. [Non-Functional Requirements](#8-non-functional-requirements)
7. [Data Requirements](#9-data-requirements)
8. [External Interface Requirements](#10-external-interface-requirements)
9. [Glossary](#11-glossary)
10. [Appendices](#12-appendices)

## 3. Introduction

- **Purpose**: Define the technical, functional, and operational scope of AIRBOOK PH as a full-stack airline booking platform for guests, registered travelers, and one Super Admin.

- **Scope**: Covers frontend and backend modules for user authentication, flight discovery, seat selection, seat hold, booking, payments, ticket retrieval, booking checker, and Super Admin management. Excludes live airline integrations, real-time flight tracking, and production airline settlement systems.

- **References**:
  - Figma airline booking mockup
  - Project repository structure
  - Backend route and service implementation
  - Approved TSD section pattern

- **Definitions, Acronyms, and Abbreviations**:
  - **JWT**: JSON Web Token used for stateless authentication.
  - **Bcrypt**: Password hashing library for secure credential storage.
  - **PNR**: Passenger Name Record or booking reference used to retrieve reservations.
  - **CRUD**: Create, Read, Update, Delete operations for managed entities.
  - **Seat Hold**: Temporary reservation lock placed on seats before booking confirmation.
  - **Seat Assignment**: Array of selected seat identifiers stored in the booking record.
  - **Audit Log**: Administrative activity record used for accountability and traceability.

## 4. Overall Description

- **Product Perspective**: AIRBOOK PH is a full-stack web application composed of a customer-facing frontend and a backend API connected to MongoDB and Redis. It supports a guided booking funnel for travelers and a protected admin console for one Super Admin.

- **Product Functions**:
  - Register and authenticate users
  - Search available flights
  - Select seats and place temporary seat holds
  - Complete bookings and simulated payment flow
  - Retrieve bookings and ticket details
  - Manage flights, bookings, users, payments, and audit logs through the Super Admin console

- **User Classes and Characteristics**:
  - **Guest User**: Can browse public content, search flights, and view booking-related pages that do not require authentication.
  - **Registered Traveler**: Can access booking, payment, ticket retrieval, booking checker, and personal booking history features.
  - **Super Admin**: Has full administrative access to manage flights, bookings, users, payments or refunds, and audit logs.

- **Operating Environment**:
  - **Frontend**: Modern browsers for desktop and mobile devices
  - **Backend**: Node.js and Express.js runtime environment
  - **Database**: MongoDB with Mongoose ODM
  - **Caching / Timed Holds**: Redis for expiry-based seat hold support

- **Assumptions and Dependencies**:
  - Stable internet connection is available
  - MongoDB and Redis services are operational
  - Environment variables are configured correctly
  - Payment flow is implemented for project purposes and may be simulated depending on project scope

## 5. Visual Mockup Reference

- **Figma Reference**: Airline Booking System Mock-up

- **Design Description**: The interface follows a clean, modern, and calming design direction. Spacious layouts, cool tones, and intuitive navigation are used to create a smoother booking experience. The design emphasizes booking clarity, readable fare information, and confidence during multi-step reservation flows.

- **Design Specs**:
  - **Primary Palette**: Travel-oriented blues with restrained accent colors for success, warning, and destructive states
  - **Typography**: Readable UI hierarchy for fares, booking references, schedules, and form-heavy checkout flows
  - **Layout**: Mobile-first structure with responsive spacing and booking-focused content blocks
  - **Admin Interface Style**: Dense but readable operational tables, filters, and confirmation modals rather than marketing-style layouts

## 6. Features

- **Secure User Authentication**: Guest registration, login, token-based sessions, and protected access to private booking and account flows.

- **Dynamic Flight Search**: Search and filter available flights by route, date, and travel options with responsive result cards.

- **Seat Map and Seat Hold Flow**: Allows travelers to select seats and temporarily lock them before booking confirmation to reduce double-booking risk.

- **Validated Booking and Payment Flow**: Captures passenger details, confirms booking data, and processes payment with booking state synchronization.

- **Manage Booking and Checker**: Allows authenticated users or checker users to retrieve booking details and status.

- **Ticket and Booking Success Views**: Displays completed reservation outcomes and ticket-related retrieval after confirmed purchase.

- **Super Admin Operations Dashboard**: Provides operational monitoring across bookings, flights, users, payments, refunds, and audit logs.

- **Super Admin CRUD Management**: Supports controlled create, read, update, and delete operations for flights, bookings, users, and payment-related administration with audit capture.

## 7. Functional Requirements

### 7.1 System Features

| System Feature | Capability Summary |
|---|---|
| Authentication and Access | Registers users, authenticates sessions, protects private routes, and restricts admin functions to the Super Admin. |
| Flight Discovery | Retrieves flight results, pricing, and schedules for search-driven booking decisions. |
| Seat Inventory Control | Creates temporary seat holds, tracks hold expiry, and prevents duplicate seat assignment during checkout. |
| Booking Lifecycle | Moves reservations through pending payment, confirmed, and cancelled states with validation rules. |
| Payment Management | Stores payment records, supports status tracking, and exposes refund operations for the Super Admin when needed. |
| Super Admin CRUD Operations | Enables the Super Admin to create, read, update, or delete operational data with audit logging and authorization checks. |

### 7.2 Detailed Use Cases

| ID | Title | Primary Actor | Description |
|-------|-------------------------------------------|-------------------------------------|--------------------------------------------------------------------------------|
| UC-01 | User Registration and Login               | Guest User                          | Create account, authenticate, and receive protected access to booking features.                               |
| UC-02 | Search and Select Flight                  | Guest User or Registered Traveler   | Search flights, inspect results, and choose a flight for booking.                                             |
| UC-03 | Select Seats and Hold Before Checkout     | Registered Traveler                 | Select seats, temporarily reserve inventory, and continue to checkout.                                        |
| UC-04 | Complete Booking and Payment              | Registered Traveler                 | Submit passenger details, confirm payment, and generate booking and ticket records.                           |
| UC-05 | Retrieve Booking via Dashboard or Checker | Registered Traveler or Checker User | View reservation details through account access or reference lookup.                                          |
| UC-06 | Super Admin Flight Management             | Super Admin                         | Create flights, read flight lists, update schedules, fares, and status, and deactivate flights when needed.   |
| UC-07 | Super Admin Booking Operations            | Super Admin                         | Read bookings, update booking or payment states, and cancel bookings while releasing resources when required. |
| UC-08 | Super Admin User Management               | Super Admin                         | Read user records, update roles or status, and deactivate user access under authorization rules.              |
| UC-09 | Super Admin Refund and Audit Review       | Super Admin                         | Trigger refunds for eligible payments and inspect audit logs for operational accountability.                  |

### 7.3 Super Admin CRUD Management Rules

| Domain | Operation | Behavior |
|----------|---------------------|---------------------------------------------------------------------------------------------------------------------|
| Flights  | Create              | Add new flight schedule, fare, capacity, and route metadata.                                                        |
| Flights  | Read                | View paginated flight lists and filter by status.                                                                   |
| Flights  | Update              | Modify route, times, fares, seat counts, and operational status.                                                    |
| Flights  | Deactivate / Delete | Deactivate or delete flights only when no active bookings are attached; status retirement is preferred when needed. |
| Bookings | Read                | View booking lists with booking and payment status filters.                                                         |
| Bookings | Update              | Adjust booking status, payment status, and ticket status with business-rule validation.                             |
| Bookings | Cancel              | Cancel bookings and release held seats or resources instead of hard-deleting transactional history.                 |
| Users    | Read                | View user list with status visibility.                                                                              |
| Users    | Update              | Change user status and selected account fields according to authorization rules.                                    |
| Users    | Deactivate          | Deactivate user access according to policy and authorization.                                                       |
| Payments | Read                | Review payment records and status history.                                                                          |
| Payments | Refund              | Issue Super Admin-triggered refunds with reason capture and audit log entries.                                      |

## 8. Non-Functional Requirements

| Category       | Requirement                                                                                                                              |
|----------------|------------------------------------------------------------------------------------------------------------------------------------------|
| Performance    | Support high-volume search and booking traffic, with target readiness for around 1,000 concurrent users under optimized infrastructure.  |
| Security       | Use Bcrypt for password hashing, JWT for authentication, protected environment variables, and auditable admin actions.                   |
| Usability      | Provide mobile-responsive booking flows, clear feedback states, readable schedules and fares, and intuitive booking and admin workflows. |
| Reliability    | Preserve booking, seat inventory, and payment state consistency even during cancellation, refund, or expiry events.                      |
| Supportability | Maintain modular frontend and backend codebases with separated services, controllers, routes, stores, and test coverage areas.           |

## 9. Data Requirements

### 9.1 Data Models

- **User**: identity, contact information, hashed password, role, status, and account context
- **Flight**: airline ID, flight number, route, departure and arrival times, base fare, seat capacity, available seats, and operational status
- **Booking**: booking reference, user ID, flight ID, `seatAssignment: [String]`, `passengerDetails: [Object]`, fare breakdown, booking status, payment status, and ticket status
- **Payment**: booking linkage, provider, amount, payment status, and refund-related metadata
- **SeatHold**: temporary seat reservation state, expiry time, user linkage, selected seat identifiers, and associated booking linkage
- **SeatInventory**: per-seat availability state, heldBy user, hold expiry, and booking linkage
- **Ticket**: issued ticket records associated with confirmed bookings
- **AdminAuditLog**: Super Admin action trail containing actor, entity, action, reason, and metadata
- **Airline**: carrier information linked to flights through `airlineID`

### 9.2 Database Requirements

- Password security through hashed password storage
- ObjectID-based references between users, flights, bookings, payments, seat holds, tickets, and airlines
- Data aggregation and relation stitching through Mongoose population and aggregation pipelines where needed
- Environment-based configuration for database, Redis, JWT, and payment provider settings
- Transactional safety patterns for booking cancellation, refund operations, and seat release updates
- Audit-trail persistence for privileged Super Admin changes

### 9.3 ERD Summary

- A user can own many bookings.
- Each booking references exactly one flight.
- A booking may include multiple passengers and multiple selected seats.
- Payments and tickets are associated to bookings.
- SeatHold and SeatInventory support reservation locking.
- Airline is linked to flights through `airlineID`.
- AdminAuditLog records privileged changes executed by the Super Admin.

## 10. External Interface Requirements

### 10.1 User Interfaces

- Public homepage with search-first hero section and promotional travel content
- Authentication pages for registration and login
- Search results and flight detail selection views
- Booking flow screens for seat selection, passenger input, payment, and success state
- Checker and booking history views for retrieval of reservations
- Super Admin dashboard and manager pages for flights, bookings, users, payments, and audit logs

### 10.2 API Interfaces

| API Group     | Responsibility                                                                                |
|---------------|-----------------------------------------------------------------------------------------------|
| Auth API      | Register, login, and protected session flows                                                  |
| Flights API   | Flight search and availability retrieval                                                      |
| Seat Hold API | Seat locking and expiry-sensitive reservation control                                         |
| Bookings API  | Booking creation, retrieval, update, and cancellation flows                                   |
| Payments API  | Payment initiation, status persistence, and refund support                                    |
| Tickets API   | Ticket retrieval after booking confirmation                                                   |
| Checker API   | Reservation lookup by reference                                                               |
| Admin API     | Dashboard metrics plus CRUD management for flights, bookings, users, payments, and audit logs |

### 10.3 Super Admin Endpoint Pattern

| Endpoint                        | Purpose                                            |
|---------------------------------|----------------------------------------------------|
| GET /admin/flights              | Read paginated flight data                         |
| POST /admin/flights             | Create flight record                               |
| PATCH /admin/flights/:id        | Update flight data                                 |
| DELETE /admin/flights/:id       | Delete or deactivate eligible flight record        |
| GET /admin/bookings             | Read booking operations list                       |
| PATCH /admin/bookings/:id       | Update booking lifecycle state                     |
| DELETE /admin/bookings/:id      | Cancel booking and release resources               |
| GET /admin/users                | Read user management list                          |
| PATCH /admin/users/:id          | Update user status or selected account fields      |
| DELETE /admin/users/:id         | Deactivate user record per policy                  |
| GET /admin/payments             | Read payment records                               |
| POST /admin/payments/:id/refund | Execute refund operation                           |
| GET /admin/audit-logs           | Read audit trail entries                           |

## 11. Glossary

| Term                   | Definition |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Airline Booking System | A full-stack web application that allows users to search, reserve, pay for, and manage flights while enabling the Super Admin to manage flight data and system actions. |
| Super Admin Dashboard  | Administrative control interface for metrics, approvals, updates, refunds, and data management.                                                                         |
| CRUD Management        | Controlled create, read, update, and delete workflows used by the Super Admin to maintain operational entities.                                                         |
| Audit Log              | Traceable record of privileged actions performed by the Super Admin.                                                                                                    |
| Booking Checker        | Feature that retrieves reservation details using a booking reference or related lookup data.                                                                            |

## 12. Appendices

### 12.1 Supporting Information

- Frontend and backend repository structure were reviewed to align this TSD with actual implementation areas.
- This document should be paired with the latest ERD diagram, API contract appendix, and booking lifecycle diagram in later revisions if needed.

### 12.2 Revision History

| Version | Date       | Summary                                                                                                                                                             |
|---------|------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1.0     | 2026-04-13 | Refactored TSD structure and explicitly added admin CRUD management pattern across features, functional requirements, and interface sections.                       |
| 1.2     | 2026-04-15 | Feedback-based cleanup for section ordering and wording.                                                                                                            |
| 1.3     | 2026-04-17 | Revised to use one Super Admin, aligned booking data with seatAssignment array, clarified seat map support, and synchronized wording with the latest reviewed plan. |

_End of Technical Specification Document_
