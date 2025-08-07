/**
 * @description This file handles User-related endpoints
 */

import { Router, Request, Response, NextFunction } from "express";
import UserController from "./user.controller";
// import { userAuthMiddleware } from "../../middlewares/user.middleware";

export default class UserRoute {
  public router: Router;
  private controller: UserController;

  /**
   * @notice Initializes User routes and controller
   */
  constructor() {
    this.router = Router();
    this.controller = new UserController();
    this.initializeRoutes();
  }

  /**
   * @notice Exports the initialized user routes
   */
  public getRouter(): Router {
    return this.router;
  }

  /**
   * @notice Defines all user-related HTTP routes
   */
  private initializeRoutes(): void {
    /**
     * @route POST /signup/sms
    * @description Creates a new account for my user and return user details for confirmation in the frontend
     * @notice sms  => school management package
     */
    this.router.post("/signup/sms", (req: Request, res: Response, next: NextFunction) =>
      this.controller.post__UserSignUpForSMS(req, res, next)
    );
    /**
     * @route POST /signup/hms
     * @description Creates a new account for my user and return user details for confirmation in the frontend
     * @notice hms  => Health Managemennt Package
     */
    this.router.post("/signup/hms", (req: Request, res: Response, next: NextFunction) =>
      this.controller.post__UserSignUpForHMS(req, res, next)
    );
    /**
     * @route POST /signup/cbt
     * @description Creates a new account for my user and return user details for confirmation in the frontend
     * @notice cbt  => Computer Based Test
     */
    this.router.post("/signup/cbt", (req: Request, res: Response, next: NextFunction) =>
      this.controller.post__UserSignUpForCBT(req, res, next)
    );


  }


}
