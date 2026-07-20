# Lidya Cultural Food Zone — Backend Build Prompt (Premium Edition)

You are a Senior Software Architect, Senior Backend Engineer, Solution Architect, Database Designer, and Security Engineer with 15+ years building enterprise production systems.

Your task: build a **complete, production-ready backend** for a real, paying client — Lidya Cultural Food Zone — and wire it to an **already-built React \+ Vite frontend** that currently runs on mock data and stock images.

This is not a tutorial project. Write code a senior engineer would approve in code review, not a demo.

---

## 0\. CLIENT CONTEXT (read this before writing any code)

Lidya Cultural Food Zone is a well-known Ethiopian cultural restaurant with branches in **Wolaita Sodo** and **Addis Ababa**, planning further expansion. The two people who will actually use this system day-to-day are:

- **The restaurant manager** — not technical. Never used an admin dashboard before. Will manage the menu, photos, reservations, and messages from a phone or laptop, often on a slow connection.  
- **The owner (Leta)** — occasional oversight, wants a professional impression and future growth (online ordering, payments, more branches).

Every architectural decision below should be filtered through: *"Would a non-technical restaurant manager in Ethiopia be able to use this without calling the developer?"*

**Critical first step for whoever implements this:** before writing DTOs or Prisma models, inventory the frontend's existing mock data files and TypeScript types (menu items, branches, gallery, reservation form, settings, about content). Match backend response shapes to those types field-for-field wherever reasonable, so the frontend needs minimal rewriting — only swapping mock imports for API calls.

---

## 1\. TECH STACK

| Layer | Choice |
| :---- | :---- |
| Frontend (already built) | **React \+ Vite (SPA)**, TypeScript, Tailwind CSS, Shadcn UI — *not* Next.js. No SSR, no API routes on the frontend side. |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT access token (short-lived, in-memory on frontend) \+ refresh token (httpOnly, Secure, SameSite cookie) \+ bcrypt |
| Validation | Zod |
| File Upload | Multer |
| Image Processing | Sharp (auto-resize, compress, generate thumbnail \+ web-optimized variants on upload) |
| Logging | Pino |
| Customer notifications | Email (Nodemailer) \+ SMS (Ethiopian SMS gateway — e.g. AfroMessage or GeezSMS; abstract behind an interface so the provider is swappable) |
| Manager/owner notifications | **Telegram Bot** (grammy or node-telegram-bot-api) — instant push to the manager's phone for new reservations and contact messages, no app to check |
| Config | dotenv |
| Testing | Jest |
| Deployment | Ubuntu VPS, PM2, Nginx, PostgreSQL |

### Why this stack matters here specifically

- Since the frontend is a **Vite SPA**, auth must follow the SPA pattern: access token held in memory (never localStorage, to reduce XSS risk), refresh token in an httpOnly cookie, CORS configured with `credentials: true` and an explicit allowed origin (the deployed frontend domain). No server-rendered auth assumptions.  
- Ethiopian customers frequently don't check email promptly — **SMS and Telegram are the primary channels**, email is a secondary/backup channel, not the main one.  
- The manager should get a **Telegram message the instant** a reservation or contact form comes in — this alone will make the system feel "magic" compared to checking a dashboard.

---

## 2\. GENERAL ARCHITECTURE REQUIREMENTS

Clean architecture, strictly separated:

routes → controllers → services → repositories → prisma/database

                ↓

         validators (Zod) / DTOs / middleware / utils

- Controllers: receive request, call service, return response. No business logic.  
- Services: all business logic, orchestration, notification triggering.  
- Repositories: all Prisma/database access. Nothing else touches Prisma directly.  
- Strict TypeScript, no `any`.  
- Dependency injection where it meaningfully improves testability — don't over-engineer for its own sake.

### Suggested folder structure

src/

  config/            env, constants, third-party client setup (telegram, sms, mailer)

  database/          prisma client singleton

  modules/

    auth/

    users/

    dashboard/

    branches/

    menus/

    categories/

    reservations/

    gallery/

    about/

    contacts/

    settings/

    notifications/

    activity-logs/

    uploads/

  middleware/        auth guard, role guard, error handler, rate limiter, upload

  shared/            base repository, response wrapper, pagination, error classes

  utils/

  types/

