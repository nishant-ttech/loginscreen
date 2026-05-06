import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, TrendingUp, Shield, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CommissionSettingsPage() {
  const [settings, setSettings] = useState({
    defaultRate: "2.5",
    minCommission: "1.00",
    maxCommission: "500.00",
    autoPayout: true,
    payoutThreshold: "100.00",
    tierEnabled: true,
  });

  const tiers = [
    { volume: "$0 - $1,000", rate: "2.5%" },
    { volume: "$1,000 - $10,000", rate: "2.2%" },
    { volume: "$10,000 - $50,000", rate: "1.8%" },
    { volume: "$50,000+", rate: "1.5%" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Commission Settings</h1>
          <p className="text-white/60 text-sm mt-1">Configure commission rates and payout rules</p>
        </div>
        <Button className="glass hover:bg-white/10 transition-colors">
          <SettingsIcon className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Form */}
        <Card className="glass-strong border-white/10 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white text-lg">Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-5 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="defaultRate" className="text-white/80">Default Commission Rate (%)</Label>
                <div className="relative">
                  <Input
                    id="defaultRate"
                    type="text"
                    value={settings.defaultRate}
                    onChange={(e) => setSettings({ ...settings, defaultRate: e.target.value })}
                    className="bg-white/5 border-white/10 text-white pl-8"
                    placeholder="2.5"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">%</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minCommission" className="text-white/80">Minimum Commission ($)</Label>
                <div className="relative">
                  <Input
                    id="minCommission"
                    type="text"
                    value={settings.minCommission}
                    onChange={(e) => setSettings({ ...settings, minCommission: e.target.value })}
                    className="bg-white/5 border-white/10 text-white pl-8"
                    placeholder="1.00"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">$</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxCommission" className="text-white/80">Maximum Commission ($)</Label>
                <div className="relative">
                  <Input
                    id="maxCommission"
                    type="text"
                    value={settings.maxCommission}
                    onChange={(e) => setSettings({ ...settings, maxCommission: e.target.value })}
                    className="bg-white/5 border-white/10 text-white pl-8"
                    placeholder="500.00"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">$</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payoutThreshold" className="text-white/80">Auto-Payout Threshold ($)</Label>
                <div className="relative">
                  <Input
                    id="payoutThreshold"
                    type="text"
                    value={settings.payoutThreshold}
                    onChange={(e) => setSettings({ ...settings, payoutThreshold: e.target.value })}
                    className="bg-white/5 border-white/10 text-white pl-8"
                    placeholder="100.00"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">$</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div>
                  <Label className="text-white/80 cursor-pointer">Enable Tiered Commission</Label>
                  <p className="text-xs text-white/40 mt-1">Apply volume-based rates</p>
                </div>
                <Switch
                  checked={settings.tierEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, tierEnabled: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div>
                  <Label className="text-white/80 cursor-pointer">Auto-Payout</Label>
                  <p className="text-xs text-white/40 mt-1">Automatic commission payout</p>
                </div>
                <Switch
                  checked={settings.autoPayout}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoPayout: checked })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tiered Rates */}
        <Card className="glass-strong border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Tiered Rates</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="space-y-3">
              {tiers.map((tier, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-white/40">{tier.volume}</span>
                    <span className="text-emerald-400 font-semibold">{tier.rate}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${25 + i * 25}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">Security Policy</span>
              </div>
              <p className="text-xs text-emerald-200/80">All commission transactions are encrypted and logged for audit purposes.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
