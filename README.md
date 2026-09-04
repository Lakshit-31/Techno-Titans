# EventHub — Full-Stack Movie & Event Ticketing Platform

EventHub is a BookMyShow-style full-stack event and movie ticket booking web application. It features a clean, light-themed, content-first user interface, RESTful backend APIs with OpenAPI 3.0 Swagger documentation, local MongoDB database support viewable in MongoDB Compass, and role-based access control for **User**, **Organiser** (with Admin approval workflow), and **Admin**.

---

## 🏗️ Monorepo Structure

```text
EventHub/
├── back-end/               # Node.js + Express + Mongoose + Swagger API Backend
│   ├── src/
│   │   ├── config/         # Database & Swagger OpenAPI setup
│   │   ├── controllers/    # Auth, Event, Showtime, Booking, Review, Admin, Category controllers
│   │   ├── middleware/     # JWT protection, RBAC & Organiser approval middlewares
│   │   ├── models/         # Mongoose Schemas (User, Event, Showtime, Booking, Category, Review)
│   │   ├── routes/         # Annotated Express API routes
│   │   ├── seed.js         # Database seeding script
│   │   └── server.js       # Express server entry point
│   ├── package.json
│   └── .env
└── front-end/              # React (Vite) + Tailwind CSS Frontend
    ├── src/
    │   ├── components/     # Navbar, Footer, EventCard, ProtectedRoute
    │   ├── context/        # AuthContext & BookingContext
    │   ├── pages/          # Home, SearchListing, EventDetails, Checkout, Confirmation, Profile, Dashboards
    │   ├── services/       # Axios API client
    │   └── App.jsx
    ├── package.json
    └── vite.config.js
```

---

## 🛠️ Tech Stack & Features

- **Frontend**: React (Vite), React Router v6, Axios, Tailwind CSS (light-themed #F7F7F8 background, solid red #DC2626 accent).
- **Backend**: Node.js, Express.js REST API.
- **Database**: MongoDB local instance (`mongodb://localhost:27017/eventhub`), accessed via Mongoose ODM and inspectable in **MongoDB Compass**.
- **Interactive API Docs**: Swagger OpenAPI 3.0 served live at **`http://localhost:5000/api/docs`**.
- **Authentication & RBAC**: JWT Bearer token authentication, bcrypt password hashing, Organiser Approval workflow (`PENDING` -> `APPROVED`).
- **Ticketing & Checkout**: Showtimes selection, atomic seat reservation, dummy payment simulation, e-ticket pass with `bookingRef`.

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- Node.js (v18+ recommended)
- Local MongoDB running on port 27017 (or **MongoDB Compass** installed)

### 2. Install Dependencies

```bash
# Install backend dependencies
cd back-end
npm install

# Install frontend dependencies
cd ../front-end
npm install
```

### 3. Seed the Database
Run the database seed script to populate Categories, Admin, Organisers, Sample Movies & Events, Showtimes, and Bookings:

```bash
cd back-end
npm run seed
```

View the database in **MongoDB Compass** by connecting to:
`mongodb://localhost:27017/eventhub`

### 4. Start the Application Servers

```bash
# Start Backend Server (runs on http://localhost:5000)
cd back-end
npm run dev

# In a new terminal, start Frontend Dev Server (runs on http://localhost:3000)
cd front-end
npm run dev
```

---

## 📄 Interactive Swagger Documentation
Open your browser and navigate to:
👉 **`http://localhost:5000/api/docs`**

You can test all endpoints directly using the **Authorize** button by pasting your JWT Bearer token.

---

## 🔑 Pre-seeded Demo Login Accounts

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@eventhub.com` | `admin123` | Full access, platform stats, approve/reject pending organisers, feature banners. |
| **Approved Organiser** | `organiser@pvr.com` | `organiser123` | Publish events & movies, create showtimes, manage own listings. |
| **Pending Organiser** | `apex@comedy.com` | `organiser123` | Needs Admin approval before events go live. |
| **Customer / User** | `rohan@example.com` | `user123` | Browse shows, select showtimes, book tickets, view e-tickets, cancel bookings. |
