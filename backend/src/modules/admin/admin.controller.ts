/**
 * @description Handles pre-DB logic like input validation, before delegating to service
 */
import { Request, Response, NextFunction } from "express";
import AdminImplementation from "./admin.service";

export default class AdminController {
  private adminService: AdminImplementation;

  constructor() {
    this.adminService = new AdminImplementation(); // Instantiate internally
    console.log(this.adminService)
  }
  public async getAdminLogedIn(req: Request, res: Response, next: NextFunction) {
    console.log("Turbo Log  ~ AdminController ~ getAdminLogedIn ~ req.body:", req.body);
    try {
      // 1. Validate inputs (if any)
      // 2. Apply middleware before this point in Express

      const { username, inputPassword } = req.body
      const admins = await this.adminService.verifyAdminLogin(username, inputPassword);
      if (admins) {
        return res.status(200).json({ message: "admins log in successful" });
      } else {
        return res.status(401).json({ message: "Incorrect username or password" });
      }
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
  public async getCustomerActivated(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Validate inputs (if any)
      // 2. Apply middleware before this point in Express
      const { userIdToBeUpdated } = req.body
      const admins = await this.adminService.fetch_CustomerAccountActivation(userIdToBeUpdated);
      return res.status(200).json(admins);
    } catch (err) {
      console.log("Turbo Log  ~ AdminController ~ getCustomerActivation ~ err:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  public async getCustomerDeactivated(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Validate inputs (if any)
      // 2. Apply middleware before this point in Express
      const { userIdToBeUpdated } = req.body
      const admins = await this.adminService.fetch_CustomerAccountDeactivation(userIdToBeUpdated);
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
      const { slotValue, schoolId } = req.body
      const admins = await this.adminService.fetch_IncreaseCBTSlot(slotValue, schoolId);
      return res.status(200).json(admins);
    } catch (err) {
      console.log("Turbo Log  ~ AdminController ~ getIncreaseInSlot ~ err:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async getSchoolStudentForCBT(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Validate inputs (if any)
      // 2. Apply middleware before this point in Express
      const { schoolId } = req.body
      const admins = await this.adminService.fetchSchoolManagementCBT_student(schoolId);
      return res.status(200).json(admins);
    } catch (err) {
      console.log("Turbo Log  ~ AdminController ~ getSchoolStudentForCBT ~ (err:", (err));
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  public async getSchoolManagementFullDetails(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Validate inputs (if any)
      // 2. Apply middleware before this point in Express
      const { schoolId } = req.body
      const admins = await this.adminService.fetchSchoolManagement_alldetails(schoolId);
      return res.status(200).json(admins);
    } catch (err) {
      console.log("Turbo Log  ~ AdminController ~ getSchoolManagementFullDetails ~ (err:", (err));
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

}
