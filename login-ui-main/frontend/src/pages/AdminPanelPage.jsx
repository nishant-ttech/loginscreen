import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Server, Network, Activity, CheckCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminPanelPage() {
  const systemStats = [
    { name: "Total Users", value: "24,581", change: "+12.5%", icon: Shield, color: "emerald" },
    { name: "Active Sessions", value: "1,842", change: "+8.2%", icon: Server, color: "blue" },
    { name: "System Uptime", value: "99.98%", change: "+0.1%", icon: Network, color: "emerald" },
    { name: "API Requests", value: "2.4M", change: "+15.3%", icon: Activity, color: "amber" },
  ];

  const recentAlerts = [
    { id: 1, type: "success", message: "System backup completed successfully", time: "10 min ago" },
    { id: 2, type: "info", message: "New merchant registration approved", time: "25 min ago" },
    { id: 3, type: "warning", message: "High transaction volume detected", time: "1 hour ago" },
    { id: 4, type: "success", message: "Security scan completed - no threats", time: "2 hours ago" },
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case "success": return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case "warning": return <Shield className="h-4 w-4 text-amber-400" />;
      case "info": return <Settings className="h-4 w-4 text-blue-400" />;
      default: return <Shield className="h-4 w-4 text-white/60" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-white/60 text-sm mt-1">System administration and monitoring dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="glass hover:bg-white/10 transition-colors">
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </Button>
          <Button className="glass hover:bg-white/10 transition-colors">
            Generate Report
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {systemStats.map((stat, i) => (
          <Card key={i} className="glass-strong border-white/10">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`h-10 w-10 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 text-${stat.color}-400`} />
                </div>
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/40 mt-1">{stat.name}</div>
              <div className="flex items-center gap-1 mt-2">
                <span className={`text-sm ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-white/30">from last week</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Activity */}
        <Card className="glass-strong border-white/10 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white text-lg">System Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">API Response Time</span>
                <span className="text-emerald-400 font-medium">120ms avg</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500/50 rounded-full" style={{ width: "65%" }} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">Database Queries</span>
                <span className="text-amber-400 font-medium">2.1k/min</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500/50 rounded-full" style={{ width: "45%" }} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">Cache Hit Rate</span>
                <span className="text-emerald-400 font-medium">94.2%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500/50 rounded-full" style={{ width: "94%" }} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">Error Rate</span>
                <span className="text-red-400 font-medium">0.02%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-red-500/50 rounded-full" style={{ width: "2%" }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="glass-strong border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex gap-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="text-sm text-white/80">{alert.message}</div>
                      <div className="text-xs text-white/40 mt-1">{alert.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <Card className="glass-strong border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="ghost" className="flex flex-col items-center gap-2 p-6 hover:bg-white/10">
              <Shield className="h-6 w-6 text-emerald-400" />
              <span className="text-sm text-white/80">Security Scan</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center gap-2 p-6 hover:bg-white/10">
              <Server className="h-6 w-6 text-blue-400" />
              <span className="text-sm text-white/80">Deploy Update</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center gap-2 p-6 hover:bg-white/10">
              <Activity className="h-6 w-6 text-amber-400" />
              <span className="text-sm text-white/80">View Logs</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center gap-2 p-6 hover:bg-white/10">
              <Network className="h-6 w-6 text-emerald-400" />
              <span className="text-sm text-white/80">Network Monitor</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
