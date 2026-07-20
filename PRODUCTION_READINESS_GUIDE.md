# Path to Production: Lidya Cultural Food Zone

This document provides a comprehensive overview of the current state of the Lidya Cultural Food Zone platform, detailing what has been implemented, what remains to be completed, and a step-by-step guide to taking the project to a robust, production-ready state.

> [!IMPORTANT]
> The application architecture is currently solid and fundamentally sound (React + Node.js/Express + PostgreSQL). The remaining work primarily involves hardening the application for public release, finalizing business logic integrations, and deploying to cloud infrastructure.

---

## 1. Current State: What is Implemented

We have successfully established a full-stack monorepo architecture with a strong foundation.

### Frontend (React + Vite + Tailwind CSS)
- **Component Architecture**: Built a beautiful, responsive, and animated user interface using React and Motion.
- **State & Data Fetching**: Integrated `TanStack React Query` for performant data fetching, caching, and skeleton loading states.
- **API Client**: Implemented a global `Axios` client with interceptors to automatically handle JWT authentication tokens.
- **Public Routes**: Connected the Menu, Branches, Gallery, Reservation, and Contact sections to dynamic backend endpoints.
- **Admin Interface**: Built the foundation of a comprehensive admin dashboard with an authentication flow, layout, and CRUD (Create, Read, Update, Delete) interfaces for Menu, Reservations, Branches, and Gallery.

### Backend (Node.js + Express + TypeScript)
- **Database Schema**: Designed a comprehensive Prisma schema (PostgreSQL) covering Users, Branches, Categories, MenuItems, Reservations, GalleryItems, and ContactMessages.
- **Authentication**: Implemented secure JWT-based authentication and role-based access control (RBAC).
- **RESTful API**: Developed robust API endpoints with dedicated controllers and routing.
- **Service Layer**: Decoupled business logic into a service layer (e.g., `menu.service.ts`, `reservation.service.ts`).
- **File Uploads**: Implemented basic Multer-based local file uploads for the Gallery.

---

## 2. The Database: Current vs. Production

### Current State
- The application uses **PostgreSQL** via Prisma ORM.
- The schema is well-designed and relations are established.

### What is Remaining for Production
- **Cloud Database Hosting**: You must migrate from a local PostgreSQL database to a managed cloud provider (e.g., Supabase, Neon, AWS RDS, or DigitalOcean Managed Databases). This ensures high availability, automated backups, and scalability.
- **Database Seeding script**: We need a robust `seed.ts` script to populate the production database with the initial Admin user, initial branches (Addis Ababa & Wolaita Sodo), and default categories so the system functions immediately upon deployment.
- **Connection Pooling**: For production traffic, configure Prisma to use connection pooling (e.g., using Prisma Accelerate or PgBouncer) to prevent database connection exhaustion under heavy load.

---

## 3. Backend Logic & Requirements: Making it Real

To make the backend truly robust and production-ready, several critical business logic implementations remain.

### What is Remaining
- **Image Storage (Critical)**: Currently, images uploaded via the Admin Dashboard are saved locally to an `/uploads` folder. **In production, local file systems are ephemeral (temporary).** 
  - *Action*: Integrate a cloud storage service like **AWS S3, Cloudinary, or Supabase Storage**. The backend upload controller must be updated to push files to the cloud and return the public URL.
