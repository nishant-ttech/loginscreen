import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Network, TrendingUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CryptoPage() {
  const cryptos = [
    { id: 1, name: "Bitcoin", symbol: "BTC", price: "$61,234.50", change: "+2.3%", volume: "$28.5B", status: "active" },
    { id: 2, name: "Ethereum", symbol: "ETH", price: "$3,421.80", change: "+1.8%", volume: "$15.2B", status: "active" },
    { id: 3, name: "Ripple", symbol: "XRP", price: "$0.5234", change: "-0.5%", volume: "$2.1B", status: "active" },
    { id: 4, name: "Litecoin", symbol: "LTC", price: "$87.45", change: "+3.2%", volume: "$580M", status: "active" },
    { id: 5, name: "Bitcoin Cash", symbol: "BCH", price: "$412.30", change: "-1.2%", volume: "$420M", status: "active" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Crypto Management</h1>
          <p className="text-white/60 text-sm mt-1">Manage cryptocurrency transactions and rates</p>
        </div>
        <Button className="glass hover:bg-white/10 transition-colors">
          <Network className="h-4 w-4 mr-2" />
          New Crypto Tx
        </Button>
      </div>

      <Card className="glass-strong border-white/10">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                type="text"
                placeholder="Search cryptocurrencies..."
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
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Cryptocurrency</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Symbol</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Price</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">24h Change</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Volume</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {cryptos.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                          <Coins className="h-4 w-4 text-emerald-400" />
                        </div>
                        <span className="text-white/80 text-sm font-medium">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-white/60 text-sm font-mono">{c.symbol}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-white font-mono text-sm">{c.price}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-sm font-medium ${c.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                        {c.change}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-white/60 text-sm">{c.volume}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                        {c.status}
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
