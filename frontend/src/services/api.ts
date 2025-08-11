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

/**
 * @notice  
 * @SMS - School Management Package
 * @HMS - Health Management Package
 * @CBT - CBT Management Package
 * 
 */

export const api__user_sgnupForSMS = (data: {
  school_name: string,
  package: string,
  renewal_date: string,
  staff_count: number,
  student_count: number,
  last_payment_date: string,
}, config?: AxiosRequestConfig) => {
  return api.post("api/user/signup/sms", data, config)
}

export const api__user_sgnupForHMS = (data: {
  hospital_name: string,
  package: string,
  renewal_date: string,
  last_payment: string,
}, config?: AxiosRequestConfig) => {
  return api.post("api/user/signup/hms", data, config)
}

export const api__user_sgnupForCBT = (data: {
  center_name: string,
  available_slot: number,
  used_slot: number,
  last_slot_purchase: string,
  last_login: string,
}, config?: AxiosRequestConfig) => {
  return api.post("api/user/signup/cbt", data, config)
}



// ============================
// Admin APIs Endpoints
// ============================

export const api__admin_LogIn = (data: { username: string, password: string }, config?: AxiosRequestConfig) => {
  return api.post("api/admin/login", data, config)
}

/*//////////////////////////////////////////////////////////////
          ADMIN GET REQUEST END ROUTE FOR ALL CUSTOMERS
//////////////////////////////////////////////////////////////*/

export const api__admin_fetchAllCustomerForSMS = (config?: AxiosRequestConfig) => {
  return api.get("api/admin/sms/all", config)
}

export const api__admin_validateAdmin = (config?: AxiosRequestConfig) => {
  return api.get("api/admin/validate-admin", {
    ...config,
    withCredentials: true
  })
}

export const api__admin_fetchAllCustomerForCBT = (config?: AxiosRequestConfig) => {
  return api.get("api/admin/cbt/all", config)
}

export const api__admin_fetchAllCustomerForHMS = (config?: AxiosRequestConfig) => {
  return api.get("api/admin/hms/all", config)
}

/*//////////////////////////////////////////////////////////////
    ADMIN PATCH REQUEST END ROUTE FOR VERIFICATION CHANGING
//////////////////////////////////////////////////////////////*/

export const api__admin_changeCustomerVerificationForSMS = (data: { customer_id: string, status: boolean }, config?: AxiosRequestConfig) => {
  return api.patch("api/admin/sms/verify", data, config)
}

export const api__admin_changeCustomerVerificationForHMS = (data: { customer_id: string, status: boolean }, config?: AxiosRequestConfig) => {
  return api.patch("api/admin/hms/verify", data, config)
}

export const api__admin_changeCustomerVerificationForCBT = (data: { customer_id: string, status: boolean }, config?: AxiosRequestConfig) => {
  return api.patch("api/admin/cbt/verify", data, config)
}

/*//////////////////////////////////////////////////////////////
          ADMIN PATCH REQUEST END ROUTE FOR UPDATING PACKAGE
//////////////////////////////////////////////////////////////*/


export const api__admin_changeCustomerPackageForHMS = (data: { customer_id: string, newPackage: string }, config?: AxiosRequestConfig) => {
  return api.patch("api/admin/hms/package", data, config)
}

export const api__admin_changeCustomerPackageForSMS = (data: { customer_id: string, newPackage: string }, config?: AxiosRequestConfig) => {
  return api.patch("api/admin/sms/package", data, config)
}

export const api__admin_changeSlotForCBT = (data: { customer_id: string, newSlot: number }, config?: AxiosRequestConfig) => {
  return api.patch("api/admin/cbt/slot", data, config)
}

/*//////////////////////////////////////////////////////////////
          ADMIN DELETE REQUEST END ROUTE FOR UPDATING PACKAGE
//////////////////////////////////////////////////////////////*/

export const api__admin_logOutAdmin = (config?: AxiosRequestConfig) => {
  return api.delete("/api/admin/signout", { withCredentials: true, ...config });
};

