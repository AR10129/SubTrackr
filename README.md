# SubTrackr

A full-stack subscription management application for tracking recurring payments and services.

## Features

- **User Authentication** - JWT-based signup/login
- **Subscription Management** - Create, read, update, delete subscriptions
- **Email Reminders** - Automated notifications before renewal dates
- **Rate Limiting** - Protection against spam and abuse
- **Modern UI** - Clean React dashboard with Tailwind CSS

## Tech Stack

**Backend:** Node.js, Express.js, MongoDB, JWT, Arcjet, Upstash, Nodemailer  
**Frontend:** React, Vite, Tailwind CSS, Axios

## Project Structure

```
├── backend/          # Express API server
│   ├── config/       # Environment & service configuration
│   ├── controllers/  # Route handlers
│   ├── database/     # MongoDB connection
│   ├── middlewares/  # Auth, rate limiting & error handling
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   └── utils/        # Email templates & helpers
│
├── frontend/         # React application
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
# Backend
cd backend
npm install
cp .env.example .env.development.local
npm run dev

# Frontend 
cd frontend
npm install
npm run dev
```

### Set Up Environment Variables

Create `backend/.env.development.local` with:

```env
# PORT
PORT=5500
SERVER_URL="http://localhost:5500"

# ENVIRONMENT
NODE_ENV=development

# DATABASE
DB_URI=

# JWT AUTH
JWT_SECRET=
JWT_EXPIRES_IN="1d"

# ARCJET
ARCJET_KEY=
ARCJET_ENV="development"

# UPSTASH
QSTASH_URL=http://127.0.0.1:8080
QSTASH_TOKEN=

# NODEMAILER
EMAIL_USER=
EMAIL_PASSWORD=
```

`DB_URI` and `JWT_SECRET` are required. Other services are optional.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/sign-up` | Register |
| POST | `/api/v1/auth/sign-in` | Login |
| GET | `/api/v1/subscriptions/user/:id` | Get user subscriptions |
| POST | `/api/v1/subscriptions` | Create subscription |
| GET | `/api/v1/subscriptions/:id` | Get subscription |
| PUT | `/api/v1/subscriptions/:id` | Update subscription |
| DELETE | `/api/v1/subscriptions/:id` | Delete subscription |
| PUT | `/api/v1/subscriptions/:id/cancel` | Cancel subscription |
