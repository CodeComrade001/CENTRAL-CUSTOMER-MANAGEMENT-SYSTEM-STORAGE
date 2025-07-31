/**
 * @description this file handles Admin-related endpoints
 */

import { Router, Request, Response, NextFunction } from "express";
import AdminController from "./admin.controller";
import { adminAuthMiddleware } from "../../middlewares/admin.middleware";

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
    this.router.post("/login", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getAdminLogedIn(req, res, next)
    );



    this.router.get("/validate-admin", adminAuthMiddleware, (req, res) => res.status(200).json({ ok: true }))

    this.router.use(adminAuthMiddleware);

    /**
         * @route GET / all-detail admin
         * @description Retrieves all customer details
         */

    this.router.get("/customer/all", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getAllCustomers(req, res, next)
    );

    /**
         * @route GET / logOut admin
         * @description Retrieves all customer details
         */

    this.router.get("/signout", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getAdminLoggedOut(req, res, next)
    );

    /**
         * @route GET / school mamagement details admin
         * @description Retrieves all school management details
         */

    this.router.get("/sms/all", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getSchoolManagementAllDetails(req, res, next)
    );

    /**
         * @route GET / cbt all details 
         * @description Retrieves all cbt customer details
         */

    this.router.get("/cbt/all", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getCBTAllDetails(req, res, next)
    );

    /**
         * @route GET / health all details 
         * @description Retrieves all health management subscribers customer details
         */

    this.router.get("/hms/all", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getHealthManagementAllDetails(req, res, next)
    );

    /**
         * @route POST /activate-customer 
         * @description Activate a customer who has made payment
         */

    this.router.post("/customer/activate", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getCustomerActivated(req, res, next)
    );

    /**
         * @route POST / deactivate-customer 
         * @description deactivate customer who refused to pa
         */

    this.router.post("/customer/deactivate", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getCustomerDeactivated(req, res, next)
    );

    /**
         * @route POST / Increase sms slot 
         * @description Incrase slot for customers who needs more slot for student
         */

    this.router.post("/sms/update", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getIncreaseInSchoolManagementSlot(req, res, next)
    );
    /**
         * @route POST / increase cbt slot 
         * @description Incrase slot for customers who needs more slot for student
         */

    this.router.post("/cbt/update", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getIncreaseInCBTSlot(req, res, next)
    );
    /**
         * @route get / school-cbt-student 
         * @description Incrase slot for customers who needs more slot for student
         */

    this.router.get("/school/student", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getSchoolStudent(req, res, next)
    );
    /**
         * @route get /school-full-details 
         * @description Incrase slot for customers who needs more slot for student
         */

    this.router.get("/school/teachers", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getSchoolTeacher(req, res, next)
    );

    // add more routes here, e.g.
    // this.router.post("/test-connection", this.controller.createAdmin.bind(this.controller));
  }
}
