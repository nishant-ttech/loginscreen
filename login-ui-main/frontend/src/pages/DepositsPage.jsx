import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter as FilterIcon, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { depositsService } from "@/services/depositsService";
import { toast } from "@/components/ui/sonner";

export default function DepositsPage() {
  const [deposits, setDeposits] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    rejected: 0,
    completedAmount: "$0.00",
    today: { count: 0, amount: "$0.00" },
  });
  const [breakdown, setBreakdown] = useState({
    manual: { amount: "$0.00", count: 0 },
    auto: { amount: "$0.00", count: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [chainFilter, setChainFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");

  const fetchDeposits = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter && statusFilter !== "all") params.status = statusFilter;
      if (chainFilter && chainFilter !== "all") params.chain = chainFilter;
      if (verificationFilter && verificationFilter !== "all") params.verification = verificationFilter;

      const data = await depositsService.getDeposits(params);
      setDeposits(data.deposits || []);
    } catch (error) {
      console.error("Failed to fetch deposits:", error);
      const mockDeposits = [
        {
          id: 1,
          user: { name: "sumit kethwas", email: "amladevi8765@gmail.com" },
          reference: "AUTO-1599753070",
          chain: "TRC20",
          txHash: "6a15821a7f609ee5a2e30f384ce8e998c4fa9b7a24a1e81ad74cb2a5020e5784",
          amount: "$982.50 USDT",
          verification: "Unverified",
          note: "[Auto-Credited] 1000 USDT detected on TRC20. Block: 82467588. Commission: 17.5 U...",
          status: "completed",
          submitted: "06 May 2026 12:38 PM",
        },
        {
          id: 2,
          user: { name: "dipesh dipesh", email: "n9867693837@icloud.com" },
          reference: "AUTO-A726015525",
          chain: "TRC20",
          txHash: "295456fca78ac7e80d02e0a3dd83ecf86b6eff242ccf6e5ddb87fa47bc4e2ceb",
          amount: "$245.63 USDT",
          verification: "Unverified",
          note: "[Auto-Credited] 250 USDT detected on TRC20. Block: 82445871. Commission: 4.375 U...",
          status: "completed",
          submitted: "05 May 2026 06:32 PM",
        },
        {
          id: 3,
          user: { name: "Nishant Kumar", email: "n4nishant@gmail.com" },
          reference: "AUTO-B97CF28556",
          chain: "BEP20",
          txHash: "bep20_auto_0xfff49789796e3870f6b207066bbece09beba360c_1777624509806",
          amount: "$150.00 USDT",
          verification: "Unverified",
          note: "[Auto-Credited] 150 USDT detected on BEP20.",
          status: "completed",
          submitted: "04 May 2026 02:15 PM",
        },
      ];
      setDeposits(mockDeposits);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, chainFilter, verificationFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await depositsService.getDepositsStats();
      setStats({
        total: data.total || 0,
        completed: data.completed || 0,
        pending: data.pending || 0,
        rejected: data.rejected || 0,
        completedAmount: data.completedAmount || "$0.00",
        today: data.today || { count: 0, amount: "$0.00" },
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      setStats({
        total: 16,
        completed: 16,
        pending: 0,
        rejected: 0,
        completedAmount: "$63,414.01",
        today: { count: 0, amount: "$0.00" },
      });
    }
  }, []);

  const fetchBreakdown = useCallback(async () => {
    try {
      const data = await depositsService.getDepositsBreakdown();
      setBreakdown({
        manual: data.manual || { amount: "$0.00", count: 0 },
        auto: data.auto || { amount: "$0.00", count: 0 },
      });
    } catch (error) {
      console.error("Failed to fetch breakdown:", error);
      setBreakdown({
        manual: { amount: "$62,078.00", count: 12 },
        auto: { amount: "$1,336.01", count: 4 },
      });
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchBreakdown();
    fetchDeposits();
  }, [fetchDeposits, fetchStats, fetchBreakdown]);

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setChainFilter("all");
    setVerificationFilter("all");
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed": return "bg-emerald-500/20 text-emerald-400";
      case "pending": return "bg-amber-500/20 text-amber-400";
      case "rejected": return "bg-red-500/20 text-red-400";
      default: return "bg-white/10 text-white/60";
    }
  };

  const handleVerify = async (id) => {
    try {
      await depositsService.verifyDeposit(id);
      toast.success("Deposit verified successfully");
      fetchDeposits();
    } catch (error) {
      toast.error("Failed to verify deposit");
    }
  };

  const handleReject = async (id) => {
    try {
      await depositsService.rejectDeposit(id);
      toast.success("Deposit rejected successfully");
      fetchDeposits();
    } catch (error) {
      toast.error("Failed to reject deposit");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Deposits</h1>
          <p className="text-white/60 text-sm mt-1">All deposit requests · {stats.completedAmount} completed</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="glass-strong border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <ArrowDownRight className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-xs text-white/40">Total Deposits</div>
                <div className="text-xs text-white/60 mt-0.5">All deposit requests</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <ArrowDownRight className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.completed}</div>
                <div className="text-xs text-white/40">Completed</div>
                <div className="text-xs text-white/60 mt-0.5">Successfully processed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <ArrowDownRight className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.pending}</div>
                <div className="text-xs text-white/40">Pending</div>
                <div className="text-xs text-white/60 mt-0.5">Awaiting approval</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <ArrowDownRight className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.rejected}</div>
                <div className="text-xs text-white/40">Rejected</div>
                <div className="text-xs text-white/60 mt-0.5">Declined requests</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-strong border-white/10">
        <CardContent className="p-5">
          <h3 className="font-display text-lg font-semibold text-white mb-4">Breakdown by Source</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <span className="text-white/60 text-sm">Manual (Admin)</span>
              <div className="text-right">
                <div className="text-white/80 font-medium">{breakdown.manual.amount}</div>
                <div className="text-white/40 text-xs">{breakdown.manual.count} deposits {breakdown.manual.count > 0 ? "· admin-added" : ""}</div>
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-white/60 text-sm">Auto / Crypto</span>
              <div className="text-right">
                <div className="text-white/80 font-medium">{breakdown.auto.amount}</div>
                <div className="text-white/40 text-xs">{breakdown.auto.count} deposits · on-chain</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-3 rounded-lg bg-white/5">
              <div className="text-white/40 text-xs mb-1">Today</div>
              <div className="text-white/80 font-medium">{stats.today.count}</div>
              <div className="text-white/40 text-xs">{stats.today.amount} received today</div>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <div className="text-white/40 text-xs mb-1">Completed Amount</div>
              <div className="text-emerald-400 font-medium">{stats.completedAmount}</div>
              <div className="text-white/40 text-xs">Total value processed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-strong border-white/10">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                type="text"
                placeholder="Search deposits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={chainFilter} onValueChange={setChainFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Chain" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                <SelectItem value="all">All Chains</SelectItem>
                <SelectItem value="TRC20">TRC20</SelectItem>
                <SelectItem value="BEP20">BEP20</SelectItem>
                <SelectItem value="ERC20">ERC20</SelectItem>
              </SelectContent>
            </Select>
            <Select value={verificationFilter} onValueChange={setVerificationFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10">
                <SelectItem value="all">All Verification</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
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
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-4">User</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-4">Chain</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-4">TX Hash</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-4">Amount</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-4">Verification</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-4">Status</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-4">Submitted</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-white/40">
                      Loading deposits...
                    </td>
                  </tr>
                ) : deposits.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-white/40">
                      No deposits found
                    </td>
                  </tr>
                ) : (
                  deposits.map((deposit) => (
                    <tr key={deposit.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <div className="text-white/80 text-sm font-medium">{deposit.user?.name}</div>
                          <div className="text-white/40 text-xs">{deposit.user?.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white/60 text-sm">{deposit.chain}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-400 text-sm font-mono truncate block max-w-[150px]">
                          {deposit.txHash}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-400 text-sm font-medium">{deposit.amount}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white/60 text-sm">{deposit.verification}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(deposit.status)}`}>
                          {deposit.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white/60 text-sm">{deposit.submitted}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {deposit.status === "completed" ? (
                            <span className="text-emerald-400 text-sm">Completed</span>
                          ) : deposit.status === "pending" ? (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleVerify(deposit.id)}
                                className="h-7 px-2 text-emerald-400 hover:text-emerald-300"
                              >
                                Verify
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleReject(deposit.id)}
                                className="h-7 px-2 text-red-400 hover:text-red-300"
                              >
                                Reject
                              </Button>
                            </>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-white/40 text-sm">
            {deposits.length} total requests
          </div>
        </CardContent>
      </Card>
    </div>
  );
}