import React, { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Copy,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { CHAINS } from "./WalletDepositPage";

function QrPlaceholder({ data }) {
  const blocks = Array.from({ length: 21 * 21 }, (_, i) => {
    const seed = (data.charCodeAt(i % data.length) * (i + 1)) % 100;
    return seed > 50;
  });
  return (
    <div className="grid grid-cols-[repeat(21,minmax(0,1fr))] gap-px p-3 bg-white rounded-xl shadow-lg w-fit mx-auto">
      {blocks.map((on, i) => (
        <div key={i} className={`aspect-square ${on ? "bg-black" : "bg-white"}`} />
      ))}
    </div>
  );
}

export default function WalletDepositChainPage() {
  const { chain: chainId } = useParams();
  const chain = CHAINS.find((c) => c.id === chainId);
  const [txHash, setTxHash] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!chain) return <Navigate to="/wallet/deposit" replace />;

  const address =
    chain.id === "trc20"
      ? "TQrZ8xN9pV1aFdPK7eYbWk2Hc4rL5sV3mA"
      : "0x4A2c8B3E9d1F0c7Ab52E8f19D6B3Ca0e1F4D7B82";

  const recentDeposits = [
    {
      id: "d-001",
      date: "2026-05-05 14:21",
      amount: 250,
      status: "Completed",
      hash: "0x9a7c...e21f",
    },
    {
      id: "d-002",
      date: "2026-05-04 09:05",
      amount: 1000,
      status: "Verified",
      hash: "0x37bc...11d9",
    },
    {
      id: "d-003",
      date: "2026-05-02 18:43",
      amount: 500,
      status: "Unverified",
      hash: "—",
    },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const onSubmitHash = (e) => {
    e.preventDefault();
    if (!txHash.trim()) return;
    setSubmitted(true);
  };

  const statusColor = (s) =>
    s === "Completed"
      ? "bg-emerald-500/20 text-emerald-400"
      : s === "Verified"
      ? "bg-blue-500/20 text-blue-400"
      : s === "Rejected"
      ? "bg-red-500/20 text-red-400"
      : "bg-white/10 text-white/60";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/wallet/deposit">
          <Button variant="ghost" size="sm" className="text-white/60">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            Deposit USDT on <span className={chain.accent}>{chain.name}</span>
          </h1>
          <p className="text-white/60 text-sm mt-1">{chain.network} · auto-detect enabled</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg glass">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400">Polling every 6s</span>
        </div>
      </div>

      <Card className="glass-strong border-amber-500/20 bg-amber-500/5">
        <CardContent className="p-4 flex gap-3 items-start">
          <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="text-amber-300 font-medium">Send only USDT on {chain.name}</p>
            <p className="text-white/60 mt-1">
              Other tokens or networks will be lost. Minimum {chain.confirmations} confirmations
              required.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-strong border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Scan QR or copy address</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-4">
            <QrPlaceholder data={address} />
            <div>
              <Label className="text-white/70 text-sm mb-2 block">Deposit address</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={address}
                  className="bg-white/5 border-white/10 text-white font-mono text-xs"
                />
                <Button onClick={copy} variant="ghost" className="glass shrink-0">
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-white/70" />
                  )}
                </Button>
              </div>
            </div>
            <div className="text-xs text-white/50 grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
              <div>
                <div className="text-white/40">Network</div>
                <div className="text-white/80 mt-0.5">{chain.network}</div>
              </div>
              <div>
                <div className="text-white/40">Token</div>
                <div className="text-white/80 mt-0.5">USDT ({chain.token})</div>
              </div>
              <div>
                <div className="text-white/40">Confirmations</div>
                <div className="text-white/80 mt-0.5">{chain.confirmations}</div>
              </div>
              <div>
                <div className="text-white/40">Deposit fee</div>
                <div className="text-white/80 mt-0.5">{chain.fee}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Submit proof manually</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-4">
            <p className="text-sm text-white/60">
              If your deposit isn't auto-detected within ~10 minutes, paste the transaction hash
              below and we'll verify it manually.
            </p>
            <form onSubmit={onSubmitHash} className="space-y-3">
              <div>
                <Label className="text-white/70 text-sm mb-2 block">Transaction hash</Label>
                <Input
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="0x... or T..."
                  className="bg-white/5 border-white/10 text-white font-mono text-xs"
                />
              </div>
              <Button
                type="submit"
                disabled={!txHash.trim() || submitted}
                className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 disabled:opacity-50"
              >
                {submitted ? "Submitted ✓" : "Submit transaction hash"}
              </Button>
            </form>
            {submitted && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-300 flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>
                  Transaction submitted for review. You'll see it appear below shortly.
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="glass-strong border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white text-lg">Recent deposits on {chain.name}</CardTitle>
          <Button variant="ghost" size="sm" className="text-white/60">
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh
          </Button>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Date</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Amount</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Hash</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentDeposits.map((d) => (
                  <tr key={d.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-2 text-white/60 text-sm">{d.date}</td>
                    <td className="py-3 px-2 text-emerald-400 font-medium text-sm">+{d.amount} USDT</td>
                    <td className="py-3 px-2">
                      <span className="text-white/60 text-xs font-mono flex items-center gap-1">
                        {d.hash}
                        {d.hash !== "—" && <ExternalLink className="h-3 w-3 text-white/30" />}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColor(d.status)}`}>
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
