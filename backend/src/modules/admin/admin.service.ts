/**
 *@description Handles all the admin logic it has direct contact with db
 */
import { connectToPostgres } from "../../config/database"
import { Pool } from "pg"
import bcrypt from "bcrypt"

export default class AdminImplementation {
  private postgres!: Pool
  private saltRound: number = 10

  constructor() {
    this.init()
  }

  /**
   * @description creates an new instance of a database and ensure that a connect was established
   */
  private async init() {
    this.postgres = await connectToPostgres()
  }


  public async adminSignIn(payload: { username: string, password: string }) {
    const { username, password } = payload;

    const result = await this.postgres.query(
      "SELECT *  FROM verify_admin_login($1)",
      [username]
    );

    if (result.rows.length === 0) {
      return { message: false };
    }

    const { out_user_id, out_password } = result.rows[0];

    const isMatch = await bcrypt.compare(password, out_password);
    if (!isMatch) {
      return { message: false };
    }

    return { message: true, id: out_user_id };
  }

  public async fetchAllCustomersForSMS() {
    const query = `SELECT customer_id,school_name,package,renewal_date,student_count,staff_count,last_payment_date,is_verified
    FROM school_management
    ORDER BY created_at ASC
    LIMIT 50
    `;

    const { rows } = await this.postgres.query(query);

    return { rows: rows.length === 0 ? [] : rows };
  }


  // public async adminNewAccount(
  // ) {

  //   const username = "Admin_00001"
  //   const password = "Admin123456789"
  //   const role = "admin"
  //   const email = "admin@gmmail.com"
  //   // Hash password
  //   const hashedPassword = await bcrypt.hash(password, 10);

  //   const query = `
  //   INSERT INTO admin (username, role, email, password)
  //   VALUES ($1, $2, $3, $4) RETURNING user_id
  // `;

  //   const data = await this.postgres.query(query, [
  //     username,
  //     role,
  //     email,
  //     hashedPassword
  //   ]);
  //   if (data.rowCount == null) return { id: "" }
  //   return { id: data.rows[0].user_id };
  // }


  public async fetchAllCustomersForHMS() {
    const query = `SELECT customer_id,hospital_name,package,renewal_date,last_payment,is_verified
    FROM health_management
    ORDER BY created_at ASC
    LIMIT 50
  `;

    const { rows } = await this.postgres.query(query);

    return { rows: rows.length === 0 ? [] : rows };
  }

  public async fetchAllCustomersForCBT() {
    const query = `SELECT customer_id,center_name,available_slot,used_slot,is_verified,number_of_server,last_slot_purchase,last_login
    FROM cbt_management
    ORDER BY created_at ASC
    LIMIT 50
  `;

    const { rows } = await this.postgres.query(query);

    return { rows: rows.length === 0 ? [] : rows };
  }

  public async changeCustomerAccesForSMS(payload: { customer_id: string, status: boolean }): Promise<boolean> {
    const { customer_id, status } = payload
    // Validate inputs
    if (typeof status !== 'boolean') {
      return false; // or throw new Error('Status must be a boolean');
    }
    if (!/^sch_\d+$/.test(customer_id)) {
      return false; // or throw new Error('Invalid customer_id format');
    }

    const query = `UPDATE school_management
    SET is_verified = $1
    WHERE customer_id = $2
  `;

    const data = await this.postgres.query(query, [status, customer_id]);

    const { rowCount } = data

    if (rowCount == null) return false //rowCount is null
    return rowCount > 0;
  }

  public async changeCustomerAccesForHMS(payload: { customer_id: string, status: boolean }) {
    const { customer_id, status } = payload
    // Validate inputs
    if (typeof status !== 'boolean') {
      return false; // or throw new Error('Status must be a boolean');
    }
    if (!/^hms_\d+$/.test(customer_id)) {
      return false; // or throw new Error('Invalid customer_id format');
    }

    const query = `UPDATE health_management
    SET is_verified = $1
    WHERE customer_id = $2
  `;

    const data = await this.postgres.query(query, [status, customer_id]);

    const { rowCount } = data

    if (rowCount == null) return false //rowCount is null
    return rowCount > 0;
  }

  public async changeCustomerAccesForCBT(payload: { customer_id: string, status: boolean }) {
    const { customer_id, status } = payload
    // Validate inputs
    if (typeof status !== 'boolean') {
      return false; // or throw new Error('Status must be a boolean');
    }
    if (!/^cbt_\d+$/.test(customer_id)) {
      return false; // or throw new Error('Invalid customer_id format');
    }

    const query = `UPDATE cbt_management
    SET is_verified = $1
    WHERE customer_id = $2
  `;

    const data = await this.postgres.query(query, [status, customer_id]);

    const { rowCount } = data

    if (rowCount == null) return false //rowCount is null
    return rowCount > 0;
  }

  public async updateCustomerPackageForHMS(payload: { customer_id: string, newPackage: string }) {
    const { customer_id, newPackage } = payload
    // Validate inputs
    const allowedPackages = ["starter ", "standard", "premium"]
    if (!allowedPackages.includes(newPackage.toLowerCase())) {
      return false; // or throw new Error('Status must be a string' or invalid package);
    }
    if (!/^hms_\d+$/.test(customer_id)) {
      return false; // or throw new Error('Invalid customer_id format');
    }

    const query = `UPDATE health_management
    SET package = $1
    WHERE customer_id = $2
  `;

    const data = await this.postgres.query(query, [newPackage, customer_id]);

    const { rowCount } = data

    if (rowCount == null) return false //rowCount is null
    return rowCount > 0;
  }

  public async updateCustomerPackageForSMS(payload: { customer_id: string, newPackage: string }) {
    const { customer_id, newPackage } = payload
    const allowedPackages = ["basic", "pro", "premium", "enterprise"]
    // Validate inputs
    if (!allowedPackages.includes(newPackage.toLowerCase())) {
      return false; // or throw new Error('Status must be a string or invalid package');
    }
    if (!/^sch_\d+$/.test(customer_id)) {
      return false; // or throw new Error('Invalid customer_id format');
    }

    const query = `UPDATE school_management
    SET package = $1
    WHERE customer_id = $2
    `;

    const data = await this.postgres.query(query, [newPackage, customer_id]);

    const { rowCount } = data

    if (rowCount == null) return false //rowCount is null
    return rowCount > 0;
  }

  public async updateCustomerSlotForCBT(payload: { customer_id: string, newSlot: number }) {
    const { customer_id, newSlot } = payload

    if (!/^cbt_\d+$/.test(customer_id)) {
      return false; // or throw new Error('Invalid customer_id format');
    }

    const query = `UPDATE cbt_management
    SET available_slot = $1
    WHERE customer_id = $2
  `;

    const data = await this.postgres.query(query, [newSlot, customer_id]);

    const { rowCount } = data

    if (rowCount == null) return false //rowCount is null
    return rowCount > 0;
  }




}
