import { useState } from "react";
import { Image, Loader2, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const IMAGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-image`;

type GeneratedImage = {
  prompt: string;
  url: string;
  text?: string;
};

const ImageGeneratorPage = () => {
  const [prompt, setPrompt] = useState("");
  const [quality, setQuality] = useState("standard");
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);

  const generate = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const resp = await fetch(IMAGE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ prompt: prompt.trim(), quality }),
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || "Image generation failed");
      }

      const data = await resp.json();
      
      if (data.images && data.images.length > 0) {
        const newImages = data.images.map((img: any) => ({
          prompt: prompt.trim(),
          url: img.image_url?.url || "",
          text: data.text,
        }));
        setImages((prev) => [...newImages, ...prev]);
        toast.success("Image generated!");
      } else {
        toast.error("No image was generated. Try a different prompt.");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to generate image");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = (url: string, name: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `ai-image-${name}.png`;
    link.click();
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-3">
          <Image className="h-7 w-7 text-primary" />
          AI Image Generator
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Create stunning images from text descriptions</p>
      </div>

      {/* Generator controls */}
      <div className="glass-card rounded-xl p-6 mb-6">
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">Describe your image</Label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic cityscape at sunset with flying cars and neon lights..."
              className="bg-secondary border-border min-h-[80px] resize-none"
            />
          </div>
          <div className="flex items-end gap-4">
            <div className="w-48">
              <Label className="text-sm text-muted-foreground mb-2 block">Quality</Label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger className="bg-secondary border-border text-foreground text-sm h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">⚡ Standard (Fast)</SelectItem>
                  <SelectItem value="high">✨ High Quality</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generate} disabled={isLoading || !prompt.trim()} className="h-10 px-6">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Gallery */}
      {images.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Image className="h-16 w-16 text-primary/30 mb-4" />
          <h3 className="text-lg font-display font-semibold text-foreground/70">No images yet</h3>
          <p className="text-sm text-muted-foreground mt-1">Describe an image above and click Generate to create one</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && (
          <div className="glass-card rounded-xl aspect-square flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Creating your image...</p>
            </div>
          </div>
        )}
        {images.map((img, i) => (
          <div key={i} className="glass-card rounded-xl overflow-hidden group">
            <div className="relative aspect-square">
              <img src={img.url} alt={img.prompt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div className="flex-1">
                  <p className="text-xs text-white/80 line-clamp-2">{img.prompt}</p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20 shrink-0"
                  onClick={() => downloadImage(img.url, String(i))}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGeneratorPage;
