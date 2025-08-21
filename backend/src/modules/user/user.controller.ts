import { Request, Response, NextFunction } from "express";
import UserImplementation from "./user.service";
import { validateCBT, validateHMS, validateSMS } from "./user.model";

/**
 * @title UserController
 * @notice Handles HTTP logic and delegates business logic to the service layer.
 */
export default class UserController {
  private userService: UserImplementation;
  // private Valiidator: userSupabaseAuthMiddleware;

  constructor() {
    this.userService = new UserImplementation();
    // this.validator = new userSupabaseAuthMiddleware();
  }


  /**
   * @notice Handles user login for school management package.
   * @dev Expects sms_payload.
   */
  public async post__UserSignUpForSMS(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const validationResult = await validateSMS.safeParseAsync(payload);
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Validation failed",
          issues: validationResult.error,
        });
      }
      const { message } = await this.userService.fetchUserSignUpForSMS(validationResult.data);
      if (message) {
        return res.status(200).json({ message: "Account has been created successfully" })
      }
      return res.status(400).json({ error: "Could not create account" });
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  /**
   * @notice Handles user login for Health Managemennt Package.
   * @dev Expects hms_payload.
   */
  public async post__UserSignUpForHMS(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const validationResult = await validateHMS.safeParseAsync(payload);
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Validation failed",
          issues: validationResult.error,
        });
      }
      const { message } = await this.userService.fetchUserSignUpForHMS(validationResult.data);
      if (message) {
        return res.status(200).json({ message: "Account has been created successfully" })
      }
      return res.status(400).json({ error: "Could not create account" });
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  /**
   * @notice Handles user login for Computer Based Test.
   * @dev Expects cbt_payload.
   */
  public async post__UserSignUpForCBT(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const validationResult = await validateCBT.safeParseAsync(payload);
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Validation failed",
          issues: validationResult.error.format(),
        });
      }
      const { message } = await this.userService.fetchUserSignUpForCBT(validationResult.data);
      if (message) {
        return res.status(200).json({ message: "Account has been created successfully" })
      }
      return res.status(400).json({ error: "Could not create account" });
    } catch {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }


}
