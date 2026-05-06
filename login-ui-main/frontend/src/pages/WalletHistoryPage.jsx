import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  Search,
  Download,
  ExternalLink,
} from "lucide-react";

const ALL_TRANSACTIONS = [
  { id: "tx-2001", date: "2026-05-06 09:23", type: "deposit", amount: 1250, fee: 0, status: "completed", hash: "0x9a7c…e21f", chain: "TRC20" },
  { id: "tx-2000", date: "2026-05-05 18:11", type: "withdrawal", amount: 500, fee: 1, status: "pending", hash: "—", chain: "TRC20" },
  { id: "tx-1999", date: "2026-05-05 14:48", type: "card", amount: 120, fee: 1.8, status: "completed", hash: "card•1234", chain: "Card" },
  { id: "tx-1998", date: "2026-05-04 11:02", type: "deposit", amount: 3000, fee: 0, status: "completed", hash: "0x37bc…11d9", chain: "ERC20" },
  { id: "tx-1997", date: "2026-05-03 22:30", type: "commission", amount: 12.5, fee: 0, status: "completed", hash: "—", chain: "—" },
  { id: "tx-1996", date: "2026-05-02 19:18", type: "withdrawal", amount: 200, fee: 5, status: "completed", hash: "0x57ee…ab21", chain: "BEP20" },
  { id: "tx-1995", date: "2026-05-01 09:00", type: "deposit", amount: 500, fee: 0, status: "rejected", hash: "0x12aa…ff03", chain: "POLYGON" },
  { id: "tx-1994", date: "2026-04-30 14:30", type: "card", amount: 89.99, fee: 1.35, status: "completed", hash: "card•1234", chain: "Card" },
  { id: "tx-1993", date: "2026-04-29 17:50", type: "deposit", amount: 750, fee: 0, status: "completed", hash: "0x66dd…9a01", chain: "TRC20" },
  { id: "tx-1992", date: "2026-04-28 12:14", type: "withdrawal", amount: 1500, fee: 5, status: "failed", hash: "—", chain: "ERC20" },
  { id: "tx-1991", date: "2026-04-27 08:45", type: "deposit", amount: 2000, fee: 0, status: "completed", hash: "0x4abc…12fe", chain: "ARBITRUM" },
];

export default function WalletHistoryPage() {
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return ALL_TRANSACTIONS.filter((tx) => {
      if (type !== "all" && tx.type !== type) return false;
      if (status !== "all" && tx.status !== status) return false;
      if (
        search &&
        ![tx.id, tx.hash, tx.chain].some((f) => f.toLowerCase().includes(search.toLowerCase()))
      )
        return false;
      return true;
    });
  }, [type, status, search]);

  const typeIcon = (t) =>
    t === "deposit" ? (
      <ArrowDownRight className="h-4 w-4 text-emerald-400" />
    ) : t === "withdrawal" ? (
      <ArrowUpRight className="h-4 w-4 text-amber-400" />
    ) : (
      <CreditCard className="h-4 w-4 text-blue-400" />
    );

  const statusColor = (s) =>
    s === "completed"
      ? "bg-emerald-500/20 text-emerald-400"
      : s === "pending"
      ? "bg-amber-500/20 text-amber-400"
      : s === "rejected" || s === "failed"
      ? "bg-red-500/20 text-red-400"
      : "bg-white/10 text-white/60";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/wallet">
          <Button variant="ghost" size="sm" className="text-white/60">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-white">Wallet History</h1>
          <p className="text-white/60 text-sm mt-1">All your wallet transactions in one place</p>
        </div>
        <Button className="glass">
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      <Card className="glass-strong border-white/10">
        <CardContent className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by tx ID, hash or chain..."
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
            >
              <option value="all">All types</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="card">Card</option>
              <option value="commission">Commission</option>
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white"
            >
              <option value="all">All statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Date</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Type</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Amount</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Fee</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Chain</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Hash</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-white/40 text-sm">
                      No transactions match these filters
                    </td>
                  </tr>
                ) : (
                  filtered.map((tx) => (
                    <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-2 text-white/60 text-sm">{tx.date}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          {typeIcon(tx.type)}
                          <span className="text-white/80 text-sm capitalize">{tx.type}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`text-sm font-medium ${
                            tx.type === "withdrawal" ? "text-amber-400" : "text-emerald-400"
                          }`}
                        >
                          {tx.type === "withdrawal" ? "-" : "+"}
                          {tx.amount} USDT
                        </span>
                      </td>
                      <td className="py-3 px-2 text-white/40 text-sm">{tx.fee} USDT</td>
                      <td className="py-3 px-2 text-white/70 text-sm">{tx.chain}</td>
                      <td className="py-3 px-2">
                        <span className="text-white/60 text-xs font-mono flex items-center gap-1">
                          {tx.hash}
                          {tx.hash.startsWith("0x") && (
                            <ExternalLink className="h-3 w-3 text-white/30" />
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${statusColor(tx.status)}`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <p className="text-xs text-white/40">
              Showing {filtered.length} of {ALL_TRANSACTIONS.length} transactions
            </p>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" className="h-8 text-white/60" disabled>
                Previous
              </Button>
              <Button size="sm" variant="ghost" className="h-8 text-emerald-400">
                1
              </Button>
              <Button size="sm" variant="ghost" className="h-8 text-white/60">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
