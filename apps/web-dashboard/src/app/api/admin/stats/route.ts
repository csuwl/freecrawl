import { NextRequest, NextResponse } from "next/server";
import { verifyToken, db } from "@/lib/db";

async function getAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const xToken = request.headers.get("x-token");
  
  if (authHeader?.startsWith("Bearer ")) {
    const decoded = verifyToken(authHeader.substring(7));
    if (decoded?.role === "admin") return decoded;
  }
  
  if (xToken) {
    const decoded = verifyToken(xToken);
    if (decoded?.role === "admin") return decoded;
  }
  
  return null;
}

// GET - Get admin statistics
export async function GET(request: NextRequest) {
  const admin = await getAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user counts
  const usersResult = await db.query("SELECT COUNT(*) FROM users");
  const activeResult = await db.query("SELECT COUNT(*) FROM users WHERE is_active = true");
  const keysResult = await db.query("SELECT COUNT(*) FROM api_keys");
  const requestsResult = await db.query("SELECT COUNT(*) FROM usage_records");

  return NextResponse.json({
    totalUsers: Number(usersResult.rows[0]?.count || 0),
    activeUsers: Number(activeResult.rows[0]?.count || 0),
    totalKeys: Number(keysResult.rows[0]?.count || 0),
    totalRequests: Number(requestsResult.rows[0]?.count || 0)
  });
}