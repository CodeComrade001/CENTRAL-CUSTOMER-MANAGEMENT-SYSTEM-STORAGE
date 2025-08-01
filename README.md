# CodeComrade001-CENTRAL-CUSTOMER-MANAGEMENT-SYSTEM-STORAGE

This is a full-stack web application built with **Vite + React** on the frontend and **Express.js + Supabase** on the backend.  
It includes user authentication, protected routes, and a real-time connection to a remote PostgreSQL database via Supabase.  
The entire project is Dockerized and structured for easy deployment and local development.

> 🔧 This API is private and needs supabase key — it is only intended to be used by the frontend. Direct access is restricted without proper Supabase authentication.

## 🧩 Overview

CCMS allows schools to register and use different service packages tailored for educational and institutional needs. The system is currently focused on providing:

1. **School Management System (SaaS)** – for managing teachers, students, and school-related data.
2. **Computer-Based Testing (CBT) System (SaaS)** – register students for CBT, manage exam sessions, and track participation.
3. **Health Management System (EMR)** – under active development and not yet available.

## 🚀 Hosted Links

| Component        | URL                                                                 |
|------------------|----------------------------------------------------------------------|
| 🌐 Frontend       | [cen-cms-ui.vercel.app](https://cen-cms-ui.vercel.app)              |
| ⚙️ Backend API     | [central-customer-management-system.onrender.com](https://central-customer-management-system.onrender.com) |
| 📂 Frontend Repo  | [GitHub - frontend](https://github.com/CodeComrade001/CENTRAL-CUSTOMER-MANAGEMENT-SYSTEM-STORAGE/tree/main/frontend) |
| 📂 Backend Repo   | [GitHub - backend](https://github.com/CodeComrade001/CENTRAL-CUSTOMER-MANAGEMENT-SYSTEM-STORAGE/tree/main/backend) |
| 📄 Proposal       | [GitHub - proposal](https://github.com/CodeComrade001/CENTRAL-CUSTOMER-MANAGEMENT-SYSTEM-STORAGE/tree/main/proposal) |

> 🔒 **Note:** The backend API is private — it is only designed to be used by the frontend app.  
> Direct API calls (e.g., Postman, CURL) will be rejected unless properly authenticated through the website.
---

## 📦 Getting Started

### ✅ Requirements

- Node.js (v18+)
- Docker (optional, for backend)
- Supabase project (already configured)

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
