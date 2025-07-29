/**
 * @description Handles pre-DB logic like input validation, before delegating to service
 */
import { Request, Response, NextFunction } from "express";
import AdminImplementation from "./admin.service";
import { verifyAdminSession } from "../../middlewares/admin.middleware";

export default class AdminController {
  private adminService: AdminImplementation;

  constructor() {
    this.adminService = new AdminImplementation(); // Instantiate internally
    console.log(this.adminService)
  }

  /**
   * 
   * @notice ensure that all routes are protected  one mistake will leave route exposed
   * @warning do not add for sign function
   * @copy if (!(await this.ensureAuthenticated(req, res))) return;
   */

  private async ensureAuthenticated(req: Request, res: Response): Promise<boolean> {
    const isValid = await verifyAdminSession(req);
    if (!isValid) {
      res.status(401).json({ error: "Unauthorized" });
      return false;
    }
    return true;
  }

  public async getAdminLogedIn(req: Request, res: Response, next: NextFunction) {
    console.log("Turbo Log  ~ AdminController ~ getAdminLogedIn ~ req.body:", req.body);
    try {

      const { username, password } = req.body
      const admins = await this.adminService.verifyAdminLogin(username, password);
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

  public async getAdminLoggedOut(req: Request, res: Response, next: NextFunction) {
    try {

      const admins = await this.adminService.fetchAdminSignOut();
      if (admins) {
        return res.status(200).json({ message: "admins log out successful" });
      }
    } catch (err) {
      console.log("Turbo Log  ~ AdminController ~ getAdminLogedIn ~ err:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }


  public async getCBTAllDetails(req: Request, res: Response, next: NextFunction) {
    try {
      if (!(await this.ensureAuthenticated(req, res))) return;
      const admins = await this.adminService.fetchCBTDetails();
      return res.status(200).json(admins);
    } catch (err) {
      console.log("Turbo Log  ~ AdminController ~ getAllDetails ~ err:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async getAllCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      if (!(await this.ensureAuthenticated(req, res))) return;
      const admins = await this.adminService.fetchAllCustomers();
      return res.status(200).json(admins);
    } catch (err) {
      console.log("Turbo Log  ~ AdminController ~ getAllDetails ~ err:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async getSchoolManagementAllDetails(req: Request, res: Response, next: NextFunction) {
    try {
      if (!(await this.ensureAuthenticated(req, res))) return;
      const admins = await this.adminService.fetchSchoolManagementDetails();
      return res.status(200).json(admins);
    } catch (err) {
      console.log("Turbo Log  ~ AdminController ~ getAllDetails ~ err:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async getHealthManagementAllDetails(req: Request, res: Response, next: NextFunction) {
    try {
      if (!(await this.ensureAuthenticated(req, res))) return;
      const admins = await this.adminService.fetchSchoolManagementDetails();
      return res.status(200).json(admins);
    } catch (err) {
      console.log("Turbo Log  ~ AdminController ~ getAllDetails ~ err:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }


  public async getCustomerActivated(req: Request, res: Response, next: NextFunction) {
    try {
      if (!(await this.ensureAuthenticated(req, res))) return;
      const { schoolId } = req.body
      const admins = await this.adminService.fetch_CustomerAccountActivation(schoolId);
      if (admins) {
        return res.status(200).json({ message: "customer account activated" });
      }
    } catch (err) {
      console.log("Turbo Log  ~ AdminController ~ getCustomerActivation ~ err:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }


  public async getCustomerDeactivated(req: Request, res: Response, next: NextFunction) {
    try {
      if (!(await this.ensureAuthenticated(req, res))) return;
      const { schoolId } = req.body
      const admins = await this.adminService.fetch_CustomerAccountDeactivation(schoolId);
      if (admins) {
        return res.status(200).json({ message: "customer account deactivated" });
      }
    } catch (err) {
      console.log("Turbo Log  ~ AdminController ~ getCustomerDeactivation ~ err:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }


  public async getIncreaseInCBTSlot(req: Request, res: Response, next: NextFunction) {
    try {
      if (!(await this.ensureAuthenticated(req, res))) return;
      const { slotValue, schoolId } = req.body
      const admins = await this.adminService.fetch_IncreaseCBTSlot(slotValue, schoolId);
      if (admins) {
        return res.status(200).json({ message: "customer cbt slot increased" });
      }
    } catch (err) {
      console.log("Turbo Log  ~ AdminController ~ getIncreaseInSlot ~ err:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async getIncreaseInSchoolManagementSlot(req: Request, res: Response, next: NextFunction) {
    try {
      if (!(await this.ensureAuthenticated(req, res))) return;
      const { slotValue, schoolId } = req.body
      const admins = await this.adminService.fetch_IncreaseSchoolManagementSlot(slotValue, schoolId);
      if (admins) {
        return res.status(200).json({ message: "customer cbt slot increased" });
      }
    } catch (err) {
      console.log("Turbo Log  ~ AdminController ~ getIncreaseInSlot ~ err:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }



  public async getSchoolStudent(req: Request, res: Response, next: NextFunction) {
    try {
      if (!(await this.ensureAuthenticated(req, res))) return;
      const { schoolId } = req.body
      const admins = await this.adminService.fetchAllSchoolStudent();
      return res.status(200).json(admins);
    } catch (err) {
      console.log("Turbo Log  ~ AdminController ~ getSchoolStudentForCBT ~ (err:", (err));
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }


  public async getSchoolTeacher(req: Request, res: Response, next: NextFunction) {
    try {
      if (!(await this.ensureAuthenticated(req, res))) return;
      const { schoolId } = req.body
      const admins = await this.adminService.fetchAllSchoolTeacher();
      return res.status(200).json(admins);
    } catch (err) {
      console.log("Turbo Log  ~ AdminController ~ getSchoolManagementFullDetails ~ (err:", (err));
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

}
