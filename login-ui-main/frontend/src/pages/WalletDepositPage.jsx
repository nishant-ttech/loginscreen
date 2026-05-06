import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CHAINS = [
  {
    id: "trc20",
    name: "TRC20",
    network: "Tron",
    token: "TRX",
    confirmations: 19,
    fee: "0%",
    enabled: true,
    color: "from-orange-500/20 to-red-500/10",
    accent: "text-orange-400",
    border: "border-orange-500/30",
  },
  {
    id: "bep20",
    name: "BEP20",
    network: "BNB Smart Chain",
    token: "BNB",
    confirmations: 15,
    fee: "0%",
    enabled: true,
    color: "from-yellow-500/20 to-amber-500/10",
    accent: "text-yellow-400",
    border: "border-yellow-500/30",
  },
  {
    id: "erc20",
    name: "ERC20",
    network: "Ethereum",
    token: "ETH",
    confirmations: 12,
    fee: "0%",
    enabled: true,
    color: "from-purple-500/20 to-indigo-500/10",
    accent: "text-purple-400",
    border: "border-purple-500/30",
  },
  {
    id: "polygon",
    name: "POLYGON",
    network: "Polygon",
    token: "MATIC",
    confirmations: 128,
    fee: "0%",
    enabled: true,
    color: "from-blue-500/20 to-violet-500/10",
    accent: "text-blue-400",
    border: "border-blue-500/30",
  },
  {
    id: "arbitrum",
    name: "ARBITRUM",
    network: "Arbitrum One",
    token: "ETH",
    confirmations: 10,
    fee: "0%",
    enabled: true,
    color: "from-cyan-500/20 to-sky-500/10",
    accent: "text-cyan-400",
    border: "border-cyan-500/30",
  },
  {
    id: "base",
    name: "BASE",
    network: "Base",
    token: "ETH",
    confirmations: 10,
    fee: "0%",
    enabled: true,
    color: "from-blue-500/20 to-indigo-500/10",
    accent: "text-blue-400",
    border: "border-blue-500/30",
  },
  {
    id: "avalanche",
    name: "AVALANCHE",
    network: "Avalanche C-Chain",
    token: "AVAX",
    confirmations: 1,
    fee: "0%",
    enabled: true,
    color: "from-red-500/20 to-rose-500/10",
    accent: "text-red-400",
    border: "border-red-500/30",
  },
  {
    id: "optimism",
    name: "OPTIMISM",
    network: "Optimism",
    token: "ETH",
    confirmations: 10,
    fee: "0%",
    enabled: false,
    color: "from-pink-500/20 to-fuchsia-500/10",
    accent: "text-pink-400",
    border: "border-pink-500/30",
  },
];

export default function WalletDepositPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/wallet">
          <Button variant="ghost" size="sm" className="text-white/60">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Deposit USDT</h1>
          <p className="text-white/60 text-sm mt-1">Select the network you want to deposit on</p>
        </div>
      </div>

      <Card className="glass-strong border-amber-500/20 bg-amber-500/5">
        <CardContent className="p-4 flex gap-3 items-start">
          <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="text-amber-300 font-medium">Network selection is final.</p>
            <p className="text-white/60 mt-1">
              Sending USDT on the wrong network will result in permanent loss of funds. Always verify
              before sending.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {CHAINS.map((chain) => (
          <button
            key={chain.id}
            disabled={!chain.enabled}
            onClick={() => navigate(`/wallet/deposit/${chain.id}`)}
            className={`text-left p-5 rounded-2xl bg-gradient-to-br ${chain.color} border ${chain.border} hover:scale-[1.02] transition-all relative overflow-hidden ${
              !chain.enabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/5" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`h-12 w-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center ${chain.accent} font-bold text-lg`}
                >
                  {chain.token.slice(0, 1)}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    chain.enabled
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-white/10 text-white/40"
                  }`}
                >
                  {chain.enabled ? "Enabled" : "Soon"}
                </span>
              </div>
              <div className={`font-bold text-xl ${chain.accent}`}>{chain.name}</div>
              <div className="text-white/60 text-sm mt-0.5">{chain.network}</div>
              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                <div>
                  <div className="text-white/40">Confirms</div>
                  <div className="text-white/80 font-medium">{chain.confirmations}</div>
                </div>
                <div>
                  <div className="text-white/40">Fee</div>
                  <div className="text-white/80 font-medium">{chain.fee}</div>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <Card className="glass-strong border-white/10">
        <CardContent className="p-5 flex gap-3 items-start">
          <Info className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
          <div className="text-sm text-white/60 leading-relaxed">
            Deposits are credited automatically once they meet the minimum confirmation count for
            the selected network. If automatic detection fails, you can submit the transaction hash
            manually on the deposit page.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
