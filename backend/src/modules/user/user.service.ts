/**
 *@description Handles all the user logic it has direct contact with db
 */

import { Pool } from "pg";
import { connectToPostgres } from "../../config/database";
import { CBTpayload, HMSpayload, SMSpayload } from "./user.model";

export default class UserImplementation {
  private postgres!: Pool

  constructor() {
    this.init()
  }

  /**
   * @description creates an new instance of a database and ensure that a connect was established
   */
  private async init() {
    try {
      this.postgres = await connectToPostgres()
    } catch (err) {
      console.log("Turbo Log  ~ UserImplementation ~ init ~ err:", err);
      return
    }
  }



  public async fetchUserSignUpForSMS(payload: SMSpayload) {
    const allowedPackages = ["basic", "pro", "premium", "enterprise"];
    const {
      school_name,
      package: userPackage,
      renewal_date,
      student_count,
      staff_count,
      last_payment_date,
    } = payload;

    // Trim and validate package
    const trimmedPackage = userPackage.trim().toLowerCase();
    if (!allowedPackages.includes(trimmedPackage)) {
      return { error: "Invalid package selected." };
    }

    try {
      const query = `
      INSERT INTO school_management (
        school_name, package, renewal_date, student_count, staff_count, last_payment_date
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `;

      const values = [
        school_name,
        trimmedPackage,
        renewal_date,
        student_count,
        staff_count,
        last_payment_date,
      ];

      await this.postgres.query(query, values);

      return { message: true };
    } catch (err) {
      console.error("DB Insert Error:", err); // Log for debugging
      return { error: "Failed to insert data." };
    }
  }


  public async fetchUserSignUpForHMS(payload: HMSpayload) {
    const allowedPackages = ["starter ", "standard", "premium"]
    const {
      hospital_name,
      package: userPackage,
      renewal_date,
      last_payment,
    } = payload;

    // Trim and validate package
    const trimmedPackage = userPackage.trim().toLowerCase();
    if (!allowedPackages.includes(trimmedPackage)) {
      return { error: "Invalid package selected." };
    }

    try {
      const query = `
      INSERT INTO health_management (
        school_name, package, renewal_date, student_count, staff_count, last_payment_date
      ) VALUES ($1, $2, $3, $4)
    `;

      const values = [
        trimmedPackage,
        hospital_name,
        renewal_date,
        last_payment,
      ];

      await this.postgres.query(query, values);

      return { message: true };
    } catch (err) {
      console.error("DB Insert Error:", err); // Log for debugging
      return { error: "Failed to insert data." };
    }
  }

  public async fetchUserSignUpForCBT(payload: CBTpayload) {
    const {
      center_name,
      available_slot,
      used_slot,
      last_slot_purchase,
      last_login,
    } = payload;


    try {
      const query = `
      INSERT INTO cbt_management (
        school_name, package, renewal_date, student_count, staff_count, last_payment_date
      ) VALUES ($1, $2, $3, $4, $5) 
    `;

      const values = [
        center_name,
        available_slot,
        used_slot,
        last_slot_purchase,
        last_login,
      ];

      await this.postgres.query(query, values);

      return { message: true };
    } catch (err) {
      console.error("DB Insert Error:", err); // Log for debugging
      return { error: "Failed to insert data." };
    }
  }

}

