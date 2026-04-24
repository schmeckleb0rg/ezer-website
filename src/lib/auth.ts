import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { supabase } from "./supabase";

const JWT_SECRET = process.env.JWT_SECRET || process.env.ADMIN_JWT_SECRET || "fallback-secret-change-me";
const TOKEN_EXPIRY = "8h";

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

export async function authenticateAdmin(
  email: string,
  password: string
): Promise<{ token: string; user: AdminUser } | null> {
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, email, password_hash, role")
    .eq("email", email.toLowerCase())
    .single();

  if (error || !data) return null;

  const valid = await bcrypt.compare(password, data.password_hash);
  if (!valid) return null;

  // Update last login
  await supabase
    .from("admin_users")
    .update({ last_login: new Date().toISOString() })
    .eq("id", data.id);

  const user: AdminUser = { id: data.id, email: data.email, role: data.role };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

  return { token, user };
}

export function verifyToken(token: string): AdminUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminUser;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
