# Project Documentation: Digital Tracking System for Municipal Waste Management

**Academic Project Report & System Architecture Specification**  
**Technology Stack:** MERN (MongoDB, Express.js, React.js, Node.js)  
**Academic Year:** 2026  

---

## 1. Project Title
**Digital Tracking System for Municipal Waste Management**

---

## 2. Abstract
Rapid urbanization has dramatically increased solid waste generation in metropolitan and secondary urban cities. Municipal corporations face severe challenges in tracking the flow of waste across disparate stages: source segregation, daily fleet collection, transfer stations, bio-composting / material recovery plants, recycling centers, and final sanitary landfills. Traditional approaches depend on manual logbooks, disconnected weighbridge spreadsheets, and fragmented verbal communication, resulting in data loss, unrecorded collection delays, unchecked landfill saturation, and lack of municipal accountability.

The **Digital Tracking System for Municipal Waste Management** is a centralized, full-stack web application built on the MERN stack (MongoDB, Express.js, React.js, Node.js). It replaces scattered, paper-based records with an integrated digital operations portal featuring role-based access control (Admin and Municipal Staff), real-time fleet dispatch logs, waste characterization metrics, automated processing efficiency algorithms, plant recycling rate monitors, and dynamic landfill airspace warning systems.

---

## 3. Introduction
Solid Waste Management (SWM) is one of the most critical public infrastructure services managed by municipal corporations. Efficient municipal solid waste handling requires continuous supervision across multiple interconnected nodes:
- **Ward-Level Segregation:** Separating waste at source and intermediate depots into biodegradable organics, dry recyclable plastics/paper/glass/metal, and hazardous e-waste.
- **Collection & Fleet Logistics:** Tracking daily route schedules, vehicle licensing, crew rosters, and net payload tonnage.
- **Treatment & Material Recovery:** Monitoring biological composting efficiency, Refuse-Derived Fuel (RDF) briquette production, and material recovery facilities (MRF).
- **Recycling Operations:** Ensuring secondary reprocessing units function at safe capacities and optimal recycling conversion ratios.
- **Sanitary Landfill Airspace Management:** Calculating consumed versus remaining safe engineered airspace and issuing proactive alerts before landfill crisis points are reached.

This digital system connects all these operational stages into one cohesive platform.

---

## 4. Problem Statement
Municipal authorities frequently encounter systemic operational breakdowns due to:
1. **Manual Record Inaccuracies:** Field supervisors log collections on paper manifests, leading to transcription errors and lost records.
2. **Delayed Fleet Visibility:** Municipal administrators cannot ascertain in real time which collection points were cleared, which vehicles are on transit, and which routes experienced cancellations.
3. **Lack of Conversion Metrics:** Composting and Material Recovery Facilities fail to track output yields versus input mass, obscuring plant operating efficiency.
4. **Catastrophic Landfill Saturation:** Unmonitored disposal grounds often surpass safe structural tipping limits before alerts are raised, causing environmental hazards and fires.
5. **Inefficient Reporting:** Aggregating monthly or annual waste characterization data for state pollution control boards requires weeks of tedious manual collation.

---

## 5. Existing System vs. Proposed System

| Dimension | Existing Manual System | Proposed Digital Tracking System |
|---|---|---|
| **Data Capture** | Paper logbooks and physical ledger entries | Web forms with automated validation and database persistence |
| **Fleet Monitoring** | Verbal telephone checks with drivers | Real-time collection manifest tracking vehicle, crew, and load |
| **Calculations** | Manual arithmetic prone to error | Dynamic MongoDB aggregations and formula-driven computations |
| **Landfill Tracking** | Infrequent surveying, no early warning | Automated airspace calculation with 4 warning levels (<60%, 60-80%, 80-90%, >90%) |
| **Access Control** | Ledger easily accessible or misplaced | JWT-secured role-based authorization (Admin / Staff) |
| **Audit & Reports** | Days needed to compile data | One-click instant reports with CSV export and print styles |
| **Information Retrieval** | Flipping through filing cabinets | Unified global query search across all 5 municipal modules |

---

## 6. Objectives
- Establish an end-to-end digital audit trail for all municipal waste handling activities.
- Provide a single administrative dashboard delivering instant operational metrics (total collected, segregated, processed, recycled, landfilled).
- Automate key performance calculations:
  - Waste processing efficiency percentage.
  - Secondary recycling conversion rates.
  - Landfill remaining capacity and threshold warning status.
