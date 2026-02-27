// 用量记录回调 API
// Freecrawl API 调用此端点记录用量

import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres"
});

// 验证内部 API 调用
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "freecrawl-internal-secret";

// UUID 验证正则
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  // 验证 API Key
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${INTERNAL_API_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { api_key_id, user_id, endpoint, credits_used, pages_scraped } = await request.json();

    if (!user_id || !endpoint) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 如果 user_id 不是有效的 UUID，跳过记录（非 Dashboard 用户）
    if (!UUID_REGEX.test(user_id)) {
      console.log(`Skipping usage callback for non-Dashboard user: ${user_id}`);
      return NextResponse.json({ success: true, skipped: true, reason: "Non-Dashboard user" });
    }

    // 记录用量
    await pool.query(
      `INSERT INTO usage_records (user_id, api_key_id, endpoint, credits_used, pages_scraped)
       VALUES ($1, $2, $3, $4, $5)`,
      [user_id, api_key_id || null, endpoint, credits_used || 1, pages_scraped || 0]
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
    if (api_key_id) {
      await pool.query(
        `UPDATE api_keys SET last_used_at = NOW() WHERE id = $1`,
        [api_key_id]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Usage callback error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
