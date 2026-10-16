# Digital Tracking System for Municipal Waste Management

> A centralized full-stack MERN (MongoDB, Express.js, React.js, Node.js) web platform for end-to-end municipal solid waste monitoring, fleet dispatch, material recovery, circular recycling operations, and engineered landfill capacity management.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsusanprakash07-lab%2Fmunicipal-waste-managment&env=MONGO_URI,JWT_SECRET,NODE_ENV&envDescription=Enter%20your%20MongoDB%20Atlas%20connection%20string%20and%20environment%20variables&project-name=municipal-waste-management)

---

## 📌 Project Overview

Traditional municipal waste management relies on manual logbooks, siloed spreadsheets, and verbal dispatch communication. This leads to inaccurate records, unmonitored landfill saturation, delayed route pickups, and lack of accountability.

The **Digital Tracking System for Municipal Waste Management** provides a single, unified digital platform for municipal corporations, zonal supervisors, sanitation officers, and plant managers. It tracks waste across its entire lifecycle:
1. **Segregation:** Sorting wet, dry, recyclable, and hazardous fractions at ward transfer stations.
2. **Collection:** Fleet routing, vehicle tonnage weighing, crew assignments, and trip manifest logging.
3. **Processing:** Biological composting, Material Recovery Facilities (MRF), and Refuse-Derived Fuel (RDF) conversion with live efficiency tracking.
4. **Recycling Plants:** Reprocessing of plastics, paper, glass, and metals with recycling rate calculation.
5. **Landfill Airspace Management:** Real-time remaining capacity tracking with automatic threshold warnings (Normal, Moderate, High, Critical Alert).
6. **Cross-Module Unified Search:** Global search across all stages by ID, location, vehicle, or status.
7. **Official Reports & Analytics:** Daily, monthly, waste characterization, and fleet performance reports with CSV export and print-ready stylesheets.
8. **Role-Based Access Control (RBAC):** Admin and Municipal Staff role boundaries.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js (v18), Vite, Tailwind CSS, Lucide React Icons |
| **Data Visualization** | Recharts (Responsive Line, Bar, Pie, and Funnel Charts) |
| **Backend API** | Node.js, Express.js, RESTful JSON Architecture |
| **Database & ODM** | MongoDB, Mongoose ODM |
| **Authentication & Security** | JWT (JSON Web Tokens), Bcrypt.js, Helmet, CORS |
| **Tooling & Orchestration**| Concurrently, Morgan, Dotenv |

---

## 📂 Project Structure