- Implement strict Role-Based Access Control (RBAC) to ensure administrative integrity and field-staff accountability.
- Provide automated reporting capabilities with date-range filters, print stylesheets, and CSV exports.

---

## 7. Scope
The application encompasses:
- Ward transfer stations and segregation depots.
- Primary and secondary collection vehicle dispatches.
- Municipal bio-composting and Material Recovery Facilities.
- Authorized circular recycling facilities.
- Municipal sanitary landfill repositories.
- Municipal administrative and sanitation staff accounts.

*Excluded out of scope for this college implementation: Hardware IoT weight-sensor integration, live vehicle GPS satellite trackers, and payment gateways.*

---

## 8. Functional Requirements
1. **User Authentication & Authorization:**
   - Secure login using email and password.
   - Salted password hashing with bcrypt.
   - JWT token generation with expiration.
   - Role-specific access (Admin can manage users and delete data; Staff can create and edit records).
2. **Waste Segregation Management:**
   - Log sorting batches with unique ID (SEG-xxxx), collection depot, date, waste category, quantity, unit, status, and officer name.
   - Full CRUD support with search, filtering, and pagination.
3. **Waste Collection Logistics:**
   - Log vehicle trips with unique ID (COL-xxxx), collection point, municipal zone, vehicle registration number, driver and collector crew, payload tonnage, and status (Scheduled, In Progress, Completed, Cancelled).
4. **Waste Processing Module:**
   - Log conversion batches with unique ID (PRC-xxxx), facility, method (Composting, MRF, Recycling, Treatment), input tonnage, output tonnage, and product type.
   - Automatically compute Processing Efficiency: `(Output / Input) * 100`.
5. **Recycling Plant Module:**
   - Register recycling facilities with unique ID (RPL-xxxx), location, primary waste stream, design daily capacity, input feedstock, and recycled yield.
   - Automatically compute Recycling Rate and Plant Capacity Utilization.
6. **Landfill Management Module:**
   - Monitor disposal repositories with unique ID (LNF-xxxx), engineered total capacity, cumulative used capacity, daily inflow, and remaining safe capacity.
   - Dynamic threshold warnings:
     - Normal (`< 60%`)
     - Moderate (`60% – 80%`)
     - High (`80% – 90%`)
     - Critical (`> 90%`)
7. **Unified Search & Retrieval:**
   - Search across all 5 stages in a single query by keyword, category, status, or date.
8. **Reporting & Analytics:**
   - Generate Daily Flow, Monthly Analysis, Waste Characterization, Recycling Efficiency, Landfill Airspace, and Fleet Completion Performance reports.
   - Export report data to formatted CSV files.
   - Print-friendly layout matching municipal audit standards.
9. **User Management:**
   - Admin-only module to provision new staff, assign roles, and deactivate accounts.

---

## 9. Non-Functional Requirements
- **Performance:** Sub-second response times for typical database queries and dashboard aggregations.
- **Reliability:** Graceful error handling prevents application crashes from database or network interruptions.
- **Usability:** Responsive UI built with Tailwind CSS, supporting desktop, laptop, tablet, and mobile displays.
- **Maintainability:** Modular component hierarchy in React and controller-service-route separation in Express.
- **Portability:** Easy deployment on local Windows systems using standard Node.js and MongoDB.

---

## 10. User Roles & Access Matrix

| Feature / Page | ADMIN Role | MUNICIPAL STAFF Role |
|---|:---:|:---:|
| User Login & Profile |  Yes |  Yes |
| Dashboard & Analytics |  Yes |  Yes |
| View Segregation / Collection / Processing / Recycling / Landfill |  Yes |  Yes |
| Create Records across all modules |  Yes |  Yes |
| Update Records across all modules |  Yes |  Yes |
| Delete Records across modules |  Yes |  No |
| Generate & Export Reports |  Yes |  Yes |
| Unified Global Search |  Yes |  Yes |
| User Provisioning & Account Management |  Yes |  No (Blocked) |
| System Settings Telemetry |  Yes |  Yes |

---

## 11. System Architecture

