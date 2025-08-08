/**
 * @description this file handles Admin-related endpoints
 */

import { Router, Request, Response, NextFunction } from "express";
import AdminController from "./admin.controller";
// import { adminAuthMiddleware } from "../../middlewares/admin.middleware";

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

    this.router.post("/login", (req: Request, res: Response, next: NextFunction) =>
      this.controller.post__adminSignIn(req, res, next)
    );

    // this.router.post("/new-account", (req: Request, res: Response, next: NextFunction) =>
    //   this.controller.post__adminNewAccount(req, res, next)
    // );



    // this.router.get("/validate-admin", (req, res) => res.status(200).json({ ok: true }))

    // this.router.use(adminAuthMiddleware);


    /*//////////////////////////////////////////////////////////////
                           ALL GET REQUEST
    //////////////////////////////////////////////////////////////*/

    this.router.get("/sms/all", (req: Request, res: Response, next: NextFunction) =>
      this.controller.get__allCustomersForSMS(req, res, next)
    );
    this.router.get("/cbt/all", (req: Request, res: Response, next: NextFunction) =>
      this.controller.get__allCustomersForCBT(req, res, next)
    );
    this.router.get("/hms/all", (req: Request, res: Response, next: NextFunction) =>
      this.controller.get__allCustomersForHMS(req, res, next)
    );

    /*//////////////////////////////////////////////////////////////
                 ADMIN ACCOUNT == ACTIVATION AND DEACTIVATION
     //////////////////////////////////////////////////////////////*/

    this.router.patch("/sms/verify", (req: Request, res: Response, next: NextFunction) =>
      this.controller.patch__customerAccountAccessForSMS(req, res, next)
    );
    this.router.patch("/hms/verify", (req: Request, res: Response, next: NextFunction) =>
      this.controller.patch__customerAccountAccessForHMS(req, res, next)
    );
    this.router.patch("/cbt/verify", (req: Request, res: Response, next: NextFunction) =>
      this.controller.patch__customerAccountAccessForCBT(req, res, next)
    );

    /*//////////////////////////////////////////////////////////////
                  ADMIN ACCOUNT == UPDATING PACKAGE AND SLOT
    //////////////////////////////////////////////////////////////*/

    this.router.patch("/hms/package", (req: Request, res: Response, next: NextFunction) =>
      this.controller.patch__updatePackageForHMS(req, res, next)
    );
    this.router.patch("/sms/package", (req: Request, res: Response, next: NextFunction) =>
      this.controller.patch__updatePackageForSMS(req, res, next)
    );
    this.router.patch("/cbt/slot", (req: Request, res: Response, next: NextFunction) =>
      this.controller.patch__updateSLotForCBT(req, res, next)
    );


    /*//////////////////////////////////////////////////////////////
                 ADMIN ACCOUNT == ALL DELETE REQUEST
    //////////////////////////////////////////////////////////////*/

    this.router.delete("/signout", (req: Request, res: Response, next: NextFunction) =>
      this.controller.delete__adminSignOut(req, res, next)
    );
  }
}
