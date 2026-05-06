import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Key,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

const VALID_LENGTHS = [12, 15, 18, 21, 24];

export default function WalletImportPage() {
  const [mnemonic, setMnemonic] = useState("");
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [monitor, setMonitor] = useState(true);
  const [imported, setImported] = useState([
    {
      id: 1,
      label: "Wallet 1",
      evm: "0x4A2c8B3E9d1F0c7Ab52E8f19D6B3Ca0e1F4D7B82",
      tron: "TQrZ8xN9pV1aFdPK7eYbWk2Hc4rL5sV3mA",
      monitored: true,
      addedOn: "2026-04-22",
    },
    {
      id: 2,
      label: "Wallet 2",
      evm: "0xB781d0aC3f5e8A0c92fE4d1B7a09c2A0E5b3f9D1",
      tron: "TKpZv6gFkMa2eW9LdQb1hRsVx3CmYz4jPn",
      monitored: false,
      addedOn: "2026-04-15",
    },
  ]);

  const wordCount = useMemo(
    () => mnemonic.trim().split(/\s+/).filter(Boolean).length,
    [mnemonic]
  );
  const isValid = VALID_LENGTHS.includes(wordCount);

  const strength =
    wordCount === 0 ? 0 : wordCount >= 24 ? 100 : wordCount >= 18 ? 80 : wordCount >= 12 ? 60 : 30;

  const onImport = (e) => {
    e.preventDefault();
    if (!isValid) return;
    const id = Date.now();
    setImported((prev) => [
      {
        id,
        label: `Wallet ${prev.length + 1}`,
        evm: `0x${Math.random().toString(16).slice(2, 10)}…${Math.random().toString(16).slice(2, 6)}`,
        tron: `T${Math.random().toString(36).slice(2, 9).toUpperCase()}…${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
        monitored: monitor,
        addedOn: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    setMnemonic("");
  };

  const remove = (id) => setImported((prev) => prev.filter((w) => w.id !== id));
  const toggle = (id) =>
    setImported((prev) => prev.map((w) => (w.id === id ? { ...w, monitored: !w.monitored } : w)));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/wallet">
          <Button variant="ghost" size="sm" className="text-white/60">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Import Wallet</h1>
          <p className="text-white/60 text-sm mt-1">
            Import an external wallet to monitor incoming deposits
          </p>
        </div>
      </div>

      <Card className="glass-strong border-red-500/20 bg-red-500/5">
        <CardContent className="p-4 flex gap-3 items-start">
          <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="text-red-300 font-medium">Never share your mnemonic with anyone</p>
            <p className="text-white/60 mt-1">
              We encrypt your seed phrase locally and only use it to derive read-only addresses.
              Anyone with this phrase can drain your wallet.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-strong border-white/10 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white text-lg">Recovery phrase</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <form onSubmit={onImport} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-white/70 text-sm">12, 15, 18, 21 or 24 words</Label>
                  <button
                    type="button"
                    onClick={() => setShowMnemonic((s) => !s)}
                    className="text-xs text-white/40 hover:text-white/70 flex items-center gap-1"
                  >
                    {showMnemonic ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {showMnemonic ? "Hide" : "Show"}
                  </button>
                </div>
                <textarea
                  value={mnemonic}
                  onChange={(e) => setMnemonic(e.target.value)}
                  placeholder="word1 word2 word3 ..."
                  rows={5}
                  className={`w-full p-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-mono placeholder:text-white/30 focus:outline-none focus:border-emerald-500/40 ${
                    !showMnemonic && mnemonic ? "[-webkit-text-security:disc] [text-security:disc]" : ""
                  }`}
                  style={
                    !showMnemonic && mnemonic
                      ? { WebkitTextSecurity: "disc", textSecurity: "disc" }
                      : undefined
                  }
                />
                <div className="flex items-center justify-between mt-2">
                  <span
                    className={`text-xs ${
                      wordCount === 0
                        ? "text-white/40"
                        : isValid
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}
                  >
                    {wordCount} word{wordCount === 1 ? "" : "s"}
                    {isValid ? " ✓" : wordCount > 0 ? " (need 12/15/18/21/24)" : ""}
                  </span>
                </div>
                <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      strength >= 80
                        ? "bg-emerald-500"
                        : strength >= 60
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${strength}%` }}
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10">
                <input
                  type="checkbox"
                  checked={monitor}
                  onChange={(e) => setMonitor(e.target.checked)}
                  className="h-4 w-4 accent-emerald-500"
                />
                <div className="flex-1">
                  <div className="text-sm text-white">Monitor for incoming deposits</div>
                  <div className="text-xs text-white/50">
                    Auto-credit detected USDT transfers to your NetPay balance
                  </div>
                </div>
              </label>

              <Button
                type="submit"
                disabled={!isValid}
                className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 disabled:opacity-50"
              >
                <Key className="h-4 w-4 mr-2" /> Import wallet
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">How it works</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-3 text-sm">
            {[
              "We derive your EVM and Tron addresses from your mnemonic.",
              "Your seed never leaves your browser unencrypted.",
              "We watch the chain for incoming USDT transfers.",
              "Detected deposits are credited to your wallet automatically.",
              "You can disable monitoring or delete the wallet anytime.",
            ].map((line, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-white/70">{line}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="glass-strong border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white text-lg">Imported wallets ({imported.length})</CardTitle>
          <Button variant="ghost" size="sm" className="text-white/60">
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Sync
          </Button>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          {imported.length === 0 ? (
            <p className="text-sm text-white/40 text-center py-8">No wallets imported yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {imported.map((w) => (
                <div
                  key={w.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.07]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-white font-medium">{w.label}</p>
                      <p className="text-xs text-white/40">Added {w.addedOn}</p>
                    </div>
                    <button
                      onClick={() => remove(w.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-white/40 uppercase tracking-wider">EVM</span>
                      <p className="text-white/80 font-mono break-all">{w.evm}</p>
                    </div>
                    <div>
                      <span className="text-white/40 uppercase tracking-wider">Tron</span>
                      <p className="text-white/80 font-mono break-all">{w.tron}</p>
                    </div>
                  </div>
                  <label className="flex items-center justify-between mt-3 pt-3 border-t border-white/10 cursor-pointer">
                    <span className="text-sm text-white/70">Monitor deposits</span>
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        toggle(w.id);
                      }}
                      className={`relative h-5 w-9 rounded-full transition-colors ${
                        w.monitored ? "bg-emerald-500/40" : "bg-white/10"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 h-4 w-4 rounded-full transition-transform ${
                          w.monitored ? "translate-x-4 bg-emerald-400" : "translate-x-0.5 bg-white/60"
                        }`}
                      />
                    </div>
                  </label>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
