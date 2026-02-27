// Re-export all types
export * from './api';

// Additional types not in api.ts
export interface UsageRecord {
  id: string;
  user_id: string;
  api_key_id: string;
  endpoint: string;
  credits_used: number;
  pages_scraped: number;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'starter' | 'standard' | 'growth' | 'scale';
  status: 'active' | 'canceled' | 'past_due';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export interface PricingPlan {
  name: string;
  price: number;
  credits: number;
  features: string[];
  rate_limits: {
    crawl: number;
    scrape: number;
    extract: number;
    search: number;
    map: number;
  };
}

export interface AdminStats {
  total_users: number;
  active_users: number;
  total_api_keys: number;
  total_credits_used: number;
  total_pages_scraped: number;
  queue_status: {
    crawl: number;
    scrape: number;
    extract: number;
  };
}

export interface SystemStatus {
  api: 'healthy' | 'degraded' | 'down';
  redis: 'healthy' | 'degraded' | 'down';
  postgres: 'healthy' | 'degraded' | 'down';
  playwright: 'healthy' | 'degraded' | 'down';
}