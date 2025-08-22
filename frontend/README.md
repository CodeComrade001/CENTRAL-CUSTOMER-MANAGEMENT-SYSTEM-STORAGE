# Central Customer Management System (CCMS)

A centralized platform designed to manage multiple SaaS services for schools, enabling registration, data storage, and access management across various educational and health-focused solutions.

## 🧩 Overview

CCMS allows schools to register and use different service packages tailored for educational and institutional needs. The system is currently focused on providing:

1. **School Management System (SaaS)** – for managing teachers, students, and school-related data.
2. **Computer-Based Testing (CBT) System (SaaS)** – register students for CBT, manage exam sessions, and track participation.
3. **Health Management System (EMR)** – under active development and not yet available.

> ⚠️ **Note:** Payment functionality has **not** been implemented. All packages are currently available for **free** during the development phase.

---

## ✅ Functional Features

### 👥 User Requirements

* Register a school with basic information for SMS, HMS, or CBT packages.

### 🧑‍💼 Admin Dashboard

* View all registered schools based on package type (HMS, SMS, or CBT).
* Activate and deactivate user accounts.
* Allocate CBT slots to schools.

---

## ⚙️ Environment Configuration

Create a `.env` file in the **frontend root** directory and configure the backend URL:

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

> Replace values (e.g., `http://localhost:3000`) with your actual backend service address if needed.

---

## 🚧 Under Development

### 🚑 Health Management System (EMR)

* Electronic Medical Records functionality is currently in progress.
* Not yet available for use.

### 💳 Payment System

* No billing or subscription management is active.
* Schools can access all packages for free until payments are enforced.

---

## 🚀 How to Run Locally

### 🧪 Quick Setup (Bash)

```bash
git clone https://github.com/CodeComrade001/CENTRAL-CUSTOMER-MANAGEMENT-SYSTEM-STORAGE.git
cd ccms-frontend
npm install
npm run dev
```
