import { Pool } from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres"
});

// Helper to verify JWT
export function verifyToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
  } catch {
    return null;
  }
}

// Helper to hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Helper to verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Export pool for direct queries
export const db = pool;

// User operations
export async function createUser(email: string, password: string, name?: string) {
  const hashedPassword = await hashPassword(password);
  const result = await pool.query(
    `INSERT INTO users (email, password, name, role, is_active) 
     VALUES ($1, $2, $3, 'user', true) 
     RETURNING id, email, name, role, created_at`,
    [email, hashedPassword, name || email.split("@")[0]]
  );
  return result.rows[0];
}

export async function getUserByEmail(email: string) {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0];
}

export async function getUserById(id: string) {
  const result = await pool.query(
    "SELECT id, email, name, role, is_active, created_at FROM users WHERE id = $1",
    [id]
  );
  return result.rows[0];
}

// API Key operations
export async function createApiKey(userId: string, name: string) {
  const crypto = await import("crypto");
  const key = `fc-${crypto.randomBytes(24).toString("hex")}`;
  
  const result = await pool.query(
    `INSERT INTO api_keys (user_id, name, key, is_active) 
     VALUES ($1, $2, $3, true) 
     RETURNING id, name, key, is_active, created_at`,
    [userId, name, key]
  );
  return result.rows[0];
}

export async function getApiKeysByUser(userId: string) {
  const result = await pool.query(
    `SELECT id, name, key, is_active, created_at, last_used_at 
     FROM api_keys 
     WHERE user_id = $1 
     ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
}

export async function deleteApiKey(userId: string, keyId: string) {
  const result = await pool.query(
    "DELETE FROM api_keys WHERE id = $1 AND user_id = $2 RETURNING id",
    [keyId, userId]
  );
  return (result.rowCount ?? 0) > 0;
}

// Subscription operations
export async function getSubscription(userId: string) {
  const result = await pool.query(
    "SELECT * FROM subscriptions WHERE user_id = $1",
    [userId]
  );
  return result.rows[0];
}

export async function createSubscription(userId: string, plan = "free", creditsTotal = 100) {
  const result = await pool.query(
    `INSERT INTO subscriptions (user_id, plan, status, credits_total, credits_used) 
     VALUES ($1, $2, 'active', $3, 0) 
     RETURNING *`,
    [userId, plan, creditsTotal]
  );
  return result.rows[0];
}

// Usage operations
export async function getUsageStats(userId: string) {
  const result = await pool.query(
    `SELECT 
      COALESCE(SUM(credits_used), 0) as credits_used,
      COALESCE(SUM(pages_scraped), 0) as pages_scraped,
      COUNT(*) as requests_count
     FROM usage_records 
     WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0];
}

export { JWT_SECRET };