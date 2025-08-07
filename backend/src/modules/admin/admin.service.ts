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




  public async adminSignIn(username: string, password: string) {
    const result = await this.postgres.query(
      "SELECT password FROM admin WHERE username = $1 AND role = 'admin'",
      [username]
    );

    if (result.rows.length === 0) return { message: false };

    const hashedPassword = result.rows[0].password;
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) return { message: false };

    // TODO: Invalidate session or JWT token here
    return { message: true };
  }


  public async fetchAllCustomersForSMS() {
    const query = `SELECT customer_id,school_name,package,renewal_date,student_count,staff_count,last_payment_date,is_verified,
    FROM school_management
    ORDER BY created_at ASC
    LIMIT 50
  `;

    const { rows } = await this.postgres.query(query);

    return rows.length === 0 ? [] : rows;
  }


  public async fetchAllCustomersForHMS() {
    const query = `SELECT customer_id,hospital_name,package,renewal_date,last_payment,is_verified,
    FROM health_management
    ORDER BY created_at ASC
    LIMIT 50
  `;

    const { rows } = await this.postgres.query(query);

    return rows.length === 0 ? [] : rows;
  }

  public async fetchAllCustomersForCBT() {
    const query = `SELECT customer_id,center_name,available_slot,used_slot,is_verified,number_of_servers,last_slot_purchase,last_login,
    FROM cbt_management
    ORDER BY created_at ASC
    LIMIT 50
  `;

    const { rows } = await this.postgres.query(query);

    return rows.length === 0 ? [] : rows;
  }

  public async changeCustomerAccesForSMS(customer_id: string, status: boolean): Promise<boolean> {
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


  public async adminNewAccount(
    username: string,
    role: boolean,
    email: string,
    password: string
  ) {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
    INSERT INTO admin (username, role, email, password)
    VALUES ($1, $2, $3, $4) RETURNING id
  `;

    const data = await this.postgres.query(query, [
      username,
      role,
      email,
      hashedPassword
    ]);
    if (data.rowCount == null) return false
    return data.rows[0].id;;
  }




  public async changeCustomerAccesForHMS(customer_id: string, status: boolean) {
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

  public async changeCustomerAccesForCBT(customer_id: string, status: boolean) {
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

  public async updateCustomerPackageForHMS(customer_id: string, newPackage: string) {
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

  public async updateCustomerPackageForSMS(customer_id: string, newPackage: string) {
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

  public async updateCustomerSlotForCBT(customer_id: string, newSlot: number) {
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
