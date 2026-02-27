import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getApiKeysByUser, createApiKey } from "@/lib/db";

// GET - List API keys
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const xToken = request.headers.get("x-token");
  
  let userId: string | null = null;
  
  if (authHeader?.startsWith("Bearer ")) {
    const decoded = verifyToken(authHeader.substring(7));
    userId = decoded?.userId || null;
  } else if (xToken) {
    const decoded = verifyToken(xToken);
    userId = decoded?.userId || null;
  }

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keys = await getApiKeysByUser(userId);
  return NextResponse.json(keys);
}

// POST - Create new API key
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const xToken = request.headers.get("x-token");
  
  let userId: string | null = null;
  
  if (authHeader?.startsWith("Bearer ")) {
    const decoded = verifyToken(authHeader.substring(7));
    userId = decoded?.userId || null;
  } else if (xToken) {
    const decoded = verifyToken(xToken);
    userId = decoded?.userId || null;
  }

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await request.json();

  if (!name) {
    return NextResponse.json({ error: "Key name is required" }, { status: 400 });
  }

  const apiKey = await createApiKey(userId, name);
  return NextResponse.json(apiKey);
}