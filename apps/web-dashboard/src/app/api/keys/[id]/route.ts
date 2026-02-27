import { NextRequest, NextResponse } from "next/server";
import { verifyToken, deleteApiKey } from "@/lib/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

  const deleted = await deleteApiKey(userId, params.id);

  if (!deleted) {
    return NextResponse.json({ error: "Key not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}