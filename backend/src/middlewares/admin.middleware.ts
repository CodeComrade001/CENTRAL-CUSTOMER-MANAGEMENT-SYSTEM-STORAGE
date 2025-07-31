// middleware/adminAuth.ts
import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) return res.status(401).json({ error: 'Unauthorized: No token' });

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return res.status(401).json({ error: 'Invalid token' });

    if (user.user_metadata?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Not an admin' });
    }

    (req as any).user = user; // attach user to request
    next(); // go to controller
  } catch (err) {
    return res.status(500).json({ error: 'Auth check failed' });
  }
}
