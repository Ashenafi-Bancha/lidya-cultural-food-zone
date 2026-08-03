# Lidya Cultural Food Zone — Deployment Guide

Everything needed to run the site locally and publish it at **lidyaculturalfood.com**
on Ethiopian hosting (YegaraHost, Ashewa Cloud, or any Ubuntu VPS).

---

## 1. What you are deploying

Three pieces work together:

| Piece | What it is | Where it runs in production |
|---|---|---|
| **Frontend** | React site, built into plain HTML/CSS/JS files | Served directly by Nginx |
| **Backend** | Node.js API (Express + Prisma) | Node process on port 5000, kept alive by PM2 |
| **Database** | PostgreSQL | Same server, port 5432 |

```
Visitor → lidyaculturalfood.com (443/HTTPS)
                │
             [ Nginx ]
                ├── /            → frontend files (dist/)
                ├── /uploads/    → uploaded photos (backend/uploads/)
                └── /api/        → Node backend (127.0.0.1:5000) → PostgreSQL
```

**Why one domain for everything:** the browser never makes a cross‑origin
request, so there is no CORS configuration to get wrong, and the frontend simply
calls `/api`.

---

## 2. Local development (Docker database)

The database runs in Docker so you don't need PostgreSQL installed.

**One‑time setup**

```bash
cp .env.example .env          # then edit the password
docker compose up -d          # starts PostgreSQL
cd backend  && npm install && npx prisma migrate deploy && npx prisma db seed
cd ../frontend && npm install
```

**Every day**

```bash
docker compose up -d                    # database
cd backend  && npm run dev              # API   → http://localhost:5000
cd frontend && npm run dev              # site  → http://localhost:5173
```

| Task | Command |
|---|---|
| Stop the database (keeps data) | `docker compose down` |
| Reset the database (**deletes data**) | `docker compose down -v` then re‑run migrate + seed |
| Database GUI at :5050 | `docker compose --profile tools up -d` |
| Back up local data | `docker exec lidya-db pg_dump -U postgres lidyaculturalfood -Fc > backup.dump` |

> **Port note:** the compose file uses **5434** on the host to avoid clashing
> with any PostgreSQL already installed on 5432. Keep `POSTGRES_PORT` in `.env`
> and the port in `backend/.env` `DATABASE_URL` identical.

**Admin login (change these before going live):**
`letaowner@lidyafoodzone.com` / `LetaOwner@2026!`

---

## 3. Before you buy hosting — what to ask

Ethiopian providers sell two very different things. **Shared cPanel hosting is
built for PHP/WordPress and usually cannot run this app.** Send the provider
this exact checklist:

1. **Do you offer a VPS with root access and Ubuntu 22.04 or 24.04?** ✅ this is what you want
2. Can I install **Node.js 20+** and **PostgreSQL 16**? *(shared plans normally offer MySQL only — that will not work)*
3. Is there a **public/static IPv4 address** for DNS?
4. Can I open **ports 80 and 443**, and use **Let's Encrypt** free SSL?
5. Minimum useful size: **2 GB RAM, 2 vCPU, 40 GB SSD**
6. Do you also sell the **.com domain**, or should I register it elsewhere?
7. What is the **backup policy** — snapshots, and how often?

> If a provider only offers shared cPanel hosting, see **§11 Fallback options**
> before paying. Do not buy a shared plan hoping to "make Node work" on it.

**A note on the domain:** you can register `lidyaculturalfood.com` through the
Ethiopian host (simplest, pay in ETB) or through an international registrar.
Registering DNS with **Cloudflare** (free) is worth considering — it gives free
global caching, which makes the site noticeably faster for the international
tourists your client is targeting, and hides the server's real IP.

---

## 4. First login to the server

```bash
ssh root@YOUR_SERVER_IP
```

Create a normal user (never run the site as root):

```bash
adduser lidya
usermod -aG sudo lidya
su - lidya
```

Basic firewall:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ufw
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## 5. Install the software

```bash
# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PostgreSQL, Nginx, PM2, Certbot, Git
sudo apt install -y postgresql postgresql-contrib nginx git
sudo npm install -g pm2
sudo apt install -y certbot python3-certbot-nginx

node -v && psql --version && nginx -v      # confirm
```

