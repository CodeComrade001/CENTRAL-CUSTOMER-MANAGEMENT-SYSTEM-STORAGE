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


  /**
   * @notice Fetches user email and company information for initial setup.
   * @returns A list of user details containing email and company name.
   * @throws Error if Supabase query fails.
   */
  public async fetchUserDetails() {
    const { data, error } = await this.supabase
      .from("user_product_overview")
      .select("email, Company");
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
   */
  public async fetchUserSignUp(userEmail: string, userPassword: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email: userEmail,
      password: userPassword
    });
    if (error) throw error;
    return data;
  }

  /**
   * @notice Retrieves all available subscription packages.
   * @returns List of available packages from the database.
   * @throws Error if Supabase query fails.
   */
  public async fetchUserSelectPlan() {
    const { data, error } = await this.supabase
      .from("user_product_overview")
      .select("packages");
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
      .from("user_product_overview")
      .update({ [product]: product_subscription })
      .eq("product", product);

    if (error) throw error;
    return data;
  }
}

