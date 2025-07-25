/**
 * @description this file handles Admin-related endpoints
 */

import { Router, Request, Response, NextFunction } from "express";
import AdminController from "./admin.controller";
import validateUserMiddleware from "../auth/auth.middleware"

export default class AdminRoute {
  public router = Router();
  private controller: AdminController;

  public getRouter(): Router {
    return this.router;
  }

  constructor() {
    this.router = Router();
    this.controller = new AdminController(); // instantiate internally
    this.initializeRoutes();
  }


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
      this.controller.getCustomerActivated(req, res, next)
    );

    /**
         * @route POST / deactivate-customer 
         * @description deactivate customer who refused to pa
         */

    this.router.post("/cbt/deactivate-customer", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getCustomerDeactivated(req, res, next)
    );

    /**
         * @route POST / Increase-slot 
         * @description Incrase slot for customers who needs more slot for student
         */

    this.router.post("/sms/increase-slot", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getIncreaseInSlot(req, res, next)
    );
    /**
         * @route POST / school-cbt-student 
         * @description Incrase slot for customers who needs more slot for student
         */

    this.router.post("/school-cbt-student", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getSchoolStudentForCBT(req, res, next)
    );
    /**
         * @route POST /school-full-details 
         * @description Incrase slot for customers who needs more slot for student
         */

    this.router.post("/school-full-details", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getSchoolManagementFullDetails(req, res, next)
    );

    // add more routes here, e.g.
    // this.router.post("/test-connection", this.controller.createAdmin.bind(this.controller));
  }
}
