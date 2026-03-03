import {
  LayoutDashboard,
  Settings,
  Brain,
  Users,
  Globe,
  Bell,
  Key,
  FileText,
  ImageIcon,
  LogOut,
  Zap,
  ChevronLeft,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: Settings, label: "General Setting", to: "/dashboard/settings" },
  { icon: Brain, label: "AI Engines", to: "/dashboard/ai-engines" },
  { icon: FileText, label: "Content Creator", to: "/dashboard/content-creator" },
  { icon: ImageIcon, label: "Image Generator", to: "/dashboard/image-generator" },
  { icon: Users, label: "Users", to: "/dashboard/users" },
  { icon: Globe, label: "Website Builder", to: "/dashboard/website-builder" },
  { icon: Bell, label: "Notifications", to: "/dashboard/notifications" },
  { icon: Key, label: "API Keys", to: "/dashboard/api-keys" },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-56"
      } min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 relative`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold font-display text-sidebar-accent-foreground">
            Web<span className="text-primary">AI</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`
            }
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && item.label}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 bottom-20 w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className={`h-3 w-3 transition-transform ${collapsed ? "rotate-180" : ""}`} />
      </button>

      {/* Logout */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive w-full transition-all duration-200"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
