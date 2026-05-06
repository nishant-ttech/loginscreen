import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Key, Lock, Smartphone, History, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function SecurityPage() {
  const securitySettings = [
    { id: 1, name: "Two-Factor Authentication", enabled: true, desc: "Extra layer of security for login", icon: Key },
    { id: 2, name: "Login Alerts", enabled: true, desc: "Get notified of new logins", icon: Smartphone },
    { id: 3, name: "Session Management", enabled: true, desc: "Control active sessions", icon: History },
    { id: 4, name: "Password Protection", enabled: true, desc: "Strong password requirements", icon: Lock },
  ];

  const loginHistory = [
    { id: 1, device: "Chrome on Windows", location: "New York, US", time: "2 min ago", status: "active" },
    { id: 2, device: "Safari on iPhone", location: "Los Angeles, US", time: "5 hours ago", status: "expired" },
    { id: 3, device: "Firefox on macOS", location: "London, UK", time: "2 days ago", status: "expired" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Security & 2FA</h1>
          <p className="text-white/60 text-sm mt-1">Manage your account security settings</p>
        </div>
        <Button className="glass hover:bg-white/10 transition-colors">
          <Shield className="h-4 w-4 mr-2" />
          Update Security
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Security Settings */}
        <Card className="glass-strong border-white/10 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white text-lg">Security Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5 pt-0">
            {securitySettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <setting.icon className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{setting.name}</div>
                    <div className="text-white/40 text-sm">{setting.desc}</div>
                  </div>
                </div>
                <Switch checked={setting.enabled} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-strong border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-5 pt-0">
            <Button className="w-full glass hover:bg-white/10 transition-colors justify-start">
              <Key className="h-4 w-4 mr-2" />
              Change Password
            </Button>
            <Button className="w-full glass hover:bg-white/10 transition-colors justify-start">
              <Smartphone className="h-4 w-4 mr-2" />
              Setup 2FA
            </Button>
            <Button variant="outline" className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 justify-start">
              <AlertCircle className="h-4 w-4 mr-2" />
              Revoke Sessions
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Login History */}
      <Card className="glass-strong border-white/10">
        <CardHeader>
          <CardTitle className="text-white text-lg">Recent Login Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="space-y-3">
            {loginHistory.map((login) => (
              <div key={login.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{login.device}</div>
                    <div className="text-white/40 text-sm">{login.location}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    {login.status === "active" ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-400" />
                    )}
                    <span className={`text-sm ${login.status === "active" ? "text-emerald-400" : "text-white/60"}`}>
                      {login.time}
                    </span>
                  </div>
                  <div className="text-xs text-white/30 mt-1">{login.status}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
