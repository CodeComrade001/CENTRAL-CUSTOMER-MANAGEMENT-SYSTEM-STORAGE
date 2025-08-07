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


  public async post__adminSignIn(req: Request, res: Response, next: NextFunction) {
    try {

      const { email, password } = req.body
      const { message } = await this.adminService.adminSignIn(email, password);
      if (message) {
        return res.status(200).json({ token: "Pass the token here" });
      } else {
        return res.status(401).json({ message: "User Is Unauthorized" });
      }
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async post__adminNewAccount(req: Request, res: Response, next: NextFunction) {
    try {

      const { username, role, email, password } = req.body
      const { id } = await this.adminService.adminNewAccount(username, role, email, password);

      req.session.userId = id; // fixed: use id from service
      req.session.role = "admin";
      res.status(201).json({ success: true, message: "Account created", session: req.session });

    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async delete__adminSignOut(req: Request, res: Response, next: NextFunction) {
    try {
      const { message } = await this.adminService.adminSignOut();
      if (message) {
        req.session.destroy(err => {
          if (err) return res.status(500).json({ error: "Logout failed" });
          res.clearCookie("connect.sid");
          res.json({ message: "Logged out" });
        });
        return res.status(200).json({ token: "Pass the token here" });
      } else {
        return res.status(401).json({ message: "User Is Unauthorized" });
      }
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }


  public async get__allCustomersForSMS(req: Request, res: Response, next: NextFunction) {
    try {

      const admins = await this.adminService.fetchAllCustomersForSMS();
      if (admins) {
        return res.status(200).json({ message: "admins log out successful" });
      }
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async get__allCustomersForCBT(req: Request, res: Response, next: NextFunction) {
    try {

      const admins = await this.adminService.fetchAllCustomersForCBT();
      if (admins) {
        return res.status(200).json({ message: "admins log out successful" });
      }
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async get__allCustomersForHMS(req: Request, res: Response, next: NextFunction) {
    try {

      const admins = await this.adminService.fetchAllCustomersForHMS();
      if (admins) {
        return res.status(200).json({ message: "admins log out successful" });
      }
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async patch__customerAccountAccessForSMS(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer_id, status } = req.body
      const admins = await this.adminService.changeCustomerAccesForSMS(customer_id, status);
      if (admins) {
        return res.status(200).json({ message: "admins log out successful" });
      }
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async patch__customerAccountAccessForHMS(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer_id, status } = req.body
      const admins = await this.adminService.changeCustomerAccesForHMS(customer_id, status);
      if (admins) {
        return res.status(200).json({ message: "admins log out successful" });
      }
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async patch__customerAccountAccessForCBT(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer_id, status } = req.body
      const admins = await this.adminService.changeCustomerAccesForCBT(customer_id, status);
      if (admins) {
        return res.status(200).json({ message: "admins log out successful" });
      }
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async patch__updatePackageForHMS(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer_id, newPackage } = req.body
      const admins = await this.adminService.updateCustomerPackageForHMS(customer_id, newPackage);
      if (admins) {
        return res.status(200).json({ message: "admins log out successful" });
      }
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async patch__updatePackageForSMS(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer_id, newPackage } = req.body
      const admins = await this.adminService.updateCustomerPackageForSMS(customer_id, newPackage);
      if (admins) {
        return res.status(200).json({ message: "admins log out successful" });
      }
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async patch__updateSLotForCBT(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer_id, slotValue } = req.body
      const admins = await this.adminService.updateCustomerSlotForCBT(customer_id, slotValue);
      if (admins) {
        return res.status(200).json({ message: "admins log out successful" });
      }
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }




}
