# EchoHire

EchoHire is split into two apps:

- Frontend: `frontend/`
- Backend: `backend/`

## Prerequisites

Make sure these are available before setting up the project:

- Node.js 18+ and npm
- MongoDB running locally, or access to a MongoDB URI
- Homebrew on macOS if you want to install and run MongoDB locally with `brew services`

## Quick Start

### 1. Start MongoDB locally

The backend connects to a local MongoDB instance by default at `mongodb://127.0.0.1:27017/echohire`.

If you installed MongoDB with Homebrew, start it with:

```bash
brew services start mongodb/brew/mongodb-community
```

### 2. Run the backend

From `backend/`:

```bash
npm install
npm run dev
```

The API runs on port `5050` by default.

Health check:

```bash
curl http://127.0.0.1:5050/health
```

Optional environment variable:

- `MONGODB_URI` - override the local MongoDB connection string

### 3. Run the frontend

From `frontend/`:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

If the frontend cannot reach the API, add `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:5050` to `frontend/.env.local`.

## Project Guides

For feature-by-feature notes and file maps, read:

- `frontend/README.md` for the UI folder map and page structure
- `backend/src/` for the API routes, models, services, and middleware

## Notes

- The frontend is a Next.js app.
- The backend is an Express + TypeScript API using Mongoose.
- If you change the backend port, update your frontend API base URL to match.
