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

// PATCH - Update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await getAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { is_active, role } = body;

  const updateFields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (typeof is_active === "boolean") {
    updateFields.push(`is_active = $${paramIndex++}`);
    values.push(is_active);
  }
  if (role) {
    updateFields.push(`role = $${paramIndex++}`);
    values.push(role);
  }

  if (updateFields.length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  values.push(params.id);
  
  await db.query(
    `UPDATE users SET ${updateFields.join(", ")} WHERE id = $${paramIndex}`,
    values
  );

  return NextResponse.json({ success: true });
}

// DELETE - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await getAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Delete user's data
  await db.query("DELETE FROM api_keys WHERE user_id = $1", [params.id]);
  await db.query("DELETE FROM subscriptions WHERE user_id = $1", [params.id]);
  await db.query("DELETE FROM usage_records WHERE user_id = $1", [params.id]);
  await db.query("DELETE FROM users WHERE id = $1", [params.id]);

  return NextResponse.json({ success: true });
}