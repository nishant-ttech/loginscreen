import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle,
  Wallet,
} from "lucide-react";
import { CHAINS } from "./WalletDepositPage";

const AVAILABLE_BALANCE = 12500.5;
const MIN_WITHDRAWAL = 10;

export default function WalletWithdrawPage() {
  const [chainId, setChainId] = useState("trc20");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const chain = CHAINS.find((c) => c.id === chainId);
  const numericAmount = parseFloat(amount) || 0;
  const networkFee = chain?.id === "erc20" ? 5 : chain?.id === "trc20" ? 1 : 0.5;
  const commissionRate = 0.005;
  const commission = numericAmount * commissionRate;
  const total = numericAmount + networkFee + commission;
  const willReceive = numericAmount;

  const recentWithdrawals = [
    {
      id: "w-101",
      date: "2026-05-04 11:21",
      amount: 200,
      chain: "TRC20",
      status: "Completed",
      address: "TKpZv...9LdQ",
    },
    {
      id: "w-100",
      date: "2026-05-02 09:14",
      amount: 800,
      chain: "BEP20",
      status: "Pending",
      address: "0x4A2c...8F19",
    },
    {
      id: "w-099",
      date: "2026-04-28 16:02",
      amount: 350,
      chain: "ERC20",
      status: "Completed",
      address: "0xB781...c2A0",
    },
  ];

  const errors = useMemo(() => {
    const e = {};
    if (numericAmount > 0 && numericAmount < MIN_WITHDRAWAL) {
      e.amount = `Minimum withdrawal is ${MIN_WITHDRAWAL} USDT`;
    }
    if (total > AVAILABLE_BALANCE && numericAmount > 0) {
      e.amount = "Insufficient available balance";
    }
    if (address && chain?.id === "trc20" && !address.startsWith("T")) {
      e.address = "Tron addresses start with T";
    }
    if (address && chain?.id !== "trc20" && !address.startsWith("0x")) {
      e.address = "EVM addresses start with 0x";
    }
    return e;
  }, [numericAmount, total, address, chain]);

  const canSubmit =
    numericAmount >= MIN_WITHDRAWAL &&
    total <= AVAILABLE_BALANCE &&
    address.length > 10 &&
    Object.keys(errors).length === 0;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setConfirming(true);
  };

  const onConfirm = () => {
    setConfirming(false);
    setSubmitted(true);
    setAmount("");
    setAddress("");
  };

  const statusColor = (s) =>
    s === "Completed"
      ? "bg-emerald-500/20 text-emerald-400"
      : s === "Pending"
      ? "bg-amber-500/20 text-amber-400"
      : "bg-red-500/20 text-red-400";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/wallet">
          <Button variant="ghost" size="sm" className="text-white/60">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Withdraw USDT</h1>
          <p className="text-white/60 text-sm mt-1">
            Send USDT to an external wallet · Available {AVAILABLE_BALANCE.toLocaleString()} USDT
          </p>
        </div>
      </div>

      {submitted && (
        <Card className="glass-strong border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="p-5 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5" />
            <div>
              <p className="text-emerald-300 font-medium">Withdrawal submitted</p>
              <p className="text-white/60 text-sm mt-1">
                Awaiting admin approval. You'll be notified once it's processed (usually within 30
                minutes).
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-strong border-white/10 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white text-lg">Withdrawal details</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <Label className="text-white/70 text-sm mb-2 block">Network</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CHAINS.filter((c) => c.enabled).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setChainId(c.id)}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                        chainId === c.id
                          ? `${c.accent} bg-white/10 ${c.border}`
                          : "text-white/60 bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-white/70 text-sm">Amount (USDT)</Label>
                  <button
                    type="button"
                    onClick={() => setAmount((AVAILABLE_BALANCE - networkFee).toFixed(2))}
                    className="text-xs text-emerald-400 hover:text-emerald-300"
                  >
                    Use max
                  </button>
                </div>
                <Input
                  type="number"
                  step="0.01"
                  min={MIN_WITHDRAWAL}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-white/5 border-white/10 text-white text-lg"
                />
                {errors.amount && (
                  <p className="text-xs text-red-400 mt-1">{errors.amount}</p>
                )}
                <input
                  type="range"
                  min={MIN_WITHDRAWAL}
                  max={AVAILABLE_BALANCE}
                  value={numericAmount || MIN_WITHDRAWAL}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full mt-3 accent-emerald-500"
                />
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>Min: {MIN_WITHDRAWAL}</span>
                  <span>Max: {AVAILABLE_BALANCE.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <Label className="text-white/70 text-sm mb-2 block">Destination address</Label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={chain?.id === "trc20" ? "T..." : "0x..."}
                  className="bg-white/5 border-white/10 text-white font-mono text-sm"
                />
                {errors.address && (
                  <p className="text-xs text-red-400 mt-1">{errors.address}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={!canSubmit}
                className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 disabled:opacity-50"
              >
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Continue to confirm
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass-strong border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">You send</span>
                <span className="text-white">{numericAmount.toFixed(2)} USDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Network fee</span>
                <span className="text-white/80">{networkFee.toFixed(2)} USDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Commission (0.5%)</span>
                <span className="text-white/80">{commission.toFixed(2)} USDT</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="text-white/80 font-medium">Total deducted</span>
                <span className="text-amber-400 font-bold">{total.toFixed(2)} USDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80 font-medium">Recipient gets</span>
                <span className="text-emerald-400 font-bold">{willReceive.toFixed(2)} USDT</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-strong border-amber-500/20 bg-amber-500/5">
            <CardContent className="p-4 flex gap-2 items-start">
              <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-white/70 leading-relaxed">
                Always double-check the destination network and address. Withdrawals are
                irreversible once broadcast on-chain.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="glass-strong border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg">Recent withdrawals</CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Date</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Amount</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Chain</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Address</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentWithdrawals.map((w) => (
                  <tr key={w.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-2 text-white/60 text-sm">{w.date}</td>
                    <td className="py-3 px-2 text-amber-400 font-medium text-sm">-{w.amount} USDT</td>
                    <td className="py-3 px-2 text-white/70 text-sm">{w.chain}</td>
                    <td className="py-3 px-2 text-white/60 text-xs font-mono">{w.address}</td>
                    <td className="py-3 px-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColor(w.status)}`}>
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

      {confirming && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setConfirming(false)}
        >
          <div
            className="glass-strong border border-white/20 rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white text-lg font-bold mb-2">Confirm withdrawal</h3>
            <p className="text-white/60 text-sm mb-4">
              You're about to send <span className="text-white font-medium">{numericAmount} USDT</span>{" "}
              on <span className={chain.accent}>{chain.name}</span> to:
            </p>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 mb-4">
              <p className="text-xs text-white/50 mb-1">Destination address</p>
              <p className="text-white text-sm font-mono break-all">{address}</p>
            </div>
            <div className="space-y-1 text-sm mb-5">
              <div className="flex justify-between text-white/60">
                <span>Total deducted</span>
                <span className="text-amber-400 font-medium">{total.toFixed(2)} USDT</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setConfirming(false)}
                className="flex-1 glass text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40"
              >
                Confirm withdrawal
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
