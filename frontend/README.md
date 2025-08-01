# Central Customer Management System (CCMS)

A centralized platform designed to manage multiple SaaS services for schools, enabling registration, data storage, and access management across various educational and health-focused solutions.

## 🧩 Overview

CCMS allows schools to register and use different service packages tailored for educational and institutional needs. The system is currently focused on providing:

1. **School Management System (SaaS)** – for managing teachers, students, and school-related data.
2. **Computer-Based Testing (CBT) System (SaaS)** – register students for CBT, manage exam sessions, and track participation.
3. **Health Management System (EMR)** – under active development and not yet available.

> ⚠️ Note: Payment functionality has **not** been implemented. All packages are currently available for **free** during the development phase.

---

## ✅ Functional Features

### 🏫 School Management System

- Register a school with basic info.
- Add, edit, and delete teachers and students.
- View school details.

### 🧪 Computer-Based Testing System

- Register students for CBT sessions.
- Store and manage CBT-related student data.

### 🧑‍💼 Admin Dashboard

- View all registered schools.
- See all teachers and their respective schools.
- Monitor packages used by each school.
- Allocate CBT slots to schools.
- Deactivate accounts that fail to meet payment requirements (placeholder logic; no payment integration yet).

---

## 🚧 Under Development

### 🚑 Health Management System (EMR)

- Electronic Medical Records functionality is currently in progress.
- Not yet available for use.

### 💳 Payment System

- No billing or subscription management is active.
- Schools can access all packages for free until payments are enforced.

---

## 🔒 Authentication & Access Control

- Schools must log in to access their data.
- Admin users have elevated privileges to manage and monitor all schools.

---

## 🚀 Live Site

Url : <https://cen-cms-ui.vercel.app>

## 🚀 How to Run Locally

## 🧪 Quick Setup (Bash)

```bash
git clone https://github.com/CodeComrade001/CENTRAL-CUSTOMER-MANAGEMENT-SYSTEM-STORAGE.git
cd ccms-frontend
npm install
echo "VITE_API_URL=http://localhost:3000" > .env
npm run dev
