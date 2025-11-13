import { Users, Server, Activity, DollarSign } from "lucide-react";
import { StatsCards } from "@/components/stats/stats-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const stats = [
    {
      title: "Active Tenants",
      value: "1,248",
      description: "12.5% from last month",
      trend: { value: 12.5, isPositive: true },
      icon: <Users className="h-5 w-5" />,
      color: "primary" as const,
    },
    {
      title: "Total Revenue",
      value: "$45.2K",
      description: "8.3% from last month",
      trend: { value: 8.3, isPositive: true },
      icon: <DollarSign className="h-5 w-5" />,
      color: "success" as const,
    },
    {
      title: "API Requests",
      value: "2.4M",
      description: "23.1% from last month",
      trend: { value: 23.1, isPositive: true },
      icon: <Activity className="h-5 w-5" />,
      color: "warning" as const,
    },
    {
      title: "System Health",
      value: "99.8%",
      description: "0.2% from last month",
      trend: { value: 0.2, isPositive: true },
      icon: <Server className="h-5 w-5" />,
      color: "success" as const,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <StatsCards cards={stats} columns={4} />

      {/* Tenant Growth Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base font-medium">Tenant Growth Over Time</CardTitle>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs border rounded hover:bg-accent transition-colors">
              Export
            </button>
            <button className="px-3 py-1.5 text-xs border rounded hover:bg-accent transition-colors">
              Settings
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] relative rounded overflow-hidden bg-gradient-to-b from-primary/10 to-transparent">
            <div
              className="absolute bottom-0 left-0 right-0 h-4/5 opacity-30"
              style={{
                background: 'linear-gradient(to right, transparent 0%, var(--primary) 50%, transparent 100%)',
                clipPath: 'polygon(0% 100%, 10% 70%, 20% 75%, 30% 50%, 40% 60%, 50% 30%, 60% 40%, 70% 20%, 80% 35%, 90% 25%, 100% 40%, 100% 100%)'
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Tenants Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base font-medium">Recent Tenants</CardTitle>
          <button className="px-3 py-1.5 text-xs border rounded hover:bg-accent transition-colors">
            View All
          </button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Tenant Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Plan</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Users</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">MRR</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Created</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-accent/50">
                  <td className="px-4 py-3">Acme Corporation</td>
                  <td className="px-4 py-3">Enterprise</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded bg-[rgba(115,191,105,0.2)] text-chart-1 font-medium">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-3">142</td>
                  <td className="px-4 py-3">$2,499</td>
                  <td className="px-4 py-3">2025-01-10</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="px-4 py-3">Tech Solutions Inc.</td>
                  <td className="px-4 py-3">Professional</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded bg-[rgba(115,191,105,0.2)] text-chart-1 font-medium">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-3">58</td>
                  <td className="px-4 py-3">$999</td>
                  <td className="px-4 py-3">2025-01-12</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="px-4 py-3">Global Logistics</td>
                  <td className="px-4 py-3">Business</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded bg-[rgba(255,152,48,0.2)] text-chart-3 font-medium">
                      Trial
                    </span>
                  </td>
                  <td className="px-4 py-3">23</td>
                  <td className="px-4 py-3">$0</td>
                  <td className="px-4 py-3">2025-01-14</td>
                </tr>
                <tr className="border-b hover:bg-accent/50">
                  <td className="px-4 py-3">Retail Solutions</td>
                  <td className="px-4 py-3">Professional</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded bg-[rgba(115,191,105,0.2)] text-chart-1 font-medium">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-3">67</td>
                  <td className="px-4 py-3">$999</td>
                  <td className="px-4 py-3">2025-01-08</td>
                </tr>
                <tr className="hover:bg-accent/50">
                  <td className="px-4 py-3">Manufacturing Pro</td>
                  <td className="px-4 py-3">Enterprise</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded bg-[rgba(158,167,180,0.2)] text-muted-foreground font-medium">
                      Suspended
                    </span>
                  </td>
                  <td className="px-4 py-3">0</td>
                  <td className="px-4 py-3">$0</td>
                  <td className="px-4 py-3">2024-12-20</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
