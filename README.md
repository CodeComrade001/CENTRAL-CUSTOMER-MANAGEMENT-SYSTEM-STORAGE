# CodeComrade001-CENTRAL-CUSTOMER-MANAGEMENT-SYSTEM-STORAGE

This is a full-stack web application built with **Vite + React** on the frontend and **Express.js + PostgreSQL** on the backend.
It includes user authentication, protected routes, and a real-time connection to a PostgreSQL database.
The entire project is Dockerized and structured for easy deployment and local development.

---

## 🧩 Overview

CCMS allows schools to register and use different service packages tailored for educational and institutional needs. The system is currently focused on providing:

1. **School Management System (SaaS)** – for managing teachers, students, and school-related data.
2. **Computer-Based Testing (CBT) System (SaaS)** – register students for CBT, manage exam sessions, and track participation.
3. **Health Management System (EMR)** – under active development and not yet available.

---

## 🚀 Hosted Links

| Component        | URL                                                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------------------------------------- |
| 🌐 Frontend      | [cen-cms-ui.vercel.app](https://cen-cms-ui.vercel.app)                                                               |
| ⚙️ Backend API   | [central-customer-management-system.onrender.com](https://central-customer-management-system.onrender.com)           |
| 📂 Frontend Repo | [GitHub - frontend](https://github.com/CodeComrade001/CENTRAL-CUSTOMER-MANAGEMENT-SYSTEM-STORAGE/tree/main/frontend) |
| 📂 Backend Repo  | [GitHub - backend](https://github.com/CodeComrade001/CENTRAL-CUSTOMER-MANAGEMENT-SYSTEM-STORAGE/tree/main/backend)   |
| 📄 Proposal      | [GitHub - proposal](https://github.com/CodeComrade001/CENTRAL-CUSTOMER-MANAGEMENT-SYSTEM-STORAGE/tree/main/proposal) |

---

## 📦 Getting Started

### ✅ Requirements

* Node.js (v18+)
* Docker (optional, for backend)
* PostgreSQL database

---

### 🧪 Development Setup

#### Clone and install

```bash
git clone https://github.com/your/repo.git
cd your-repo

# Install frontend
cd frontend && npm install

# Install backend
cd ../backend && npm install
```

#### Run locally

Frontend:

```bash
cd frontend
npm run dev
```

Backend:

```bash
cd backend
npm run dev
```

By default, the project is configured to use **local PostgreSQL connection**.

---

### 🔑 Environment Configuration for frontend

Copy the `.env.example` file into `.env` in the **frontend** folders, then update the values.

Example `.env template`  for frontend:

```env
VITE_LOCAL_BACKEND_URL=your_port
```
Example `.env example` for frontend:

```env
VITE_LOCAL_BACKEND_URL=6482      
```

### 🔑 Environment Configuration for backend

Copy the `.env.example` file into `.env` in both  **backend** folders, then update the values.

Example `.env template`  for backend:

```env##########################################

Local (Manual) Development Settings
These are used when running Postgres on your host machine (localhost).

##########################################

POSTGRESS_CONNECTION=local_connection       # Identifier to know we are using local connection
LOCAL_POSTGRES_USER=<input_your_role>        # Local DB username
LOCAL_POSTGRES_PASSWORD=<input_your_password>   # Local DB password
LOCAL_POSTGRES_DB=<input_your_db_name>       # Local database name
LOCAL_POSTGRES_HOST=localhost                # Localhost since DB is installed directly
LOCAL_POSTGRES_PORT=<input_your_port>        # Exposed external port for local Postgres
LOCAL_SESSION_SECRET=<input_your_session_secret>
LOCAL_DATABASE_URL=postgresql://<input_your_role>:<input_your_password>@localhost:<input_your_port>/<input_your_db_name>

##########################################

Docker Development Settings
These are used when running Postgres in a Docker container.

##########################################

POSTGRESS_CONNECTION=docker                 # Identifier to know we are using Docker
DOCKER_POSTGRES_USER=<input_your_role>       # Docker DB username
DOCKER_POSTGRES_PASSWORD=<input_your_password>   # Docker DB password
DOCKER_POSTGRES_DB=<input_your_db_name>      # Docker database name
DOCKER_POSTGRES_HOST=postgres                # Container hostname = "postgres" (service name in docker-compose)
DOCKER_POSTGRES_PORT=5432                    # Internal Postgres port (always 5432 inside container)
DOCKER_SESSION_SECRET=<input_your_session_secret>
DOCKER_DATABASE_URL=postgresql://<input_your_role>:<input_your_password>@postgres:5432/<input_your_db_name>

##########################################

Common Settings

##########################################

POSTGRES_EXTERNAL_PORT=<input_your_external_port>   # Port exposed to host when using Docker
CEN_CMS_API_PORT=<input_your_api_port>              # Backend API port (frontend will call this)


```

Example `.env example` for backend:

```env
##########################################
# Local (Manual) Development Settings 
# These are used when running Postgres on your host machine (localhost).
##########################################

POSTGRESS_CONNECTION=local_connection       # Identifier to know we are using local connection
LOCAL_POSTGRES_USER=public_role             # Local DB username
LOCAL_POSTGRES_PASSWORD=demopassword123   # Local DB password
LOCAL_POSTGRES_DB=cen_cms_db                # Local database name
LOCAL_POSTGRES_HOST=localhost               # Localhost since DB is installed directly
LOCAL_POSTGRES_PORT=5394                    # Exposed external port for local Postgres
LOCAL_SESSION_SECRET=6809ef42283c259b71955a1aca64135c901689ddc6071ee3749e9a7efb2cd8e7a3a96918f9a8e12aa7c3da471064b19af4d3c58cad812d3663bac9a80255eb30
LOCAL_DATABASE_URL=postgresql://public_role:demopassword123@localhost:5394/cen_cms_db


##########################################
# Docker Development Settings
# These are used when running Postgres in a Docker container.
##########################################

POSTGRESS_CONNECTION=docker                 # Identifier to know we are using Docker
DOCKER_POSTGRES_USER=public_role            # Docker DB username
DOCKER_POSTGRES_PASSWORD=demopassword123    # Docker DB password
DOCKER_POSTGRES_DB=cen_cms_db               # Docker database name
DOCKER_POSTGRES_HOST=postgres               # Container hostname = "postgres" (service name in docker-compose)
DOCKER_POSTGRES_PORT=5432                   # Internal Postgres port (always 5432 inside container)
DOCKER_SESSION_SECRET=6809ef42283c259b71955a1aca64135c901689ddc6071ee3749e9a7efb2cd8e7a3a96918f9a8e12aa7c3da471064b19af4d3c58cad812d3663bac9a80255eb30
DOCKER_DATABASE_URL=postgresql://public_role:demopassword123@postgres:5432/cen_cms_db


##########################################
# Common Settings
##########################################

POSTGRES_EXTERNAL_PORT=5394                 # Port exposed to host when using Docker
CEN_CMS_API_PORT=6482                       # Backend API port (frontend will call this)


```

---

### 🐳 Docker Setup

To run with Docker, pull the image and start it:

```bash
docker pull your-dockerhub-username/ccms-backend:latest
docker run -p 5000:5000 --env-file .env your-dockerhub-username/ccms-backend:latest
```

You can update `.env` to match Docker container configuration.

---

### 🌐 Switching Between Local & Docker

* **Local Mode**: Default, uses your local PostgreSQL instance.
* **Docker Mode**: Navigate to the Docker configuration section (to be provided) and update your `.env` to point to Docker.

---

### ✅ Testing Complete

Once setup is done, visit:

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend: [http://localhost:5000](http://localhost:5000)

---
