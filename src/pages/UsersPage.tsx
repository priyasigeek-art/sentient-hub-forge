import { Users, Search, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";

const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", plan: "Professional", status: "Active", joined: "2026-01-15" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", plan: "Starter", status: "Active", joined: "2026-01-20" },
  { id: 3, name: "Alex Johnson", email: "alex@example.com", plan: "Enterprise", status: "Active", joined: "2026-02-01" },
  { id: 4, name: "Maria Garcia", email: "maria@example.com", plan: "Professional", status: "Inactive", joined: "2026-02-05" },
  { id: 5, name: "David Lee", email: "david@example.com", plan: "Starter", status: "Active", joined: "2026-02-10" },
];

const UsersPage = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground flex items-center gap-3">
            <Users className="h-7 w-7 text-primary" />
            Users
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage platform users and their subscriptions</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-9 bg-secondary border-border text-foreground" />
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-muted-foreground font-medium">Name</th>
              <th className="text-left p-4 text-muted-foreground font-medium">Email</th>
              <th className="text-left p-4 text-muted-foreground font-medium">Plan</th>
              <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
              <th className="text-left p-4 text-muted-foreground font-medium">Joined</th>
              <th className="text-left p-4 text-muted-foreground font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr key={user.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="p-4 font-medium text-foreground">{user.name}</td>
                <td className="p-4 text-muted-foreground">{user.email}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {user.plan}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    user.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground">{user.joined}</td>
                <td className="p-4">
                  <button className="text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
