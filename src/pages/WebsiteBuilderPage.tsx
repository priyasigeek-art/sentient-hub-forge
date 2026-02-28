import { Globe, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockSites = [
  { id: 1, name: "Portfolio Site", url: "portfolio.webai.com", status: "Published", pages: 5, updated: "2 hours ago" },
  { id: 2, name: "E-commerce Store", url: "shop.webai.com", status: "Draft", pages: 12, updated: "1 day ago" },
  { id: 3, name: "Blog Platform", url: "blog.webai.com", status: "Published", pages: 8, updated: "3 days ago" },
];

const WebsiteBuilderPage = () => {
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
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Plus className="h-4 w-4" /> New Website
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {mockSites.map((site) => (
          <div key={site.id} className="glass-card rounded-xl p-6 hover:border-primary/30 transition-all cursor-pointer">
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
            <p className="text-xs text-muted-foreground mt-1">{site.url}</p>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
              <span>{site.pages} pages</span>
              <span>Updated {site.updated}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebsiteBuilderPage;
