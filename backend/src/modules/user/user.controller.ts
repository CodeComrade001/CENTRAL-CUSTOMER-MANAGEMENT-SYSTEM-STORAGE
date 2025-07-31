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
   * 
   * @notice ensure that all routes are protected  one mistake will leave route exposed
   * @warning do not add for sign up and sign function
   */


  /**
   * @notice Fetches user details during initial setup.
   */
  public async getUserDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.fetchUserDetails();
      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * @notice Handles user login.
   * @dev Expects `userEmail` and `userPassword` in the request body.
   */
  public async getUserLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { message, token, error } = await this.userService.fetchUserLogin(email, password);
      if (error) {
        return res.status(408).json({ message: "Account Disabled" })
      } else if (message) {
        return res.status(200).json({ token: token })
      } else {
        return res.status(401).json({ message: "incorrect email or password " });
      }
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  /**
   * @notice Handles user log out.
   * @dev Expects `userEmail` and `userPassword` in the request body.
   */
  public async getUserSignOut(req: Request, res: Response, next: NextFunction) {
    try {
      const logoutData = await this.userService.fetchUserSignOut();
      return res.status(200).json(logoutData);
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * @notice Handles user signup.
   * @dev Expects `userEmail` and `userPassword` in the request body.
   */
  public async getUserSignUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { schoolName, email, password } = req.body;
      const { message } = await this.userService.fetchUserSignUp(schoolName, email, password);
      if (message) {
        return res.status(200).json({ message: "account creation successful" });
      }
      return res.status(409).json({
        error: "UserAlreadyRegistered",
        message: "A user with this email is already registered.",
        code: 1001
      });
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * @notice Fetches available user plans.
   */
  public async getUserSelectedPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const plans = await this.userService.fetchUserSelectedPlan();
      return res.status(200).json(plans);
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * @notice Edits user's selected plan.
   * @dev Expects `product` and `product_subscription` in the request body.
   */
  public async getUserPlanEdit(req: Request, res: Response, next: NextFunction) {
    try {
      const { product, product_subscription, id } = req.body;
      const { message } = await this.userService.fetchUserPlanEdit(
        id, product,
        product_subscription,
      );
      if (message) {
        return res.status(200).json({ message: "subscription plan added" });
      }
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async createStudents(req: Request, res: Response, next: NextFunction) {
    try {

      const students = req.body;
      const result = await this.userService.createStudents(students);
      return res.status(result.message ? 201 : 400).json(result);
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async updateStudents(req: Request, res: Response, next: NextFunction) {
    try {

      const students = req.body;
      const result = await this.userService.updateStudents(students);

      return res.status(result.message ? 200 : 400).json(result);
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public async createTeachers(req: Request, res: Response, next: NextFunction) {
    try {

      const teachers = req.body;
      const result = await this.userService.createTeachers(teachers);

      return res.status(result.message ? 201 : 400).json(result);
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }


  public async updateTeachers(req: Request, res: Response, next: NextFunction) {
    try {

      const teachers = req.body;
      const result = await this.userService.updateTeachers(teachers);

      return res.status(result.message ? 200 : 400).json({ result });
    } catch (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
    * @notice Controller to get all students
    * @route GET /students/all
    */
  public async getAllStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.userService.getAllStudents();
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch students" });
    }
  }

  /**
   * @notice Controller to get all teachers
   * @route GET /teachers/all
   */
  public async getAllTeachers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.userService.getAllTeachers();
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch teachers" });
    }
  }

  /**
   * @notice Controller to get students marked for CBT
   * @route GET /cbt/students
   */
  public async getAllCBTStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.userService.getAllCBTStudents();
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch CBT students" });
    }
  }

  // /**
  //  * @notice controller to get validation on user for protected route
  //  */
  // public async validateSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const isValid = await this.userService.validateSession(req);

  //     if (!isValid) {
  //       res.status(401).json({ message: "Session invalid or expired" });
  //       return;
  //     }

  //     res.status(200).json({ message: "Session valid" });
  //   } catch (err) {
  //     next(err);
  //   }
  // }

}
