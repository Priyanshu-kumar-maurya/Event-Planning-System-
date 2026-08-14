# 🎉 EventHub — Campus Event Planning & Management System

> A full-stack MERN (MongoDB, Express, React, Node.js) College Event Planning & Registration System featuring User Authentication, strict participation access control, real-time MongoDB attendee tracking, and a dedicated Administrator Control Center.

---

## 🌟 Key Features

### 👤 Student & User Experience
- **Discover Events:** Browse and search campus hackathons, fests, workshops, sports, and cultural events with dynamic category filtering.
- **Strict Participation Control:** Registration is strictly secured — only logged-in students can register for events.
- **1-Click Registration:** Auto-fills verified student credentials and updates seat capacity in real-time.
- **Personal Student Dashboard:** View and manage all registered events and organized events in one place.
- **Live Seat Availability:** Interactive progress bars showing live percentage of filled seats.

### 🛡️ Dedicated Admin Control Center (`/admin`)
- **Live MongoDB Analytics:** Real-time metrics for total events, total registrations, registered students, and revenue generated.
- **Event Inventory Management:** View, search, inspect, and delete events directly from MongoDB.
- **Registered Attendees Directory:** Select any event to view the full directory of registered students (Name, Email, College/Branch, Phone, Registration Timestamp).
- **📥 CSV / Excel Export:** 1-click export of attendee lists for organizers.
- **User Management Directory:** Overview of all accounts and roles on the platform.

### 🔐 Security & Architecture
- **JWT (JSON Web Token) Authentication**
- **bcryptjs Password Hashing**
- **Role-Based Authorization (Student vs Admin)**
- **Express REST API + Mongoose ODM**
- **Vanilla CSS Glassmorphism Design System**

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
- `POST /api/auth/register` — Register a new student/organizer
- `POST /api/auth/login` — Login user & return JWT token
- `GET  /api/auth/me` — Get current logged-in user (Protected)
- `GET  /api/auth/users` — Get all users (Admin only)
- `GET  /api/auth/admin-stats` — Get platform metrics (Admin only)

### 🎪 Events (`/api/events`)
- `GET    /api/events` — Get all events (supports `?category=`, `?search=`, `?sort=`)
- `GET    /api/events/:id` — Get single event by ID
- `POST   /api/events` — Create new event (Protected)
- `PUT    /api/events/:id` — Update event
- `DELETE /api/events/:id` — Delete event (Admin/Organizer)
- `POST   /api/events/:id/register` — Register user for event (Strictly Protected)
- `POST   /api/events/:id/unregister` — Unregister from event (Protected)
- `GET    /api/events/user/registered` — Get events registered by current user (Protected)
- `GET    /api/events/user/created` — Get events created by current user (Protected)

---

## 🎓 College Project Submission Info
- **Project Name:** Event Planning & Management System (EventHub)
- **Tech Stack:** React, Node.js, Express.js, MongoDB, JWT, Mongoose, CSS3 Glassmorphism
- **Repository:** https://github.com/Priyanshu-kumar-maurya/Event-Planning-System-
