# 🏫 Central Customer Management System (CCMS)

This is the frontend and backend for the Central Customer Management System (CCMS), a SaaS platform for managing schools, students, teachers, and CBT systems.

---

## 🔧 Tech Stack

- **Frontend**: Vite + React + TypeScript  
- **Backend**: Node.js + Express  
- **Database/Auth**: Supabase  
- **Deployment**: Render (or localhost for development)

---

## 🚀 How to Run Frontend Locally

```bash
# Clone the frontend repository
git clone https://github.com/CodeComrade001/CENTRAL-CUSTOMER-MANAGEMENT-SYSTEM-STORAGE.git

# Navigate to the frontend directory
cd frontend

# Install frontend dependencies
npm install

# Create an environment variable file
echo "VITE_API_URL=http://localhost:3000 " > .env

# Start the frontend server
npm run dev
```

## 🚀 How to Run Backend Locally

```bash
# Clone the backend repository
git clone https://github.com/CodeComrade001/CENTRAL-CUSTOMER-MANAGEMENT-SYSTEM-STORAGE.git

# Navigate to the backend directory
cd ccms-backend

# Install backend dependencies
npm install

# Create an environment variable file
echo "SUPABASE_URL=https://your-project.supabase.co" > .env
echo "SUPABASE_SERVICE_ROLE_KEY=your-secret-service-role-key" >> .env

# Start the backend server
npm run dev

```

## 🚀 Admin Routes

- **POST** `/admin/login` – Log in as admin  
- **GET** `/admin/validate-admin` – Check admin token validity  
- **GET** `/admin/customer/all` – View all customers  
- **GET** `/admin/signout` – Log out admin  
- **GET** `/admin/sms/all` – Get all SMS (School Mgmt Sys) data  
- **GET** `/admin/cbt/all` – Get all CBT data  
- **GET** `/admin/hms/all` – Get all HMS/EMR data  
- **POST** `/admin/customer/activate` – Activate a customer  
- **POST** `/admin/customer/deactivate` – Deactivate a customer  
- **POST** `/admin/sms/update` – Add more SMS slots  
- **POST** `/admin/cbt/update` – Add more CBT slots  
- **GET** `/admin/school/student` – View all students in a school  
- **GET** `/admin/school/teachers` – View all teachers in a school  

---

## 🚀 User Routes

- **POST** `/user/signin` – School logs in  
- **POST** `/user/signup` – School registers  
- **GET** `/user/signout` – School logs out  
- **GET** `/user/validate-user` – Check user token validity  
- **GET** `/user/details` – Get logged-in user details  
- **GET** `/user/selected-plan` – Get school’s selected package  
- **POST** `/user/edit-plan` – Change selected plan  
- **POST** `/user/students/create` – Add students  
- **PUT** `/user/students/update` – Update students  
- **GET** `/user/students/all` – View all students  
- **POST** `/user/teachers/create` – Add teachers  
- **PUT** `/user/teachers/update` – Update teachers  
- **GET** `/user/teachers/all` – View all teachers  
- **GET** `/user/cbt/students/all` – View CBT-registered students  

---

## 🚀 Live URLs

- **Frontend**: [https://cen-cms-ui.vercel.app](https://cen-cms-ui.vercel.app)  
- **Backend**: [https://central-customer-management-system.onrender.com](https://central-customer-management-system.onrender.com)
