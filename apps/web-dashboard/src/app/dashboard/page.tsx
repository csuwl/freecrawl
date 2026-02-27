"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Flame, 
  Key, 
  BarChart3, 
  Settings, 
  Copy, 
  Trash2, 
  Plus,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  AlertCircle
} from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
}

interface UsageStats {
  totalCredits: number;
  usedCredits: number;
  pagesScraped: number;
  requestsCount: number;
  plan?: string;
  status?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [usage, setUsage] = useState<UsageStats>({
    totalCredits: 100,
    usedCredits: 0,
    pagesScraped: 0,
    requestsCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState("");
  const [showKey, setShowKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check auth
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/auth/login");
      return;
    }
    setToken(storedToken);
  }, [router]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    if (!token) return;
    
    try {
      const headers = { "x-token": token };
      
      const [keysRes, usageRes] = await Promise.all([
        fetch("/api/keys", { headers }),
        fetch("/api/usage", { headers })
      ]);
      
      if (keysRes.status === 401) {
        localStorage.removeItem("token");
        router.push("/auth/login");
        return;
      }
      
      if (keysRes.ok) {
        const keys = await keysRes.json();
        setApiKeys(keys);
      }
      
      if (usageRes.ok) {
        const usageData = await usageRes.json();
        setUsage(usageData);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const createKey = async () => {
    if (!newKeyName.trim()) {
      setError("Please enter a name for the API key");
      return;
    }
    
    if (!token) {
      setError("Not authenticated");
      return;
    }
    
    try {
      setError(null);
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-token": token 
        },
        body: JSON.stringify({ name: newKeyName })
      });
      
      if (res.status === 401) {
        localStorage.removeItem("token");
        router.push("/auth/login");
        return;
      }
      
      if (res.ok) {
        const newKey = await res.json();
        setApiKeys([newKey, ...apiKeys]);
        setNewKeyName("");
        setSuccess("API key created successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create key");
      }
    } catch (error) {
      console.error("Failed to create key:", error);
      setError("Failed to create key");
    }
  };

  const deleteKey = async (id: string) => {
    if (!confirm("Are you sure you want to delete this API key?")) return;
    if (!token) return;
    
    try {
      const res = await fetch(`/api/keys/${id}`, { 
        method: "DELETE",
        headers: { "x-token": token }
      });
      
      if (res.ok) {
        setApiKeys(apiKeys.filter(k => k.id !== id));
        setSuccess("API key deleted successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError("Failed to delete key");
      }
    } catch (error) {
      console.error("Failed to delete key:", error);
      setError("Failed to delete key");
    }
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setSuccess("API key copied to clipboard!");
    setTimeout(() => setSuccess(null), 2000);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Flame className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="h-8 w-8 text-orange-500" />
            <span className="text-xl font-bold">Freecrawl Dashboard</span>
          </div>
          <Button variant="outline" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        <Tabs defaultValue="keys" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="keys" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="usage" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Usage
            </TabsTrigger>
            <TabsTrigger value="docs" className="flex items-center gap-2">
              Docs
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* API Keys Tab */}
          <TabsContent value="keys" className="space-y-6">
            {/* Usage Overview */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Credits Used</CardDescription>
                  <CardTitle className="text-2xl">
                    {usage.usedCredits} / {usage.totalCredits}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${Math.min((usage.usedCredits / usage.totalCredits) * 100, 100)}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Pages Scraped</CardDescription>
                  <CardTitle className="text-2xl">{usage.pagesScraped}</CardTitle>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>API Requests</CardDescription>
                  <CardTitle className="text-2xl">{usage.requestsCount}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Create New Key */}
            <Card>
              <CardHeader>
                <CardTitle>Create New API Key</CardTitle>
                <CardDescription>
                  Generate a new API key for accessing the Freecrawl API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Key name (e.g., Production App)"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && createKey()}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <Button onClick={createKey} className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Key
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* API Keys List */}
            <Card>
              <CardHeader>
                <CardTitle>Your API Keys</CardTitle>
                <CardDescription>
                  Manage your API keys for programmatic access
                </CardDescription>
              </CardHeader>
              <CardContent>
                {apiKeys.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No API keys yet. Create one above to get started.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {apiKeys.map((apiKey) => (
                      <div 
                        key={apiKey.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {apiKey.is_active ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            <span className="font-medium">{apiKey.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                              {showKey === apiKey.id 
                                ? apiKey.key 
                                : `${apiKey.key.substring(0, 8)}...${apiKey.key.substring(apiKey.key.length - 4)}`
                              }
                            </code>
                            <button
                              onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              {showKey === apiKey.id ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => copyKey(apiKey.key)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Created: {new Date(apiKey.created_at).toLocaleDateString()}</span>
                          <button
                            onClick={() => deleteKey(apiKey.id)}
                            className="p-2 hover:bg-red-50 text-red-500 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
                <CardDescription>
                  View your API usage over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Plan</div>
                    <div className="text-2xl font-bold capitalize">{usage.plan || 'free'}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div className="text-2xl font-bold capitalize">{usage.status || 'active'}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Credits Remaining</div>
                    <div className="text-2xl font-bold">{usage.totalCredits - usage.usedCredits}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Requests</div>
                    <div className="text-2xl font-bold">{usage.requestsCount}</div>
                  </div>
                </div>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                  Usage charts coming soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Docs Tab */}
          <TabsContent value="docs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>
                  Quick start guide for using the Freecrawl API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Base URL</h3>
                  <code className="block p-4 bg-gray-100 rounded-lg text-sm">
                    http://localhost:3002
                  </code>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Authentication</h3>
                  <p className="text-muted-foreground mb-2">
                    Include your API key in the Authorization header:
                  </p>
                  <code className="block p-4 bg-gray-100 rounded-lg text-sm">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Scrape a URL</h3>
                  <pre className="p-4 bg-gray-100 rounded-lg text-sm overflow-x-auto">
{`curl -X POST http://localhost:3002/v2/scrape \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'`}
                  </pre>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Crawl a Website</h3>
                  <pre className="p-4 bg-gray-100 rounded-lg text-sm overflow-x-auto">
{`curl -X POST http://localhost:3002/v2/crawl \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com", "limit": 50}'`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    disabled
                    className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                    placeholder={localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}").email : "user@example.com"}
                  />
                </div>
                <Button variant="outline">Update Password</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}