import express, { Express, Request, Response, NextFunction } from "express";
import AdminRoute from "./modules/admin/admin.routes";
import UserRoute from "./modules/user/user.routes";
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import { limitPayload } from "./middlewares/limitPayload";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { attachDbClient, dbSessionMiddleware } from "./middlewares/admin.middleware";
import pool from "./config/database";
import { logger } from "./utils/logger";

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
    const PgSession = connectPgSimple(session);
    const sessionSecret = process.env.SESSION_SECRET;
    if (!sessionSecret) {
      logger.error('FATAL: SESSION_SECRET (or DOCKER_SESSION_SECRET) is not set. Set SESSION_SECRET in env.');
      process.exit(1);
    }
    // Core body parsers
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.set("trust proxy", 1);

    // CORS config
    this.app.use(cors({
      origin: ['https://cen-cms-ui.vercel.app', 'http://web:8080', 'http://localhost:5173', 'http://localhost:5174'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }));
    //session
    this.app.use(
      session({
        store: new PgSession({
          pool,
          tableName: "session"
        }),
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false, // localhost = HTTP
          httpOnly: true,
          path: "/",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000
        }
      })
    );
    // Security middlewares
    this.app.use(helmet()); // HTTP header protection
    // this.app.use(xssClean()); // Sanitize user input against XSS
    this.app.use(hpp()); // Prevent HTTP Parameter Pollution

    // Payload size limiter (your custom middleware)
    this.app.use(limitPayload(1_000_000)); // 1MB limit

    // Rate limiter - prevents brute force
    this.app.use(rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 200, // limit each IP to 100 requests
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: 'Too many requests, please try again later.' },
    }));
    this.app.use(attachDbClient);       // attach client first
    this.app.use(dbSessionMiddleware);
  }




  private async setupRoutes() {
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
      res.status(500).json({ error: "Internal Server from app Error" });
    });

    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      logger.error('Unhandled error:', err && (err.stack || err));
      const payload: any = { error: 'Internal Server from app Error' };
      if (process.env.NODE_ENV !== 'production') {
        payload.details = err?.message;
        payload.stack = err?.stack;
      }
      res.status(500).json(payload);
    });
  }
}
