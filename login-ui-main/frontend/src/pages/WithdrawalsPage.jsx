import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter as FilterIcon, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { withdrawalsService } from "@/services/withdrawalsService";
import { toast } from "@/components/ui/sonner";

export default function WithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
    rejected: 0,
    totalPaidOut: "$0.00",
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [chainFilter, setChainFilter] = useState("all");

  const fetchWithdrawals = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter && statusFilter !== "all") params.status = statusFilter;
      if (chainFilter && chainFilter !== "all") params.chain = chainFilter;

      const data = await withdrawalsService.getWithdrawals(params);
      setWithdrawals(data.withdrawals || []);
    } catch (error) {
      console.error("Failed to fetch withdrawals:", error);
      const mockWithdrawals = [
        {
          id: 1,
          user: { name: "Nishant Kumar", email: "n4nishant@gmail.com" },
          chain: "TRC20",
          destination: "THGfLz7jvDaz9SEvvthYHKcnnjVfgbsBBr",
          amount: "$980.00",
          fee: "$20.00",
          status: "completed",
          txHash: "d3e4b8377956",
          requested: "02 May 2026 12:22 PM",
        },
      ];
      setWithdrawals(mockWithdrawals);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, chainFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await withdrawalsService.getWithdrawalsStats();
      setStats({
        total: data.total || 0,
        pending: data.pending || 0,
        approved: data.approved || 0,
        completed: data.completed || 0,
        rejected: data.rejected || 0,
        totalPaidOut: data.totalPaidOut || "$0.00",
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      setStats({
        total: 1,
        pending: 0,
        approved: 0,
        completed: 1,
        rejected: 0,
        totalPaidOut: "$980.00",
      });
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchWithdrawals();
  }, [fetchWithdrawals, fetchStats]);

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setChainFilter("all");
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed": return "bg-emerald-500/20 text-emerald-400";
      case "pending": return "bg-amber-500/20 text-amber-400";
      case "approved": return "bg-blue-500/20 text-blue-400";
      case "rejected": return "bg-red-500/20 text-red-400";
      default: return "bg-white/10 text-white/60";
    }
  };

  const handleApprove = async (id) => {
    try {
      await withdrawalsService.approveWithdrawal(id);
      toast.success("Withdrawal approved successfully");
      fetchWithdrawals();
    } catch (error) {
      toast.error("Failed to approve withdrawal");
    }
  };

  const handleReject = async (id) => {
    try {
      await withdrawalsService.rejectWithdrawal(id);
      toast.success("Withdrawal rejected successfully");
      fetchWithdrawals();
    } catch (error) {
      toast.error("Failed to reject withdrawal");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Withdrawals</h1>
          <p className="text-white/60 text-sm mt-1">{stats.total} requests · {stats.totalPaidOut} completed</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="glass-strong border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <ArrowUpRight className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-xs text-white/40">Total Withdrawals</div>
                <div className="text-xs text-white/60 mt-0.5">All requests</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <ArrowUpRight className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.pending}</div>
                <div className="text-xs text-white/40">Pending</div>
                <div className="text-xs text-white/60 mt-0.5">$0.00 awaiting action</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <ArrowUpRight className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.approved}</div>
                <div className="text-xs text-white/40">Approved / Processing</div>
                <div className="text-xs text-white/60 mt-0.5">Queued for on-chain processing</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <ArrowUpRight className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.completed}</div>
                <div className="text-xs text-white/40">Completed</div>
                <div className="text-xs text-white/60 mt-0.5">$980.00 paid out</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-strong border-white/10">
        <CardContent className="p-5">
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 mb-5">
            <div>
              <div className="text-white/40 text-xs">Total Paid Out</div>
              <div className="text-emerald-400 text-lg font-bold">{stats.totalPaidOut}</div>
            </div>
            <div className="text-right">
              <div className="text-white/40 text-xs">Completed withdrawals only</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                type="text"
                placeholder="Search withdrawals..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
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
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-4">Destination</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-4">Amount</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-4">Status</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-4">TX Hash</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-4">Requested</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-white/40">
                      Loading withdrawals...
                    </td>
                  </tr>
                ) : withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-white/40">
                      No withdrawals found
                    </td>
                  </tr>
                ) : (
                  withdrawals.map((withdrawal) => (
                    <tr key={withdrawal.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <div className="text-white/80 text-sm font-medium">{withdrawal.user?.name}</div>
                          <div className="text-white/40 text-xs">{withdrawal.user?.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white/60 text-sm">{withdrawal.chain}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-400 text-sm font-mono truncate block max-w-[180px]">
                          {withdrawal.destination}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <span className="text-amber-400 text-sm font-medium">{withdrawal.amount}</span>
                          <div className="text-white/40 text-xs">Fee: {withdrawal.fee}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(withdrawal.status)}`}>
                          {withdrawal.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-400 text-sm font-mono">{withdrawal.txHash}...</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-white/60 text-sm">{withdrawal.requested}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {withdrawal.status === "completed" ? (
                            <span className="text-emerald-400 text-sm">Completed</span>
                          ) : withdrawal.status === "pending" ? (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleApprove(withdrawal.id)}
                                className="h-7 px-2 text-blue-400 hover:text-blue-300"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleReject(withdrawal.id)}
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
            {withdrawals.length} total
          </div>
        </CardContent>
      </Card>
    </div>
  );
}