```text
+-----------------------------------------------------------+
|                      Client Layer                         |
|  React.js (Vite) + Tailwind CSS + Recharts + Lucide Icons |
+-----------------------------------------------------------+
                             │
                  HTTP/JSON (REST API)
                  Axios + JWT Bearer
                             ▼
+-----------------------------------------------------------+
|                     API Gateway                           |
|       Express.js + CORS + Helmet + Morgan Logger          |
+-----------------------------------------------------------+
                             │
                             ▼
+-----------------------------------------------------------+
|                   Middleware Layer                        |
|       JWT Authentication & Role Authorization (RBAC)      |
|              Centralized Error Handling                   |
+-----------------------------------------------------------+
                             │
                             ▼
+-----------------------------------------------------------+
|                  Controllers Layer                        |
|   authController, segregationController, collectionCtrl,  |
|   processingCtrl, recyclingCtrl, landfillCtrl,            |
|   dashboardCtrl (Aggregations), reportsCtrl, searchCtrl   |
+-----------------------------------------------------------+
                             │
                             ▼
+-----------------------------------------------------------+
|                     Data Layer                            |
|             Mongoose Object Data Modeling (ODM)           |
+-----------------------------------------------------------+
                             │
                             ▼
+-----------------------------------------------------------+
|                   Database Storage                        |
|         MongoDB (Local Community or MongoDB Atlas)        |
+-----------------------------------------------------------+
```

---

## 12. Technology Stack Justification
- **React.js (v18):** Declarative component architecture allows modular reuse of tables, modals, badges, and form controls. Fast virtual DOM updates deliver instant dashboard reactivity.
- **Vite:** Next-generation build tool providing near-instantaneous hot module replacement (HMR) and optimized minified production builds.
- **Node.js & Express.js:** Asynchronous, non-blocking I/O ideal for handling multiple concurrent telemetry updates and data retrieval operations.
- **MongoDB & Mongoose:** Flexible document model accommodating varying municipal record schemas without rigid migration bottlenecks. Powerful aggregation pipeline enables efficient server-side metric computation.
- **Tailwind CSS:** Utility-first CSS framework delivering an uncluttered, modern municipal theme without stylesheet bloat.
- **Recharts:** Highly responsive, SVG-based charting library tailored for React, supporting clear data visualization for academic presentation.

---

## 13. Database Schema Design

### 13.1 User Schema (`users`)
- `name` (String, required)
- `email` (String, required, unique, indexed)
- `password` (String, required, hashed via bcrypt)
- `role` (String, enum: `['ADMIN', 'MUNICIPAL STAFF']`)
- `department` (String)
- `phone` (String)
- `isActive` (Boolean, default: true)
- `timestamps` (createdAt, updatedAt)

### 13.2 Waste Segregation Schema (`wastesegregations`)
- `recordId` (String, unique, e.g. `SEG-1001`)
- `collectionPoint` (String, required)
- `date` (Date, default: Date.now)
- `wasteType` (String, enum: `['Organic', 'Plastic', 'Paper', 'Glass', 'Metal', 'E-Waste', 'Other']`)
- `quantity` (Number, required, positive)
- `unit` (String, enum: `['kg', 'tons']`)
- `status` (String, enum: `['Pending', 'In Progress', 'Completed']`)
- `segregatedBy` (String, required)
- `remarks` (String)
- `createdBy` (ObjectId ref User)
- `timestamps`

### 13.3 Waste Collection Schema (`wastecollections`)
- `collectionId` (String, unique, e.g. `COL-1001`)
- `collectionPoint` (String, required)
- `area` (String, required)
- `date` (Date, required)
- `time` (String, required)
- `wasteType` (String, required)
- `quantity` (Number, required, positive)
- `unit` (String, default: `'tons'`)
- `vehicleNumber` (String, required)
- `driverName` (String, required)
- `collectorName` (String, required)
- `status` (String, enum: `['Scheduled', 'In Progress', 'Completed', 'Cancelled']`)
- `remarks` (String)
- `createdBy` (ObjectId ref User)
- `timestamps`

### 13.4 Waste Processing Schema (`wasteprocessings`)
- `processingId` (String, unique, e.g. `PRC-1001`)
- `wasteSource` (String, required)
- `processingFacility` (String, required)
- `wasteType` (String, required)
- `inputQuantity` (Number, required, > 0)
- `processedQuantity` (Number, required, >= 0)
- `processingDate` (Date, required)
- `processingMethod` (String, enum: `['Composting', 'Material Recovery', 'Recycling', 'Treatment', 'Other']`)
- `outputType` (String, required)
- `efficiency` (Number, auto-computed: `(processedQuantity / inputQuantity) * 100`)
- `status` (String, enum: `['Pending', 'Processing', 'Completed']`)
- `remarks` (String)
- `createdBy` (ObjectId ref User)
- `timestamps`