```text
Digital_Tracking_System_for_Municipal_Waste_Management/
│
├── client/                               # Frontend React Application
│   ├── public/                           # Static assets & SVG icons
│   ├── src/
│   │   ├── assets/                       # UI assets
│   │   ├── components/                   # Reusable UI components
│   │   │   ├── ChartCard.jsx             # Chart container card
│   │   │   ├── ConfirmationDialog.jsx    # Deletion safety modal
│   │   │   ├── DashboardCard.jsx         # KPI summary card
│   │   │   ├── DataTable.jsx             # Universal table with search, filter & pagination
│   │   │   ├── EmptyState.jsx            # Empty table indicator
│   │   │   ├── FormControls.jsx          # Input, select & textarea components
│   │   │   ├── Header.jsx                # Sticky top navigation bar
│   │   │   ├── Layout.jsx                # Responsive shell wrapper
│   │   │   ├── LoadingSpinner.jsx        # Spinners & skeleton loaders
│   │   │   ├── Modal.jsx                 # Accessible backdrop dialog
│   │   │   ├── ProtectedRoute.jsx        # JWT & RBAC route guard
│   │   │   ├── Sidebar.jsx               # Categorized municipal navigation drawer
│   │   │   └── StatusBadge.jsx           # Color-coded status & alert badges
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # Global user authentication state
│   │   ├── pages/                        # Main Application Pages
│   │   │   ├── Dashboard.jsx             # Real-time metrics & Recharts graphs
│   │   │   ├── LandfillManagement.jsx    # Airspace & threshold warning tracking
│   │   │   ├── Login.jsx                 # Auth screen with 1-click viva demo fill
│   │   │   ├── NotFound.jsx              # 404 handler
│   │   │   ├── Profile.jsx               # User profile & password change
│   │   │   ├── RecyclingPlant.jsx        # Plant capacity & recycling rate monitoring
│   │   │   ├── Reports.jsx               # Daily/Monthly reports with CSV export & print
│   │   │   ├── SearchRecords.jsx         # Cross-module unified query search
│   │   │   ├── Settings.jsx              # Architecture & database telemetry
│   │   │   ├── UserManagement.jsx        # Admin-only staff provisioning
│   │   │   ├── WasteCollection.jsx       # Vehicle fleet dispatch & trip logs
│   │   │   ├── WasteProcessing.jsx       # MRF & composting efficiency tracking
│   │   │   └── WasteSegregation.jsx      # Ward sorting & depot characterization
│   │   ├── services/
│   │   │   └── api.js                    # Axios instance with JWT interceptor
│   │   ├── App.jsx                       # React Router configuration
│   │   ├── index.css                     # Tailwind directives & print styles
│   │   └── main.jsx                      # Client bootstrap entrypoint
│   ├── index.html                        # HTML template
│   ├── package.json                      # Client dependencies
│   ├── postcss.config.js                 # PostCSS setup
│   ├── tailwind.config.js                # Tailwind theme configuration
│   └── vite.config.js                    # Vite dev server & proxy settings
│
├── server/                               # Backend Node.js / Express API
│   ├── config/
│   │   └── db.js                         # Mongoose connection & fallback logic
│   ├── controllers/
│   │   ├── authController.js             # User login, profile, and password update
│   │   ├── collectionController.js       # Collection CRUD & route queries
│   │   ├── dashboardController.js        # MongoDB aggregation for dashboard KPIs
│   │   ├── landfillController.js         # Landfill capacity & warning computations
│   │   ├── processingController.js       # Processing CRUD & efficiency metrics
│   │   ├── recyclingController.js        # Recycling plant CRUD & rate computations
│   │   ├── reportsController.js          # Aggregated daily, monthly, and fleet reports
│   │   ├── searchController.js           # Multi-collection regex search engine
│   │   ├── segregationController.js      # Waste segregation CRUD
│   │   └── userController.js             # Admin staff provisioning
│   ├── middleware/
│   │   ├── auth.js                       # JWT verification & role authorization
│   │   └── errorHandler.js               # Centralized API error handler
│   ├── models/
│   │   ├── Landfill.js                   # Landfill Mongoose schema
│   │   ├── RecyclingPlant.js             # Recycling plant Mongoose schema
│   │   ├── User.js                       # User & credentials Mongoose schema
│   │   ├── WasteCollection.js            # Vehicle collection Mongoose schema
│   │   ├── WasteProcessing.js            # Processing batch Mongoose schema
│   │   └── WasteSegregation.js           # Segregation Mongoose schema
│   ├── routes/                           # Express route definitions
│   │   ├── authRoutes.js
│   │   ├── collectionRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── landfillRoutes.js
│   │   ├── processingRoutes.js
│   │   ├── recyclingRoutes.js
│   │   ├── reportsRoutes.js
│   │   ├── searchRoutes.js
│   │   ├── segregationRoutes.js
│   │   └── userRoutes.js
│   ├── seed/
│   │   ├── seed.js                       # Standalone seed runner
│   │   └── seedData.js                   # Realistic Indian municipal demo records
│   ├── .env.example                      # Server environment template
│   ├── package.json                      # Server dependencies
│   └── server.js                         # Express application entrypoint
│
├── .env.example                          # Root environment template
├── .gitignore                            # Clean repo configuration
├── package.json                          # Root package with concurrently commands
├── PROJECT_DOCUMENTATION.md              # Complete academic & architectural documentation
└── README.md                             # Step-by-step setup & operational guide
```

