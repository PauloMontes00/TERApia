# TERApia — Project Commands

This file documents common commands for local development and database management.

Backend (API)
- Install dependencies:
  - `cd backend` then `npm install`
- Start dev server (TypeScript):
  - `npm run dev` (runs `ts-node-dev`)
- Build:
  - `npm run build`
- Start built app:
  - `npm run start`

Database
- Run DB initialization script (creates tables in `public` schema):
  - From project root (PowerShell):
    ```powershell
    $env:DB_NAME='postgis_36_sample'; $env:DB_USER='postgres'; $env:DB_PASSWORD='ADMIN'; node backend/run-db-init.js
    ```
  - Or set env vars in `.env` and run:
    ```powershell
    node backend/run-db-init.js
    ```
- Test DB connection and list public tables:
  - From project root:
    ```powershell
    node teste.cennectingDB
    ```
  - Or inside `backend`:
    ```powershell
    cd backend
    npm run db:test
    ```

Frontend
- Install dependencies:
  - `cd frontend` then `npm install`
- Start dev server (Vite):
  - `npm run dev` (default `http://localhost:5173`)

Repository
- Commit local changes:
  - `git add -A && git commit -m "Your message"`

Environment
- Example `.env` (root/backedn):
  - `DATABASE_URL=postgresql://postgres:ADMIN@localhost:5432/postgis_36_sample`
  - `JWT_SECRET=...`
  - `ENCRYPTION_KEY=...` (min ~32 chars)

Notes
- The project was refactored to use `pg` (node-postgres) instead of Prisma.
- SQL schema creation script: `backend/db-init.sql` (run once).