prisma/

  schema.prisma

  migrations/

uploads/             (or swap for object storage later — design for that swap)

---

## 3\. DATABASE DESIGN (PostgreSQL via Prisma)

Normalized schema, `createdAt`/`updatedAt` on everything, soft delete (`deletedAt`) on customer/content-facing tables (menus, gallery, branches, reservations) so nothing is ever hard-deleted by accident by a non-technical manager.

Core tables: `users`, `roles`, `permissions`, `refresh_tokens`, `branches`, `categories`, `menus`, `gallery`, `gallery_categories`, `reservations`, `contacts`, `website_settings`, `about_content`, `notifications`, `activity_logs`.

**Content/i18n-readiness:** menu names, descriptions, about content, and settings text fields should be structured so an Amharic (and later Wolaytta) translation can be added later without a schema rewrite — e.g. a `translations` JSON column or a simple `content_translations` table keyed by `entityType`, `entityId`, `locale`, `field`. Don't build the full multilingual UI now — just don't paint the schema into a corner.

**Reservation capacity fields:** each branch should carry configurable operating hours \+ a simple capacity-per-timeslot setting (even a flat number is fine for v1) so the system can flag overbooked slots for the manager rather than blindly accepting unlimited reservations.

---

## 4\. AUTHENTICATION

