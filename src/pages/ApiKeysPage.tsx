import { Key, Eye, EyeOff, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const mockApiKeys = [
  { id: 1, name: "Production Key", key: "sk-prod-xxxx...xxxx", created: "2026-01-10", lastUsed: "2 min ago" },
  { id: 2, name: "Development Key", key: "sk-dev-xxxx...xxxx", created: "2026-02-01", lastUsed: "1 hour ago" },
  { id: 3, name: "Testing Key", key: "sk-test-xxxx...xxxx", created: "2026-02-15", lastUsed: "3 days ago" },
];

const ApiKeysPage = () => {
  const [visibility, setVisibility] = useState<Record<number, boolean>>({});

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-3">
          <Key className="h-7 w-7 text-primary" />
          API Keys
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your platform API keys</p>
      </div>

      <div className="space-y-3 max-w-3xl">
        {mockApiKeys.map((apiKey) => (
          <div key={apiKey.id} className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground text-sm">{apiKey.name}</h3>
              <span className="text-xs text-muted-foreground">Last used {apiKey.lastUsed}</span>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm font-mono text-muted-foreground bg-secondary rounded px-3 py-2">
                {visibility[apiKey.id] ? "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx" : apiKey.key}
              </code>
              <button
                onClick={() => setVisibility((p) => ({ ...p, [apiKey.id]: !p[apiKey.id] }))}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {visibility[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button
                onClick={() => toast.success("Copied to clipboard")}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Created {apiKey.created}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiKeysPage;
