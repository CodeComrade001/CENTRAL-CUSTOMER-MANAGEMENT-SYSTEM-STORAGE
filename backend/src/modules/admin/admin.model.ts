import * as z from "zod";
export interface SMSpayload {
  customer_id: string; //sch_*****
  school_name: string; //ogoekeog
  package: string;  // Starter || Standard || Premium, 
  renewal_date: string; //date
  student_count: number
  staff_count: number
  last_payment_date: string; //date
  is_verified: boolean;
  created_at: string //date
}

export interface CBTpayload {
  customer_id: string; //cbt_*****
  center_name: string,
  available_slot: number,
  used_slot: number,
  is_verified: boolean,
  number_of_servers: number,
  last_slot_purchase: string, //date
  last_login: string //date
}

export interface HMSpayload {
  customer_id: string; //hms_*****
  hospital_name: string,
  package: string, // Basic or Pro || Premium or Enterprise,
  renewal_date: string, //date
  last_payment: string, //date
  is_verified: boolean
}

/*//////////////////////////////////////////////////////////////
                         ALL ADMIN ZOD SCHEMA
    //////////////////////////////////////////////////////////////*/

const loginInAdmin = z.object({
  username: z.string(),
  password: z.string(),
})

const customerAccess = z.object({
  customer_id: z.string(),
  status: z.boolean(),
})

const packageUpdate = z.object({
  customer_id: z.string(),
  newPackage: z.string(),
})

const slotUpdate = z.object({
  customer_id: z.string(),
  newSlot: z.number(),
})







export { loginInAdmin, customerAccess, packageUpdate, slotUpdate }