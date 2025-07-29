import axios, { type AxiosRequestConfig } from "axios";


const baseURL = import.meta.env.VITE_BACKEND_URL || "";
console.log("Turbo Log  ~ baseURL:", baseURL);

const api = axios.create({
  baseURL,
  withCredentials: true,
  // timeout: 1000,
})

// ============================
// User APIs Endpoints
// ============================

export const APi__FetchUserDeails = (config?: AxiosRequestConfig) => {
  return api.get("api/user/details", config)
}

export const API__UserSelectedPlan = (config?: AxiosRequestConfig) => {
  return api.get("api/user/selected-plan", config)
}
export const API__UserLogIn = (data: { email: string, password: string }, config?: AxiosRequestConfig) => {
  return api.post("api/user/signin", data, config)
}
export const API__UserSignUp = (data: { schoolName: string, email: string, password: string }, config?: AxiosRequestConfig) => {
  return api.post("api/user/signup", data, config)
}
export const API__UserPlanEdit = (data: { product: string, product_subscription: boolean }, config?: AxiosRequestConfig) => {
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
export const API__CreateStudents = (data: any[], config?: AxiosRequestConfig) => {
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
export const API__CreateTeachers = (data: any[], config?: AxiosRequestConfig) => {
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

export const API__Admin_LogIn = (data: { username: string, password: string }, config?: AxiosRequestConfig) => {
  return api.post("api/admin/login", data, config)
}

export const API__Admin_AllDetails = (config?: AxiosRequestConfig) => {
  return api.get("api/admin/all-details", config)
}

export const API__Admin_UserAccountDeactivation = (data: { schoolId: string }, config?: AxiosRequestConfig) => {
  return api.post("api/admin/cbt/deactivate-account", data, config)
}

export const API__Admin_UserAccountActivate = (data: { schoolId: string }, config?: AxiosRequestConfig) => {
  return api.post("api/admin/cbt/activate-account", data, config)
}

export const API__Admin_UserSMS_IncreaseSlot = (data: { slotValue: number, schoolId: string }, config?: AxiosRequestConfig) => {
  return api.post("api/admin/sms/increase-slot", data, config)
}

export const API__Admin_UserCbt_students = (data: { schoolId: string }, config?: AxiosRequestConfig) => {
  return api.post("api/admin/school-cbt-student", data, config)
}

export const API__Admin_UserSchoolManagentFullDetails = (data: { schoolId: string }, config?: AxiosRequestConfig) => {
  return api.post("api/admin/school-full-details", data, config)
}
