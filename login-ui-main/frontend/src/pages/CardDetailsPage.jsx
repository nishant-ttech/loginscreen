import React, { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  RefreshCw,
  Snowflake,
  Flame,
  ArrowDownRight,
  ArrowUpRight,
  Trash2,
  KeyRound,
  Copy,
  CheckCircle,
  CreditCard,
  Shield,
} from "lucide-react";
import cardholdersService from "@/services/cardholdersService";

const CARD_TX = [
  { id: "ctx-1", date: "2026-05-05 18:42", merchant: "Amazon Web Services", amount: -42.18, status: "completed", ref: "AUTH-901223" },
  { id: "ctx-2", date: "2026-05-04 12:30", merchant: "Spotify", amount: -9.99, status: "completed", ref: "AUTH-887234" },
  { id: "ctx-3", date: "2026-05-03 09:15", merchant: "NetPay top-up", amount: 250.0, status: "completed", ref: "TOP-220019" },
  { id: "ctx-4", date: "2026-05-01 22:08", merchant: "Uber", amount: -23.5, status: "pending", ref: "AUTH-871002" },
  { id: "ctx-5", date: "2026-04-29 17:55", merchant: "Apple", amount: -1.99, status: "declined", ref: "AUTH-861455" },
];

const CardVisual = ({ card, compact = false }) => {
  const brandColors = {
    "VISA": "from-emerald-600 to-emerald-900",
    "MASTERCARD": "from-slate-700 to-slate-900",
    "AMEX": "from-blue-700 to-indigo-900",
    "DISCOVER": "from-amber-700 to-orange-900",
  };
  return (
    <div
      className={`relative rounded-2xl p-5 overflow-hidden bg-gradient-to-br ${brandColors[card.brand] || brandColors["VISA"]} text-white aspect-[1.586/1] ${compact ? "" : "min-h-[200px]"}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_60%)]" />
      <div className="relative h-full flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] opacity-70">
              {card.type?.toLowerCase() === "virtual" ? "Virtual Card" : "Physical Card"}
            </div>
            <div className="font-display text-lg mt-1">NetPay</div>
          </div>
          <CreditCard className="h-4 w-4 rotate-90 opacity-80" />
        </div>
        <div>
          <div className="text-base sm:text-lg font-mono tracking-[0.18em] mb-3">
            •••• •••• •••• {card.last4 || "0000"}
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[9px] uppercase opacity-60">Card holder</div>
              <div className="text-xs font-medium">{card.holder || "N/A"}</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] uppercase opacity-60">Expires</div>
              <div className="text-xs font-medium font-mono">{card.expiry || "—"}</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] uppercase opacity-60">Brand</div>
              <div className="text-xs font-bold tracking-wider">{card.brand || "—"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CardDetailsPage() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [revealed, setRevealed] = useState(false);
  const [revealCountdown, setRevealCountdown] = useState(30);
  const [topupAmount, setTopupAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [status, setStatus] = useState("active");
  const [copied, setCopied] = useState(null);
  const [tab, setTab] = useState("transactions");

  useEffect(() => {
    const fetchCard = async () => {
      setLoading(true);
      try {
        // Try to fetch from API first
        const data = await cardholdersService.getCardholder(id);
        setCard(data);
        setStatus(data.status || "active");
      } catch (err) {
        // If API fails, try to get from cardholders list or use mock fallback
        try {
          const list = await cardholdersService.getCardholders();
          const cardholders = list.data || list || [];
          const found = cardholders.find((c) => c.id === id || c.holderId === id);
          if (found) {
            setCard({
              id: found.id,
              last4: found.cardLast4 || Math.floor(1000 + Math.random() * 9000).toString(),
              brand: found.cardType || "VISA",
              holder: found.name || "Unknown",
              expiry: found.expiry || "12/29",
              type: found.holderType?.toLowerCase() === "virtual" ? "virtual" : "physical",
              status: found.status || "active",
              balance: found.balance || 0,
            });
            setStatus(found.status || "active");
          } else {
            setError("Card not found");
          }
        } catch (e) {
          setError("Failed to load card data");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCard();
    }
  }, [id]);

  useEffect(() => {
    if (!revealed) return;
    if (revealCountdown <= 0) {
      setRevealed(false);
      setRevealCountdown(30);
      return;
    }
    const t = setTimeout(() => setRevealCountdown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [revealed, revealCountdown]);

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Link to="/cards">
            <Button variant="ghost" size="sm" className="text-white/60">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to cards
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="h-8 w-8 text-white/40 animate-spin" />
            <span className="text-white/40">Loading card details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !card) return <Navigate to="/cards" replace />;

  const fullPan = `•••• •••• •••• ${card.last4}`;
  const cvv = "738";
  const expiry = card.expiry;

  const topupNumeric = parseFloat(topupAmount) || 0;
  const topupFee = topupNumeric * 0.015;

  const copy = async (key, val) => {
    try {
      await navigator.clipboard.writeText(val);
      setCopied(key);
      setTimeout(() => setCopied(null), 1200);
    } catch {}
  };

  const onFreeze = () => setStatus(status === "frozen" ? "active" : "frozen");
  const onTerminate = () => {
    if (window.confirm("Terminate this card? This action cannot be undone.")) {
      setStatus("cancelled");
    }
  };

  const isActive = status === "active";
  const isFrozen = status === "frozen";
  const isCancelled = status === "cancelled";

  const txStatusColor = (s) =>
    s === "completed"
      ? "bg-emerald-500/20 text-emerald-400"
      : s === "pending"
      ? "bg-amber-500/20 text-amber-400"
      : "bg-red-500/20 text-red-400";

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link to="/cards">
          <Button variant="ghost" size="sm" className="text-white/60">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to cards
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">
            {card.type === "virtual" ? "Virtual" : "Physical"} Card · ••{card.last4}
          </h1>
          <p className="text-white/60 text-sm mt-1 capitalize">Status: {status}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <CardVisual card={{ ...card, status }} />

          <Card className="glass-strong border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-base">Card information</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Card type</span>
                <span className="text-white capitalize">{card.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Brand</span>
                <span className="text-white">{card.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Holder</span>
                <span className="text-white">{card.holder}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Issued</span>
                <span className="text-white">{card.created || card.issued || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Expires</span>
                <span className="text-white font-mono">{card.expiry}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-strong border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-400" />
                Reveal card details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-3">
              {!revealed ? (
                <Button
                  onClick={() => {
                    setRevealed(true);
                    setRevealCountdown(30);
                  }}
                  disabled={!isActive}
                  className="w-full glass disabled:opacity-50"
                >
                  <Eye className="h-4 w-4 mr-2" /> Reveal sensitive details
                </Button>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <span>Auto-hides in {revealCountdown}s</span>
                    <button
                      onClick={() => setRevealed(false)}
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      <EyeOff className="h-3 w-3" /> Hide
                    </button>
                  </div>
                  <div className="space-y-2">
                    {[ 
                      { k: "pan", label: "Card number", val: fullPan },
                      { k: "exp", label: "Expiry", val: expiry },
                      { k: "cvv", label: "CVV", val: cvv },
                    ].map((row) => (
                      <div
                        key={row.k}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div>
                          <div className="text-xs text-white/40">{row.label}</div>
                          <div className="text-white font-mono text-sm">{row.val}</div>
                        </div>
                        <button
                          onClick={() => copy(row.k, row.val)}
                          className="p-2 rounded-lg hover:bg-white/10 text-white/60"
                        >
                          {copied === row.k ? (
                            <CheckCircle className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-strong border-white/10">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Balance</div>
                <div className="text-3xl font-bold text-emerald-400">
                  {card.balance.toFixed(2)} <span className="text-lg">USDT</span>
                </div>
              </div>
              <Button variant="ghost" className="glass">
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button
              onClick={onFreeze}
              disabled={isCancelled}
              className={`flex-col h-auto py-4 ${
                isFrozen
                  ? "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                  : "glass"
              }`}
            >
              {isFrozen ? <Flame className="h-5 w-5 mb-1" /> : <Snowflake className="h-5 w-5 mb-1" />}
              <span className="text-xs">{isFrozen ? "Unfreeze" : "Freeze"}</span>
            </Button>
            <Button
              disabled={!isActive}
              onClick={() => document.getElementById("topup-section")?.scrollIntoView({ behavior: "smooth" })}
              className="flex-col h-auto py-4 glass disabled:opacity-50"
            >
              <ArrowDownRight className="h-5 w-5 mb-1 text-emerald-400" />
              <span className="text-xs">Top up</span>
            </Button>
            <Button
              disabled={!isActive}
              onClick={() => document.getElementById("withdraw-section")?.scrollIntoView({ behavior: "smooth" })}
              className="flex-col h-auto py-4 glass disabled:opacity-50"
            >
              <ArrowUpRight className="h-5 w-5 mb-1 text-amber-400" />
              <span className="text-xs">Withdraw</span>
            </Button>
            <Button
              onClick={onTerminate}
              disabled={isCancelled}
              className="flex-col h-auto py-4 glass disabled:opacity-50 hover:bg-red-500/10"
            >
              <Trash2 className="h-5 w-5 mb-1 text-red-400" />
              <span className="text-xs text-red-400">Terminate</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card id="topup-section" className="glass-strong border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-base">Top up card</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-3">
                <div>
                  <Label className="text-white/70 text-sm mb-2 block">Amount (USDT)</Label>
                  <Input
                    type="number"
                    value={topupAmount}
                    onChange={(e) => setTopupAmount(e.target.value)}
                    placeholder="30 - 10,000"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-white/50">
                    <span>Amount</span>
                    <span>{topupNumeric.toFixed(2)} USDT</span>
                  </div>
                  <div className="flex justify-between text-white/50">
                    <span>Fee (1.5%)</span>
                    <span>{topupFee.toFixed(2)} USDT</span>
                  </div>
                  <div className="flex justify-between text-white pt-2 border-t border-white/10 font-medium">
                    <span>Total</span>
                    <span>{(topupNumeric + topupFee).toFixed(2)} USDT</span>
                  </div>
                </div>
                <Button
                  disabled={!isActive || topupNumeric < 30}
                  className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 disabled:opacity-50"
                >
                  Top up card
                </Button>
              </CardContent>
            </Card>

            <Card id="withdraw-section" className="glass-strong border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-base">Withdraw from card</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-3">
                <div>
                  <Label className="text-white/70 text-sm mb-2 block">Amount (USDT)</Label>
                  <Input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="1 - 10,000"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <p className="text-xs text-white/50">
                  Funds are returned to your wallet immediately after processing.
                </p>
                <Button
                  disabled={!isActive || !withdrawAmount}
                  className="w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 disabled:opacity-50"
                >
                  Withdraw from card
                </Button>
              </CardContent>
            </Card>
          </div>

          {card.type === "physical" && (
            <Card className="glass-strong border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-emerald-400" /> PIN Management
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70 text-sm mb-2 block">New PIN (4 digits)</Label>
                  <Input
                    type="password"
                    maxLength={4}
                    placeholder="••••"
                    className="bg-white/5 border-white/10 text-white tracking-widest font-mono"
                  />
                </div>
                <div>
                  <Label className="text-white/70 text-sm mb-2 block">Confirm PIN</Label>
                  <Input
                    type="password"
                    maxLength={4}
                    placeholder="••••"
                    className="bg-white/5 border-white/10 text-white tracking-widest font-mono"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Button className="w-full glass">Update PIN</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="glass-strong border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white text-base">Recent activity</CardTitle>
              <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
                {["transactions", "authorizations"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-3 py-1 text-xs rounded-md capitalize ${
                      tab === t ? "bg-white/10 text-white" : "text-white/50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Date</th>
                      <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Merchant</th>
                      <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Amount</th>
                      <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Reference</th>
                      <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CARD_TX.map((tx) => (
                      <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-2 text-white/60 text-sm">{tx.date}</td>
                        <td className="py-3 px-2 text-white/80 text-sm">{tx.merchant}</td>
                        <td className="py-3 px-2">
                          <span
                            className={`text-sm font-medium ${
                              tx.amount > 0 ? "text-emerald-400" : "text-amber-400"
                            }`}
                          >
                            {tx.amount > 0 ? "+" : ""}
                            {tx.amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-white/50 text-xs font-mono">{tx.ref}</td>
                        <td className="py-3 px-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${txStatusColor(tx.status)}`}>
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
      </div>
    </div>
  );
}
