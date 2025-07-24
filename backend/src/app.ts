// src/app.ts
import express, { Express, Request, Response, NextFunction } from "express";
import AdminRoute from "./modules/admin/admin.routes";

// dotenv.config();

export default class AppBootstrap {
  private app: Express;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandlers();
  }

  public getApp(): Express {
    return this.app;
  }

  private setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes() {
    const adminRoute = new AdminRoute();

    this.app.use("/api/admin", adminRoute.getRouter());
    this.app.get("/health", (req: Request, res: Response) => {
      res.status(200).json({ status: "OK", timestamp: new Date() });
    });
  }

  private setupErrorHandlers() {
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({ error: "Route not found" });
    });

    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error("App Error:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    });
  }
}
