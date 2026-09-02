# EventHub — Event Ticket Booking System

Full-stack event booking application with customer ticketing, visual seat selection, cancellation/release handling, and a protected admin workspace.

## Stack

- Frontend: React, Vite, React Router, Axios, responsive CSS
- Backend: Node.js, Express, MongoDB/Mongoose, JWT, bcrypt

## Run locally

1. Create `Back-end/.env` from `Back-end/.env.example` and set a reachable MongoDB database and long JWT secret.
2. Install and start the API:

   ```powershell
   cd Back-end
   npm install
   npm run dev
   ```

3. Create `Front-end/.env` from `Front-end/.env.example`, then run the UI:

   ```powershell
   cd Front-end
   npm install
   npm run dev
   ```

Open `http://localhost:5173`. The API defaults to `http://localhost:5000`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Long random secret used to sign access tokens |
| `PORT` | No | API port; defaults to `5000` |
| `CLIENT_URL` | No | Browser origin allowed by CORS; defaults to Vite's local URL |
| `VITE_API_URL` | No | Browser API base URL; defaults to local API `/api` |

## First admin account

Public registration always creates a regular user. After configuring MongoDB, run:

```powershell
cd Back-end
node scripts/createAdmin.js "Admin Name" admin@example.com "a-secure-password"
```

The script creates or promotes that email to the `admin` role.

## API

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Register a user |
| POST | `/api/auth/login` | Public | Receive JWT and profile |
| GET | `/api/events` | Public | List events (`?upcoming=true` supported) |
| GET | `/api/events/:id` | Public | Event details and seat map |
| POST/PUT/DELETE | `/api/events/:id?` | Admin | Create, edit, delete events |
| POST | `/api/bookings` | Authenticated | Book `{ eventId, seats }` |
| GET | `/api/bookings/my` | Authenticated | Current user's bookings |
| GET | `/api/bookings/:id` | Owner/Admin | Ticket details |
| PUT | `/api/bookings/:id/cancel` | Owner/Admin | Cancel and release seats |
| GET | `/api/admin/dashboard` | Admin | Dashboard statistics/recent bookings |
| GET | `/api/admin/events` | Admin | Event list |
| GET | `/api/admin/bookings` | Admin | Booking list with search/filter inputs |
| GET | `/api/admin/users` | Admin | Customers and booking summaries |

Authenticated endpoints require `Authorization: Bearer <token>`.

## Models and booking safety

- `User`: name, unique email, bcrypt password hash, role, timestamps.
- `Event`: presentation details, price, seat capacity, current availability, and booked seat IDs.
- `Booking`: user/event references, seat IDs, amount, confirmed/cancelled status, booking and cancellation dates.

The booking endpoint validates every seat against the generated event seat map and atomically reserves event seats only when every requested seat remains free. The booking collection also has a partial unique compound index for confirmed event seats. On cancellation, the booking becomes `Cancelled`, its seat IDs are removed from the event’s booked list, and availability is incremented. This makes the released seats immediately selectable and keeps them out of active bookings and revenue totals.

## Verification performed

- Backend JavaScript syntax checked with Node.
- Production frontend build completed successfully with Vite.
- The API health endpoint was started and returned successfully.

End-to-end database tests require a valid `MONGO_URI`; configure one before testing registration, booking, cancellation, and admin flows.
