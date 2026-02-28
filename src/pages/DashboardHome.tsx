import { Users, Globe, Cpu, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Users", value: "1,248", change: "+12%", icon: Users },
  { label: "Websites Built", value: "3,567", change: "+8%", icon: Globe },
  { label: "AI Generations", value: "24.5K", change: "+23%", icon: Cpu },
  { label: "Revenue", value: "$12,400", change: "+15%", icon: TrendingUp },
];

const DashboardHome = () => {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your WebAI platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-semibold text-green-400">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold font-display text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