---

## 🔑 Demo Credentials (College Project Defense / Viva)

The application comes pre-configured with realistic demo accounts. You can type them in or click the one-click demo login buttons directly on the login screen:

| Role | Email Address | Password | Permissions |
|---|---|---|---|
| **ADMIN** | `admin@municipal.com` | `Admin@123` | Full system control: Manage users, add/edit/delete all records, export reports, system settings. |
| **MUNICIPAL STAFF** | `staff@municipal.com` | `Staff@123` | Field operations: View dashboard, log segregation, collection hauls, processing batches, recycling & landfill records. Cannot delete users or access admin routes. |

---

## 💻 Prerequisites

Ensure the following tools are installed on your Windows machine:
1. **Node.js** (v18.0.0 or higher recommended)
   - Verify: `node -v` and `npm -v`
2. **MongoDB**
   - **Local MongoDB Community Server** running on `mongodb://127.0.0.1:27017`
   - *OR* a free cloud **MongoDB Atlas** connection string.
3. **Visual Studio Code (VS Code)**

---

## 🚀 Step-by-Step Installation & Setup

### 1. Extract the Project Folder
Extract the `Digital_Tracking_System_for_Municipal_Waste_Management.zip` archive into your desired folder. Open the extracted folder in VS Code:
```bash
code Digital_Tracking_System_for_Municipal_Waste_Management
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` inside the `server/` directory:
```bash
cd server
copy .env.example .env
```
Default `.env` configuration:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/municipal_waste_management
JWT_SECRET=super_secret_municipal_waste_mgmt_key_2026_secure
JWT_EXPIRE=7d
```
*(If using MongoDB Atlas, replace `MONGO_URI` with your Atlas SRV string).*

### 3. Install All Dependencies
From the project root folder, run:
```bash
npm run install-all
```
*Or install individually:*
```bash
# In server folder:
cd server
npm install

# In client folder:
cd ../client
npm install
```

### 4. Seed the Database
Populate the database with realistic municipal data (10+ segregation records, 15+ collection trips, 10+ processing batches, 5+ recycling plants, 6+ landfill repositories):
```bash
cd server
npm run seed
```
Output:
```text
 Database populated with realistic municipal demo records:
   - Users: 3 (Admin: admin@municipal.com, Staff: staff@municipal.com)
   - Segregation Records: 11
   - Collection Records: 16
   - Processing Records: 11
   - Recycling Plants: 6
   - Landfill Sites: 6
 Seeding completed successfully!
```

### 5. Start the Application
Start both Backend and Frontend simultaneously with one command from the root directory:
```bash
npm run dev
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔄 Core Calculations & Logic

All statistics are computed dynamically from live database records:
1. **Total Waste Collected:** `SUM(WasteCollection.quantity)`
2. **Total Waste Processed:** `SUM(WasteProcessing.processedQuantity)`
3. **Total Recycled:** `SUM(RecyclingPlant.recycledQuantity)`
4. **Processing Efficiency (%):** `(Processed Quantity / Input Quantity) × 100`
5. **Recycling Rate (%):** `(Recycled Quantity / Input Quantity) × 100`
6. **Plant Capacity Utilization (%):** `(Input Quantity / Design Capacity) × 100`
7. **Landfill Remaining Capacity:** `Capacity - Used Capacity`
8. **Landfill Airspace Utilization (%):** `(Used Capacity / Capacity) × 100`
9. **Landfill Warning Levels:**
   - **Normal:** `< 60%`
   - **Moderate:** `60% – 80%`
   - **High Warning:** `80% – 90%`
   - **Critical Alert:** `> 90%`

---

## 📡 RESTful API Reference

