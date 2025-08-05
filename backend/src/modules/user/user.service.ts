/**
 *@description Handles all the user logic it has direct contact with db
 */

import { Pool } from "pg";
import { connectToPostgres } from "../../config/database";

interface AddStudent {
  id?: string;
  student_name?: string;
  student_class?: string;
  student_department?: string;
  student_age?: string;
}

interface AddTeacher {
  teacher_name?: string;
  teacher_email?: string;
}

interface EditStudent {
  id?: string;
  student_name?: string;
  student_class?: string;
  student_department?: string;
  student_age?: string;
}
interface EditTeacher {
  id?: string;
  teacher_name?: string;
  teacher_email?: string;
}

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
      return
    }
  }

  protected async storeSchoolName(schoolName: string) {
    try {
      const data = await this.postgres.query("selct all from db")
      return { message: true };
    } catch (err) {
      return { message: null };
    }
  }

  protected async verifySession() {
    try {
      const data = await this.postgres.query("selct all from db")
      return true
    } catch (err) {
      return false
    }
  }

  protected async CheckUserAccountIsActive(): Promise<{ activated: boolean }> {
    const data = await this.postgres.query("selct all from db")

    // data will be `null` if no rows, so default to empty array
    return { activated: true };
  }


  /**
   * @notice Fetches user email and school_name information for initial setup.
   * @returns A list of user details containing email and company name.
   * @throws Error if Supabase query fails.
   */
  public async fetchUserDetails() {

    const data = await this.postgres.query("selct all from db")
    return data;
  }

  /**
   * @notice Authenticates a user using email and password.
   * @param userEmail - The user's email address.
   * @param userPassword - The user's password.
   * @returns Supabase sign-in response object.
   * @throws Error if login fails.
   */
  public async fetchUserLogin(userEmail: string, userPassword: string) {
    const data = await this.postgres.query("selct all from db")
    return { message: true };
  }

  /**
   * @notice Registers a new user with email and password.
   * @param userEmail - The new user's email.
   * @param userPassword - The new user's password.
   * @returns Supabase sign-up response object.
   * @throws Error if registration fails.
   * @note co.
   */
  public async fetchUserSignUp(schoolName: string, email: string, password: string) {
    const data = await this.postgres.query("selct all from db")

    return { message: true };

  }


  /**
   * @notice Retrieves all available subscription packages.
   * @returns List of available packages from the database.
   * @throws Error if Supabase query fails.
   */
  public async fetchUserSelectedPlan() {
    const data = await this.postgres.query("selct all from db")
    return data;
  }

  /**
   * @notice Updates the selected product plan for a user.
   * @param userSelectedPlan - Object containing product and subscription status.
   * @returns Update response data from Supabase.
   * @throws Error if the update fails.
   */
  public async fetchUserPlanEdit(
    id: number,
    product_name: string,
    product_subscription: boolean
  ) {

    const data = await this.postgres.query("selct all from db")

    return { message: true };
  }




  public async fetchUserSignOut() {

    const data = await this.postgres.query("selct all from db")
    return { message: true };
  }

  public async createStudents(
    students: AddStudent | AddStudent[]
  ): Promise<any> {
    const data = await this.postgres.query("selct all from db")
    return { message: true };
  }


  public async updateStudents(
    students: EditStudent | EditStudent[]
  ): Promise<any> {
    const data = await this.postgres.query("selct all from db")

    return { message: true };
  }

  public async createTeachers(
    teachers: AddTeacher | AddTeacher[]
  ): Promise<any> {
    const data = await this.postgres.query("selct all from db")
    return { message: true };
  }

  public async updateTeachers(
    teachers: EditTeacher | EditTeacher[]
  ): Promise<any> {
    const data = await this.postgres.query("selct all from db")
    return { message: true };
  }
  /**
    * @notice Fetch all registered students
    */
  public async getAllStudents() {
    const data = await this.postgres.query("selct all from db")

    return data;
  }

  /**
   * @notice Fetch all registered teachers
   */
  public async getAllTeachers() {
    const data = await this.postgres.query("selct all from db")

    return data;
  }

  /**
   * @notice Fetch students marked for CBT via subscription
   */
  public async getAllCBTStudents() {
    const data = await this.postgres.query("selct all from db")

    return data;
  }

  //   /**
  //    * @notice validate session to protect private route
  //    */
  //   /**
  //  * @notice Service method to validate user session using token
  //  */

  //   // utils/token.ts

  // export function extractBearerToken(req: Request): string | null {
  //   const authHeader = req.headers["authorization"] as string | undefined;
  //   if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  //   return authHeader.slice(7);
  // }

}

