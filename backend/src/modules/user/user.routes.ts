/**
 * @description This file handles User-related endpoints
 */

import { Router, Request, Response, NextFunction } from "express";
import UserController from "./user.controller";
import { userAuthMiddleware } from "../../middlewares/user.middleware";

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
     * @route POST /login
     * @description Logs in a user
     */
    this.router.post("/signin", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getUserLogin(req, res, next)
    );
    /**
         * @route GET /signout
         * @description Log out user
         */
    this.router.get("/signout", (req: Request, res: Response, next: NextFunction) => {
      this.controller.getUserSignOut(req, res, next)
    });
    /**
     * @route POST /signup
     * @description Signs up a new user
     */
    this.router.post("/signup", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getUserSignUp(req, res, next)
    );
    this.router.get("/validate-user", userAuthMiddleware, (req, res) => res.status(200).json({ ok: true }))
    /**
     * @notice middle ware only runs from here all route below are protected 
     */
    this.router.use(userAuthMiddleware);
    /**
     * @route GET /details
     * @description Retrieves user saved details
     */
    this.router.get("/details", (req: Request, res: Response, next: NextFunction) => {
      this.controller.getUserDetails(req, res, next)
    });



    /**
     * @route POST /select-plan
     * @description Lets user select a plan
     */
    this.router.get("/selected-plan", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getUserSelectedPlan(req, res, next)
    );

    /**
     * @route POST /edit-plan
     * @description Allows user to edit their selected plan
     */
    this.router.post("/edit-plan", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getUserPlanEdit(req, res, next)
    );

    /**
 * @route POST /students/create
 * @description Adds a single student or an array of students to the database.
 */
    this.router.post("/students/create", (req: Request, res: Response, next: NextFunction) =>
      this.controller.createStudents(req, res, next)
    );

    /**
     * @route PUT /students/update
     * @description Updates a single student or an array of students in the database.
     */
    this.router.put("/students/update", (req: Request, res: Response, next: NextFunction) =>
      this.controller.updateStudents(req, res, next)
    );

    /**
     * @route POST /teachers/create
     * @description Adds a single teacher or an array of teachers to the database.
     */
    this.router.post("/teachers/create", (req: Request, res: Response, next: NextFunction) =>
      this.controller.createTeachers(req, res, next)
    );

    /**
     * @route PUT /teachers/update
     * @description Updates a single teacher or an array of teachers in the database.
     */
    this.router.put("/teachers/update", (req: Request, res: Response, next: NextFunction) =>
      this.controller.updateTeachers(req, res, next)
    );

    /**
* @route POST /students/create
* @description Adds a single student or an array of students to the database.
*/
    this.router.post("/students/create", (req: Request, res: Response, next: NextFunction) =>
      this.controller.createStudents(req, res, next)
    );


    /**
     * @route GET /students/all
     * @description Retrieves all registered students
     */
    this.router.get("/students/all", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getAllStudents(req, res, next)
    );

    /**
     * @route GET /teachers/all
     * @description Retrieves all registered teachers
     */
    this.router.get("/teachers/all", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getAllTeachers(req, res, next)
    );

    /**
     * @route GET /cbt/students
     * @description Retrieves students who are registered for CBT
     */
    this.router.get("/cbt/students/all", (req: Request, res: Response, next: NextFunction) =>
      this.controller.getAllCBTStudents(req, res, next)
    );
  }


}
