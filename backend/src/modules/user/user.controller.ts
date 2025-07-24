import { Request, Response, NextFunction } from "express";
import UserImplementation from "./user.service";

/**
 * @title UserController
 * @notice Handles HTTP logic and delegates business logic to the service layer.
 */
export default class UserController {
  private userService: UserImplementation;

  constructor() {
    this.userService = new UserImplementation();
  }

  /**
   * @notice Fetches user details during initial setup.
   */
  public async getUserDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.fetchUserDetails();
      return res.status(200).json(users);
    } catch (err) {
      console.error("Turbo Log ~ getUserDetails ~ err:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * @notice Handles user login.
   * @dev Expects `userEmail` and `userPassword` in the request body.
   */
  public async getUserLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { userEmail, userPassword } = req.body;
      const loginData = await this.userService.fetchUserLogin(userEmail, userPassword);
      return res.status(200).json(loginData);
    } catch (err) {
      console.error("Turbo Log ~ getUserLogin ~ err:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * @notice Handles user signup.
   * @dev Expects `userEmail` and `userPassword` in the request body.
   */
  public async getUserSignUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { userEmail, userPassword } = req.body;
      const signUpData = await this.userService.fetchUserSignUp(userEmail, userPassword);
      return res.status(200).json(signUpData);
    } catch (err) {
      console.error("Turbo Log ~ getUserSignUp ~ err:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * @notice Fetches available user plans.
   */
  public async getUserSelectPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const plans = await this.userService.fetchUserSelectPlan();
      return res.status(200).json(plans);
    } catch (err) {
      console.error("Turbo Log ~ getUserSelectPlan ~ err:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  /**
   * @notice Edits user's selected plan.
   * @dev Expects `product` and `product_subscription` in the request body.
   */
  public async getUserPlanEdit(req: Request, res: Response, next: NextFunction) {
    try {
      const { product, product_subscription } = req.body;
      const updatedPlan = await this.userService.fetchUserPlanEdit({
        product,
        product_subscription: product_subscription,
      });
      return res.status(200).json(updatedPlan);
    } catch (err) {
      console.error("Turbo Log ~ getUserPlanEdit ~ err:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
