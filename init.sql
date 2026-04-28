-- =============================================================
-- SWD Assignment 2 - database initialisation script
-- Creates the inventory_db schema with two related tables:
--   users (one) <--- has --- (many) appliances
-- Run with:
--   mysql -u root -p < init.sql
-- =============================================================

CREATE DATABASE IF NOT EXISTS inventory_db;
USE inventory_db;

-- ---- USERS ----------------------------------------------------
-- Stores the person who registered the appliance(s).
-- user_id is the primary key referenced by appliances.user_id.
-- email is UNIQUE so the "Add" endpoint can decide whether a
-- user already exists (brief: "Add new appliance ... including
-- user details if not already present").
CREATE TABLE users (
  user_id     INT AUTO_INCREMENT PRIMARY KEY,
  first_name  VARCHAR(50)  NOT NULL,
  last_name   VARCHAR(50)  NOT NULL,
  address     VARCHAR(255) NOT NULL,
  mobile      VARCHAR(20)  NOT NULL,
  email       VARCHAR(100) NOT NULL UNIQUE,
  eircode     VARCHAR(8)   NOT NULL
);

-- ---- APPLIANCES -----------------------------------------------
-- Each appliance belongs to exactly one user (1:N relationship).
-- serial_number is UNIQUE because every CRUD operation in the
-- brief looks up the appliance by serial number.
-- cost is DECIMAL(10,2) - up to 99,999,999.99 with 2 decimal places.
CREATE TABLE appliances (
  appliance_id              INT AUTO_INCREMENT PRIMARY KEY,
  user_id                   INT NOT NULL,
  appliance_type            VARCHAR(50)  NOT NULL,
  brand                     VARCHAR(50)  NOT NULL,
  model_number              VARCHAR(50)  NOT NULL,
  serial_number             VARCHAR(50)  NOT NULL UNIQUE,
  purchase_date             DATE         NOT NULL,
  warranty_expiration_date  DATE         NOT NULL,
  cost                      DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
