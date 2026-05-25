# Leave Management System

A full-stack leave management app with role-based portals for Admin, HR, Manager, and Employee.

## Features

- Role-based dashboards and routes
- Leave requests with approval workflow
- Leave types, balances, and policies
- Holiday calendar and reports
- JWT auth and profile endpoints

## Tech Stack

- React + Vite + Tailwind CSS
- Node.js + Express + MongoDB (Mongoose)
- Axios for API calls, JWT for auth

## Project Structure

- Frontend: [src](src)
- Backend: [backend/src](backend/src)

## Getting Started

### 1) Install dependencies

```bash
npm install
npm install --prefix backend
```

### 2) Configure environment

Frontend (repo root .env):

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

Backend:

- Copy [backend/.env.example](backend/.env.example) to `backend/.env`
- Set `MONGODB_URI`, `JWT_SECRET`, and other values as needed

### 3) Seed demo data

```bash
npm run seed --prefix backend
```

### 4) Run dev servers

```bash
npm run dev:all
```

This starts:

- Frontend: http://localhost:5173
- Backend: http://localhost:8080/api

Alternatively, run them separately:

```bash
npm run dev
npm run dev:backend
```

## Scripts

Frontend (repo root):

- `npm run dev` - Start Vite
- `npm run dev:backend` - Start API only
- `npm run dev:all` - Start frontend and backend
- `npm run build` - Build frontend
- `npm run lint` - Lint frontend
- `npm run preview` - Preview frontend build

Backend:

- `npm run dev` - Start API with file watch
- `npm run start` - Start API
- `npm run seed` - Seed demo users

## API

Base URL: http://localhost:8080/api

- `POST /auth/login`
- `GET /auth/profile`
- `POST /auth/logout`

## Notes

- If the API is not available in dev, login falls back to a mock user based on the email role keyword (admin, hr, manager, employee).
- Vite also proxies `/api` to http://localhost:8080 for local development.
