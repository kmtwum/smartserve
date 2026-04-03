# smart.serve — AI Agent Build Specification

## 1. System Overview

### Company
We at Smart.Serve LLC do Low voltage electronic installations in residential homes and commercial office buildings.
We install and do the following:  
All style and model TV brackets and mount TVs from 30” to 100” we also install projectors and screens, in wall power kits and extending power outlets, sound bar mounts, in wall speakers and wire concealment, sound systems, Starlink, DirecTv, Dishnet satellite dishes, smart door bells, smart door locks, smart thermostats, wired security cameras, smart WiFi cameras, smart floodlights, all furniture deliveries with assembles, security cameras, alarm systems, audio video, PCs, fitness equipment assembles and custom home theaters.
We also do IT hardware installations.

### Platform
smart.serve is a service booking platform for home appliance/device installations. Users can:

* Create accounts
* Browse services
* Add services to cart
* Book available time slots
* Pay via Stripe
* Receive SMS and email notifications

---

## 2. Tech Stack

### Frontend + Backend

* Next.js (App Router)
* TypeScript

### Backend Logic

* Next.js API Routes (`/app/api`)
* Service layer abstraction (`/lib/services`)

### Database

* PostgreSQL
* Knex.js (query builder)

### Integrations

* Stripe (payments)
* Twilio (SMS)
* SendGrid (email)

### Hosting

* Vercel (Next.js app)
* Neon/Supabase (Postgres)

---

## 3. High-Level Architecture

```
Next.js App
 ├── UI (React components)
 ├── API Routes (serverless)
 └── Service Layer (business logic)

Database (Postgres via Knex)

External Services:
 ├── Stripe
 ├── Twilio
 └── SendGrid
```

---

## 4. Core Features

### 4.1 Authentication

* Email + password login
* Store hashed passwords (bcrypt)
* JWT-based session or NextAuth (recommended)

### 4.2 Services Catalog

* List available services
* Each service has:

  * name
  * description
  * price
  * duration (minutes)

---

### 4.3 Booking System (Fixed Slots)

#### Rules:

* Fixed time slots (e.g., 9:00, 10:00, 11:00…)
* One booking per slot
* No overlaps
* Slot must be available before booking

---

### 4.4 Cart System

* Users can add services
* Cart stored in DB (or session)

---

### 4.5 Payments (Stripe)

* Checkout session creation
* Webhook for payment confirmation

---

### 4.6 Notifications

* Email (SendGrid)
* SMS (Twilio)
* Triggered after successful booking/payment

---

## 5. Project Structure

```
/app
  /page.tsx
  /services/page.tsx
  /cart/page.tsx
  /booking/page.tsx
  /account/page.tsx

  /api
    /auth
    /services
    /bookings
    /payments
    /webhooks/stripe

/lib
  /db.ts
  /services
    bookingService.ts
    paymentService.ts
    notificationService.ts
    authService.ts

/components
```

---

## 6. Database Schema (Knex)

### Users Table

```ts
users
- id (uuid)
- name
- email (unique)
- password_hash
- phone
- address_line
- city
- zip_code
- created_at
```

---

### Services Table

```ts
services
- id
- name
- description
- price
- duration_minutes
```

---

### Bookings Table

```ts
bookings
- id
- user_id
- service_id
- date (YYYY-MM-DD)
- time_slot (HH:mm)
- status (pending, confirmed, cancelled)
- payment_status (pending, paid)
- created_at
```

---

### Cart Table

```ts
cart_items
- id
- user_id
- service_id
- quantity
```

---

## 7. API Design

### Auth

```
POST /api/auth/register
POST /api/auth/login
```

---

### Services

```
GET /api/services
```

---

### Bookings

```
GET /api/bookings/availability?date=YYYY-MM-DD
POST /api/bookings
```

---

### Payments

```
POST /api/payments/create-checkout-session
POST /api/webhooks/stripe
```

---

## 8. Booking Logic (Critical)

### Availability Check

```
1. Query bookings where date = selected date
2. Extract booked time slots
3. Compare with full slot list
4. Return available slots
```

---

### Booking Creation

```
1. Validate user
2. Check slot availability
3. Create booking (status: pending)
4. Initiate Stripe checkout
```

---

### After Payment (Webhook)

```
1. Receive Stripe webhook
2. Verify signature
3. Update booking:
   - payment_status = paid
   - status = confirmed
4. Trigger notifications
```

---

## 9. Stripe Integration

### Flow

1. User clicks "Pay"
2. Backend creates checkout session
3. Redirect to Stripe
4. Stripe calls webhook after payment
5. Update booking

---

## 10. Notification Flow

### On Successful Booking

* Send email (SendGrid)
* Send SMS (Twilio)

---

## 11. Environment Variables

```
DATABASE_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
SENDGRID_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
```

---

## 12. Security Considerations

* Hash passwords (bcrypt)
* Validate all inputs (zod recommended)
* Protect API routes (auth middleware)
* Never expose API keys to frontend

---

## 13. Step-by-Step Build Plan

### Phase 1 — Setup

* Initialize Next.js (TS)
* Setup Knex + DB connection
* Setup environment variables

---

### Phase 2 — Auth

* Register/login endpoints
* Password hashing
* Session handling

---

### Phase 3 — Services

* Seed services table
* Build services UI + API

---

### Phase 4 — Booking System

* Availability endpoint
* Booking creation logic

---

### Phase 5 — Payments

* Stripe checkout integration
* Webhook handling

---

### Phase 6 — Notifications

* SendGrid email setup
* Twilio SMS setup

---

### Phase 7 — UI Polish

* Cart flow
* Booking UX
* Error handling

---

## 14. Assumptions

* Single operator (no multi-staff scheduling)
* Fixed hourly slots
* No overlapping bookings
* Low traffic (<=100 bookings/month)

---

## 15. Future Enhancements

* Admin dashboard
* Rescheduling
* Multi-service booking per slot
* Availability rules (days off, holidays)

---

END OF SPEC
