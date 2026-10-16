# 🚀 Vercel Deployment Guide
## Digital Tracking System for Municipal Waste Management

This project is configured as a production-grade full-stack monorepo ready for deployment on **Vercel** with:
- **Frontend**: React (Vite) single-page application served directly from Vercel's global Edge CDN.
- **Backend API**: Express.js serverless functions running on Node.js via `/api/index.js`.
- **Routing**: Client-side SPA routing and API request routing configured via `vercel.json`.
- **Database**: Cloud MongoDB Atlas with connection caching and automatic cold-start database seeding.

---

## 📋 Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Step-by-Step Deployment via Vercel Dashboard](#2-step-by-step-deployment-via-vercel-dashboard)
3. [Deployment via Vercel CLI](#3-deployment-via-vercel-cli)
4. [Setting Up MongoDB Atlas (Free Cloud Database)](#4-setting-up-mongodb-atlas-free-cloud-database)
5. [Required Environment Variables](#5-required-environment-variables)
6. [Demo Login Credentials](#6-demo-login-credentials)
7. [Troubleshooting & FAQ](#7-troubleshooting--faq)

---

## 1. Architecture Overview

```text
                        ┌──────────────────────────────┐
                        │      Incoming Request        │
                        └──────────────┬───────────────┘
                                       │
                         [ vercel.json rewrites ]
                                       │
                ┌──────────────────────┴──────────────────────┐
                │                                             │
      Path: /api/*                                   Path: /* (All other routes)
                │                                             │
    ┌───────────▼───────────┐                     ┌───────────▼───────────┐
    │    api/index.js       │                     │    client/dist/       │
    │  Vercel Serverless    │                     │  Vite Static Build    │
    │    Node.js Lambda     │                     │  (Global Edge CDN)    │
    └───────────┬───────────┘                     └───────────────────────┘
                │
    ┌───────────▼───────────┐
    │  MongoDB Atlas Cloud  │
    │  (Auto-seeded on 1st  │
    │   launch if empty)    │
    └───────────────────────┘
```

---

## 2. Step-by-Step Deployment via Vercel Dashboard

### Step 2.1: Import Git Repository
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** ➔ **Project**.
3. Under "Import Git Repository", find:
   ```text
   susanprakash07-lab/municipal-waste-managment
   ```
   and click **Import**.

### Step 2.2: Configure Project Settings
Vercel automatically detects the project. Confirm the following settings:
- **Framework Preset**: `Other` (or `Vite`)
- **Root Directory**: `./` (leave default)
- **Build Command**: `npm --prefix client install && npm --prefix client run build`
- **Output Directory**: `client/dist`

### Step 2.3: Configure Environment Variables
Expand the **Environment Variables** section and add the following keys:

| Key | Example Value | Description |
|---|---|---|
| `MONGO_URI` | `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/municipal_waste_management?retryWrites=true&w=majority` | Your MongoDB Atlas cloud database connection string. |
| `JWT_SECRET` | `super_secret_municipal_waste_mgmt_key_2026_secure` | Secret string used for signing JWT authentication tokens. |
| `NODE_ENV` | `production` | Sets runtime environment to production. |

### Step 2.4: Deploy!
Click **Deploy**. Vercel will install dependencies, build the frontend, package the serverless function, and assign a production URL (e.g., `https://municipal-waste-managment.vercel.app`).

---

## 3. Deployment via Vercel CLI

If you prefer terminal deployment using the Vercel CLI:

```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Login to your account
vercel login

# 3. Deploy to preview
vercel

# 4. Deploy to production
vercel --prod
```

When prompted, accept the detected default project settings.

---

## 4. Setting Up MongoDB Atlas (Free Cloud Database)

If you don't already have a cloud MongoDB database:

1. Visit [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account.
2. Create a **Shared M0 Cluster** (Free forever).
3. Under **Security ➔ Database Access**:
   - Create a database user (e.g. `municipal_admin`) with password.
4. Under **Security ➔ Network Access**:
   - Click **Add IP Address** ➔ Choose **Allow Access from Anywhere** (`0.0.0.0/0`) so Vercel's serverless functions can connect.
5. Under **Database ➔ Connect**:
   - Select **Drivers** (Node.js).
   - Copy the connection string.
   - Replace `<password>` with your database user password and specify the database name:
     ```text
     mongodb+srv://municipal_admin:YourPassword123@cluster0.abcde.mongodb.net/municipal_waste_management?retryWrites=true&w=majority
     ```
6. Paste this string into Vercel as `MONGO_URI`.

> **Note on Auto-Seeding:**
> When the application connects to your new, empty MongoDB Atlas cluster for the first time, it automatically populates the database with realistic municipal demo data, seed users, landfill locations, recycling facilities, and waste log batches.

---

## 5. Required Environment Variables

| Variable | Required | Default / Fallback | Notes |
|---|---|---|---|
| `MONGO_URI` | **Yes** (on Vercel) | `mongodb://127.0.0.1:27017/...` | Cloud MongoDB URI |
| `JWT_SECRET` | Optional | Built-in fallback string | Change in production for security |
| `NODE_ENV` | Optional | `development` | Set to `production` on Vercel |
| `PORT` | Local only | `5000` | Ignored on Vercel serverless |

---

## 6. Demo Login Credentials

Once deployed on Vercel, use these pre-seeded accounts:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Administrator** | `admin@municipal.com` | `Admin@123` | Full access to all modules, landfill config, and user management |
| **Municipal Staff** | `staff@municipal.com` | `Staff@123` | Operational access to waste logs, segregation, collection, and processing |

---

## 7. Troubleshooting & FAQ

### Q: Why do I see "Database not connected" error?
**A:** Ensure you added `MONGO_URI` in **Vercel Dashboard ➔ Project Settings ➔ Environment Variables** and redeployed. Also check that your MongoDB Atlas Network Access allows `0.0.0.0/0`.

### Q: Does the application have CORS issues on Vercel?
**A:** No. Because both frontend and backend are hosted on the same Vercel project domain, the client accesses the backend using relative URLs (`/api/...`), completely eliminating cross-origin CORS errors.

### Q: Can I run this project locally while also having Vercel config?
**A:** Yes! The project remains 100% functional locally:
```bash
npm run dev
# or
npm run single
```
