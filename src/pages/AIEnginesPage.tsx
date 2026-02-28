import { Brain } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const engines = [
  { id: "openai", name: "OpenAI", models: ["GPT-3.5 Turbo", "GPT-4.1", "GPT-4o", "GPT-4o Mini", "GPT-5", "GPT-5 Mini"], icon: "🤖" },
  { id: "gemini", name: "Google Gemini", models: ["Gemini 2.0 Flash", "Gemini 2.5 Pro", "Gemini 2.5 Flash"], icon: "💎" },
  { id: "claude", name: "Anthropic Claude", models: ["Claude 3 Haiku", "Claude 3 Sonnet", "Claude 3 Opus"], icon: "🧠" },
  { id: "deepseek", name: "DeepSeek", models: ["DeepSeek Chat", "DeepSeek Coder"], icon: "🔍" },
];

const AIEnginesPage = () => {
  const [selectedEngine, setSelectedEngine] = useState("openai");

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-3">
          <Brain className="h-7 w-7 text-primary" />
          AI Engines
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Configure and manage AI engine providers</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {engines.map((engine) => (
          <div
            key={engine.id}
            onClick={() => setSelectedEngine(engine.id)}
            className={`glass-card rounded-xl p-6 cursor-pointer transition-all ${
              selectedEngine === engine.id ? "border-primary/50 ring-1 ring-primary/20" : "hover:border-primary/20"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{engine.icon}</span>
              <div>
                <h3 className="font-semibold font-display text-foreground">{engine.name}</h3>
                <p className="text-xs text-muted-foreground">{engine.models.length} models available</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Default Model</Label>
              <Select defaultValue={engine.models[0]}>
                <SelectTrigger className="bg-secondary border-border text-foreground text-sm h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {engine.models.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIEnginesPage;
