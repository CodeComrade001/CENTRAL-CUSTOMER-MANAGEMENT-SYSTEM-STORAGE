/**
 * @description this file handles Admin-related endpoints
 */

import { Router, Request, Response, NextFunction } from "express";
import AdminController from "./admin.controller";

export default class AdminRoute {
  public router = Router();
  private controller: AdminController;
  static router: any;

  public getRouter(): Router {
    return this.router;
  }

  constructor() {
    this.router = Router();
    this.controller = new AdminController(); // instantiate internally
    this.initializeRoutes();
  }
  /**
   * @notice Computer Base Testing Platform (CBT), Rygma Admin should be able to activate 
  and deactivate a Customer’s account; Grant candidate slot to Customer account 
  *@notice For the School Management System (SMS) , Admin should be able to activate or deactivate 
  School Account, Upgrade School package, See the numbers of student and staff 
  withing a Schoo
  *@note Computer Base Testing Platform (CBT) == /cbt/<route-path>
  *@note School Management System (SMS) == /sms/<route-path>
  * @notice Defines all user-related HTTP routes
   */


  private initializeRoutes() {

    /**
         * @route POST / logs-in 
         * @description Authtenticate Admin before logging in
         */
    this.router.post("/log-in", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getAdminLogedIn(req, res, next)
    );
    /**
         * @route GET / all-detail admin
         * @description Retrieves all customer details
         */

    this.router.get("/all-details", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getAllDetails(req, res, next)
    );

    /**
         * @route POST /activate-customer 
         * @description Activate a customer who has made payment
         */

    this.router.post("/cbt/activate-customer", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getCustomerActivation(req, res, next)
    );

    /**
         * @route POST / deactivate-customer 
         * @description deactivate customer who refused to pa
         */

    this.router.post("/cbt/deactivate-customer", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getCustomerDeactivation(req, res, next)
    );

    /**
         * @route POST / Increase-slot 
         * @description Incrase slot for customers who needs more slot for student
         */

    this.router.post("/sms/increase-slot", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getIncreaseInSlot(req, res, next)
    );

    // add more routes here, e.g.
    // this.router.post("/test-connection", this.controller.createAdmin.bind(this.controller));
  }
}