---

## 6. Create the database

```bash
sudo -u postgres psql
```

Inside psql (**use your own strong password**):

```sql
CREATE DATABASE lidyaculturalfood;
CREATE USER lidya_user WITH ENCRYPTED PASSWORD 'PUT_A_STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON DATABASE lidyaculturalfood TO lidya_user;
\c lidyaculturalfood
GRANT ALL ON SCHEMA public TO lidya_user;
\q
```

---

## 7. Get the code and configure it

```bash
sudo mkdir -p /var/www/lidya && sudo chown -R lidya:lidya /var/www/lidya
git clone https://github.com/Ashenafi-Bancha/lidya-cultural-food-zone.git /var/www/lidya
cd /var/www/lidya
```

**Backend environment** — `nano backend/.env`:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL="postgresql://lidya_user:PUT_A_STRONG_PASSWORD_HERE@localhost:5432/lidyaculturalfood?schema=public"

# Generate each with:  openssl rand -base64 48
JWT_SECRET=REPLACE_WITH_A_LONG_RANDOM_STRING
JWT_REFRESH_SECRET=REPLACE_WITH_A_DIFFERENT_LONG_RANDOM_STRING

FRONTEND_URL=https://lidyaculturalfood.com

# Booking / contact emails
RESEND_API_KEY=your_resend_key
RESEND_FROM_EMAIL=noreply@lidyaculturalfood.com
MANAGER_EMAIL=ashenafibanchabassa01@gmail.com
```

Both JWT secrets must be **at least 32 characters** or the app refuses to start
— that check is deliberate.

**Frontend environment** — none needed. Because Nginx serves the API on the same
domain, the frontend's default relative `/api` path is correct.

---

## 8. Build and start

```bash
# Backend
cd /var/www/lidya/backend
npm ci
npx prisma generate
npx prisma migrate deploy     # creates the tables
npx prisma db seed            # menu, branches, gallery, testimonials, admin users
npm run build

# Frontend
cd ../frontend
npm ci
npm run build                 # produces frontend/dist

# Start the API under PM2
sudo mkdir -p /var/log/lidya && sudo chown -R lidya:lidya /var/log/lidya
cd /var/www/lidya
pm2 start deploy/ecosystem.config.js
pm2 save
pm2 startup                   # run the command it prints, so it survives reboot
pm2 status
```

---

## 9. Nginx + HTTPS

```bash
sudo cp /var/www/lidya/deploy/nginx.conf.example /etc/nginx/sites-available/lidyaculturalfood
sudo ln -s /etc/nginx/sites-available/lidyaculturalfood /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
```

**Point the domain at the server first** (§10), wait for it to resolve, then:

```bash
sudo certbot --nginx -d lidyaculturalfood.com -d www.lidyaculturalfood.com
sudo nginx -t && sudo systemctl reload nginx
```

Certbot installs the certificate and sets up automatic renewal. Verify renewal
works: `sudo certbot renew --dry-run`.

> The example config already references the certificate paths. If you run
> Certbot **before** copying the config, it may rewrite the file — copy first.

---

## 10. Domain DNS

In your registrar's DNS panel, create:

| Type | Name | Value | TTL |
|---|---|---|---|
| A | `@` | `YOUR_SERVER_IP` | 3600 |
| A | `www` | `YOUR_SERVER_IP` | 3600 |

Check propagation (can take 30 min – 24 h):

```bash
dig +short lidyaculturalfood.com
```

---

## 11. Fallback options if VPS isn't available

| Situation | What to do |
|---|---|
| Host offers only shared cPanel **with "Setup Node.js App"** | Possible, but PostgreSQL is rarely offered. You would need an external database (e.g. Neon free tier) and to run the API through Passenger. Fragile — treat as a last resort. |
| Host offers only shared cPanel **without Node** | Cannot run this app. Use it for the domain only. |
| Want the site live *today* while sorting local hosting | **Hybrid:** frontend on Vercel (free, global CDN) + backend on the Ethiopian VPS. Set `VITE_API_URL=https://api.lidyaculturalfood.com/api` and `FRONTEND_URL` to the Vercel URL. |