| Endpoint | Method | Role | Description |
|---|---|---|---|
| `/api/auth/login` | POST | Public | Authenticate user & return JWT token |
| `/api/auth/me` | GET | Private | Return current authenticated user profile |
| `/api/auth/update-profile`| PUT | Private | Update display name, phone, department |
| `/api/auth/change-password`| PUT | Private | Verify old password & set new password |
| `/api/dashboard` | GET | Private | Aggregated stats, Recharts dataset, and alerts |
| `/api/segregation` | GET, POST | Private | Read and create waste segregation records |
| `/api/segregation/:id` | GET, PUT, DELETE | Private (DELETE: Admin) | Get, update, or remove segregation entry |
| `/api/collections` | GET, POST | Private | Read and log fleet collection hauls |
| `/api/collections/:id` | GET, PUT, DELETE | Private (DELETE: Admin) | Get, update, or remove collection haul |
| `/api/processing` | GET, POST | Private | Read and log waste processing batches |
| `/api/processing/:id` | GET, PUT, DELETE | Private (DELETE: Admin) | Get, update, or remove processing batch |
| `/api/recycling-plants` | GET, POST | Private | Read and register recycling facilities |
| `/api/recycling-plants/:id`| GET, PUT, DELETE | Private (DELETE: Admin) | Get, update, or remove recycling plant |
| `/api/landfills` | GET, POST | Private | Read and register landfill sites |
| `/api/landfills/:id` | GET, PUT, DELETE | Private (DELETE: Admin) | Get, update, or remove landfill site |
| `/api/search` | GET | Private | Multi-collection global search with filters |
| `/api/reports` | GET | Private | Aggregated reports (Daily, Monthly, Fleet) |
| `/api/users` | GET, POST | Admin Only | Provision and list municipal accounts |
| `/api/users/:id` | GET, PUT, DELETE | Admin Only | Update and deactivate staff accounts |

---

## 🛡️ Security Implementation
- **Password Protection:** Stored using bcrypt salted hashing (10 salt rounds). Passwords never returned in plain text.
- **JWT Authorization:** Stateless Bearer token verification with configurable expiration.
- **Route Guards:** Frontend `<ProtectedRoute>` redirects unauthenticated users and restricts admin routes. Backend middleware enforces `authorize('ADMIN')`.
- **Sanitized Headers:** HTTP protection headers enabled using `helmet`.
- **CORS Protection:** Configured to whitelist authorized client origins.

---

## 🚀 Vercel Deployment Guide

The repository is configured for native full-stack deployment on **Vercel** using serverless functions for the Express backend and static hosting for the React/Vite frontend.

### Prerequisites
- A [Vercel](https://vercel.com) account.
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (M0 free tier recommended).

### One-Click / Git Deployment Steps:
1. **Push your code to GitHub** (already done!).
2. Log in to **[Vercel Dashboard](https://vercel.com/dashboard)** and click **"Add New..."** ➔ **"Project"**.
3. Import the GitHub repository: `susanprakash07-lab/municipal-waste-managment`.
4. Keep the default settings:
   - **Framework Preset:** `Other` (or Vite)
   - **Root Directory:** `./`
   - **Build Command:** `npm --prefix client install && npm --prefix client run build`
   - **Output Directory:** `client/dist`
5. Under **Environment Variables**, add:
   - `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/municipal_waste_management?retryWrites=true&w=majority`
   - `JWT_SECRET`: `super_secret_municipal_waste_mgmt_key_2026_secure` (or your custom secure string)
   - `NODE_ENV`: `production`
6. Click **"Deploy"**.
7. Once deployed, open your Vercel URL. The application will connect to MongoDB Atlas, automatically seed the initial demo data on first load, and you can log in immediately using:
   - **Admin:** `admin@municipal.com` / `Admin@123`
   - **Staff:** `staff@municipal.com` / `Staff@123`

