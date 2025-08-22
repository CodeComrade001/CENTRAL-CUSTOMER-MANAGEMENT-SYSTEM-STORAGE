# Central Customer Management System (CCMS)

A centralized platform designed to manage multiple SaaS services for schools, enabling registration, data storage, and access management across various educational and health-focused solutions.

---

## 📑 Table of Contents

1. [Overview](#-overview)
2. [Functional Features](#-functional-features)
3. [Environment Configuration](#-environment-configuration)

   * [Local Setup for Frontend](#local-setup-for-frontend)
   * [Local Setup for Backend](#local-setup-for-backend)
   * [Docker Setup](#docker-setup)
4. [How to Run Locally](#-how-to-run-locally)

   * [Frontend Setup](#-quick-setup-frontend)
   * [Backend Setup](#-quick-setup-backend)
   * [DB Connection Notes](#-notes-on-db-connections)
5. [How to Run with Docker](#-how-to-run-with-docker)

   * [Schema Preparation](#step-1-prepare-schema)
   * [Docker Env Config](#step-2-configure-envdocker)
   * [Run Containers](#step-3-run-containers)
   * [Preconfigured Docker Setup](#-to-run-with-preconfgured-docker-download-docker-setupzip-file-in-release-section)
6. [Under Development](#-under-development)

---

## 🧩 Overview

CCMS allows schools to register and use different service packages tailored for educational and institutional needs. The system is currently focused on providing:

1. **School Management System (SaaS)** – for managing teachers, students, and school-related data.
2. **Computer-Based Testing (CBT) System (SaaS)** – register students for CBT, manage exam sessions, and track participation.
3. **Health Management System (EMR)** – under active development and not yet available.

> ⚠️ Note: Payment functionality has **not** been implemented. All packages are currently available for **free** during the development phase.

---

## ✅ Functional Features

### User Requirements

* Register a school with basic info for **SMS**, **HMS**, or **CBT**.

### 🧑‍💼 Admin Dashboard

* View all registered schools by package type (HMS, SMS, or CBT).
* Activate and deactivate user accounts.
* Allocate CBT slots to schools.

---

## ⚙️ Environment Configuration

### Local Setup for Frontend

```ini
##########################################
# Local (Manual) Development Settings
# Used when running backend locally (npm run dev).
##########################################
VITE_BACKEND_URL=http://localhost:3000

##########################################
# Docker Development Settings
# Used when running frontend + API in Docker containers.
##########################################
VITE_BACKEND_URL=http://api:3000
```

### Local Setup for Backend

```ini
##########################################
# Local (Manual) Development Settings
# Switch between Docker and local connection
##########################################
POSTGRESS_CONNECTION=docker                 # COMMENT or DELETE to select local connection

##########################################
# Local Postgres Settings (host machine)
##########################################
LOCAL_POSTGRES_USER=<your_local_user>
LOCAL_POSTGRES_PASSWORD=<your_local_password>
LOCAL_POSTGRES_DB=<your_local_db_name>
LOCAL_POSTGRES_HOST=localhost
LOCAL_POSTGRES_PORT=5394
LOCAL_DATABASE_URL=postgresql://<your_local_user>:<your_local_password>@localhost:5394/<your_local_db_name>

##########################################
# Docker Postgres Settings (containerized)
##########################################
DOCKER_POSTGRES_USER=<your_docker_user>
DOCKER_POSTGRES_PASSWORD=<your_docker_password>
DOCKER_POSTGRES_DB=<your_docker_db_name>
DOCKER_POSTGRES_HOST=postgres
DOCKER_POSTGRES_PORT=5432
DOCKER_DATABASE_URL=postgresql://<your_docker_user>:<your_docker_password>@postgres:5432/<your_docker_db_name>

##########################################
# Common Settings
##########################################
SESSION_SECRET=<your_session_secret>
NODE_ENV=development
# NODE_ENV=production
POSTGRES_EXTERNAL_PORT=5394
CEN_CMS_API_PORT=3000
```

### Docker Setup

```ini
##########################################
# Docker Development Settings
# These are used when running Postgres in a Docker container.
##########################################
POSTGRESS_CONNECTION=docker                 # Identifier to know we are using Docker
DOCKER_POSTGRES_USER=<your_db_user>         # Docker DB username
DOCKER_POSTGRES_PASSWORD=<your_db_password> # Docker DB password
DOCKER_POSTGRES_DB=<your_db_name>           # Docker database name
DOCKER_POSTGRES_HOST=postgres               # Container hostname = "postgres" (service name in docker-compose)
DOCKER_POSTGRES_PORT=5432                   # Internal Postgres port
SESSION_SECRET=<your_session_secret>        # Strong random session key
DOCKER_DATABASE_URL=postgresql://<your_db_user>:<your_db_password>@postgres:5432/<your_db_name>

##########################################
# Common Settings
##########################################
POSTGRES_EXTERNAL_PORT=5394                 # Port exposed to host
CEN_CMS_API_PORT=3000                       # Backend API port
VITE_BACKEND_URL=http://api:3000
```

---

## 🚀 How to Run Locally

### 🧪 Quick Setup (Frontend)

```bash
git clone https://github.com/CodeComrade001/CENTRAL-CUSTOMER-MANAGEMENT-SYSTEM-STORAGE.git
cd frontend
npm install
npm run dev
```

This will start the frontend with the backend API pointing to `http://localhost:5173`.

### 🧪 Quick Setup (Backend)

```bash
git clone https://github.com/CodeComrade001/CENTRAL-CUSTOMER-MANAGEMENT-SYSTEM-STORAGE.git
cd backend
npm install
npm run dev
```

This will start the backend API on `http://localhost:3000`.

### 🔑 Notes on DB Connections

* Remove or comment `POSTGRESS_CONNECTION=docker` for **local Postgres connection**.
* Keep `POSTGRESS_CONNECTION=docker` for **Docker connection**.
* Or edit `database.ts`:

```ts
const isDocker = true;   // for Docker
const isDocker = false;  // for Local
```

---

## 🐳 How to Run with Docker

### Step 1: Prepare Schema

Place your `schema.sql` inside the `backend/init-scripts/` directory. This ensures the database is created with the proper schema when Postgres starts.

```text
backend/
  └── init-scripts/
       └── schema.sql
```

### Step 2: Configure `.env.docker`

Ensure `.env.docker` is configured using the [Docker Setup](#docker-setup) template.

### Step 3: Run Containers

If you have `docker-compose.yml` configured:

```bash
docker-compose up --build
```

This will spin up:

* **Postgres** with your `schema.sql`
* **Backend API** on port `3000`
* **Frontend** accessible at `http://localhost:5173`

---

## 🐳 To run with preconfigured Docker (Release Package)

### Step 1: Download Preconfigured Package

Go to the **Releases** section of this repository and download the file: `docker-setup.zip`.

### Step 2: Extract and Run

Extract the archive, navigate into the extracted directory, and simply run:

```bash
docker-compose up
```

This will start the containers with demo `.env` values and preloaded `schema.sql`.

---

## 🚧 Under Development

### 🚑 Health Management System (EMR)

* Electronic Medical Records functionality is currently in progress.
* Not yet available for use.

### 💳 Payment System

* No billing or subscription management is active.
* Schools can access all packages for free until payments are enforced.
