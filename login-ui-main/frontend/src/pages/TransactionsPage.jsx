import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Search, Coins, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TransactionsPage() {
  const transactions = [
    { id: 1, user: "John Smith", type: "deposit", description: "Bank Transfer - ACH", amount: "+$1,250.00", date: "2024-05-06 09:23", status: "completed" },
    { id: 2, user: "Sarah Johnson", type: "withdrawal", description: "Crypto - BTC", amount: "-$2,000.00", date: "2024-05-06 08:15", status: "completed" },
    { id: 3, user: "Mike Chen", type: "commission", description: "Merchant fee - TechGear", amount: "+$127.50", date: "2024-05-05 22:30", status: "completed" },
    { id: 4, user: "Emma Wilson", type: "deposit", description: "Credit Card Payment", amount: "+$850.00", date: "2024-05-05 18:45", status: "pending" },
    { id: 5, user: "David Brown", type: "withdrawal", description: "Wire Transfer", amount: "-$500.00", date: "2024-05-05 14:20", status: "failed" },
    { id: 6, user: "Lisa Anderson", type: "deposit", description: "Crypto - ETH", amount: "+$3,000.00", date: "2024-05-04 11:10", status: "completed" },
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case "deposit": return "bg-emerald-500/20 text-emerald-400";
      case "withdrawal": return "bg-amber-500/20 text-amber-400";
      case "commission": return "bg-blue-500/20 text-blue-400";
      default: return "bg-white/10 text-white/60";
    }
  };

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
          <h1 className="font-display text-2xl font-bold text-white">Transactions</h1>
          <p className="text-white/60 text-sm mt-1">View all financial transactions</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-strong border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">$12,450</div>
                <div className="text-sm text-white/40">Total Deposits</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-strong border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">$8,230</div>
                <div className="text-sm text-white/40">Total Withdrawals</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-strong border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Coins className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">$1,234</div>
                <div className="text-sm text-white/40">Commissions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="glass-strong border-white/10">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                type="text"
                placeholder="Search transactions..."
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
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Type</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Description</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Amount</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Date</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2">
                      <span className="text-white/80 text-sm">{tx.user}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(tx.type)} capitalize`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-white/60 text-sm">{tx.description}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-sm font-medium ${tx.amount.startsWith('+') ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {tx.amount}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-white/40 text-sm">{tx.date}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(tx.status)}`}>
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
