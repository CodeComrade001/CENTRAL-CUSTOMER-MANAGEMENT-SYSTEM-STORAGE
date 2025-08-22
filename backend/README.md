# 🏫 Central Customer Management System (CCMS)

This is the **backend and frontend** for the **Central Customer Management System (CCMS)**, a SaaS platform for managing schools, students, teachers, and CBT systems.

---

## 🔧 Tech Stack

* **Frontend**: Vite + React + TypeScript
* **Backend**: Node.js + Express + Docker

---

## 🚀 How to Run Backend Locally

```bash
# Clone the repository
git clone https://github.com/CodeComrade001/CENTRAL-CUSTOMER-MANAGEMENT-SYSTEM-STORAGE.git

# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file (see example below)

# Start the backend server
npm run dev   # if running locally
```

### 🔑 Notes on DB Connections

* Remove or comment `POSTGRESS_CONNECTION=docker` for **local Postgres connection**.
* Keep `POSTGRESS_CONNECTION=docker` for **Docker connection**.
* Or edit `database.ts`:

```ts
const isDocker = true;   // for Docker
const isDocker = false;  // for Local
```

---

## 📄 Example `.env` File

```env
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

---

## 📡 API Routes

### 👩‍💼 Admin Routes

> **Notes:**
>
> * `sms` = School Management System
> * `hms` = Health Management System
> * `cbt` = Computer-Based Test
> * `GET /health` → returns current date/timestamp to confirm API is alive

* **POST** `/admin/login` – Log in as admin
* **GET** `/admin/validate-admin` – Validate admin token
* **GET** `/admin/customer/all` – View all customers
* **GET** `/admin/signout` – Log out admin
* **GET** `/admin/sms/all` – Get all SMS data
* **GET** `/admin/cbt/all` – Get all CBT data
* **GET** `/admin/hms/all` – Get all HMS/EMR data
* **PATCH** `/sms/verify` – Verify SMS customer access
* **PATCH** `/hms/verify` – Verify HMS customer access
* **PATCH** `/cbt/verify` – Verify CBT customer access
* **PATCH** `/hms/package` – Update HMS package
* **PATCH** `/sms/package` – Update SMS package
* **PATCH** `/cbt/slot` – Update CBT slots
* **DELETE** `/cbt/slot` – Remove CBT session

---

### 👥 User Routes

* **POST** `/signup/sms` – School registers for SMS
* **POST** `/signup/hms` – Hospital registers for HMS
* **POST** `/signup/cbt` – CBT center registers

---

## 📦 Payload Definitions

Payloads are defined in the TypeScript `models.ts` file.

### School Management System (SMS)

```ts
export interface SMSpayload {
  school_name: string;
  package: string;  // Starter | Standard | Premium
  renewal_date: string; // date
  student_count: number;
  staff_count: number;
  last_payment_date: string; // date
}
```

### Computer-Based Test (CBT)

```ts
export interface CBTpayload {
  center_name: string;
  available_slot: number;
  used_slot: number;
  last_slot_purchase: string; // date
  last_login: string; // date
}
```

### Health Management System (HMS)

```ts
export interface HMSpayload {
  hospital_name: string;
  package: string; // Basic | Pro | Premium | Enterprise
  renewal_date: string; // date
  last_payment: string; // date
}
```

### 🧪 Unit Testing

This project includes comprehensive unit tests written with Jest to ensure code quality and reliability.

```bash
npm run test
```

---

## 🌍 Live URLs (Demo Environment)

* **Docker**: [http://api:3000](http://api:3000)
* **Local**: [http://localhost:3000](http://localhost:3000)

---