---

## 12. Post‑deployment checklist

- [ ] `https://lidyaculturalfood.com` loads with a padlock
- [ ] `www` version redirects correctly
- [ ] Refreshing directly on `/menu`, `/gallery`, `/about` works (SPA fallback)
- [ ] Menu, gallery, testimonials and branches all show content
- [ ] Photos under `/uploads/…` load
- [ ] Admin login works at `/admin/login`
- [ ] **Changed both seeded admin passwords**
- [ ] Uploading a photo in the admin works and appears on the site
- [ ] A test reservation and event booking arrive by email
- [ ] Print Menu & QR page produces a correct A4 PDF
- [ ] QR code (regenerate it **from the live site**) opens the real menu
- [ ] Language toggle works on every page
- [ ] Checked on a real phone

---

## 13. Updating the site later

```bash
cd /var/www/lidya
git pull

cd backend  && npm ci && npx prisma migrate deploy && npm run build
cd ../frontend && npm ci && npm run build

pm2 restart lidya-api
```

Nginx needs no restart — it serves the newly built files immediately.

---

## 14. Backups (do not skip)

**Database — nightly at 2am.** `crontab -e`:

```cron
0 2 * * * pg_dump -U lidya_user -h localhost lidyaculturalfood -Fc > /home/lidya/backups/db-$(date +\%F).dump 2>>/home/lidya/backups/backup.log
0 3 * * 0 find /home/lidya/backups -name '*.dump' -mtime +30 -delete
```

```bash
mkdir -p /home/lidya/backups
```

**Uploaded photos** live in `/var/www/lidya/backend/uploads/`. Back that folder
up too — those files are *not* all in Git:

```cron
30 2 * * * tar -czf /home/lidya/backups/uploads-$(date +\%F).tar.gz -C /var/www/lidya/backend uploads
```

Copy backups off the server periodically. Also ask the host to enable **VPS
snapshots** — that is your fastest full recovery.

---

## 15. Troubleshooting

| Symptom | Check |
|---|---|
| Site loads but menu/gallery empty | API down → `pm2 status`, `pm2 logs lidya-api` |
| 502 Bad Gateway | Backend crashed or wrong port → `pm2 restart lidya-api` |
| 404 when refreshing `/menu` | SPA fallback missing → `try_files … /index.html` in Nginx |
| Photos don't load | Path/permissions on `backend/uploads` → `sudo chown -R lidya:lidya /var/www/lidya/backend/uploads` |
| App won't start | Almost always `.env` — JWT secrets under 32 chars, or a bad `DATABASE_URL` |
| Emails not arriving | `RESEND_API_KEY`, and verify the sending domain in Resend |
| Certificate expired | `sudo certbot renew && sudo systemctl reload nginx` |

Useful commands:

```bash
pm2 logs lidya-api --lines 100      # API logs
sudo tail -f /var/log/nginx/error.log
sudo systemctl status postgresql
```

---

## 16. Security essentials

- [ ] Change **both** seeded admin passwords immediately
- [ ] `backend/.env` is never committed (already in `.gitignore`)
- [ ] JWT secrets are long and random — not reused from the example
- [ ] PostgreSQL listens on localhost only (Ubuntu default — do not expose 5432)
- [ ] UFW allows only SSH, 80 and 443
- [ ] Keep the server patched: `sudo apt update && sudo apt upgrade`
- [ ] Consider `sudo apt install fail2ban` to block SSH brute force

---

## 17. Rough running costs (verify current prices with the provider)

| Item | Typical |
|---|---|
| VPS (2 GB RAM) | monthly or yearly, billable in ETB locally |
| `.com` domain | ~1 year at a time |
| SSL certificate | **free** (Let's Encrypt) |
| Resend email | free tier covers a restaurant's volume |
| Cloudflare DNS/CDN | free tier is enough |

Prices change — ask YegaraHost / Ashewa Cloud directly for current VPS plans and
confirm the checklist in §3 before paying.
