import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Users, UserPlus, UserCheck, UserX, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UsersPage() {
  const users = [
    { id: 1, name: "John Smith", email: "john@netpay.com", status: "active", role: "merchant", joined: "2024-01-15" },
    { id: 2, name: "Sarah Johnson", email: "sarah@netpay.com", status: "active", role: "user", joined: "2024-02-20" },
    { id: 3, name: "Mike Chen", email: "mike@netpay.com", status: "suspended", role: "merchant", joined: "2024-03-10" },
    { id: 4, name: "Emma Wilson", email: "emma@netpay.com", status: "pending", role: "user", joined: "2024-04-05" },
    { id: 5, name: "David Brown", email: "david@netpay.com", status: "active", role: "user", joined: "2024-01-28" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-emerald-500/20 text-emerald-400";
      case "suspended": return "bg-red-500/20 text-red-400";
      case "pending": return "bg-amber-500/20 text-amber-400";
      default: return "bg-white/10 text-white/60";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">User Management</h1>
          <p className="text-white/60 text-sm mt-1">Manage users and merchant accounts</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="glass hover:bg-white/10 transition-colors">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-strong border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">12,458</div>
                <div className="text-sm text-white/40">Total Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-strong border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">1,284</div>
                <div className="text-sm text-white/40">Active Merchants</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-strong border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <UserX className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">84</div>
                <div className="text-sm text-white/40">Suspended</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="glass-strong border-white/10">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                type="text"
                placeholder="Search users by name or email..."
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <Button className="glass hover:bg-white/10 transition-colors">
              Search
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">User</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Email</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Role</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Status</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Joined</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <span className="text-sm text-emerald-400 font-medium">{user.name[0]}</span>
                        </div>
                        <span className="text-white/80 text-sm">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-white/60 text-sm">{user.email}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-white/40 text-sm">{user.joined}</span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-white/60 hover:text-white">
                          Edit
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-red-400 hover:text-red-300">
                          Suspend
                        </Button>
                      </div>
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
