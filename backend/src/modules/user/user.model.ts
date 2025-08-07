export interface SMSpayload {
  school_name: string;
  package: string;  // Starter || Standard || Premium, 
  renewal_date: string; //date
  student_count: number
  staff_count: number
  last_payment_date: string; //date
  is_verified: boolean;
  created_at: string //date
}

export interface CBTpayload {
  center_name: string,
  available_slot: number,
  used_slot: number,
  is_verified: boolean,
  number_of_servers: number,
  last_slot_purchase: string, //date
  last_login: string //date
}

export interface HMSpayload {
  hospital_name: string,
  package: string, // Basic or Pro || Premium or Enterprise,
  renewal_date: string, //date
  last_payment: string, //date
  is_verified: boolean
}