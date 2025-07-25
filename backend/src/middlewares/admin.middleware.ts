// src/middlewares/validateUser.ts
import bcrypt from "bcrypt";
import { createClient } from "@supabase/supabase-js";
import { Router, Request, Response, NextFunction } from "express";
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export default async function validateUserMiddleware(req: Request, res: Response, next: NextFunction) {
  const { username, password } = req.headers;

  if (!username || !password) {
    return res.status(401).json({ message: "Missing credentials" });
  }

  const { data, error } = await supabase
    .from("management.staff")
    .select("password, role")
    .eq("username", username)
    .single();

  if (error || !data) {
    return res.status(403).json({ message: "Invalid user" });
  }

  const isValid = await bcrypt.compare(password as string, data.password);
  if (!isValid) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  // Attach user info to request for downstream use
  req.body.user = { username, role: data.role };
  next();
}
