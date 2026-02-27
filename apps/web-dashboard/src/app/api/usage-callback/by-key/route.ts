// 通过 API Key 查找用户并记录用量

import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres"
});

const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "freecrawl-internal-secret";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${INTERNAL_API_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { api_key, endpoint, credits_used, pages_scraped } = await request.json();

    if (!api_key || !endpoint) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 通过 API Key 查找用户
    const keyResult = await pool.query(
      `SELECT user_id FROM api_keys WHERE key = $1 AND is_active = true`,
      [api_key]
    );

    if (keyResult.rows.length === 0) {
      return NextResponse.json({ success: true, skipped: true, reason: "API key not found" });
    }

    const user_id = keyResult.rows[0].user_id;

    // 记录用量
    await pool.query(
      `INSERT INTO usage_records (user_id, endpoint, credits_used, pages_scraped)
       VALUES ($1, $2, $3, $4)`,
      [user_id, endpoint, credits_used || 1, pages_scraped || 0]
    );

    // 更新订阅用量
    await pool.query(
      `UPDATE subscriptions 
       SET credits_used = credits_used + $1,
           updated_at = NOW()
       WHERE user_id = $2`,
      [credits_used || 1, user_id]
    );

    // 更新 API Key 最后使用时间
    await pool.query(
      `UPDATE api_keys SET last_used_at = NOW() WHERE key = $1`,
      [api_key]
    );

    return NextResponse.json({ success: true, user_id });
  } catch (error) {
    console.error("Usage callback by key error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
