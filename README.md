# 🎉 EventHub — Campus Event Planning & Management System

<p align="center">
  <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80" alt="EventHub Banner" width="100%" style="border-radius: 12px; max-height: 380px; object-fit: cover;" />
</p>

<p align="center">
  <strong>A Modern Full-Stack MERN Platform for Campus Events, Ticket Registrations, and Real-Time Analytics</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Local-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</p>

---

## 👥 Project Team & Contributors

| No. | Student / Contributor Name | Role & Contribution |
|:---:|:---|:---|
| 1 | **Annu Maurya** | Frontend Architecture, UI/UX Glassmorphism & Responsive Design |
| 2 | **Aanchal Pandey** | Backend REST APIs, JWT Authentication & Database Schemas |
| 3 | **Krishna Ojha** | Data Analytics, Visual Graphs, Documentation & QA Testing |
| 4 | **Priyanshu Kumar Maurya** | Full-Stack Integration, Deployment & Optimization |

---

## 🌟 Key Features

### 👤 Student & Attendee Experience
- **🎯 Discover Campus Events:** Browse hackathons, cultural festivals, sports leagues, entrepreneur summits, and workshops with instant search and category filters.
- **🛡️ Strict Participation Security:** Only authenticated students can register; registration dynamically links verified student details (Name, College, Email, Phone).
- **⚡ 1-Click Instant Booking:** Direct seat booking with real-time seat decrement and prevention of duplicate registrations.
- **📱 100% Mobile Responsive:** Optimized Glassmorphism UI across phones, tablets, and desktops.
- **📸 Smart Image CDN & Fallbacks:** Supports external image URLs (Instagram CDN, Unsplash, Imgur) with automatic high-res fallback visuals.
- **🗓️ Smart Date Validation:** Past dates are automatically disabled; only valid future dates and times are allowed for new events.
- **✏️ Event Editing:** Organizers can update event title, timings, venue, seat count, and pricing anytime.

### 🛡️ Administrator Control Center (`/admin`)
- **📊 Visual Graphs & Data Analytics:**
  - **Registrations vs Capacity Bar Graph:** Dual-track animated bars comparing enrolled attendees against maximum venue limits.
  - **Category Share SVG Donut Chart:** Interactive zero-dependency SVG donut graphic with category color-coding and percentage breakdown.
  - **Category Revenue Breakdown:** Real-time financial collection tracking in Indian Rupees (₹).
  - **Ticketing & Pricing Dynamics:** Comparative analysis of Free vs Paid events and average attendance yield.
- **📋 Registered Attendees Directory:** Live attendee lists per event with student names, emails, colleges, and contact numbers.
- **📥 CSV / Excel Export:** 1-click download of attendee rosters for on-ground gate checks and certificates.
- **👑 1-Click Demo Login:** Dedicated `👑 Admin Demo` and `👤 Student Demo` buttons on `/login` for immediate examiner demonstrations.

### 🔐 Security & Engineering Highlights
- **JWT (JSON Web Token) Security with 30-day session expiry**
- **bcryptjs Salted Password Hashing**
- **Role-Based Access Control (`admin` vs `user`)**
- **Express 5.2 Async Error Boundaries & MongoDB Auto-Reconnect**

---

## 📁 Project Architecture

```
Event-Planning-System/
├── frontend/                     # React + Vite Client
│   ├── src/
│   │   ├── components/           # Navbar, EventCard, CategoryFilter, Footer
│   │   ├── context/              # AuthContext (JWT & User Session State)
│   │   ├── pages/                # Home, Events, EventDetail, CreateEvent, Dashboard, Login, Signup, AdminDashboard
│   │   ├── services/             # api.js (Central API layer with Bearer token injection)
│   │   ├── App.jsx               # App routes & Auth Provider
│   │   └── index.css             # Glassmorphism Design Tokens & Utilities
│   └── package.json
│
├── backend/                      # Node.js + Express + MongoDB Server
│   ├── middleware/               # auth.js (JWT verify & Admin guard)
│   ├── models/                   # User.js, Event.js (with registeredUsers sub-schema)
│   ├── routes/                   # authRoutes.js, eventRoutes.js
│   ├── seed.js                   # Pre-populates DB with Admin, Students & Events
│   ├── server.js                 # Express Application Entry Point
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v16+)
- MongoDB (Running locally on `mongodb://localhost:27017` or MongoDB Atlas URI)

