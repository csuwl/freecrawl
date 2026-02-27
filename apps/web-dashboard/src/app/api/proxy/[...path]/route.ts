import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const FIRECRAWL_API_URL = process.env.FIRECRAWL_API_URL || process.env.NEXT_PUBLIC_FIRECRAWL_API_URL || "http://api:3002";

// API Key 验证
async function validateApiKey(apiKey: string) {
  const result = await db.query(
    `SELECT k.id, k.user_id, k.is_active, s.credits_total, s.credits_used 
     FROM api_keys k 
     LEFT JOIN subscriptions s ON k.user_id = s.user_id 
     WHERE k.key = $1`,
    [apiKey]
  );
  
  if (result.rows.length === 0) {
    return { valid: false, error: "Invalid API key" };
  }
  
  const keyData = result.rows[0];
  
  if (!keyData.is_active) {
    return { valid: false, error: "API key is disabled" };
  }
  
  const usedCredits = Number(keyData.credits_used || 0);
  const totalCredits = Number(keyData.credits_total || 100);
  
  if (usedCredits >= totalCredits) {
    return { valid: false, error: "Credits exhausted" };
  }
  
  return { valid: true, userId: keyData.user_id, keyId: keyData.id };
}

// 记录用量
async function recordUsage(userId: string, keyId: string, endpoint: string, credits: number, pages: number) {
  await db.query(
    `INSERT INTO usage_records (user_id, api_key_id, endpoint, credits_used, pages_scraped) VALUES ($1, $2, $3, $4, $5)`,
    [userId, keyId, endpoint, credits, pages]
  );
  
  await db.query(
    `UPDATE subscriptions SET credits_used = credits_used + $1 WHERE user_id = $2`,
    [credits, userId]
  );
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  const authHeader = request.headers.get("authorization") || "";
  const apiKey = authHeader.replace("Bearer ", "").trim();
  
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 401 });
  }
  
  const path = (params.path || []).join("/");
  const endpoint = path.split("/")[0] || "unknown";
  
  const validation = await validateApiKey(apiKey);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 401 });
  }
  
  try {
    const body = await request.text();
    const response = await fetch(`${FIRECRAWL_API_URL}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    
    const data = await response.json();
    
    if (response.ok && data.success && validation.userId && validation.keyId) {
      const credits = data.data?.metadata?.creditsUsed || 1;
      const pages = data.data?.links?.length || 1;
      await recordUsage(validation.userId, validation.keyId, endpoint, credits, pages);
    }
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Proxy error:", error?.message || error);
    return NextResponse.json({ error: "Proxy error", details: error?.message }, { status: 502 });
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const params = await context.params;
  const authHeader = request.headers.get("authorization") || "";
  const apiKey = authHeader.replace("Bearer ", "").trim();
  
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 401 });
  }
  
  const path = (params.path || []).join("/");
  
  const validation = await validateApiKey(apiKey);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 401 });
  }
  
  try {
    const response = await fetch(`${FIRECRAWL_API_URL}/${path}`);
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ error: "Proxy error", details: error?.message }, { status: 502 });
  }
}