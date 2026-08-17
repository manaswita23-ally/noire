# NOIRÉ — A Curated Full-Stack E-Commerce Boutique

NOIRÉ is a full-stack MERN e-commerce application built as a premium digital boutique — editorial
collections, mood-based discovery, smart recommendations, wishlist, cart, checkout, order tracking,
and a full role-based admin dashboard with real analytics.

---

## 1. Project Overview

- **Frontend:** React + Vite + Tailwind CSS + Framer Motion + React Router + Axios
- **Backend:** Node.js + Express + MongoDB + Mongoose
- **Auth:** JWT + bcrypt password hashing, role-based (user/admin) authorization
- Frontend talks to the backend exclusively via REST APIs — no hardcoded/faked data once the DB is seeded.

## 2. Features

- Curated collections (Midnight Essentials, Workday Minimal, Weekend Escape, Under ₹999, Trending Now, New Arrivals, Editor's Choice)
- Shop by Mood discovery (Minimal, Bold, Calm, Executive, Weekend, Luxury, Tech, Everyday)
- "Complete the Look" & "You May Also Like" recommendations (metadata-based, no external AI API)
- Recently Viewed (DB for logged-in users, localStorage for guests)
- Wishlist, guest cart with login-merge into DB cart
- Multi-step checkout with simulated payments (COD / Demo Card / UPI Demo)
- Animated order tracking timeline
- Full admin dashboard: products, orders, customers, collections, real analytics (no hardcoded numbers)
- Responsive, accessible, SEO-friendly (clean slugs, meta tags)

## 3. Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, React Router, Axios |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB |
| Auth | JWT, bcryptjs |

## 4. Architecture

```
Frontend (React/Vite) → REST API (Express) → MongoDB (Mongoose models)
```

## 5. Folder Structure

```
noire/
├── server/
│   ├── controllers/   # business logic
│   ├── models/        # Mongoose schemas (User, Product, Order, Review, Collection)
│   ├── routes/        # Express routers
│   ├── middleware/    # auth, admin, error handling
│   ├── utils/         # response helpers, JWT
│   ├── seed/           # seed.js — realistic demo data
│   └── server.js
└── client/
    └── src/
        ├── components/  # Navbar, Footer, ProductCard, ProductGrid, ProtectedRoute
        ├── pages/        # storefront pages + pages/admin
        ├── context/      # AuthContext, CartContext
        ├── services/     # api.js (axios instance)
        └── utils/        # formatters
```

## 6. Environment Setup

**Backend** — copy `server/.env.example` to `server/.env` and fill in:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/noire
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@noire.demo
ADMIN_PASSWORD=Admin@123
```

**Frontend** — copy `client/.env.example` to `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## 7. Installation

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

## 8. Database Setup

Install MongoDB locally, or use a free MongoDB Atlas cluster and put the connection string in
`MONGO_URI`.

## 9. Seed Instructions

```bash
cd server
npm run seed
```

This creates: 1 admin user, 1 demo customer (with a saved address, a delivered order, and a review),
30 realistic products, 7 collections, and their mood/collection associations.

## 10. Running the Backend

```bash
cd server
npm run dev      # nodemon, auto-restarts on change
# or
npm start
```

Runs on `http://localhost:5000`. Health check: `GET /api/health`.

## 11. Running the Frontend

```bash
cd client
npm run dev
```

Runs on `http://localhost:5173`.

## 12. API Documentation (summary)

All responses follow:
```json
{ "success": true, "data": { } }
{ "success": false, "message": "..." }
```

| Method | Route | Auth |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | User |
| GET | /api/products | Public (search/filter/sort/paginate) |
| GET | /api/products/:id | Public |
| GET | /api/products/:id/recommendations | Public |
| POST/PUT/DELETE | /api/products(/:id) | Admin |
| GET | /api/products/meta/facets | Public |
| GET/POST | /api/products/:id/reviews | Public / User |
| GET | /api/collections | Public |
| GET | /api/collections/:slug | Public |
| POST/PUT/DELETE | /api/collections(/:id) | Admin |
| GET/POST/PUT/DELETE | /api/cart | User |
| POST | /api/orders | User |
| GET | /api/orders | User (own orders) |
| GET | /api/orders/:id | User (own) / Admin |
| GET | /api/orders/admin/all | Admin |
| PUT | /api/orders/:id/status | Admin |
| GET/POST | /api/users/wishlist | User |
| GET/POST | /api/users/recently-viewed | User |
| PUT | /api/users/profile | User |
| POST/DELETE | /api/users/addresses | User |
| GET | /api/admin/users | Admin |
| PUT | /api/admin/users/:id/role | Admin |
| PUT | /api/admin/users/:id/status | Admin |
| GET | /api/admin/analytics/* | Admin |

## 13. Demo Credentials

```
Admin:  admin@noire.demo / Admin@123   (or whatever you set in ADMIN_EMAIL / ADMIN_PASSWORD)
Demo:   demo@noire.demo  / Demo@123
```

## 14. Future Improvements

- Real payment gateway integration (Razorpay/Stripe) in place of the simulated payment flow
- Image upload to cloud storage (Cloudinary/S3) instead of external image URLs
- Server-side pagination for the admin product/order tables with virtualized rendering
- Email notifications on order status change
- Unit/integration test suite (Jest + Supertest for API, React Testing Library for UI)
- Redis caching for product facets/recommendations at scale
