/**
 * @description Handles pre-DB logic like input validation, before delegating to service
 */
import { Request, Response, NextFunction } from "express";
import AdminImplementation from "./admin.service";
import { customerAccess, loginInAdmin, packageUpdate, slotUpdate } from "./admin.model";




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

      const payload = req.body
      const validationResult = await loginInAdmin.safeParseAsync(payload);
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Validation failed",
          issues: validationResult.error.format(),
        });
      }
      const { id, message, data } = await this.adminService.adminSignIn(payload);
      if (!message) {
        return res.status(404).json({ message: "Unauthorised user" });
      }
      req.session.userId = id; // fixed: use id from service
      req.session.role = "admin";
      // res.status(201).json({ message: "Account created", data });
      // for testing purpose 
      res.status(201).json({ message: "Account created", session: req.session, data });
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // public async post__adminNewAccount(req: Request, res: Response, next: NextFunction) {
  //   try {

  // const { username, role, email, password } = req.body
  //     const { id } = await this.adminService.adminNewAccount();

  //     req.session.userId = id; // fixed: use id from service
  //     req.session.role = "admin";
  //     res.status(201).json({ success: true, message: "Account created", session: req.session });

  //   } catch (err) {
  //     return res.status(500).json({ error: "Internal Server Error" });
  //   }
  // }

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

      const { rows } = await this.adminService.fetchAllCustomersForSMS();
      if (rows) {
        return res.status(200).json({ rows });
      }
    } catch (error) {
      return res.status(500).json({ error: `Internal Server Error: ${error}` });
    }
  }

  public async get__allCustomersForCBT(req: Request, res: Response, next: NextFunction) {
    try {

      const { rows } = await this.adminService.fetchAllCustomersForCBT();
      console.log("Turbo Log  ~ AdminController ~ get__allCustomersForCBT ~ rows:", rows);
      if (rows) {
        return res.status(200).json({ rows });
      }
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async get__allCustomersForHMS(req: Request, res: Response, next: NextFunction) {
    try {

      const { rows } = await this.adminService.fetchAllCustomersForHMS();
      if (rows) {
        return res.status(200).json({ rows });
      }
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async patch__customerAccountAccessForSMS(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body
      const validationResult = await customerAccess.safeParseAsync(payload);
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Validation failed",
          issues: validationResult.error.format(),
        });
      }
      const admins = await this.adminService.changeCustomerAccesForSMS(validationResult.data);
      if (admins) {
        return res.status(200).json({ message: "admins log out successful" });
      }
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async patch__customerAccountAccessForHMS(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body
      const validationResult = await customerAccess.safeParseAsync(payload);
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Validation failed",
          issues: validationResult.error.format(),
        });
      }
      const admins = await this.adminService.changeCustomerAccesForHMS(validationResult.data);
      if (admins) {
        return res.status(200).json({ message: "admins log out successful" });
      }
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async patch__customerAccountAccessForCBT(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body
      const validationResult = await customerAccess.safeParseAsync(payload);
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Validation failed",
          issues: validationResult.error.format(),
        });
      }
      const admins = await this.adminService.changeCustomerAccesForCBT(validationResult.data);
      if (admins) {
        return res.status(200).json({ message: "admins log out successful" });
      }
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async patch__updatePackageForHMS(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body
      const validationResult = await packageUpdate.safeParseAsync(payload);
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Validation failed",
          issues: validationResult.error.format(),
        });
      }
      const admins = await this.adminService.updateCustomerPackageForHMS(validationResult.data);
      if (admins) {
        return res.status(200).json({ message: "admins log out successful" });
      }
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async patch__updatePackageForSMS(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body
      const validationResult = await packageUpdate.safeParseAsync(payload);
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Validation failed",
          issues: validationResult.error.format(),
        });
      }
      const admins = await this.adminService.updateCustomerPackageForSMS(validationResult.data);
      if (admins) {
        return res.status(200).json({ message: "admins log out successful" });
      }
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async patch__updateSLotForCBT(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body
      const validationResult = await slotUpdate.safeParseAsync(payload);
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Validation failed",
          issues: validationResult.error.format(),
        });
      }
      const admins = await this.adminService.updateCustomerSlotForCBT(validationResult.data);
      if (admins) {
        return res.status(200).json({ message: "admins log out successful" });
      }
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }




}
