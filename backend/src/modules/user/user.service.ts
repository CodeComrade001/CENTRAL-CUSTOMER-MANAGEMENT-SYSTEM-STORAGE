/**
 *@description Handles all the user logic it has direct contact with db
 */

import { Pool } from "pg";
import { connectToPostgres } from "../../config/database";
import { CBTpayload, HMSpayload, SMSpayload } from "./user.model";

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
      console.log("Turbo Log  ~ UserImplementation ~ init ~ err:", err);
      return
    }
  }

  public async fetchUserSignUpForSMS(payload: SMSpayload) {
    try {
      const data = await this.postgres.query("selct all from db")
      return { message: true };
    } catch (err) {
      return { message: null };
    }
  }

  public async fetchUserSignUpForHMS(payload: CBTpayload) {
    try {
      const data = await this.postgres.query("selct all from db")
      return { message: true };
    } catch (err) {
      return { message: null };
    }
  }

  public async fetchUserSignUpForCBT(payload: HMSpayload) {
    try {
      const data = await this.postgres.query("selct all from db")
      return { message: true };
    } catch (err) {
      return { message: null };
    }
  }

}

