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

// GET - List all users
export async function GET(request: NextRequest) {
  const admin = await getAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db.query(
    `SELECT id, email, name, role, is_active, created_at 
     FROM users 
     ORDER BY created_at DESC`
  );

  return NextResponse.json(result.rows);
}