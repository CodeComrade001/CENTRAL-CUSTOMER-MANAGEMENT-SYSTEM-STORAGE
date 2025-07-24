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

  /**
   * @description this is for testing purpose in initial setup
   */
  public async fetchAdminLogedIn() {
    const { data, error } = await this.supabase.from("admins").select("*")
    if (error) throw error
    return data
  }
  public async fetchAllDetails() {
    const { data, error } = await this.supabase.from("admins").select("*")
    if (error) throw error
    return data
  }
  public async fetchCustomerActivation() {
    const { data, error } = await this.supabase.from("admins").select("*")
    if (error) throw error
    return data
  }
  public async fetchCustomerDeactivation() {
    const { data, error } = await this.supabase.from("admins").select("*")
    if (error) throw error
    return data
  }
  public async fetchIncreaseInSlot() {
    const { data, error } = await this.supabase.from("admins").select("*")
    if (error) throw error
    return data
  }

  private async validateUser() {

  }
}
