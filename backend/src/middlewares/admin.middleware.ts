import { Request, Response, NextFunction } from "express";

export function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log("Turbo Log  ~ authAdmin ~ req.session.role:", req.session.role);
  console.log("Turbo Log  ~ authAdmin ~ req.session:", req.session);
  if (!req.session || req.session.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized - Admin only" });
  }
  next();
}
