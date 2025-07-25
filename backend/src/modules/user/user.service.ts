/**
 *@description Handles all the user logic it has direct contact with db
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { getSafeSupabase } from "../../config/database";


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

  protected async storeSchoolName(schoolName: string): Promise<boolean> {
    try {
      if (schoolName === "") return false;

      const { error } = await this.supabase
        .from("all_customers")
        .insert([{ school_name: schoolName }]);

      if (error) throw error;
      return true;
    } catch (err) {
      console.log("Turbo Log  ~ UserImplementation ~ storeSchoolName ~ err:", err);
      return false;
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
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: userEmail,
      password: userPassword
    });
    if (error) throw error;
    return data;
  }

  /**
   * @notice Registers a new user with email and password.
   * @param userEmail - The new user's email.
   * @param userPassword - The new user's password.
   * @returns Supabase sign-up response object.
   * @throws Error if registration fails.
   * @note co.
   */
  public async fetchUserSignUp(schoolName: string, userEmail: string, userPassword: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email: userEmail,
      password: userPassword
    });

    if (error) throw error;
    await this.storeSchoolName(schoolName)
    return data;
  }

  /**
   * @notice Retrieves all available subscription packages.
   * @returns List of available packages from the database.
   * @throws Error if Supabase query fails.
   */
  public async fetchUserSelectPlan() {
    const { data, error } = await this.supabase
      .from("rygma_subsription")
      .select("school_management_system ,computer_base_testing_system ,health_management_system");
    if (error) throw error;
    return data;
  }

  /**
   * @notice Updates the selected product plan for a user.
   * @param userSelectedPlan - Object containing product and subscription status.
   * @returns Update response data from Supabase.
   * @throws Error if the update fails.
   */
  public async fetchUserPlanEdit(userSelectedPlan: {
    product: string;
    product_subscription: boolean;
  }) {
    const { product, product_subscription } = userSelectedPlan;

    const { data, error } = await this.supabase
      .from("all_customer")
      .update({ [product]: product_subscription })

    if (error) throw error;
    return data;
  }
}

