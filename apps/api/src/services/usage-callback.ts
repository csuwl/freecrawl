// 用量回调服务 - 发送用量数据到 Dashboard
import { logger } from "../lib/logger";

const DASHBOARD_URL = process.env.DASHBOARD_URL || "http://dashboard:3000";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "firecrawl-internal-secret";

interface UsageCallbackData {
  user_id: string;
  api_key_id?: string;
  endpoint: string;
  credits_used: number;
  pages_scraped?: number;
}

export async function sendUsageCallback(data: UsageCallbackData): Promise<void> {
  try {
    const response = await fetch(`${DASHBOARD_URL}/api/usage-callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${INTERNAL_API_KEY}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      logger.warn(`Usage callback failed: ${response.status}`, { data });
    }
  } catch (error) {
    logger.warn(`Usage callback error: ${error}`, { data });
  }
}

// 通过 API Key 发送用量回调
export async function sendUsageCallbackByApiKey(
  apiKey: string | undefined,
  endpoint: string,
  creditsUsed: number,
  pagesScraped: number = 1
): Promise<void> {
  if (!apiKey) return;
  
  // 调用 Dashboard 的端点，让它通过 API Key 查找用户
  try {
    const response = await fetch(`${DASHBOARD_URL}/api/usage-callback/by-key`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${INTERNAL_API_KEY}`,
      },
      body: JSON.stringify({
        api_key: apiKey,
        endpoint,
        credits_used: creditsUsed,
        pages_scraped: pagesScraped,
      }),
    });

    if (!response.ok) {
      logger.warn(`Usage callback by key failed: ${response.status}`);
    }
  } catch (error) {
    logger.warn(`Usage callback by key error: ${error}`);
  }
}
