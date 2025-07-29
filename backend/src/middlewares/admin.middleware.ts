import { createClient } from '@supabase/supabase-js';
import { Request } from 'express';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function verifyAdminSession(req: Request): Promise<boolean> {

  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return false;

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return false;

  // Example: Check if the user's role is "admin"
  const { data: profile, error: profileError } = await supabase
    .from("management.staff")
    .select("role")
    .eq("id", user.id)
    .single();

  console.log("Turbo Log  ~ verifyAdminSession ~ profileError:", profileError);
  if (profileError || profile?.role !== "admin" || profile?.role !== "database_administrator") return false;

  // Attach user for later use
  (req as any).user = user;
  return true;
}
