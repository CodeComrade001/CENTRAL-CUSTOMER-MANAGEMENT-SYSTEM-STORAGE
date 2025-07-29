/**
 *@description Handles all the user logic it has direct contact with db
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { getSafeSupabase } from "../../config/database";

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
  private supabase!: SupabaseClient

  constructor() {
    this.init()
  }

  /**
   * @description creates an new instance of a database and ensure that a connect was established
   */
  private async init() {
    try {
      this.supabase = await getSafeSupabase()
    } catch (err) {
      console.log("Turbo Log  ~ UserImplementation ~ init ~ err:", err);
    }
  }

  protected async storeSchoolName(schoolName: string) {
    try {
      if (schoolName === "") return false;

      const { error } = await this.supabase
        .from("all_customers")
        .insert([{ school_name: schoolName }]);

      if (error) return { message: false };
      return { message: true };
    } catch (err) {
      console.log("Turbo Log  ~ UserImplementation ~ storeSchoolName ~ err:", err);
      return { message: null };
    }
  }

  protected async verifySession() {
    try {
      const { error } = await this.supabase.auth.getSession()
      if (error) return false;
      return true
    } catch (err) {
      console.log("Turbo Log  ~ UserImplementation ~ verifySession ~ err:", err);
      return false
    }
  }

  protected async fetchUserSlot(): Promise<
    { computer_based_test_slot: string; school_management_slot: string }[]
  > {
    try {
      const { data, error } = await this.supabase
        .from("all_customers")
        .select("computer_based_test_slot, school_management_slot");
      if (error) {
        console.error(
          "Turbo Log  ~ UserController ~ fetchUserSlot ~ supabase error:",
          error
        );
        // You could re-throw here if you want upstream to handle it
        return [];
      }
      // data will be `null` if no rows, so default to empty array
      return data ?? [];
    } catch (err) {
      console.error(
        "Turbo Log  ~ UserController ~ fetchUserSlot ~ unexpected err:",
        err
      );
      // Return empty array to satisfy callers expecting an array
      return [];
    }
  }


  /**
   * @notice Fetches user email and company information for initial setup.
   * @returns A list of user details containing email and company name.
   * @throws Error if Supabase query fails.
   */
  public async fetchUserDetails() {

    let { data, error } = await this.supabase
      .from('all_customers')
      .select('conputer_based_test_slot,school_management_slot')
    console.log("Turbo Log  ~ UserImplementation ~ fetchUserDetails ~ data:", data);

    if (error) throw error;
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
    const { error } = await this.supabase.auth.signInWithPassword({
      email: userEmail,
      password: userPassword
    });
    console.log("Turbo Log  ~ UserImplementation ~ fetchUserLogin ~ error:", error);
    if (error) return { message: false };
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
    const { data: authData, error: signUpError } = await this.supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (signUpError) throw signUpError;

    // 🔒 Wait for auth to fully complete before inserting
    const { error: signInError } = await this.supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
    if (signInError) throw signInError;

    // ✅ Now insert: auth.uid() is available
    const { error: insertError } = await this.supabase.from('all_customers').insert([
      { company_name: schoolName }
    ]);
    if (insertError) return { message: false };

    return { message: true };

  }


  /**
   * @notice Retrieves all available subscription packages.
   * @returns List of available packages from the database.
   * @throws Error if Supabase query fails.
   */
  public async fetchUserSelectedPlan() {
    const { data, error } = await this.supabase
      .from("subscription")
      .select("computer_based_test, school_management ,health_management ");
    if (error) throw error;
    return data;
  }

  /**
   * @notice Updates the selected product plan for a user.
   * @param userSelectedPlan - Object containing product and subscription status.
   * @returns Update response data from Supabase.
   * @throws Error if the update fails.
   */
  public async fetchUserPlanEdit(
    product_name: string,
    product_subscription: boolean
  ) {
    console.log("Turbo Log  ~ fetchUserPlanEdit ~ product_name:", product_name);
    console.log("Turbo Log  ~ fetchUserPlanEdit ~ product_subscription:", product_subscription);

    let column: string;

    switch (product_name) {
      case "school_management":
        column = "school_management";
        break;
      case "computer_based_test":
        column = "computer_base_test";
        break;
      case "health_management":
        column = "health_management";
        break;
      default:
        return { message: false }; // Invalid input
    }

    // Simply update the column for the current user
    const { error } = await this.supabase
      .from("subscription")
      .update({ [column]: product_subscription })

    console.log("Turbo Log ~ fetchUserPlanEdit ~ update error:", error);

    if (error) return { message: false };

    return { message: true };
  }




  public async fetchUserSignOut() {

    const { error } = await this.supabase.auth.signOut()
    if (error) return { message: false };

    return { message: true };
  }

  public async createStudents(
    students: AddStudent | AddStudent[]
  ): Promise<any> {
    const studentArray = Array.isArray(students) ? students : [students];

    const { data, error } = await this.supabase
      .from('student_db')
      .insert(studentArray)
      .select(); // Optional: remove if not needed

    if (error) return { message: false };
    return { message: true };
  }


  public async updateStudents(
    students: EditStudent | EditStudent[]
  ): Promise<any> {
    const studentArray = Array.isArray(students) ? students : [students];

    await Promise.all(
      studentArray.map(async (student) => {
        const { id, ...fields } = student;

        const { data, error } = await this.supabase
          .from('student_db')
          .update(fields)
          .eq('id', id)
          .select();

        if (error) return { message: false };
        return { message: true };
      })
    );

    return { message: true };
  }

  public async createTeachers(
    teachers: AddTeacher | AddTeacher[]
  ): Promise<any> {
    const teacherArray = Array.isArray(teachers) ? teachers : [teachers];

    const { data, error } = await this.supabase
      .from('teacher_db')
      .insert(teacherArray)
      .select(); // Optional: remove if not needed

    if (error) return { message: false };
    return { message: true };
  }

  public async updateTeachers(
    teachers: EditTeacher | EditTeacher[]
  ): Promise<any> {
    const teacherArray = Array.isArray(teachers) ? teachers : [teachers];

    const updates = await Promise.all(
      teacherArray.map(async (teacher) => {
        const { id, ...fields } = teacher;

        const { data, error } = await this.supabase
          .from('teacher_db')
          .update(fields)
          .eq('id', id)
          .select();

        if (error) return { message: false };
        return { message: true };
      })
    );

    return { message: true };
  }
  /**
    * @notice Fetch all registered students
    */
  public async getAllStudents() {
    const { data, error } = await this.supabase.from("student_db").select("id,student_name,student_department,student_class, student_age");

    if (error) {
      console.error("StudentService ~ getAllStudents ~ error:", error.message);
      throw new Error("Failed to fetch students");
    }

    return data;
  }

  /**
   * @notice Fetch all registered teachers
   */
  public async getAllTeachers() {
    const { data, error } = await this.supabase.from("teachers").select("id,teacher_name,teacher_email");

    if (error) {
      console.error("StudentService ~ getAllTeachers ~ error:", error.message);
      throw new Error("Failed to fetch teachers");
    }

    return data;
  }

  /**
   * @notice Fetch students marked for CBT via subscription
   */
  public async getAllCBTStudents() {
    const { data, error } = await this.supabase
      .from("student_db")
      .select(`
      id,
      student_name,
      student_department,
      student_class,
      student_age,
      computer_based_test_system!inner(student_id)
    `);

    if (error) {
      console.error("StudentService ~ getAllCBTStudents ~ error:", error.message);
      throw new Error("Failed to fetch CBT students");
    }

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

