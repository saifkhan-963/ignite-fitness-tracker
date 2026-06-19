# IGNITE - Claude Code Context

## What is IGNITE
A social running app where users run together remotely in real time.
Think "Spotify group session but for running."
Users in different cities join a live session and track each other's
pace, distance, and progress simultaneously.

## Tech Stack
- Backend: Django + Django REST Framework + SimpleJWT (Python)
- Frontend: React 19 + Tailwind CSS + Framer Motion
- Maps: Leaflet + React-Leaflet
- HTTP: Axios
- Database: SQLite (development) → PostgreSQL (production)
- Auth: JWT tokens

## Project Structure
ignite/
├── backend/
│   ├── backend/        # Django config (settings, urls)
│   ├── users/          # Users app (auth, profiles)
│   ├── manage.py
│   └── db.sqlite3
└── frontend/
    └── src/
        ├── App.js
        └── components/
            ├── auth/         # Auth.jsx - login/signup
            ├── dashboard/    # Dashboard.jsx - main user dashboard
            ├── home/         # LandingPage.jsx + sections
            ├── services/     # AuthService.js, apiservice.js
            └── contexts/     # React contexts

## What Is Built
- Landing page (LandingPage.jsx, Header.jsx, Hero.jsx)
- Full authentication system (Auth.jsx)
- JWT auth connected to Django backend
- Dashboard skeleton (just started)

## What Is NOT Built Yet
- Live run sessions
- Real-time GPS tracking
- Friend/invite system
- Live pace and distance comparison
- Map route tracking
- Chat during runs
- Run summary after completion

## Coding Rules
- Always use Tailwind for styling, never inline styles
- Keep components in their correct folders
- Backend API endpoints go in Django REST Framework views
- Always use AuthService.js for auth-related API calls
- Never hardcode API URLs, use environment variables
- When adding new features, create a new component folder
- Keep CLAUDE.md updated after every major feature added