### 13.5 Recycling Plant Schema (`recyclingplants`)
- `plantId` (String, unique, e.g. `RPL-1001`)
- `plantName` (String, required)
- `location` (String, required)
- `wasteType` (String, required)
- `inputQuantity` (Number, >= 0)
- `recycledQuantity` (Number, >= 0)
- `processingDate` (Date, required)
- `capacity` (Number, required, > 0)
- `utilization` (Number, auto-computed: `(inputQuantity / capacity) * 100`)
- `recyclingRate` (Number, auto-computed: `(recycledQuantity / inputQuantity) * 100`)
- `operationalStatus` (String, enum: `['Operational', 'Maintenance', 'Temporarily Closed']`)
- `remarks` (String)
- `createdBy` (ObjectId ref User)
- `timestamps`

### 13.6 Landfill Schema (`landfills`)
- `landfillId` (String, unique, e.g. `LNF-1001`)
- `landfillName` (String, required)
- `location` (String, required)
- `capacity` (Number, required, total engineered tons)
- `usedCapacity` (Number, required, current filled tons)
- `remainingCapacity` (Number, auto-computed: `capacity - usedCapacity`)
- `wasteReceived` (Number, daily inflow tons)
- `wasteType` (String)
- `date` (Date, required)
- `utilizationPercentage` (Number, auto-computed: `(usedCapacity / capacity) * 100`)
- `warningLevel` (String, auto-computed: `Normal | Moderate | High | Critical`)
- `operationalStatus` (String, enum: `['Operational', 'Maintenance', 'Temporarily Closed']`)
- `remarks` (String)
- `createdBy` (ObjectId ref User)
- `timestamps`

---

## 14. Key Calculations & MongoDB Aggregations

### 14.1 Total Waste Collected
$$\text{Total Collected} = \sum (\text{WasteCollection}.\text{quantity})$$

### 14.2 Processing Efficiency
$$\text{Efficiency} = \left( \frac{\text{Processed Quantity}}{\text{Input Quantity}} \right) \times 100$$

### 14.3 Circular Recycling Rate
$$\text{Recycling Rate} = \left( \frac{\text{Recycled Output Yield}}{\text{Input Feedstock}} \right) \times 100$$

### 14.4 Landfill Airspace Utilization & Remaining Life
$$\text{Remaining Airspace} = \text{Capacity} - \text{Used Capacity}$$
$$\text{Utilization Percentage} = \left( \frac{\text{Used Capacity}}{\text{Capacity}} \right) \times 100$$

---

## 15. Security Measures
1. **Bcrypt Password Salted Hashing:** User passwords are never stored in plaintext. Each password undergoes 10 salt rounds before database insertion.
2. **Stateless JWT Tokens:** Authentication tokens are cryptographically signed using a secure secret key and expire automatically after a set duration.
3. **Role Authorization Middleware:** Express route middleware checks user role before allowing deletion or administrative operations.
4. **Input Sanitization & Mongoose Validation:** Prevents negative numbers, invalid email formats, and logic violations (e.g. processed volume exceeding input volume).
5. **Helmet Security Headers:** Defends against clickjacking, cross-site scripting (XSS), and MIME sniffing.

---

## 16. Verification & Testing

### 16.1 Unit & Integration Testing
- **Auth Testing:** Verified login with valid admin/staff credentials, rejected invalid passwords, verified token expiry and unauthorized route rejection.
- **CRUD Operations:** Tested Add, Read, Update, Delete for all 5 operational modules.
- **Calculation Verification:** Verified that landfill remaining capacity dynamically reflects `capacity - usedCapacity` and warning tags adjust appropriately.
- **Search Verification:** Tested global query across collections using vehicle licenses, depot names, and record IDs.
- **Reporting & Export Testing:** Verified generation of CSV downloads and tested browser print stylesheets.

---

## 17. Future Enhancements
1. **IoT Weighbridge Integration:** Connect digital weighbridge scales directly to the REST API for automatic payload transmission.
2. **GPS Fleet Telematics:** Integrate real-time GPS tracking devices on municipal collection vehicles to visualize live route maps.
3. **Citizen Reporting Mobile App:** Enable public reporting of uncollected street waste with photo upload and geotagging.
4. **Predictive AI Waste Forecasting:** Forecast upcoming seasonal waste spikes using historical time-series modeling.

---

## 18. Conclusion
The **Digital Tracking System for Municipal Waste Management** successfully replaces fragmented, manual municipal records with a robust, centralized MERN-stack platform. By streamlining data collection across segregation, transport, recovery, and landfill disposal, the system enhances transparency, accountability, and environmental compliance for municipal corporations.
