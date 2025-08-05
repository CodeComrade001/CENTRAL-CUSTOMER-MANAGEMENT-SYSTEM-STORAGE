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

  /**
   * 
   * @notice ensure that all routes are protected  one mistake will leave route exposed
   * @warning do not add for sign function
   */


  public async getAdminLogedIn(req: Request, res: Response, next: NextFunction) {
    try {

      const { email, password } = req.body
      const { message } = await this.adminService.verifyAdminLogin(email, password);
      if (message) {
        return res.status(200).json({ token: "Pass the token here" });
      } else {
        return res.status(401).json({ message: "User Is Unauthorized" });
      }
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }


  public async getAdminLoggedOut(req: Request, res: Response, next: NextFunction) {
    try {

      const admins = await this.adminService.fetchAdminSignOut();
      if (admins) {
        return res.status(200).json({ message: "admins log out successful" });
      }
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }


  public async getCBTAllDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const admins = await this.adminService.fetchCBTDetails();
      return res.status(200).json(admins);
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async getAllCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const admins = await this.adminService.fetchAllCustomers();
      return res.status(200).json(admins);
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async getSchoolManagementAllDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const admins = await this.adminService.fetchSchoolManagementDetails();
      return res.status(200).json(admins);
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async getHealthManagementAllDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const admins = await this.adminService.fetchSchoolManagementDetails();
      return res.status(200).json(admins);
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }


  public async getCustomerActivated(req: Request, res: Response, next: NextFunction) {
    try {
      const { schoolId } = req.body
      const admins = await this.adminService.fetch_CustomerAccountActivation(schoolId);
      if (admins.message) {
        return res.status(200).json({ message: "customer account activated" });
      }
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }


  public async getCustomerDeactivated(req: Request, res: Response, next: NextFunction) {
    try {
      const { schoolId } = req.body
      const admins = await this.adminService.fetch_CustomerAccountDeactivation(schoolId);
      if (admins.message) {
        return res.status(200).json({ message: "customer account deactivated" });
      }
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }


  public async getIncreaseInCBTSlot(req: Request, res: Response, next: NextFunction) {
    try {
      const { slotValue, schoolId } = req.body
      const admins = await this.adminService.fetch_IncreaseCBTSlot(slotValue, schoolId);
      if (admins) {
        return res.status(200).json({ message: "customer cbt slot increased" });
      }
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async getIncreaseInSchoolManagementSlot(req: Request, res: Response, next: NextFunction) {
    try {
      const { slotValue, schoolId } = req.body
      const admins = await this.adminService.fetch_IncreaseSchoolManagementSlot(slotValue, schoolId);
      if (admins) {
        return res.status(200).json({ message: "customer cbt slot increased" });
      }
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }



  public async getSchoolStudent(req: Request, res: Response, next: NextFunction) {
    try {
      // const { schoolId } = req.body
      const admins = await this.adminService.fetchAllSchoolStudent();
      return res.status(200).json(admins);
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }


  public async getSchoolTeacher(req: Request, res: Response, next: NextFunction) {
    try {
      // const { schoolId } = req.body
      const admins = await this.adminService.fetchAllSchoolTeacher();
      return res.status(200).json(admins);
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

}
