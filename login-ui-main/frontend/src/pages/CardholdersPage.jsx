import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, User, Phone, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function CardholdersPage() {
  const cardholders = [
    { id: 1, name: "John Smith", email: "john@netpay.com", phone: "+1-555-0101", cardLast4: "4532", status: "active", issued: "2024-01-15" },
    { id: 2, name: "Sarah Johnson", email: "sarah@netpay.com", phone: "+1-555-0102", cardLast4: "8829", status: "active", issued: "2024-02-20" },
    { id: 3, name: "Mike Chen", email: "mike@netpay.com", phone: "+1-555-0103", cardLast4: "1056", status: "suspended", issued: "2024-03-10" },
    { id: 4, name: "Emma Wilson", email: "emma@netpay.com", phone: "+1-555-0104", cardLast4: "7743", status: "active", issued: "2024-04-05" },
    { id: 5, name: "David Brown", email: "david@netpay.com", phone: "+1-555-0105", cardLast4: "2298", status: "expired", issued: "2023-11-28" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-emerald-500/20 text-emerald-400";
      case "suspended": return "bg-amber-500/20 text-amber-400";
      case "expired": return "bg-red-500/20 text-red-400";
      default: return "bg-white/10 text-white/60";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Cardholders</h1>
          <p className="text-white/60 text-sm mt-1">Manage virtual and physical cardholders</p>
        </div>
        <Button className="glass hover:bg-white/10 transition-colors">
          <CreditCard className="h-4 w-4 mr-2" />
          Issue Card
        </Button>
      </div>

      <Card className="glass-strong border-white/10">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                type="text"
                placeholder="Search cardholders..."
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <Button className="glass hover:bg-white/10 transition-colors">
              Filter
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Cardholder</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Email</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Card Number</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Status</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Issued</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cardholders.map((ch) => (
                  <tr key={ch.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <User className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div>
                          <div className="text-white/80 text-sm font-medium">{ch.name}</div>
                          <div className="text-white/40 text-xs">{ch.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-white/40" />
                        <span className="text-white/60 text-sm">{ch.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-emerald-400 font-mono text-sm">•••• {ch.cardLast4}</span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ch.status)}`}>
                        {ch.status}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-white/40 text-sm">{ch.issued}</span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-white/60 hover:text-white">
                          View
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-amber-400 hover:text-amber-300">
                          Edit
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
