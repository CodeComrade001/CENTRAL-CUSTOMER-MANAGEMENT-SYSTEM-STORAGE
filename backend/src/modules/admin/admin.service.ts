/**
 *@description Handles all the admin logic it has direct contact with db
 */
import { SupabaseClient } from "@supabase/supabase-js"
import { getSafeSupabase } from "../../config/database"
import bcrypt from "bcrypt";

export default class AdminImplementation {
  private supabase!: SupabaseClient
  private saltRounds = 10;

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
      console.error("Turbo Log  ~ init ~ err:", err)
    }
  }



  public async verifyAdminLogin(username: string, inputPassword: string) {
    const { data, error } = await this.supabase.rpc("get_staff_password", {
      p_username: username
    });

    if (error || !data) return false;

    const isMatch = await bcrypt.compare(inputPassword, data);
    if (!isMatch) return false;
    return true;
  }

  public async fetchAdminSignOut() {

    const { error } = await this.supabase.auth.signOut()
    if (error) return { message: false };

    return { message: true };
  }

  public async fetchAllDetails() {
    const { data, error } = await this.supabase.from("all_customers").select("school_id,email,school_management_slot,company_name,conputer_based_test_slot, subscription(computer_based_test, school_management, health_management)")
    console.log("Turbo Log  ~ AdminImplementation ~ fetchAllDetails ~ data:", data);
    if (error) throw error
    return data
  }

  public async fetch_CustomerAccountActivation(userIdToBeUpdated: string) {

    const { data, error } = await this.supabase
      .from('all_customers')
      .update({ activate: true, deactivate: false })
      .eq('user_id', userIdToBeUpdated)
      .select()

    if (error) throw error
    return data
  }


  public async fetch_CustomerAccountDeactivation(userIdToBeUpdated: string) {
    const { data, error } = await this.supabase
      .from('all_customers')
      .update({ activate: false, deactivate: true })
      .eq('user_id', userIdToBeUpdated)
      .select()
    if (error) return false
    return true
  }


  public async fetch_IncreaseCBTSlot(slotValue: number, schoolId: string) {
    const { data, error } = await this.supabase.from("all_customers").update({ "conputer_based_test_slot": slotValue })
      .eq("user_id", schoolId)
    if (error) return false
    return true
  }


  public async fetchSchoolManagementCBT_student(schoolId: string) {
    const { data, error } = await this.supabase.from("computer_base_testing_system_db").select(`student_db(*)`)
      .eq("school_id", schoolId)
    if (error) throw error
    return data
  }


  public async fetchSchoolManagement_alldetails(schoolId: string) {
    const { data, error } = await this.supabase.from("school_management_system").select(`student_db(*),teacher_db(*) `).eq("school_id", schoolId)
    if (error) throw error
    return data
  }


}
