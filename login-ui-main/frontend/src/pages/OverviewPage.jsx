import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart2,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Calendar,
} from "lucide-react";

export default function OverviewPage() {
  const stats = [
    { label: "Total Users", value: "24,581", change: "+12.5%", icon: Users, trend: "up", color: "emerald" },
    { label: "Total Revenue", value: "$128,450", change: "+8.2%", icon: DollarSign, trend: "up", color: "emerald" },
    { label: "Pending Deposits", value: "$45,230", change: "-3.1%", icon: CreditCard, trend: "down", color: "amber" },
    { label: "Active Merchants", value: "1,284", change: "+5.7%", icon: BarChart2, trend: "up", color: "emerald" },
  ];

  const recentTransactions = [
    { id: 1, user: "John Smith", type: "deposit", amount: "$1,250.00", date: "2 min ago", status: "completed" },
    { id: 2, user: "Sarah Johnson", type: "withdrawal", amount: "$500.00", date: "15 min ago", status: "pending" },
    { id: 3, user: "Mike Chen", type: "deposit", amount: "$3,000.00", date: "1 hour ago", status: "completed" },
    { id: 4, user: "Emma Wilson", type: "commission", amount: "$127.50", date: "2 hours ago", status: "completed" },
    { id: 5, user: "David Brown", type: "withdrawal", amount: "$750.00", date: "3 hours ago", status: "failed" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "text-emerald-400";
      case "pending": return "text-amber-400";
      case "failed": return "text-red-400";
      default: return "text-white/60";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-white/60 text-sm mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass px-4 py-2 rounded-xl flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-400" />
            <span className="text-sm text-white/80">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="glass-strong border-white/10">
            <CardHeader className="flex flex-row items-center justify-between p-5 pb-2">
              <CardTitle className="text-sm font-medium text-white/60">{stat.label}</CardTitle>
              <div className={`h-10 w-10 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center`}>
                <stat.icon className={`h-5 w-5 text-${stat.color}-400`} />
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend === "up" ? (
                  <ArrowUpRight className={`h-4 w-4 text-${stat.color}-400`} />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-amber-400" />
                )}
                <span className={`text-sm ${stat.trend === "up" ? "text-emerald-400" : "text-amber-400"}`}>
                  {stat.change}
                </span>
                <span className="text-sm text-white/40 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 glass-strong border-white/10">
          <CardHeader className="p-5">
            <CardTitle className="text-white text-sm font-medium">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="h-64 flex items-end justify-between gap-2">
              {[65, 85, 45, 75, 90, 55, 80, 70, 95, 60, 85, 75].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-emerald-500/30 to-emerald-500/60 rounded-t-lg transition-all hover:from-emerald-500/50 hover:to-emerald-500/70"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-xs text-white/40">{['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F'][i]}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-sm text-white/60">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="text-sm text-white/60">Commissions</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <Card className="glass-strong border-white/10">
          <CardHeader className="p-5">
            <CardTitle className="text-white text-sm font-medium">Today's Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Deposits</span>
                <span className="text-emerald-400 font-medium">$12,450</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Withdrawals</span>
                <span className="text-amber-400 font-medium">$8,230</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Commissions</span>
                <span className="text-emerald-400 font-medium">$1,234</span>
              </div>
              <div className="border-t border-white/10 my-2" />
              <div className="flex items-center justify-between">
                <span className="text-white/80 font-medium">Net Balance</span>
                <span className="text-white font-bold text-lg">$5,456</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="glass-strong border-white/10">
        <CardHeader className="p-5">
          <CardTitle className="text-white text-sm font-medium">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">User</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Type</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Amount</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Date</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2">
                      <span className="text-white/80 text-sm">{tx.user}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-white/60 text-sm capitalize">{tx.type}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-sm font-medium ${tx.type === 'deposit' || tx.type === 'commission' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {tx.type === 'withdrawal' ? '-' : '+'}{tx.amount}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-white/40 text-sm">{tx.date}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(tx.status)} bg-${tx.status === 'completed' ? 'emerald' : tx.status === 'pending' ? 'amber' : 'red'}-500/20`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}