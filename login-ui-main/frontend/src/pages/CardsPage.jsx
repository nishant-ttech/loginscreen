import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  Plus,
  Search,
  Snowflake,
  CheckCircle,
  Clock,
  XCircle,
  Wifi,
} from "lucide-react";

export const DUMMY_CARDS = [
  {
    id: "card-001",
    type: "virtual",
    brand: "VISA",
    last4: "4821",
    holder: "Mansab Mehta",
    expiry: "12/29",
    status: "active",
    balance: 1250.5,
    color: "from-emerald-600 to-emerald-900",
    issued: "2026-01-14",
  },
  {
    id: "card-002",
    type: "physical",
    brand: "Mastercard",
    last4: "9043",
    holder: "Mansab Mehta",
    expiry: "08/28",
    status: "active",
    balance: 540.0,
    color: "from-slate-700 to-slate-900",
    issued: "2025-12-02",
  },
  {
    id: "card-003",
    type: "virtual",
    brand: "VISA",
    last4: "1129",
    holder: "Mansab Mehta",
    expiry: "06/27",
    status: "frozen",
    balance: 0,
    color: "from-blue-700 to-indigo-900",
    issued: "2025-09-21",
  },
  {
    id: "card-004",
    type: "physical",
    brand: "Mastercard",
    last4: "—",
    holder: "Mansab Mehta",
    expiry: "—",
    status: "processing",
    balance: 0,
    color: "from-amber-700 to-orange-900",
    issued: "2026-05-01",
  },
];

function CardVisual({ card, compact = false }) {
  return (
    <div
      className={`relative rounded-2xl p-5 overflow-hidden bg-gradient-to-br ${card.color} text-white aspect-[1.586/1] ${
        compact ? "" : "min-h-[200px]"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_60%)]" />
      <div className="relative h-full flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] opacity-70">
              {card.type === "virtual" ? "Virtual Card" : "Physical Card"}
            </div>
            <div className="font-display text-lg mt-1">NetPay</div>
          </div>
          <Wifi className="h-4 w-4 rotate-90 opacity-80" />
        </div>
        <div>
          <div className="text-base sm:text-lg font-mono tracking-[0.18em] mb-3">
            •••• •••• •••• {card.last4}
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[9px] uppercase opacity-60">Card holder</div>
              <div className="text-xs font-medium">{card.holder}</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] uppercase opacity-60">Expires</div>
              <div className="text-xs font-medium font-mono">{card.expiry}</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] uppercase opacity-60">Brand</div>
              <div className="text-xs font-bold tracking-wider">{card.brand}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CardVisual };

export default function CardsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return DUMMY_CARDS.filter((c) => {
      if (filter !== "all" && c.status !== filter) return false;
      if (search && !c.last4.includes(search)) return false;
      return true;
    });
  }, [filter, search]);

  const counts = {
    all: DUMMY_CARDS.length,
    active: DUMMY_CARDS.filter((c) => c.status === "active").length,
    frozen: DUMMY_CARDS.filter((c) => c.status === "frozen").length,
    processing: DUMMY_CARDS.filter((c) => c.status === "processing").length,
  };

  const statusBadge = (s) => {
    const map = {
      active: { label: "Active", color: "bg-emerald-500/20 text-emerald-400", Icon: CheckCircle },
      frozen: { label: "Frozen", color: "bg-blue-500/20 text-blue-400", Icon: Snowflake },
      processing: { label: "Processing", color: "bg-amber-500/20 text-amber-400", Icon: Clock },
      pending: { label: "Pending", color: "bg-amber-500/20 text-amber-400", Icon: Clock },
      cancelled: { label: "Cancelled", color: "bg-red-500/20 text-red-400", Icon: XCircle },
    };
    return map[s] || map.pending;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">My Cards</h1>
          <p className="text-white/60 text-sm mt-1">Manage your virtual and physical cards</p>
        </div>
        <Link to="/cards/apply">
          <Button className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
            <Plus className="h-4 w-4 mr-2" /> Apply for new card
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: "all", label: "All", count: counts.all },
          { id: "active", label: "Active", count: counts.active },
          { id: "frozen", label: "Frozen", count: counts.frozen },
          { id: "processing", label: "Processing", count: counts.processing },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`p-4 rounded-xl border transition-all text-left ${
              filter === f.id
                ? "bg-emerald-500/10 border-emerald-500/40"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
          >
            <div className="text-2xl font-bold text-white">{f.count}</div>
            <div
              className={`text-xs uppercase tracking-wider ${
                filter === f.id ? "text-emerald-400" : "text-white/50"
              }`}
            >
              {f.label}
            </div>
          </button>
        ))}
      </div>

      <Card className="glass-strong border-white/10">
        <CardContent className="p-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by last 4 digits..."
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card className="glass-strong border-white/10">
          <CardContent className="p-12 text-center">
            <CreditCard className="h-12 w-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/60">No cards found matching your filters</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((card) => {
            const badge = statusBadge(card.status);
            return (
              <div key={card.id} className="space-y-3">
                <CardVisual card={card} />
                <Card className="glass-strong border-white/10">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60 capitalize">
                        {card.type} · ••{card.last4}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${badge.color}`}
                      >
                        <badge.Icon className="h-3 w-3" />
                        {badge.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div>
                        <div className="text-xs text-white/40">Balance</div>
                        <div className="text-lg font-bold text-emerald-400">
                          {card.balance.toFixed(2)} <span className="text-sm">USDT</span>
                        </div>
                      </div>
                      <Link to={`/cards/${card.id}`}>
                        <Button size="sm" className="glass">
                          Manage →
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
