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

  public async adminSignOut() {
    return { message: true };
  }




  public async adminSignIn(payload: { username: string, password: string }) {
    const { username, password } = payload
    // const username = "Admin36453"
    // const password = "Admin123456789"
    // console.log("Turbo Log  ~ AdminImplementation ~ adminSignIn ~ username:", username);
    // console.log("Turbo Log  ~ AdminImplementation ~ adminSignIn ~ password:", password);
    const result = await this.postgres.query(
      "SELECT id,role, email,password FROM admin WHERE username = $1 AND role = 'admin'",
      [username]
    );

    if (result.rows.length === 0) return { message: false };

    const hashedPassword = result.rows[0].password;
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) return { message: false };

    return { message: true, id: result.rows[0].id, data: result.rows[0] };
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


  // public async adminNewAccount(
  // ) {

  //   const username = "Admin36453"
  //   const password = "Admin123456789"
  //   const role = "admin"
  //   const email = "admin@gmmail.com"
  //   // Hash password
  //   const hashedPassword = await bcrypt.hash(password, 10);

  //   const query = `
  //   INSERT INTO admin (username, role, email, password)
  //   VALUES ($1, $2, $3, $4) RETURNING id
  // `;

  //   const data = await this.postgres.query(query, [
  //     username,
  //     role,
  //     email,
  //     hashedPassword
  //   ]);
  //   if (data.rowCount == null) return false
  //   return data.rows[0].id;
  // }




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
    if (typeof newPackage !== 'string' || !allowedPackages.includes(newPackage.toLowerCase())) {
      return false; // or throw new Error('Status must be a string' or invalid package);
    }
    if (!/^hms_\d+$/.test(customer_id)) {
      return false; // or throw new Error('Invalid customer_id format');
    }

    const query = `UPDATE cbt_management
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
    const allowedPackages = ["basic ", "pro", "premium ", "enterprise"]
    // Validate inputs
    if (typeof newPackage !== 'string' || !allowedPackages.includes(newPackage.toLowerCase())) {
      return false; // or throw new Error('Status must be a string or invalid package');
    }
    if (!/^sch_\d+$/.test(customer_id)) {
      return false; // or throw new Error('Invalid customer_id format');
    }

    const query = `UPDATE cbt_management
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
    // Validate inputs
    if (typeof newSlot !== 'number') {
      return false; // or throw new Error('Status must be a boolean');
    }
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
