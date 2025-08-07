import * as z from "zod";
/*//////////////////////////////////////////////////////////////
                        ALL INTERFACE FOR USER
    //////////////////////////////////////////////////////////////*/

export interface SMSpayload {
  school_name: string;
  package: string;  // Starter || Standard || Premium, 
  renewal_date: string; //date
  student_count: number
  staff_count: number
  last_payment_date: string; //date
}

export interface CBTpayload {
  center_name: string,
  available_slot: number,
  used_slot: number,
  last_slot_purchase: string, //date
  last_login: string //date
}

export interface HMSpayload {
  hospital_name: string,
  package: string, // Basic or Pro || Premium or Enterprise,
  renewal_date: string, //date
  last_payment: string, //date
}


/*//////////////////////////////////////////////////////////////
                          ALL USER ZOD MODEL
    //////////////////////////////////////////////////////////////*/


const validateSMS = z.object({
  school_name: z.string(),
  package: z.string(),
  renewal_date: z.string(),
  staff_count: z.number(),
  student_count: z.number(),
  last_payment_date: z.string(),
});

const validateHMS = z.object({
  hospital_name: z.string(),
  package: z.string(),
  renewal_date: z.string(),
  last_payment: z.string(),
});

const validateCBT = z.object({
  center_name: z.string(),
  available_slot: z.number(),
  used_slot: z.number(),
  last_slot_purchase: z.string(),
  last_login: z.string(),
});


export { validateSMS, validateHMS, validateCBT, }