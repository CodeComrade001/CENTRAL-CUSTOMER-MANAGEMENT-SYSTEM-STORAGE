import { Request, Response, NextFunction } from "express";
import pool from "../config/database";

export function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.session || req.session.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized - Admin only" });
  }
  next();
}

// export async function dbSessionMiddleware(req: Request, res: Response, next: NextFunction) {
//   const client = await pool.connect();
//   let released = false;
//   const releaseClient = () => {
//     if (released) return;
//     released = true;
//     // best-effort cleanup
//     client.query("RESET app.current_user_id").catch(() => { });
//     client.query("RESET app.current_user_role").catch(() => { });
//     client.release();
//   };
//   res.on('finish', releaseClient);
//   res.on('close', releaseClient);
//   res.on('error', releaseClient);

//   try {
//     if (req.session && req.session.userId) {
//       await client.query("SET app.current_user_id TO $1::text", [req.session.userId]);
//       if (req.session.role === 'admin') {
//         await client.query("SET app.current_user_role = 'admin'");
//       } else {
//         await client.query("RESET app.current_user_role");
//       }
//     } else {
//       await client.query("RESET app.current_user_id");
//       await client.query("RESET app.current_user_role");
//     }
//     (req as any).dbClient = client;
//     next();
//   } catch (err) {
//     console.log("Turbo Log  ~ dbSessionMiddleware ~ err:", err);
//     releaseClient();
//     next(err);
//   }
// }


export async function dbSessionMiddleware(req: Request, res: Response, next: NextFunction) {
  const client = await pool.connect();
  let released = false;

  const releaseClient = () => {
    if (released) return;
    released = true;
    // Best-effort cleanup
    client.query("RESET app.current_user_id").catch(() => { });
    client.query("RESET app.current_user_role").catch(() => { });
    client.release();
  };

  res.on("finish", releaseClient);
  res.on("close", releaseClient);
  res.on("error", releaseClient);

  try {
    if (req.session?.userId) {
      // Safely escape single quotes to prevent SQL injection
      const safeUserId = String(req.session.userId).replace(/'/g, "''");
      await client.query(`SET app.current_user_id = '${safeUserId}'`);

      if (req.session.role === "admin") {
        await client.query(`SET app.current_user_role = 'admin'`);
      } else {
        await client.query("RESET app.current_user_role");
      }
    } else {
      await client.query("RESET app.current_user_id");
      await client.query("RESET app.current_user_role");
    }

    (req as any).dbClient = client;
    next();
  } catch (err) {
    console.error("Turbo Log  ~ dbSessionMiddleware ~ err:", err);
    releaseClient();
    next(err);
  }
}
