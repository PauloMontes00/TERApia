-- DB initialization script to create tables corresponding to previous data models

BEGIN;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  name text NOT NULL,
  role text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  avatar text,
  bio text,
  crp text,
  specialties text[],
  "hourlyRate" numeric,
  rating numeric DEFAULT 0,
  availability jsonb
);

CREATE TABLE IF NOT EXISTS swipes (
  id uuid PRIMARY KEY,
  "fromId" uuid REFERENCES users(id) ON DELETE CASCADE,
  "toId" uuid REFERENCES users(id) ON DELETE CASCADE,
  direction text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  UNIQUE ("fromId", "toId")
);

CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY,
  "patientId" uuid REFERENCES users(id) ON DELETE CASCADE,
  "professionalId" uuid REFERENCES users(id) ON DELETE CASCADE,
  status text DEFAULT 'PENDING',
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  UNIQUE ("patientId", "professionalId")
);

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY,
  "patientId" uuid REFERENCES users(id) ON DELETE CASCADE,
  "professionalId" uuid REFERENCES users(id) ON DELETE CASCADE,
  "startTime" timestamptz NOT NULL,
  "endTime" timestamptz NOT NULL,
  status text DEFAULT 'SCHEDULED',
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS prontuarios (
  id uuid PRIMARY KEY,
  "professionalId" uuid REFERENCES users(id) ON DELETE CASCADE,
  "patientId" uuid REFERENCES users(id) ON DELETE CASCADE,
  content text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

-- Example of geographic column (if needed in the future) using PostGIS geometry
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS location geometry(Point, 4326);

COMMIT;
