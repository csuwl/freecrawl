import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getSubscription, getUsageStats } from "@/lib/db";

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

  // Get subscription info
  const subscription = await getSubscription(userId);
  
  // Get usage stats
  const usage = await getUsageStats(userId);

  const totalCredits = subscription?.credits_total || 100;
  const usedCredits = Number(usage?.credits_used || 0) + (subscription?.credits_used || 0);

  return NextResponse.json({
    totalCredits,
    usedCredits,
    pagesScraped: Number(usage?.pages_scraped || 0),
    requestsCount: Number(usage?.requests_count || 0),
    plan: subscription?.plan || "free",
    status: subscription?.status || "active"
  });
}