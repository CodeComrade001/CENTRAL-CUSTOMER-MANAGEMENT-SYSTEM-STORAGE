// middlewares/admin.middleware.ts
import { Request, Response, NextFunction } from "express";
import pool from "../config/database";

export function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.session || req.session.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized - Admin only" });
  }
  next();
}

// Attach a dedicated client from the pool for the lifetime of the request
export async function attachDbClient(req: Request, res: Response, next: NextFunction) {
  try {
    const client = await pool.connect();
    (req as any).dbClient = client;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * dbSessionMiddleware
 * - sets app.current_user_id and app.current_user_role on the *attached client*
 * - registers a single release handler to RESET the configs and release the client
 */
export async function dbSessionMiddleware(req: Request, res: Response, next: NextFunction) {
  const client = (req as any).dbClient;
  if (!client) {
    // Defensive: attachDbClient must run before this
    return next(new Error("db client not attached"));
  }

  let cleaned = false;
  const cleanup = async () => {
    if (cleaned) return;
    cleaned = true;
    try {
      // reset values so connection is clean for next user
      await client.query("RESET app.current_user_id");
      await client.query("RESET app.current_user_role");
    } catch (e) {
    } finally {
      try { client.release(); } catch (e) { return next(new Error("Failed to release client:")); }
    }
  };

  // Ensure cleanup runs once when response finishes or closes
  res.on("finish", cleanup);
  res.on("close", cleanup);
  res.on("error", cleanup);

  try {
    if (req.session?.user_id) {
      const userId = String(req.session.user_id);
      const role = req.session.role ?? null;

      // Option A (simpler): session-scoped
      // set_config(..., false) sets it for the session (persist until RESET)
      await client.query(`SELECT set_config('app.current_user_id', $1, false)`, [userId]);
      if (role) {
        await client.query(`SELECT set_config('app.current_user_role', $1, false)`, [role]);
      } else {
        await client.query(`RESET app.current_user_role`);
      }


    } else {
      // no session -> clear any previous settings
      await client.query("RESET app.current_user_id");
      await client.query("RESET app.current_user_role");
    }

    // client remains attached to req for downstream handlers
    next();
  } catch {
    // ensure cleanup on error
    await cleanup();
    next();
  }
}
