/**
 * @description Handles pre-DB logic like input validation, before delegating to service
 */
import { Request, Response, NextFunction } from "express";
import AdminImplementation from "./admin.service";
import { customerAccess, loginInAdmin, packageUpdate, slotUpdate } from "./admin.model";
import pool from "../../config/database";




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
      const { id, message } = await this.adminService.adminSignIn(payload);
      if (!message) {
        return res.status(404).json({ message: "Unauthorised user" });
      }

      const sessionVal = await new Promise<void>((resolve, reject) => {
        req.session.regenerate(async (err) => {
          if (err) return reject(err);
          req.session.userId = id; // keep as string for DB
          req.session.role = "admin";
          // ... set other session fields like role
          // ensure session is saved before returning control
          const saveSession = req.session.save(async (saveErr) => {
            if (saveErr) return reject(saveErr);
            try {
              // defensive DB update: write user_id column for this sid
              const UpdateSessionForLogin = await pool.query(`UPDATE "session" SET user_id = $1 WHERE sid = $2`, [
                String(id),
                req.sessionID
              ]);
              const { rowCount } = UpdateSessionForLogin
              if (rowCount !== 0 || rowCount !== null) {
                return res.status(200).json({ message: "Account login successful" });
              }
            } catch {
              return res.status(500).json({ error: "Internal Server Error" });
            }
            resolve();
          });
        });
      });
    } catch {
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

  public async delete__adminSignOut(req: Request, res: Response) {
    const sid = req.sessionID;
    try {

      // defensive delete first (returns count)
      const del = await this.adminService.adminSignOut(sid); // returns true if deleted

      // then destroy session object
      const destroyed = await new Promise<boolean>((resolve, reject) => {
        req.session.destroy(err => (err ? reject(err) : resolve(true)));
      });

      if (del && destroyed) {
        res.clearCookie("connect.sid", {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          secure: false,
        });

        return res.status(200).json({ message: "Log Out successful" });
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
    } catch {
      return res.status(500).json({ error: `Internal Server Error` });
    }
  }

  public async get__allCustomersForCBT(req: Request, res: Response, next: NextFunction) {
    try {

      const { rows } = await this.adminService.fetchAllCustomersForCBT();
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
    } catch (err) {
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
