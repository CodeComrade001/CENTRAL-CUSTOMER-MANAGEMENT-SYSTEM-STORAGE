/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type AxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL || "";

const api = axios.create({
  baseURL,
  withCredentials: true,
  // timeout: 1000,
})

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("user_token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});


// ============================
// User APIs Endpoints
// ============================

export const APi__FetchUserDeails = (config?: AxiosRequestConfig) => {
  return api.get("api/user/details", config)
}

// ✅ Define a function that attaches the token to the headers
export const APi__ValidateUser = (config?: AxiosRequestConfig) => {
  const token = localStorage.getItem('user_token');
  return api.get("api/user/validate-user", {
    ...config,
    headers: {
      ...(config?.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
};


export const API__UserSelectedPlan = (config?: AxiosRequestConfig) => {
  return api.get("api/user/selected-plan", config)
}
export const API__UserLogIn = (data: { email: string, password: string }, config?: AxiosRequestConfig) => {
  return api.post("api/user/signin", data, config)
}
export const API__UserSignUp = (data: { schoolName: string, email: string, password: string }, config?: AxiosRequestConfig) => {
  return api.post("api/user/signup", data, config)
}
export const API__UserPlanEdit = (data: { id: number, product: string, product_subscription: boolean }, config?: AxiosRequestConfig) => {
  return api.post("api/user/edit-plan", data, config)
}

// Sign out the user
export const API__UserSignOut = (config?: AxiosRequestConfig) => {
  return api.get("api/user/signout", config)
}

// Validate user token/session
export const API__ValidateUserToken = (data: { token: string }, config?: AxiosRequestConfig) => {
  return api.post("api/user/auth/validate", data, config)
}

// Create students (array or single)
export const API__CreateStudents = (data: {
  student_name: string;
  student_class: string;
  student_department?: string;
  student_age: string;
}[], config?: AxiosRequestConfig) => {
  return api.post("api/user/students/create", data, config)
}

// Update students (array or single)
export const API__UpdateStudents = (data: any[], config?: AxiosRequestConfig) => {
  return api.put("api/user/students/update", data, config)
}

// Get all students
export const API__GetAllStudents = (config?: AxiosRequestConfig) => {
  return api.get("api/user/students/all", config)
}

// Create teachers (array or single)
export const API__CreateTeachers = (data: {
  teacher_name: string;
  teacher_email: string;
}[], config?: AxiosRequestConfig) => {
  return api.post("api/user/teachers/create", data, config)
}

// Update teachers (array or single)
export const API__UpdateTeachers = (data: any[], config?: AxiosRequestConfig) => {
  return api.put("api/user/teachers/update", data, config)
}

// Get all teachers
export const API__GetAllTeachers = (config?: AxiosRequestConfig) => {
  return api.get("api/user/teachers/all", config)
}

// Get CBT students
export const API__GetCBTStudents = (config?: AxiosRequestConfig) => {
  return api.get("api/user/cbt/students/all", config)
}


// ============================
// Admin APIs Endpoints
// ============================

export const API__Admin_LogIn = (data: { email: string, password: string }, config?: AxiosRequestConfig) => {
  return api.post("api/admin/login", data, config)
}


export const APi__Admin_ValidateAdmin = (config?: AxiosRequestConfig) => {
  const token = localStorage.getItem('user_token');
  return api.get("api/admin/validate-admin", {
    ...config,
    headers: {
      ...(config?.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
}

export const API__Admin_LogOut = (config?: AxiosRequestConfig) => {
  return api.get("api/admin/signout", config)
}

export const API__Admin_AllCustomers = (config?: AxiosRequestConfig) => {
  return api.get("api/admin/customer/all", config)
}

export const API__Admin_SchoolManagement_AllDetails = (config?: AxiosRequestConfig) => {
  return api.get("api/admin/sms/all", config)
}

export const API__Admin_CBT_AllDetails = (config?: AxiosRequestConfig) => {
  return api.get("api/admin/cbt/all", config)
}

export const API__Admin_HealthManagement_AllDetails = (config?: AxiosRequestConfig) => {
  return api.get("api/admin/hms/all", config)
}

export const API__Admin_ActivateCustomer = (data: { schoolId: number }, config?: AxiosRequestConfig) => {
  return api.post("api/admin/customer/activate", data, config)
}

export const API__Admin_DeactivateCustomer = (data: { schoolId: number }, config?: AxiosRequestConfig) => {
  return api.post("api/admin/customer/deactivate", data, config)
}

export const API__Admin_UpdateSMS_Slot = (data: { slotValue: number, schoolId: number }, config?: AxiosRequestConfig) => {
  return api.post("api/admin/sms/update", data, config)
}

export const API__Admin_UpdateCBT_Slot = (data: { slotValue: number, schoolId: string }, config?: AxiosRequestConfig) => {
  return api.post("api/admin/cbt/update", data, config)
}

export const API__Admin_SchoolCBT_Students = (config?: AxiosRequestConfig) => {
  return api.get("api/admin/school/student", config)
}

export const API__Admin_SchoolTeachers = (config?: AxiosRequestConfig) => {
  return api.get("api/admin/school/teachers", config)
}

