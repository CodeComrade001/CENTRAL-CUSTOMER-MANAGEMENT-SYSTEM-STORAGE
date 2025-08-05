/**
 *@description Handles all the admin logic it has direct contact with db
 */
import { connectToPostgres } from "../../config/database"
import { Pool } from "pg"

export default class AdminImplementation {
  private postgres!: Pool

  constructor() {
    this.init()
  }

  /**
   * @description creates an new instance of a database and ensure that a connect was established
   */
  private async init() {
    this.postgres = await connectToPostgres()
  }

  public async verifyAdminLogin(email: string, password: string) {
    const data = await this.postgres.query("selct all from db")
    return { message: true };
  }




  public async fetchAdminSignOut() {
    const data = await this.postgres.query("selct all from db")
    return { message: true };
  }


  public async fetchAllCustomers() {
    const data = await this.postgres.query("selct all from db")
    return data;
  }


  public async fetchCBTDetails() {
    const data = await this.postgres.query("selct all from db")
    return data;
  }

  // School-management slot
  public async fetchSchoolManagementDetails() {
    const data = await this.postgres.query("selct all from db")
    return data
  }

  // Health-management only
  public async fetchHealthManagementDetails() {
    const data = await this.postgres.query("selct all from db")
    return data
  }



  public async fetch_CustomerAccountActivation(userIdToBeUpdated: string) {
    const data = await this.postgres.query("selct all from db")
    return { message: true }
  }


  public async fetch_CustomerAccountDeactivation(userIdToBeUpdated: string) {
    const data = await this.postgres.query("selct all from db")
    return { message: true }
  }


  public async fetch_IncreaseCBTSlot(slotValue: number, schoolId: number) {
    const data = await this.postgres.query("selct all from db")
    return true
  }

  public async fetch_IncreaseSchoolManagementSlot(slotValue: number, schoolId: number) {
    const data = await this.postgres.query("selct all from db")
    return true
  }


  public async fetchAllSchoolStudent() {
    const data = await this.postgres.query("selct all from db")
    return data
  }


  public async fetchAllSchoolTeacher() {
    const data = await this.postgres.query("selct all from db")
    return data
  }


}
