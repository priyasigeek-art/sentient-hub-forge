import { Key, Shield, Activity, Users } from "lucide-react";

const stats = [
  { label: "API Keys Configured", value: "4", icon: Key, color: "text-primary" },
  { label: "Active Services", value: "0", icon: Activity, color: "text-success" },
  { label: "Security Status", value: "Secure", icon: Shield, color: "text-success" },
  { label: "Admin Users", value: "1", icon: Users, color: "text-warning" },
];

const DashboardHome = () => {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome to your AI Admin Dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-5 animate-slide-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold font-display text-foreground mt-1">
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`h-10 w-10 ${stat.color} opacity-80`} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 glass-card rounded-xl p-6">
        <h2 className="text-lg font-semibold font-display text-foreground mb-4">
          Quick Actions
        </h2>
        <p className="text-muted-foreground">
          Navigate to <span className="text-primary font-medium">General Settings</span> to configure your AI provider API keys.
        </p>
      </div>
    </div>
  );
};

export default DashboardHome;
