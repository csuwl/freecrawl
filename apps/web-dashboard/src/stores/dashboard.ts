import { create } from "zustand";
import { ApiKey, UsageSummary, Subscription } from "@/types";
import { apiClient } from "./auth";

interface DashboardState {
  apiKeys: ApiKey[];
  usage: UsageSummary | null;
  subscription: Subscription | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchApiKeys: () => Promise<void>;
  createApiKey: (name: string) => Promise<ApiKey>;
  deleteApiKey: (id: string) => Promise<void>;
  toggleApiKey: (id: string, isActive: boolean) => Promise<void>;
  
  fetchUsage: () => Promise<void>;
  fetchSubscription: () => Promise<void>;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  apiKeys: [],
  usage: null,
  subscription: null,
  isLoading: false,
  error: null,

  fetchApiKeys: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient<{ keys: ApiKey[] }>("/keys");
      set({ apiKeys: response.keys || [], isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createApiKey: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient<{ key: ApiKey }>("/keys", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      const newKey = response.key;
      set((state) => ({
        apiKeys: [...state.apiKeys, newKey],
        isLoading: false,
      }));
      return newKey;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteApiKey: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient(`/keys/${id}`, { method: "DELETE" });
      set((state) => ({
        apiKeys: state.apiKeys.filter((key) => key.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  toggleApiKey: async (id: string, isActive: boolean) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient<{ key: ApiKey }>(`/keys/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ is_active: isActive }),
      });
      set((state) => ({
        apiKeys: state.apiKeys.map((key) =>
          key.id === id ? { ...key, is_active: isActive } : key
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  fetchUsage: async () => {
    try {
      const response = await apiClient<{ usage: UsageSummary }>("/usage");
      set({ usage: response.usage });
    } catch (error) {
      console.error("Failed to fetch usage:", error);
    }
  },

  fetchSubscription: async () => {
    try {
      const response = await apiClient<{ subscription: Subscription }>(
        "/subscription"
      );
      set({ subscription: response.subscription });
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));