import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Server, Database, Activity, ShieldCheck } from "lucide-react";

export default function ServerIPPage() {
  const serverInfo = {
    primary: {
      ip: "192.168.1.100",
      hostname: "prod-node-1.netpay.com",
      region: "US-East",
      status: "online",
      uptime: "99.98%",
      cpu: "34.2%",
      memory: "67.8%",
    },
    secondary: {
      ip: "192.168.1.101",
      hostname: "prod-node-2.netpay.com",
      region: "US-West",
      status: "online",
      uptime: "99.95%",
      cpu: "28.1%",
      memory: "52.4%",
    },
  };

  const databases = [
    { name: "Primary DB", type: "PostgreSQL 14", size: "124 GB", status: "healthy" },
    { name: "Replica DB", type: "PostgreSQL 14", size: "124 GB", status: "healthy" },
    { name: "Cache Redis", type: "Redis 7", size: "8 GB", status: "healthy" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Server Infrastructure</h1>
        <p className="text-white/60 text-sm mt-1">Monitor server status and IP addresses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primary Server */}
        <Card className="glass-strong border-white/10">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Server className="h-5 w-5 text-emerald-400" />
            </div>
            <CardTitle className="text-white text-lg">Primary Server</CardTitle>
            <span className="ml-auto text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
              {serverInfo.primary.status}
            </span>
          </CardHeader>
          <CardContent className="space-y-4 p-5 pt-0">
            <div className="space-y-2">
              <label className="text-xs text-white/40 uppercase">IP Address</label>
              <div className="glass px-4 py-2 rounded-lg font-mono text-sm text-emerald-400">
                {serverInfo.primary.ip}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white/40 uppercase">Hostname</label>
              <div className="text-sm text-white/60">{serverInfo.primary.hostname}</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white/5">
                <div className="text-xs text-white/40">Region</div>
                <div className="text-sm text-white/80 mt-1">{serverInfo.primary.region}</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <div className="text-xs text-white/40">CPU</div>
                <div className="text-sm text-emerald-400 mt-1">{serverInfo.primary.cpu}</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <div className="text-xs text-white/40">Memory</div>
                <div className="text-sm text-emerald-400 mt-1">{serverInfo.primary.memory}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Secondary Server */}
        <Card className="glass-strong border-white/10">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Server className="h-5 w-5 text-emerald-400" />
            </div>
            <CardTitle className="text-white text-lg">Secondary Server</CardTitle>
            <span className="ml-auto text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
              {serverInfo.secondary.status}
            </span>
          </CardHeader>
          <CardContent className="space-y-4 p-5 pt-0">
            <div className="space-y-2">
              <label className="text-xs text-white/40 uppercase">IP Address</label>
              <div className="glass px-4 py-2 rounded-lg font-mono text-sm text-emerald-400">
                {serverInfo.secondary.ip}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white/40 uppercase">Hostname</label>
              <div className="text-sm text-white/60">{serverInfo.secondary.hostname}</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white/5">
                <div className="text-xs text-white/40">Region</div>
                <div className="text-sm text-white/80 mt-1">{serverInfo.secondary.region}</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <div className="text-xs text-white/40">CPU</div>
                <div className="text-sm text-emerald-400 mt-1">{serverInfo.secondary.cpu}</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <div className="text-xs text-white/40">Memory</div>
                <div className="text-sm text-emerald-400 mt-1">{serverInfo.secondary.memory}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Database Status */}
      <Card className="glass-strong border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg">Database Infrastructure</CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {databases.map((db, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Database className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{db.name}</div>
                    <div className="text-white/40 text-xs">{db.type}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/40 text-sm">{db.size}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">{db.status}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Network Stats */}
      <Card className="glass-strong border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg">Network Statistics</CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                <Network className="h-3 w-3" />
                Active Connections
              </div>
              <div className="text-2xl font-bold text-white">1,284</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                <Activity className="h-3 w-3" />
                Requests/sec
              </div>
              <div className="text-2xl font-bold text-white">2.4K</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                <ShieldCheck className="h-3 w-3" />
                TLS Version
              </div>
              <div className="text-2xl font-bold text-emerald-400">1.3</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-white/40 text-xs mb-1">
                <ShieldCheck className="h-3 w-3" />
                SSL Rating
              </div>
              <div className="text-2xl font-bold text-emerald-400">A+</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
