-- Initialize Neon Database for Local Development
-- This script runs automatically when postgres container starts

-- Create the main database
CREATE DATABASE neondb;

-- Create the role if it doesn't exist
DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'neondb_owner') THEN
      CREATE ROLE neondb_owner WITH LOGIN PASSWORD 'password';
   END IF;
END
$$;

-- Connect to the database and create user
\c neondb

-- Grant privileges to the role
GRANT ALL PRIVILEGES ON DATABASE neondb TO neondb_owner;

-- Create schema if needed
CREATE SCHEMA IF NOT EXISTS public;
GRANT ALL ON SCHEMA public TO neondb_owner;