- **Email & SMS Notifications**: The `notification.service.ts` currently acts as a placeholder.
  - *Action (Email)*: Integrate a transactional email provider like **Resend, SendGrid, or AWS SES** to send booking confirmations to customers and alert managers of new contact messages.
  - *Action (SMS)*: Integrate an SMS provider (e.g., **Twilio or Africa's Talking**) to send text confirmations for reservations, which is crucial for the Ethiopian market.
- **Input Validation**: While basic validation exists, we need strict runtime validation (e.g., using **Zod**) on all incoming API requests to prevent malformed data from crashing the server or polluting the database.
- **Rate Limiting**: Implement rate limiting on public endpoints (like the Contact and Reservation forms) to prevent spam and DDoS attacks.

---

## 4. Admin Dashboard: Status and Path to Production

### Current State
- The UI for the dashboard is built and connected to the backend API via React Query.
- It can successfully perform CRUD operations (add menu items, view reservations, add branches).

### What is Remaining for Production
- **Initial Admin Setup**: There is currently no way to create the *first* admin user via the UI. We need a secure onboarding script or command-line tool to generate the root admin account.
- **Analytics Integration**: The dashboard currently shows basic counts. For production, integrating simple charts (e.g., Recharts) showing reservations over time or most popular menu items would add immense business value.
- **Form Validation & Error Handling**: Enhance the frontend forms with strict validation (using React Hook Form + Zod) before data is sent to the backend.
- **Pagination**: The admin tables currently load all data at once. As the business grows, endpoints and UI tables must support pagination to maintain performance.

---

## 5. Reservation System: Making it Production Ready

### Current State
- The public can submit a reservation form.
- The admin can view pending reservations and change their status (Confirmed, Cancelled, Completed).

### What is Remaining for Production
- **Capacity Management Engine**: The system currently accepts any reservation. We need backend logic to check the selected branch's `capacity` against existing confirmed reservations for that specific date and time block. If full, the API must reject the request.
- **Customer Notifications**: As mentioned in the backend section, the system *must* automatically trigger an email/SMS when an Admin clicks "Confirm" or "Cancel" on a reservation.
- **Automated State Transitions**: Implement a background cron job (using node-cron) to automatically move past reservations from "CONFIRMED" to "COMPLETED" or "NO_SHOW" if the time has passed.
- **Timezone Handling**: Ensure all dates and times are handled in UTC in the database and explicitly converted to East Africa Time (EAT/Addis Ababa) on the frontend and in email communications.

---

## 6. Step-by-Step Execution Plan (The Roadmap)

To reach a production state, I recommend executing the following phases in order:

> [!TIP]
> You can ask me to execute any of these phases, and we can work through them together.

### ✅ Phase 1: Security & Validation (Backend Hardening) — COMPLETE

> All three Phase 1 objectives have been implemented. The backend is now hardened against malformed input and brute-force attacks, and the database can be bootstrapped reliably.

| Task | Status | File(s) |
|---|---|---|
| Zod validation on **all** API routes | ✅ Done | `src/utils/validators.ts`, all `*.routes.ts` |
| Express Rate Limiting on public endpoints | ✅ Done | `src/middleware/rateLimiter.ts`, `app.ts` |
| Idempotent `seed.ts` for initial deployment | ✅ Done | `src/database/seed.ts` |

#### Phase 1 — Implementation Details

**1. Zod Validation (Complete Coverage)**

Every mutating API route is now guarded by a typed Zod schema via the `validate()` middleware. Previously, `category`, `gallery`, and `settings` routes had no input validation at all.

- **`validators.ts`** — Added: `createCategorySchema`, `updateCategorySchema`, `createGalleryItemSchema`, `updateGalleryItemSchema`, `updateSettingsSchema`
- **`category.routes.ts`** — Wired `createCategorySchema` → POST, `updateCategorySchema` → PUT
- **`gallery.routes.ts`** — Wired `createGalleryItemSchema` → POST, `updateGalleryItemSchema` → PUT
- **`settings.routes.ts`** — Wired `updateSettingsSchema` → POST

**2. Rate Limiting (Complete)**

- `apiLimiter` (100 req / 15 min) applied globally to all `/api/*` routes via `app.ts`
- `strictLimiter` (10 req / 15 min) applied directly on the sensitive public POST routes: `/api/auth/login`, `/api/reservations`, `/api/contact`

**3. Database Seed Script (Idempotent & Production-Ready)**

The `seed.ts` was rewritten from scratch to be safe to run multiple times without errors:

- All `branch.create()` calls replaced with `branch.upsert()` using stable deterministic UUIDs
- All `category.create()` calls replaced with `category.upsert()` (using the unique `name` field)
- All `menuItem.create()` calls replaced with `menuItem.upsert()` using stable seed IDs
- Added a root **OWNER** account (`owner@lidyafoodzone.com`) alongside the manager — this is the superuser needed for the admin dashboard
- Added seeding for default **WebsiteSettings** (hero text, contact info, social links)
- Passwords are driven by `SEED_OWNER_PASSWORD` / `SEED_MANAGER_PASSWORD` env vars (defaults to safe placeholder values)
- Password hashing rounds increased from 10 → 12 for production strength

> [!CAUTION]
> After running `pnpm --filter backend exec prisma db seed` on production, immediately change the default passwords via the Admin Dashboard or database.

### Phase 2: Cloud Infrastructure Integration
1. Set up a Cloudinary or AWS S3 account.
2. Rewrite the backend `upload.controller.ts` to upload to the cloud.
3. Update the frontend `GalleryManagement` to handle cloud URLs natively.

### Phase 3: The Notification Engine
1. Set up Resend (Email) and/or Twilio (SMS).
2. Complete the `notification.service.ts` logic.
3. Wire the reservation lifecycle (Create -> Confirm -> Cancel) to trigger real emails/texts.

### Phase 4: Reservation Capacity Logic
1. Update `createReservation` controller to calculate current table capacity for the requested timeslot.
2. Return proper error messages to the frontend if the restaurant is full.

### Phase 5: Deployment & DevOps
1. **Database**: Provision a managed PostgreSQL database.
2. **Backend Deployment**: Deploy the Node.js API to a platform like Render, Railway, or Heroku.
3. **Frontend Deployment**: Build the Vite application and deploy to Vercel or Netlify.
4. **Environment Variables**: Securely configure all production `.env` variables across platforms.
5. **Domain Mapping**: Connect your custom domain (e.g., lidyaculturalfood.com) and secure with SSL.
