import { useState } from "react";
import { Globe, Plus, Trash2, Edit2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Website {
  id: string;
  name: string;
  url: string;
  status: string;
  pages: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const WebsiteBuilderPage = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Website | null>(null);
  const [form, setForm] = useState({ name: "", url: "", status: "Draft", pages: 0 });

  const { data: websites = [], isLoading } = useQuery({
    queryKey: ["websites"],
    queryFn: async () => {
      const { data, error } = await supabase.from("websites").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Website[];
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (site: typeof form & { id?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (site.id) {
        const { error } = await supabase.from("websites").update({ name: site.name, url: site.url, status: site.status, pages: site.pages }).eq("id", site.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("websites").insert({ name: site.name, url: site.url, status: site.status, pages: site.pages, user_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["websites"] });
      toast.success(editingSite ? "Website updated" : "Website created");
      closeDialog();
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("websites").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["websites"] });
      toast.success("Website deleted");
    },
    onError: (e) => toast.error(e.message),
  });

  const openNew = () => {
    setEditingSite(null);
    setForm({ name: "", url: "", status: "Draft", pages: 0 });
    setDialogOpen(true);
  };

  const openEdit = (site: Website) => {
    setEditingSite(site);
    setForm({ name: site.name, url: site.url, status: site.status, pages: site.pages });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingSite(null);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return toast.error("Name is required");
    upsertMutation.mutate(editingSite ? { ...form, id: editingSite.id } : form);
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-3">
            <Globe className="h-7 w-7 text-primary" />
            Website Builder
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and create websites</p>
        </div>
        <Button onClick={openNew} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Plus className="h-4 w-4" /> New Website
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground py-12">Loading...</div>
      ) : websites.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">No websites yet. Create your first one!</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {websites.map((site) => (
            <div key={site.id} className="glass-card rounded-xl p-6 hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  site.status === "Published" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                }`}>
                  {site.status}
                </span>
              </div>
              <h3 className="font-semibold font-display text-foreground">{site.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{site.url || "No URL set"}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                <span>{site.pages} pages</span>
                <span>Updated {timeAgo(site.updated_at)}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <Button variant="ghost" size="sm" onClick={() => openEdit(site)}><Edit2 className="h-4 w-4" /></Button>
                {site.url && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={site.url.startsWith("http") ? site.url : `https://${site.url}`} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => deleteMutation.mutate(site.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSite ? "Edit Website" : "New Website"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="My Website" />
            </div>
            <div>
              <Label>URL</Label>
              <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="example.com" />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Pages</Label>
              <Input type="number" value={form.pages} onChange={(e) => setForm({ ...form, pages: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={upsertMutation.isPending}>
              {editingSite ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebsiteBuilderPage;
