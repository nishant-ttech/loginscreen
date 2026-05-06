import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function WithdrawalsPage() {
  const withdrawals = [
    { id: 1, user: "John Smith", method: "Bank Transfer", amount: "$500.00", fee: "$5.00", date: "2024-05-06", status: "completed" },
    { id: 2, user: "Sarah Johnson", method: "Crypto", amount: "$1,200.00", fee: "$0.00", date: "2024-05-05", status: "pending" },
    { id: 3, user: "Mike Chen", method: "Wire Transfer", amount: "$3,500.00", fee: "$25.00", date: "2024-05-04", status: "completed" },
    { id: 4, user: "Emma Wilson", method: "Crypto", amount: "$750.00", fee: "$0.00", date: "2024-05-03", status: "failed" },
    { id: 5, user: "David Brown", method: "Bank Transfer", amount: "$2,000.00", fee: "$20.00", date: "2024-05-02", status: "completed" },
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
          <h1 className="font-display text-2xl font-bold text-white">Withdrawals</h1>
          <p className="text-white/60 text-sm mt-1">View and manage withdrawal requests</p>
        </div>
        <Button className="glass hover:bg-white/10 transition-colors">
          <ArrowUpRight className="h-4 w-4 mr-2" />
          New Withdrawal
        </Button>
      </div>

      <Card className="glass-strong border-white/10">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                type="text"
                placeholder="Search withdrawals..."
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
                {withdrawals.map((w) => (
                  <tr key={w.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2">
                      <span className="text-white/80 text-sm">{w.user}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-white/60 text-sm">{w.method}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-amber-400 text-sm font-medium">{w.amount}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-white/40 text-sm">{w.fee}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-white/40 text-sm">{w.date}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(w.status)}`}>
                        {w.status}
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
