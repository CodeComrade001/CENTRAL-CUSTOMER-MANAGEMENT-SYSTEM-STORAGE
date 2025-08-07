import { Request, Response, NextFunction } from "express";
import UserImplementation from "./user.service";

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
      const { payload } = req.body;
      const { message } = await this.userService.fetchUserSignUpForSMS(payload);
      if (message) {
        return res.status(200).json({ token: "fetch the token here" })
      } else {
        return res.status(401).json({ message: "incorrect email or password " });
      }
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  /**
   * @notice Handles user login for Health Managemennt Package.
   * @dev Expects hms_payload.
   */
  public async post__UserSignUpForHMS(req: Request, res: Response, next: NextFunction) {
    try {
      const { payload } = req.body;
      const { message } = await this.userService.fetchUserSignUpForHMS(payload);
      if (message) {
        return res.status(200).json({ token: "fetch the token here" })
      } else {
        return res.status(401).json({ message: "incorrect email or password " });
      }
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  /**
   * @notice Handles user login for Computer Based Test.
   * @dev Expects cbt_payload.
   */
  public async post__UserSignUpForCBT(req: Request, res: Response, next: NextFunction) {
    try {
      const { payload } = req.body;
      const { message } = await this.userService.fetchUserSignUpForCBT(payload);
      if (message) {
        return res.status(200).json({ token: "fetch the token here" })
      } else {
        return res.status(401).json({ message: "incorrect email or password " });
      }
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }


}
