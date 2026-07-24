# Lidya Cultural Food Zone - Deployment Guide

This guide provides step-by-step instructions for deploying the **Lidya Cultural Food Zone** application using a decoupled architecture:
- **Frontend**: Deployed on [Vercel](https://vercel.com)
- **Backend**: Deployed on [Render](https://render.com)
- **Database**: Hosted on [Neon](https://neon.tech)

---

## Part 1: Setting up the Database on Neon

Neon is an excellent serverless PostgreSQL platform. 

### 1. Create the Database
1. Go to the [Neon Dashboard](https://console.neon.tech/) and sign up or log in.
2. Click **New Project**.
3. Name your project (e.g., `lidya-db`), choose a region closest to your intended backend region, and select the Postgres version.
4. Click **Create Project**.
5. Once created, you will be shown your **Connection String** (which looks like `postgresql://[user]:[password]@[endpoint].neon.tech/[dbname]?sslmode=require`). **Copy this URL**.

---

## Part 2: Deploying the Backend on Render

Render is excellent for hosting Node.js applications.

### 1. Deploy the Backend Web Service
1. In the [Render Dashboard](https://dashboard.render.com/), click **New** -> **Web Service**.
2. Connect your GitHub repository (`lidya-cultural-food-zone`).

### 2. Configure the Web Service
Set up the service with the following details:
- **Name**: `lidya-backend`
- **Region**: Match your Neon database region if possible.
- **Environment**: `Node`
- **Root Directory**: `backend` *(CRITICAL: Just like Vercel, Render needs to know where the backend code is)*.
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`

### 3. Set Environment Variables
Expand the **Environment Variables** section and add:
- `DATABASE_URL`: Paste the Connection String you copied from Neon.
- `JWT_SECRET`: A long, secure random string.
- `PORT`: `5000` (or leave blank, Render assigns one dynamically).
- `FRONTEND_URL`: Your future Vercel domain (e.g., `https://lidyaculturalfood.vercel.app`). *For now, you can leave it blank or put a placeholder.*
- `NODE_ENV`: `production`

### 4. Deploy and Run Migrations
1. Click **Create Web Service**. Render will install dependencies, generate the Prisma client (using `postinstall`), and build the TypeScript code.
2. **Run Prisma Migrations**: Since your Neon database is empty, you need to push the Prisma schema and seed the database.
   - Run the migration from your local machine using the Neon Connection String:
     ```bash
     cd backend
     DATABASE_URL="your-neon-connection-string" npx prisma migrate deploy
     DATABASE_URL="your-neon-connection-string" npx prisma db seed
     ```

---

## Part 3: Deploying the Frontend on Vercel

Vercel has native support for monorepos. To deploy the frontend correctly, you must rely on Vercel's dashboard settings rather than root configuration files.

### 1. Import the Project
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New** -> **Project**.
2. Select your GitHub repository (`lidya-cultural-food-zone`) and click **Import**.

### 2. Configure Project Settings (CRITICAL)
Before you click Deploy, you MUST configure the following settings:

> [!IMPORTANT]
> **Root Directory**
> Click `Edit` next to Root Directory and type `frontend`. This tells Vercel where your React application lives.

> [!IMPORTANT]
> **Framework Preset**
> Vercel should automatically detect **Vite**. If it doesn't, select it from the dropdown.

> [!IMPORTANT]
> **Build and Output Settings**
> Leave the Build Command, Output Directory, and Install Command at their **default** settings (the toggle switches should be ON, do not override them). Vercel will automatically run `npm install` and `npm run build` inside the `frontend` folder.

### 3. Set Environment Variables
Expand the **Environment Variables** section and add:
- `VITE_API_URL`: Set this to your Render backend URL (e.g., `https://lidya-backend.onrender.com/api`).

### 4. Deploy
Click the **Deploy** button. Vercel will now properly enter the `frontend` folder, install dependencies, and build your Vite React app.

---

## Part 4: Finalizing the Connection

Once all are deployed:
1. Make sure your Render backend has the correct `FRONTEND_URL` environment variable set to your new Vercel domain (e.g., `https://lidyaculturalfood.vercel.app`) to avoid CORS errors.
2. If you updated the `FRONTEND_URL` in Render, you might need to trigger a manual deploy for the backend to pick up the change.

Your application is now live!
