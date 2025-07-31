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
    this.supabase = await getSafeSupabase()
  }

  public async verifyAdminLogin(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: email,
      password: password
    })
    if (error) return { message: false };

    const token = data.session.access_token;
    return { message: true, token };
  }




  public async fetchAdminSignOut() {

    const { error } = await this.supabase.auth.signOut()
    if (error) return { message: false };

    return { message: true };
  }


  public async fetchAllCustomers() {
    const { data, error } = await this.supabase
      .from("all_customers")
      .select(`id,email,school_name,computer_based_test_slot,school_management_slot, activated`);

    if (error) throw error;
    return data;
  }


  public async fetchCBTDetails() {
    const { data, error } = await this.supabase
      .from("all_customers")
      .select(`
       id,
      email,
      school_name,
      subscription (
        school_id,
        computer_based_test,
        school_management,
        health_management
      )
    `)
      .eq("subscription.computer_based_test", true);

    if (error) throw error;
    return data;
  }

  // School-management slot
  public async fetchSchoolManagementDetails() {
    const { data, error } = await this.supabase
      .from("all_customers")
      .select(`
      id,
      email,
      school_name,
      subscription (
        school_id,
        computer_based_test,
        school_management,
        health_management
        )
        `)
      .eq("subscription.school_management", true);
    if (error) throw error;
    return data
  }

  // Health-management only
  public async fetchHealthManagementDetails() {
    const { data, error } = await this.supabase
      .from("all_customers")
      .select(`
      id,
      email,
      school_name,
      subscription (
        school_id,
        computer_based_test,
        school_management,
        health_management
        )
        `)
      .eq("subscription.health_management", true);
    if (error) throw error;
    return data
  }



  public async fetch_CustomerAccountActivation(userIdToBeUpdated: string) {

    const { data, error } = await this.supabase
      .from('all_customers')
      .update({ activated: true })
      .eq('id', userIdToBeUpdated)
      .select()

    if (error) return { message: false }
    return { message: true }
  }


  public async fetch_CustomerAccountDeactivation(userIdToBeUpdated: string) {
    const { data, error } = await this.supabase
      .from('all_customers')
      .update({ activated: false })
      .eq('id', userIdToBeUpdated)
      .select()
    if (error) return { message: false }
    return { message: true }
  }


  public async fetch_IncreaseCBTSlot(slotValue: number, schoolId: number) {
    const { data, error } = await this.supabase.from("all_customers").update({ "computer_based_test_slot": slotValue })
      .eq("user_id", schoolId)
    if (error) return false
    return true
  }

  public async fetch_IncreaseSchoolManagementSlot(slotValue: number, schoolId: number) {
    const { data, error } = await this.supabase.from("all_customers").update({ "school_management_slot": slotValue })
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
      school_name,
      student_name,
      all_customers( school_id)
      `)
    if (error) throw error
    return data
  }


  public async fetchAllSchoolTeacher() {
    const { data, error } = await this.supabase.from("teacher_db").select(`  
      id,
      teacher_name,
      teacher_email,
      school_name,
      all_customers(school_id)
      school_name in all_customers
      `)
    if (error) throw error
    return data
  }


}
