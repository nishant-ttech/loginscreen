import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Store, Search, Copy, Filter as FilterIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { merchantsService } from "@/services/merchantsService";
import { toast } from "@/components/ui/sonner";

export default function MerchantsPage() {
  const [merchants, setMerchants] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    whitelabel: 0,
    netpayOwned: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [copiedUrl, setCopiedUrl] = useState(null);

  const fetchMerchants = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter && statusFilter !== "all") params.status = statusFilter;
      if (typeFilter && typeFilter !== "all") params.type = typeFilter;

      const data = await merchantsService.getMerchants(params);
      setMerchants(data.merchants || []);
    } catch (error) {
      console.error("Failed to fetch merchants:", error);
      const mockMerchants = [
        {
          id: 1,
          name: "Sheno Pay",
          description: "Sheno Pay - Card Portal",
          type: "Whitelabel",
          email: "admin@shenopay.com",
          phone: "9898989899",
          registerUrl: "https://cards.netpay247.com/register/shenopay",
          loginUrl: "https://cards.netpay247.com/merchant-login/shenopay",
          status: "active",
          createdAt: "2026-05-01",
        },
        {
          id: 2,
          name: "ZentoraCapital",
          description: "ZentoraCapital - Card Portal",
          type: "Whitelabel",
          email: "admin@zentoracapital.com",
          phone: null,
          registerUrl: "https://cards.netpay247.com/register/lr2u6p",
          loginUrl: "https://cards.netpay247.com/merchant-login/lr2u6p",
          status: "active",
          createdAt: "2026-04-14",
        },
      ];
      setMerchants(mockMerchants);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, typeFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await merchantsService.getMerchantStats();
      setStats({
        total: data.total || 0,
        active: data.active || 0,
        inactive: data.inactive || 0,
        whitelabel: data.whitelabel || 0,
        netpayOwned: data.netpayOwned || 0,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      setStats({
        total: 2,
        active: 2,
        inactive: 0,
        whitelabel: 2,
        netpayOwned: 0,
      });
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchMerchants();
  }, [fetchMerchants, fetchStats]);

  const handleCopyUrl = (url, label) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(label);
    setTimeout(() => setCopiedUrl(null), 2000);
    toast.success(`${label} URL copied to clipboard`);
  };

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active": return "bg-emerald-500/20 text-emerald-400";
      case "inactive": return "bg-red-500/20 text-red-400";
      case "pending": return "bg-amber-500/20 text-amber-400";
      default: return "bg-white/10 text-white/60";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Merchants</h1>
          <p className="text-white/60 text-sm mt-1">Manage all registered merchants</p>
        </div>
        <Button className="glass hover:bg-white/10 transition-colors">
          <Plus className="h-4 w-4 mr-2" />
          New Merchant
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="glass-strong border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Store className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-xs text-white/40">Total Merchants</div>
                <div className="text-xs text-white/60 mt-0.5">All registered merchants</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Store className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.active}</div>
                <div className="text-xs text-white/40">Active</div>
                <div className="text-xs text-white/60 mt-0.5">Currently active</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <Store className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.inactive}</div>
                <div className="text-xs text-white/40">Inactive</div>
                <div className="text-xs text-white/60 mt-0.5">Disabled accounts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Store className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.whitelabel}</div>
                <div className="text-xs text-white/40">Whitelabel</div>
                <div className="text-xs text-white/60 mt-0.5">{stats.netpayOwned} NetPay owned</div>
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
                placeholder="Search business, contact, email…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="whitelabel">Whitelabel</SelectItem>
                <SelectItem value="netpay">NetPay Owned</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              onClick={handleReset}
              className="glass hover:bg-white/10 transition-colors"
            >
              Reset
            </Button>
            <Button className="glass hover:bg-white/10 transition-colors">
              <FilterIcon className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="overflow-x-auto -mx-5 -mb-5">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-4">Name</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-4">Type</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-4">Email</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-4">Phone</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-4">URLs</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-4">Status</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-4">Created</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-white/40">
                      Loading merchants...
                    </td>
                  </tr>
                ) : merchants.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-white/40">
                      No merchants found
                    </td>
                  </tr>
                ) : (
                  merchants.map((merchant) => (
                    <tr key={merchant.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <div className="text-white/80 text-sm font-medium">{merchant.name}</div>
                          <div className="text-white/40 text-xs">{merchant.description}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white/60 text-sm">{merchant.type || "Whitelabel"}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white/60 text-sm">{merchant.email}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white/60 text-sm">{merchant.phone || "—"}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {merchant.registerUrl && (
                            <div className="flex items-center gap-2">
                              <span className="text-white/40 text-xs">Register:</span>
                              <a
                                href={merchant.registerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 text-xs hover:underline truncate max-w-[180px] block"
                              >
                                {merchant.registerUrl}
                              </a>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCopyUrl(merchant.registerUrl, "Register")}
                                className="h-5 w-5 p-0 text-white/40 hover:text-white"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                          {merchant.loginUrl && (
                            <div className="flex items-center gap-2">
                              <span className="text-white/40 text-xs">Login:</span>
                              <a
                                href={merchant.loginUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 text-xs hover:underline truncate max-w-[180px] block"
                              >
                                {merchant.loginUrl}
                              </a>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCopyUrl(merchant.loginUrl, "Login")}
                                className="h-5 w-5 p-0 text-white/40 hover:text-white"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(merchant.status)}`}>
                          {merchant.status || "active"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white/60 text-sm">{formatDate(merchant.createdAt)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {merchant.loginUrl && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(merchant.loginUrl, "_blank")}
                              className="h-7 px-2 text-white/60 hover:text-white"
                            >
                              Login
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}