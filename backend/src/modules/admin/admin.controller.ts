/**
 * @description Handles pre-DB logic like input validation, before delegating to service
 */
import { Request, Response, NextFunction } from "express";
import AdminImplementation from "./admin.service";

export default class AdminController {
  private adminService: AdminImplementation;

  constructor() {
    this.adminService = new AdminImplementation(); // Instantiate internally
  }

  public async getAdminLogedIn(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Validate inputs (if any)
      // 2. Apply middleware before this point in Express

      const { adminPassword, adminUsername } = req.body
      const admins = await this.adminService.fetchAdminLogedIn();
      return res.status(200).json(admins);
    } catch (err) {
      console.log("Turbo Log  ~ AdminController ~ getAdminLogedIn ~ err:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  public async getAllDetails(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Validate inputs (if any)
      // 2. Apply middleware before this point in Express

      const admins = await this.adminService.fetchAllDetails();
      return res.status(200).json(admins);
    } catch (err) {
      console.log("Turbo Log  ~ AdminController ~ getAllDetails ~ err:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  public async getCustomerActivation(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Validate inputs (if any)
      // 2. Apply middleware before this point in Express

      const admins = await this.adminService.fetchCustomerActivation();
      return res.status(200).json(admins);
    } catch (err) {
      console.log("Turbo Log  ~ AdminController ~ getCustomerActivation ~ err:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  public async getCustomerDeactivation(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Validate inputs (if any)
      // 2. Apply middleware before this point in Express

      const admins = await this.adminService.fetchCustomerDeactivation();
      return res.status(200).json(admins);
    } catch (err) {
      console.log("Turbo Log  ~ AdminController ~ getCustomerDeactivation ~ err:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  public async getIncreaseInSlot(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Validate inputs (if any)
      // 2. Apply middleware before this point in Express

      const admins = await this.adminService.fetchIncreaseInSlot();
      return res.status(200).json(admins);
    } catch (err) {
      console.log("Turbo Log  ~ AdminController ~ getIncreaseInSlot ~ err:", err);
      console.error("Turbo Log ~ AdminController ~ getDatabaseConnectionlogic ~ err:", err);
    }
  }
}
