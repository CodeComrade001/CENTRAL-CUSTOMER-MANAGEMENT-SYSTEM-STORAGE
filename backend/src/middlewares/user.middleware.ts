// // middleware/auth.ts
// import { Request, Response, NextFunction } from 'express';

// export async function userAuthMiddleware(req: Request, res: Response, next: NextFunction) {
//   console.log("Turbo Log  ~ userAuthMiddleware ~ req.session :", req.session);
//   if (!req.session) {
//     return res.status(401).json({ error: "Unauthorized - User only" });
//   }
//   next();
// }