- Admin login (manager \+ owner accounts, role-based: `OWNER`, `MANAGER`, future `STAFF`)  
- JWT access token (\~15 min) \+ refresh token (7–30 days, rotated on use, stored hashed in `refresh_tokens` table so any device can be revoked)  
- bcrypt password hashing  
- Role/permission middleware on every protected route  
- "Forgot password" flow via email (manager will need this — don't skip it)

---

## 5\. ADMIN DASHBOARD MODULES — WITH MANAGER-FRIENDLINESS AS A HARD REQUIREMENT

For every module below, the backend must return data in a shape that lets the frontend present **plain-language, low-jargon UI** — this drives some API design choices:

- Status fields should have both a machine value (`PENDING`) and be easy to map to a friendly label \+ color on the frontend (`"Pending"` / yellow) — keep enums short and unambiguous.  
- Every list endpoint supports simple filters (`today`, `this week`, `this month`) as named query params, not just raw date ranges — a non-technical manager thinks in "today's reservations," not ISO date ranges.  
- Reservation and contact list endpoints support **CSV export** and a **"print today's list"**\-friendly plain response (already sorted, no pagination needed for a single day).  
- Image upload endpoints accept whatever the manager's phone camera produces (large JPEGs/HEIC-adjacent) and Sharp normalizes it — the manager should never see a "file too large" or "wrong format" error for a normal phone photo.  
- All destructive actions (delete menu item, delete gallery image) are soft-deletes with a way to restore, and are logged to `activity_logs` in a human-readable sentence format (e.g. *"Manager Aster removed 'Doro Wat' from the menu"*) — not just a JSON diff — so an activity feed reads like a story, not a debug log.

Modules to build full CRUD \+ business logic for:

1. **Dashboard statistics** — today's/weekly/monthly reservations, unread contacts, most-viewed or featured menu items, recent activity feed.  
2. **Menu management** — categories, price, description, images, availability toggle, display order (drag-reorder friendly — return an `order` int), featured flag, branch assignment.  
3. **Branch management** — name, address, phone, email, Google Maps URL, working hours (structured per day, not free text — the frontend needs to render "Open now / Closed" reliably), description, images, manager name, social links.  
4. **Reservation management** — see §6 below.  
5. **Gallery management** — categories (Food, Restaurant, Coffee Ceremony, Events, Branches), bulk upload, automatic optimization.  
6. **About content** — story, mission, vision, culture, history — structured as named sections so the frontend's existing layout maps cleanly.  
7. **Website settings** — name, logo, contact info, social links, SEO metadata, hours, footer, homepage hero content — **this is what replaces all the current mock/stock content**, so make sure every piece of currently-hardcoded frontend text and image has a corresponding settings field. Audit the frontend for this before finalizing the schema.  
8. **Contact messages** — Unread / Read / Replied states, reply-from-dashboard capability.  
9. **Admin users** — owner can create/deactivate manager accounts.  
10. **Notification center** — in-dashboard feed mirroring what's sent to Telegram/SMS, for a full audit trail.  
11. **Activity logs** — human-readable, filterable by user and date.

---

## 6\. RESERVATION SYSTEM — DETAILED WORKFLOW

Fields: customer name, phone (required — this is the primary contact method), optional email, branch, date, time, party size, special request, status.

Statuses: `PENDING` → `CONFIRMED` / `CANCELLED` / `NO_SHOW` → `COMPLETED`.

Admin capabilities: approve, reject (with optional reason), reschedule, search/filter/sort, mark completed/no-show.

### Notification flow (this is a core "premium" feature, build it properly)

1. Customer submits reservation on the site → row created as `PENDING`.  
2. **Instantly**, a Telegram message is pushed to the manager's bot chat: customer name, phone, branch, date/time, party size — with the phone number tappable to call directly. This should feel immediate, not batched.  
3. Manager approves/rejects from the dashboard (or, as a stretch goal, via Telegram inline buttons — worth scoping if time allows, since it means the manager barely needs to open the dashboard for routine approvals).  
4. On approve/reject, customer receives **SMS** (primary) confirming status, and **email** as a secondary channel if an email was given.  
5. Reminder SMS a few hours before the reservation time (background job — node-cron or similar) — optional for v1 but design the notification service so it's a small addition later, not a rewrite.

Build the notification logic as a single internal `NotificationService` with channel-specific senders (`TelegramSender`, `SmsSender`, `EmailSender`) behind a common interface, so adding WhatsApp later, or swapping the SMS provider, doesn't touch reservation logic.

---

## 7\. SECURITY

Helmet, CORS (explicit origin \+ credentials for the SPA), rate limiting (especially on `/auth/login`, `/reservations`, `/contacts` — public-facing endpoints are the ones that will get spammed), Zod validation on every input, Prisma parameterization (no raw SQL), XSS-safe handling of any rich text fields, environment-variable-only secrets, short JWT expiry with rotation.

---

## 8\. ERROR HANDLING & LOGGING

- Global error handler, custom error classes (`NotFoundError`, `ValidationError`, `UnauthorizedError`, etc.), consistent JSON error shape, no internal stack traces leaked to the client.  
- Pino structured logging for auth events, reservations, admin activity, and errors — plus, separately, the human-readable `activity_logs` table described above (logs are for developers; activity log is for the manager).

---

## 9\. FILE STORAGE

Store optimized images under `/uploads`, DB stores only URLs/paths. Structure the storage layer behind a small abstraction so moving to S3-compatible object storage later (recommended once traffic grows) is a config change, not a rewrite.

---

## 10\. DOCUMENTATION TO GENERATE

- `README.md` with setup instructions  
- `.env.example` with every variable documented (including Telegram bot token/chat ID and SMS provider credentials)  
- API documentation (OpenAPI/Swagger or a clear markdown reference)  
- Database schema explanation  
- Deployment guide for Ubuntu \+ PM2 \+ Nginx, including exact Nginx config for serving the Vite build as static files alongside the Node API, and CORS/cookie settings that will actually work across the two origins (or same-origin, if you deploy them together — decide and document which).

---

## 11\. FUTURE-PROOFING (do not build now, but do not architect against)

Design so these can be added without major refactors: online ordering, Telebirr/Chapa payments, customer accounts, multilingual frontend (Amharic/Wolaytta), analytics, mobile app, additional branches.

---

## 12\. DEFINITION OF DONE

- A non-technical manager can log in, change the entire homepage's text and images, add/edit/remove menu items with photos from their phone, and manage a full day of reservations — entirely without a developer's help, and getting a Telegram ping the moment something needs their attention.  
- The frontend's mock data files can be deleted entirely, replaced by real API calls, with no visual regressions.  
- Every route is authenticated/authorized correctly, every input is validated, every destructive action is soft-deleted and logged in plain language.  
- The code would pass review from a senior backend engineer without embarrassment.

