import { Bell, Check } from "lucide-react";

const mockNotifications = [
  { id: 1, title: "New user signup", desc: "John Doe created an account", time: "2 min ago", read: false },
  { id: 2, title: "Website published", desc: "Portfolio Site was published successfully", time: "1 hour ago", read: false },
  { id: 3, title: "AI generation complete", desc: "E-commerce Store generation finished", time: "3 hours ago", read: true },
  { id: 4, title: "Plan upgraded", desc: "Jane Smith upgraded to Professional", time: "1 day ago", read: true },
  { id: 5, title: "API key rotated", desc: "OpenAI API key was updated", time: "2 days ago", read: true },
];

const NotificationsPage = () => {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-3">
          <Bell className="h-7 w-7 text-primary" />
          Notifications
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Stay updated on platform activity</p>
      </div>

      <div className="space-y-2 max-w-2xl">
        {mockNotifications.map((n) => (
          <div key={n.id} className={`glass-card rounded-xl p-4 flex items-start gap-4 ${!n.read ? "border-primary/30" : ""}`}>
            <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!n.read ? "bg-primary" : "bg-transparent"}`} />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{n.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
            </div>
            <span className="text-xs text-muted-foreground shrink-0">{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
