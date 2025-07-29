// src/app.ts
import express, { Express, Request, Response, NextFunction } from "express";
import AdminRoute from "./modules/admin/admin.routes";
import UserRoute from "./modules/user/user.routes";
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
// import xssClean from 'xss-clean';
import hpp from 'hpp';
import { limitPayload } from "./middlewares/limitPayload";

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
    // Core body parsers
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // CORS config
    this.app.use(cors({
      origin: ['http://localhost:5173', 'https://cen-cms-ui.vercel.app'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }));

    // Security middlewares
    this.app.use(helmet()); // HTTP header protection
    // this.app.use(xssClean()); // Sanitize user input against XSS
    this.app.use(hpp()); // Prevent HTTP Parameter Pollution

    // Payload size limiter (your custom middleware)
    this.app.use(limitPayload(1_000_000)); // 1MB limit

    // Rate limiter - prevents brute force
    this.app.use(rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Too many requests, please try again later.' },
    }));
  }

  private setupRoutes() {
    const adminRoute = new AdminRoute();
    const userRoute = new UserRoute();

    this.app.use("/api/admin", adminRoute.getRouter());
    this.app.use("/api/user", userRoute.getRouter());

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
