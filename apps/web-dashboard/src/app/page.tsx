import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center gap-3">
          <Flame className="h-12 w-12 text-orange-500" />
          <h1 className="text-4xl font-bold">Freecrawl</h1>
        </div>
        
        <p className="text-xl text-muted-foreground text-center max-w-md">
          Turn websites into LLM-ready data. Powered by AI.
        </p>
        
        <div className="flex gap-4 mt-8">
          <Button size="lg" asChild>
            <a href="/auth/login">Sign In</a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="/auth/register">Create Account</a>
          </Button>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an API key?{" "}
            <a href="/dashboard" className="text-primary hover:underline">
              Go to Dashboard
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}