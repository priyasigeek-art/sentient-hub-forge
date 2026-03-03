import { useState, useRef, useEffect } from "react";
import { FileText, Send, Loader2, Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-content`;

type Msg = { role: "user" | "assistant"; content: string };

const contentTypes = [
  { id: "general", label: "General", icon: "💬" },
  { id: "blog", label: "Blog Post", icon: "📝" },
  { id: "social", label: "Social Media", icon: "📱" },
  { id: "email", label: "Email Copy", icon: "✉️" },
  { id: "code", label: "Code", icon: "💻" },
  { id: "seo", label: "SEO Content", icon: "🔍" },
];

const ContentCreatorPage = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contentType, setContentType] = useState("general");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const send = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const allMessages = [...messages, userMsg];

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages, contentType }),
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || "Request failed");
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to generate content");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-3">
          <FileText className="h-7 w-7 text-primary" />
          AI Content Creator
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Generate blog posts, social media content, emails, and more</p>
      </div>

      {/* Content type selector */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {contentTypes.map((ct) => (
          <button
            key={ct.id}
            onClick={() => setContentType(ct.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              contentType === ct.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {ct.icon} {ct.label}
          </button>
        ))}
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-0 pr-1">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Sparkles className="h-12 w-12 text-primary/40 mb-4" />
            <h3 className="text-lg font-display font-semibold text-foreground/70">What would you like to create?</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Select a content type above and describe what you need. AI will generate it instantly.
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "glass-card"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm">{msg.content}</p>
              )}
              {msg.role === "assistant" && (
                <button
                  onClick={() => handleCopy(msg.content, i)}
                  className="mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  {copiedIdx === i ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copiedIdx === i ? "Copied" : "Copy"}
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex justify-start">
            <div className="glass-card rounded-xl px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Describe the content you want to generate..."
          className="bg-secondary border-border min-h-[48px] max-h-32 resize-none"
        />
        <Button onClick={send} disabled={isLoading || !input.trim()} className="shrink-0 h-12 w-12">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default ContentCreatorPage;
