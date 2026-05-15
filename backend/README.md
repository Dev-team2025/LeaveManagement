# LMS Backend

This backend serves the React frontend at `VITE_API_BASE_URL=http://localhost:8080/api`.

## Setup

1) Create an env file:

- Copy `.env.example` to `.env`
- Set `MONGODB_URI` and `JWT_SECRET`

2) Install deps:

```bash
cd backend
npm install
```

3) Seed demo users (matches the login page):

```bash
npm run seed
```

4) Run API:

```bash
npm run dev
```

## Auth endpoints

- `POST /api/auth/login` → `{ token, user, role }`
- `GET /api/auth/profile` (Bearer token) → `{ user, role }`
- `POST /api/auth/logout` → `{ success: true }`

