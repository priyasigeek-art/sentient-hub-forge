import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/AdminSidebar";
import { Search, Bell, User } from "lucide-react";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Top bar */}
        <header className="h-14 border-b border-border flex items-center justify-end gap-3 px-6 shrink-0">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Search className="h-5 w-5" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors relative">
            <Bell className="h-5 w-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
