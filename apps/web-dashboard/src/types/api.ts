// User types
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: "user" | "admin";
  created_at: string;
  is_active: boolean;
}

// API Key types
export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key: string;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
  expires_at: string | null;
}

// Usage types
export interface UsageSummary {
  totalCredits: number;
  usedCredits: number;
  pagesScraped: number;
  requestsCount: number;
  plan?: string;
  status?: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export interface ApiKeyResponse {
  success: boolean;
  key?: ApiKey;
  keys?: ApiKey[];
  error?: string;
}

export interface UsageResponse {
  success: boolean;
  usage?: UsageSummary;
  error?: string;
}

// Request types
export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateApiKeyRequest {
  name: string;
  expires_at?: string;
}

export interface UpdateApiKeyRequest {
  name?: string;
  is_active?: boolean;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
}