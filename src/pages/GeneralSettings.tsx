import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Key, Save, Loader2 } from "lucide-react";

interface ApiKey {
  key: string;
  label: string;
  icon: string;
}

const API_KEYS: ApiKey[] = [
  { key: "OPENAI_API_KEY", label: "OpenAI API Key", icon: "🤖" },
  { key: "GEMINI_API_KEY", label: "Gemini API Key", icon: "💎" },
  { key: "CLAUDE_API_KEY", label: "Claude API Key", icon: "🧠" },
  { key: "DEEPSEEK_API_KEY", label: "DeepSeek API Key", icon: "🔍" },
];

const GeneralSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("setting_key, setting_value");

      if (error) throw error;

      const settingsMap: Record<string, string> = {};
      data?.forEach((s) => {
        settingsMap[s.setting_key] = s.setting_value;
      });
      setSettings(settingsMap);
    } catch (error: any) {
      toast.error("Failed to load settings: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        const { error } = await supabase
          .from("settings")
          .update({ setting_value: value })
          .eq("setting_key", key);

        if (error) throw error;
      }
      toast.success("Settings saved successfully!");
    } catch (error: any) {
      toast.error("Failed to save settings: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleVisibility = (key: string) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground flex items-center gap-3">
          <Key className="h-8 w-8 text-primary" />
          General Settings
        </h1>
        <p className="mt-2 text-muted-foreground">
          Manage your AI provider API keys and configuration
        </p>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-semibold font-display text-foreground border-b border-border pb-3">
          API Key Configuration
        </h2>

        <div className="space-y-5">
          {API_KEYS.map((apiKey) => (
            <div key={apiKey.key} className="space-y-2 animate-slide-in">
              <Label className="text-foreground flex items-center gap-2 text-sm font-medium">
                <span>{apiKey.icon}</span>
                {apiKey.label}
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={visibility[apiKey.key] ? "text" : "password"}
                    value={settings[apiKey.key] || ""}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        [apiKey.key]: e.target.value,
                      }))
                    }
                    placeholder={`Enter your ${apiKey.label}...`}
                    className="bg-secondary border-border text-foreground pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility(apiKey.key)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {visibility[apiKey.key] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
