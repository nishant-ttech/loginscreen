import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Copy, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function PhysicalCardsPage() {
  const physicalCards = [
    { id: 1, holder: "John Smith", cardNumber: "4532 1234 5678 9012", type: "Corporate", status: "active", expiry: "12/26", issued: "2024-01-15" },
    { id: 2, holder: "Sarah Johnson", cardNumber: "5412 7512 3412 3456", type: "Business", status: "active", expiry: "08/25", issued: "2024-02-20" },
    { id: 3, holder: "Mike Chen", cardNumber: "4916 3387 2345 6789", type: "Corporate", status: "locked", expiry: "03/27", issued: "2024-03-10" },
    { id: 4, holder: "Emma Wilson", cardNumber: "6011 1234 5678 9012", type: "Expense", status: "active", expiry: "11/25", issued: "2024-04-05" },
    { id: 5, holder: "David Brown", cardNumber: "3782 822463 10005", type: "Corporate", status: "expired", expiry: "06/24", issued: "2023-06-28" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-emerald-500/20 text-emerald-400";
      case "locked": return "bg-amber-500/20 text-amber-400";
      case "expired": return "bg-red-500/20 text-red-400";
      default: return "bg-white/10 text-white/60";
    }
  };

  const getCardTypeColor = (type) => {
    switch (type) {
      case "Corporate": return "bg-blue-500/20 text-blue-400";
      case "Business": return "bg-purple-500/20 text-purple-400";
      case "Expense": return "bg-amber-500/20 text-amber-400";
      default: return "bg-white/10 text-white/60";
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Physical Card Numbers</h1>
          <p className="text-white/60 text-sm mt-1">Manage physical card numbers and access control</p>
        </div>
        <Button className="glass hover:bg-white/10 transition-colors">
          <CreditCard className="h-4 w-4 mr-2" />
          Issue Card
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-strong border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">24</div>
                <div className="text-sm text-white/40">Active Cards</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-strong border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">3</div>
                <div className="text-sm text-white/40">Locked Cards</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass-strong border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">8</div>
                <div className="text-sm text-white/40">Expired Cards</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-strong border-white/10">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                type="text"
                placeholder="Search card numbers or holders..."
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
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Card Number</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Type</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Status</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Expiry</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {physicalCards.map((card) => (
                  <tr key={card.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <span className="text-xs text-emerald-400 font-medium">{card.holder[0]}</span>
                        </div>
                        <span className="text-white/80 text-sm">{card.holder}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-mono text-sm">{card.cardNumber}</span>
                        <Button
                          size="sm" variant="ghost"
                          className="h-6 px-1 text-white/40 hover:text-emerald-400"
                          onClick={() => copyToClipboard(card.cardNumber)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getCardTypeColor(card.type)}`}>
                        {card.type}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(card.status)}`}>
                        {card.status}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-white/40 text-sm">{card.expiry}</span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-white/60 hover:text-white">
                          View
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-emerald-400 hover:text-emerald-300">
                          <Download className="h-3 w-3" />
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
