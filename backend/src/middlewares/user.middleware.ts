import { createClient } from '@supabase/supabase-js';
import { Request } from 'express';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function verifyUserSession(req: Request): Promise<boolean> {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) return false;

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) return false;

  // req.user = user; 
  return true;
}