---

### 1️⃣ Backend Setup
```bash
cd backend
npm install

# (Optional) Seed the database with sample Admin, Students, and Events:
node seed.js

# Start the Backend Server:
node server.js
```
> Server runs on: `http://localhost:5000`

---

### 2️⃣ Frontend Setup
```bash
cd frontend
npm install

# Start the Vite Dev Server:
npm run dev
```
> Client runs on: `http://localhost:5173`

---

## 🔑 Default Test Accounts (From `seed.js`)

| Role | Email | Password | Access Level |
|---|---|---|---|
| 👑 **Administrator** | `admin@eventhub.com` | `admin123` | Full Admin Dashboard (`/admin`), Delete Events, Attendee Directory, CSV Export |
| 👤 **Student User** | `rahul@nsut.ac.in` | `user123` | Register for Events, My Registrations, Create Events |

*(Login page includes 1-Click Demo Buttons for instant testing)*

---

## 📡 REST API Endpoints

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new student or organizer account | Public |
| `POST` | `/api/auth/login` | Authenticate user & receive signed JWT | Public |
| `GET` | `/api/auth/me` | Fetch active user profile from session | Protected (JWT) |
| `GET` | `/api/auth/users` | List all registered accounts & roles | Admin Only |
| `GET` | `/api/auth/admin-stats` | High-level metrics & analytics counts | Admin Only |

### 🎪 Events (`/api/events`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/events` | List all events (`?search=`, `?category=`, `?sort=`) | Public |
| `GET` | `/api/events/:id` | Get comprehensive details of an event | Public |
| `POST` | `/api/events` | Create new event with date/seat constraints | Protected (JWT) |
| `PUT` | `/api/events/:id` | Edit event details, timings, seats, or pricing | Organizer/Admin |
| `DELETE` | `/api/events/:id` | Remove event from database | Organizer/Admin |
| `POST` | `/api/events/:id/register` | Register student for event & decrement seats | Student (JWT) |
| `POST` | `/api/events/:id/unregister` | Cancel registration & restore seats | Student (JWT) |
| `GET` | `/api/events/user/registered` | List events booked by current user | Protected (JWT) |
| `GET` | `/api/events/user/created` | List events organized by current user | Protected (JWT) |

---

## 📊 Data Visualization & Graph Highlights

- **Dual-Track Capacity Graph:** Real-time visual comparison of enrolled attendees against maximum venue limits with `% Full` badges.
- **SVG Donut Chart:** Zero-dependency, pure SVG slice projection with dynamic circumference mapping for category distribution.
- **Ticket Yield Metrics:** Detailed breakdown of revenue generated across free and paid campus events.
- **Dynamic Leaderboard:** Auto-sorts events by occupancy rate to highlight trending campus activities.

---

## 📄 College Project Submission & Report
The repository includes a ready-to-print **55+ page formal academic project report** covering:
- **System Architecture & Data Flow Diagrams:** Context Diagram, DFD Level 0, Level 1, Level 2
- **Database Schema & ER Diagrams:** Detailed Entity Relationship design with foreign references
- **Component Hierarchy:** React Router tree and AuthContext state propagation
- **Comprehensive Test Cases:** Unit, integration, security, and edge-case test matrices
- **Step-by-Step UI Walkthrough:** Explanations and layout breakdowns for every screen
- 📁 **Download PDF:** `Event_Planning_System_College_Project_Report.pdf` (Included in repository root)
- 🌐 **HTML Version:** `college_project_report.html` (Standalone, printable in browser)

---

## 🎓 Academic Submission Details
- **Project Name:** Event Planning & Management System (EventHub)
- **Tech Stack:** MERN (MongoDB, Express.js, React 19, Node.js) + Vite + CSS3 Glassmorphism
- **Repository:** [https://github.com/Priyanshu-kumar-maurya/Event-Planning-System-](https://github.com/Priyanshu-kumar-maurya/Event-Planning-System-)

---

## 📄 License
This project is open-source and developed for academic and campus management purposes under the [MIT License](LICENSE).
