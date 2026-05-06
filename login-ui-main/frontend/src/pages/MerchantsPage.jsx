import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Search, TrendingUp, TrendingDown, DollarSign, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MerchantsPage() {
  const merchants = [
    { id: 1, name: "TechGear Pro", category: "Electronics", revenue: "$45,230", status: "verified", growth: "+12.5%" },
    { id: 2, name: "Fashion Hub", category: "Apparel", revenue: "$32,890", status: "verified", growth: "+8.2%" },
    { id: 3, name: "QuickMart", category: "Grocery", revenue: "$28,150", status: "pending", growth: "+15.7%" },
    { id: 4, name: "AutoParts Plus", category: "Automotive", revenue: "$41,020", status: "verified", growth: "-2.3%" },
    { id: 5, name: "Beauty Store", category: "Cosmetics", revenue: "$18,750", status: "suspended", growth: "+5.1%" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "verified": return "bg-emerald-500/20 text-emerald-400";
      case "pending": return "bg-amber-500/20 text-amber-400";
      case "suspended": return "bg-red-500/20 text-red-400";
      default: return "bg-white/10 text-white/60";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Merchants</h1>
          <p className="text-white/60 text-sm mt-1">Manage merchant accounts and view performance</p>
        </div>
        <Button className="glass hover:bg-white/10 transition-colors">
          <Store className="h-4 w-4 mr-2" />
          Add Merchant
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-strong border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Store className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">1,284</div>
                <div className="text-sm text-white/40">Total Merchants</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-strong border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">$1.24M</div>
                <div className="text-sm text-white/40">Total Revenue</div>
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
                <div className="text-2xl font-bold text-white">+18.5%</div>
                <div className="text-sm text-white/40">Growth Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card className="glass-strong border-white/10">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                type="text"
                placeholder="Search merchants..."
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
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Merchant</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Category</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Revenue</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Growth</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Status</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {merchants.map((m) => (
                  <tr key={m.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                          <Store className="h-4 w-4 text-emerald-400" />
                        </div>
                        <span className="text-white/80 text-sm font-medium">{m.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-white/60 text-sm">{m.category}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-emerald-400 text-sm font-medium">{m.revenue}</span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1">
                        {m.growth.startsWith('+') ? (
                          <TrendingUp className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-400" />
                        )}
                        <span className={`text-sm ${m.growth.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                          {m.growth}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(m.status)}`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-white/60 hover:text-white">
                          View
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-amber-400 hover:text-amber-300">
                          Edit
                        </Button>
                      </div>
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
