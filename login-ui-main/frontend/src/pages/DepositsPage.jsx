import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Search, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DepositsPage() {
  const deposits = [
    { id: 1, user: "John Smith", method: "Bank Transfer", amount: "$1,250.00", fee: "$12.50", date: "2024-05-06", status: "completed" },
    { id: 2, user: "Sarah Johnson", method: "Crypto", amount: "$3,000.00", fee: "$0.00", date: "2024-05-05", status: "completed" },
    { id: 3, user: "Mike Chen", method: "Credit Card", amount: "$500.00", fee: "$15.00", date: "2024-05-04", status: "pending" },
    { id: 4, user: "Emma Wilson", method: "Bank Transfer", amount: "$2,750.00", fee: "$27.50", date: "2024-05-03", status: "completed" },
    { id: 5, user: "David Brown", method: "Crypto", amount: "$800.00", fee: "$0.00", date: "2024-05-02", status: "failed" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-emerald-500/20 text-emerald-400";
      case "pending": return "bg-amber-500/20 text-amber-400";
      case "failed": return "bg-red-500/20 text-red-400";
      default: return "bg-white/10 text-white/60";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Deposits</h1>
          <p className="text-white/60 text-sm mt-1">View and manage deposit transactions</p>
        </div>
        <Button className="glass hover:bg-white/10 transition-colors">
          <ArrowDownRight className="h-4 w-4 mr-2" />
          New Deposit
        </Button>
      </div>

      <Card className="glass-strong border-white/10">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                type="text"
                placeholder="Search deposits..."
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <Button className="glass hover:bg-white/10 transition-colors">
              Filter
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">User</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Method</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Amount</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Fee</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Date</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {deposits.map((d) => (
                  <tr key={d.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2">
                      <span className="text-white/80 text-sm">{d.user}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-white/60 text-sm">{d.method}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-emerald-400 text-sm font-medium">{d.amount}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-white/40 text-sm">{d.fee}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-white/40 text-sm">{d.date}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(d.status)}`}>
                        {d.status}
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
