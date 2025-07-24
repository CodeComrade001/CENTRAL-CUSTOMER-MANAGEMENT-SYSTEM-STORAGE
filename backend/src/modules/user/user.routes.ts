/**
 * @description This file handles User-related endpoints
 */

import { Router, Request, Response, NextFunction } from "express";
import UserController from "./user.controller";

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
     * @route GET /details
     * @description Retrieves user saved details
     */
    this.router.get("/details", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getUserDetails(req, res, next)
    );

    /**
     * @route POST /login
     * @description Logs in a user
     */
    this.router.post("/login", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getUserLogin(req, res, next)
    );

    /**
     * @route POST /signup
     * @description Signs up a new user
     */
    this.router.post("/signup", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getUserSignUp(req, res, next)
    );

    /**
     * @route POST /select-plan
     * @description Lets user select a plan
     */
    this.router.post("/select-plan", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getUserSelectPlan(req, res, next)
    );

    /**
     * @route POST /edit-plan
     * @description Allows user to edit their selected plan
     */
    this.router.post("/edit-plan", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getUserPlanEdit(req, res, next)
    );
  }
}
