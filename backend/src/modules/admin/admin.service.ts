/**
 *@description Handles all the admin logic it has direct contact with db
 */
import { SupabaseClient } from "@supabase/supabase-js"
import { getSafeSupabase } from "../../config/database"

export default class AdminImplementation {
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
      console.error("Turbo Log  ~ init ~ err:", err)
    }
  }

  public async verifyAdminLogin(email: string, password: string) {
    const { error } = await this.supabase.auth.signInWithPassword({
      email: email,
      password: password
    })
    if (error) return { message: false };

    return { message: true };
  }

  public async fetchAdminSignOut() {

    const { error } = await this.supabase.auth.signOut()
    if (error) return { message: false };

    return { message: true };
  }


  public async fetchAllCustomers() {
    const { data, error } = await this.supabase
      .from("all_customers")
      .select(`
      id,
      email,
      school_name,
      computer_based_test_slot,
      school_management_slot,
      activate,
      deactivate,
      school_management_slot,
      subscription(
        computer_based_test,
        school_management,
        health_management,
      )
    `)

    if (error) throw error;
    return data;
  }

  public async fetchCBTDetails() {
    const { data, error } = await this.supabase
      .from("view_school_cbt_usage")
      .select(`
      id,
      email,
      school_name,
      conputer_based_test_slot,
       used_cbt_slot
    `)
      .filter("subscription.computer_based_test", "eq", true);

    if (error) throw error;
    return data;
  }

  public async fetchSchoolManagementDetails() {
    const { data, error } = await this.supabase
      .from("view_school_management_usage")
      .select(`
      id,
      email,
      school_name,
      school_management_slot,
       used_school_management_slot`
      )

    if (error) throw error;
    return data;
  }


  public async fetchHealthManagementDetails() {
    const { data, error } = await this.supabase
      .from("all_customers")
      .select(`
      id,
      email,
      school_name,
      subscription(
        health_management
      )
    `)
      .filter("subscription.health_management", "eq", true);

    if (error) throw error;
    return data;
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


  public async fetch_IncreaseCBTSlot(slotValue: number, schoolId: number) {
    const { data, error } = await this.supabase.from("all_customers").update({ "conputer_based_test_slot": slotValue })
      .eq("user_id", schoolId)
    if (error) return false
    return true
  }

  public async fetch_IncreaseSchoolManagementSlot(slotValue: number, schoolId: number) {
    const { data, error } = await this.supabase.from("all_customers").update({ "school_management": slotValue })
      .eq("user_id", schoolId)
    if (error) return false
    return true
  }


  public async fetchAllSchoolStudent() {
    const { data, error } = await this.supabase.from("student_db").select(`
      id,
      student_name,
      student_department,
      student_class,
      student_age,
      all_customer(school_name , email)
      `)
    if (error) throw error
    return data
  }


  public async fetchAllSchoolTeacher() {
    const { data, error } = await this.supabase.from("teacher_db").select(`  all_customer(school_name , email)
      id,
      teacher_name,
      teacher_email,
       all_customer(school_name , email)
      `)
    if (error) throw error
    return data
  }


}
