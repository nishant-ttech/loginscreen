import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, TrendingUp, Percent, BarChart2 } from "lucide-react";

export default function CommissionPage() {
  const commissions = [
    { id: 1, merchant: "TechGear Pro", transaction: "$1,250.00", rate: "2.5%", amount: "$31.25", date: "2024-05-06" },
    { id: 2, merchant: "Fashion Hub", transaction: "$890.00", rate: "2.5%", amount: "$22.25", date: "2024-05-06" },
    { id: 3, merchant: "QuickMart", transaction: "$2,450.00", rate: "2.5%", amount: "$61.25", date: "2024-05-05" },
    { id: 4, merchant: "AutoParts Plus", transaction: "$1,800.00", rate: "2.5%", amount: "$45.00", date: "2024-05-05" },
    { id: 5, merchant: "Beauty Store", transaction: "$567.00", rate: "2.5%", amount: "$14.18", date: "2024-05-04" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Commission Management</h1>
          <p className="text-white/60 text-sm mt-1">View and manage commission settings and history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="glass-strong border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Coins className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">$174.08</div>
                <div className="text-sm text-white/40">Today's Commission</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-strong border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Percent className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">2.5%</div>
                <div className="text-sm text-white/40">Default Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-strong border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">$4,230</div>
                <div className="text-sm text-white/40">This Month</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-strong border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <BarChart2 className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">$48,920</div>
                <div className="text-sm text-white/40">Year to Date</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-strong border-white/10">
        <CardContent className="p-5">
          <h2 className="text-white text-sm font-medium mb-4">Recent Commission History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Merchant</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Transaction</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Rate</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Commission</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2">
                      <span className="text-white/80 text-sm">{c.merchant}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-white/60 text-sm">{c.transaction}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-emerald-400 text-sm">{c.rate}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-emerald-400 text-sm font-medium">{c.amount}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-white/40 text-sm">{c.date}</span>
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
