import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  History,
  Key,
  Trash2,
  TrendingUp,
  Lock,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WalletPage() {
  const walletData = {
    balance: 12500.5,
    locked: 250.0,
    credit: 5000.0,
    currency: "USDT",
  };

  const total = walletData.balance + walletData.locked + walletData.credit;

  const recentTransactions = [
    { id: 1, type: "deposit", amount: 1000, status: "completed", date: "2h ago", chain: "TRC20" },
    { id: 2, type: "withdraw", amount: 500, status: "completed", date: "1d ago", chain: "BEP20" },
    { id: 3, type: "deposit", amount: 2500, status: "pending", date: "2d ago", chain: "ERC20" },
    { id: 4, type: "card", amount: 120, status: "completed", date: "3d ago", chain: "Card #1234" },
    { id: 5, type: "deposit", amount: 800, status: "completed", date: "5d ago", chain: "POLYGON" },
  ];

  const importedWallets = [
    {
      id: 1,
      label: "Primary Trading",
      evm: "0x4A2c...8F19",
      tron: "TX9Wb...3Xm4",
      monitored: true,
    },
    {
      id: 2,
      label: "Cold Storage",
      evm: "0xB781...c2A0",
      tron: "TKpZv...9LdQ",
      monitored: false,
    },
  ];

  const pendingWithdrawals = [
    { id: "w-991", amount: 250, chain: "TRC20", status: "Awaiting approval" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Wallet Overview</h1>
          <p className="text-white/60 text-sm mt-1">Manage deposits, withdrawals and imported wallets</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/wallet/deposit">
            <Button className="glass hover:bg-white/10 transition-colors">
              <ArrowDownRight className="h-4 w-4 mr-2" /> Deposit
            </Button>
          </Link>
          <Link to="/wallet/withdraw">
            <Button className="glass hover:bg-white/10 transition-colors">
              <ArrowUpRight className="h-4 w-4 mr-2" /> Withdraw
            </Button>
          </Link>
          <Link to="/wallet/import">
            <Button className="glass hover:bg-white/10 transition-colors">
              <Key className="h-4 w-4 mr-2" /> Import
            </Button>
          </Link>
        </div>
      </div>

      <Card className="glass-strong border-white/10 overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 bg-gradient-to-br from-emerald-500/10 via-transparent to-emerald-500/5">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <div className="text-sm text-white/50 mb-1">Total Wallet Value</div>
                <div className="text-4xl font-bold text-white">
                  {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}{" "}
                  <span className="text-emerald-400 text-2xl font-medium">{walletData.currency}</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400">+2.4% past 24h</span>
                </div>
              </div>
              <Button variant="ghost" className="glass text-white">
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh balance
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider mb-2">
                  <Wallet className="h-3.5 w-3.5" /> Available
                </div>
                <div className="text-2xl font-bold text-emerald-400">
                  {walletData.balance.toLocaleString()}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider mb-2">
                  <Lock className="h-3.5 w-3.5" /> Locked
                </div>
                <div className="text-2xl font-bold text-amber-400">
                  {walletData.locked.toLocaleString()}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider mb-2">
                  <TrendingUp className="h-3.5 w-3.5" /> Credit Line
                </div>
                <div className="text-2xl font-bold text-blue-400">
                  {walletData.credit.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-strong border-white/10 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white text-lg">Recent Activity</CardTitle>
            <Link to="/wallet/history">
              <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300">
                View all
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="space-y-2">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/[0.07] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        tx.type === "deposit"
                          ? "bg-emerald-500/20"
                          : tx.type === "withdraw"
                          ? "bg-amber-500/20"
                          : "bg-blue-500/20"
                      }`}
                    >
                      {tx.type === "deposit" ? (
                        <ArrowDownRight className="h-5 w-5 text-emerald-400" />
                      ) : tx.type === "withdraw" ? (
                        <ArrowUpRight className="h-5 w-5 text-amber-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-blue-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium capitalize">{tx.type}</div>
                      <div className="text-white/40 text-xs">
                        {tx.chain} · {tx.date}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-base font-bold ${
                        tx.type === "withdraw" ? "text-amber-400" : "text-emerald-400"
                      }`}
                    >
                      {tx.type === "withdraw" ? "-" : "+"}
                      {tx.amount.toLocaleString()} USDT
                    </div>
                    <div
                      className={`text-xs capitalize ${
                        tx.status === "completed"
                          ? "text-emerald-400"
                          : tx.status === "pending"
                          ? "text-amber-400"
                          : "text-red-400"
                      }`}
                    >
                      {tx.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass-strong border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Pending Withdrawals</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              {pendingWithdrawals.length === 0 ? (
                <p className="text-sm text-white/40">No pending withdrawals</p>
              ) : (
                pendingWithdrawals.map((p) => (
                  <div key={p.id} className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-amber-300 font-medium">{p.amount} USDT</span>
                      <span className="text-xs text-amber-400">{p.chain}</span>
                    </div>
                    <p className="text-xs text-white/50">{p.status}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="glass-strong border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white text-lg">Imported Wallets</CardTitle>
              <Link to="/wallet/import">
                <Button variant="ghost" size="sm" className="text-emerald-400 h-7 px-2">
                  + Add
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-3">
              {importedWallets.map((w) => (
                <div key={w.id} className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium text-sm">{w.label}</span>
                    <button className="text-white/40 hover:text-red-400">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-white/40">EVM:</span>
                      <span className="text-white/70 font-mono">{w.evm}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">TRX:</span>
                      <span className="text-white/70 font-mono">{w.tron}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${
                        w.monitored ? "bg-emerald-400 animate-pulse" : "bg-white/20"
                      }`}
                    />
                    <span className={`text-xs ${w.monitored ? "text-emerald-400" : "text-white/40"}`}>
                      {w.monitored ? "Monitoring active" : "Monitoring off"}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
