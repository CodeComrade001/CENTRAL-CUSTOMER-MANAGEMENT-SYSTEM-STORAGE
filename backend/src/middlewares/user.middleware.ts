// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function userAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    console.log("Turbo Log  ~ userAuthMiddleware ~ token:", token);

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    console.log("Turbo Log  ~ userAuthMiddleware ~ user:", user);

    if (error || !user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }

    // Attach user to request for downstream handlers
    (req as any).user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ error: 'Internal Server Error during authentication' });
  }
}
