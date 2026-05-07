import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  DollarSign,
  CreditCard,
  Shield,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Wallet,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Store,
} from "lucide-react";

// Mock data - will be replaced with API calls
const initialMockStats = {
  totalUsers: 11,
  kycPending: 0,
  merchants: 2,
  totalDeposited: 63414.01,
  depositsPending: 0,
  withdrawalsPending: 1,
  totalCards: 14,
  commissionEarned: 345.21
};

const initialMockKycStatus = [
  { label: "Approved", value: 8, color: "emerald" },
  { label: "Pending", value: 0, color: "amber" },
  { label: "In Review", value: 0, color: "blue" },
  { label: "Rejected", value: 1, color: "red" },
  { label: "Not Submitted", value: 2, color: "white" },
  { label: "Total Users", value: 11, color: "white" },
  { label: "Blocked", value: 0, color: "amber" },
  { label: "Active Merchants", value: 2, color: "emerald" }
];

const initialMockCardStatus = [
  { label: "Active", value: 7, color: "emerald" },
  { label: "Frozen", value: 2, color: "amber" },
  { label: "Cancelled", value: 4, color: "red" },
  { label: "Pending/Other", value: 1, color: "blue" },
  { label: "Virtual", value: 10, color: "white" },
  { label: "Physical", value: 4, color: "white" },
  { label: "Total Balance on Cards", value: 251.97, color: "white" }
];

const initialMockRecentTransactions = [
  { id: 1, type: "CARD ISSUANCE", user: "amladevi8765@gmail.com", amount: 200, date: "13 hours ago", status: "Refunded" },
  { id: 2, type: "CARD ISSUANCE", user: "amladevi8765@gmail.com", amount: 200, date: "13 hours ago", status: "Reversed" },
  { id: 3, type: "CARD ISSUANCE", user: "amladevi8765@gmail.com", amount: 200, date: "13 hours ago", status: "Refunded" },
  { id: 4, type: "CARD ISSUANCE", user: "amladevi8765@gmail.com", amount: 200, date: "13 hours ago", status: "Reversed" },
  { id: 5, type: "CARD ISSUANCE", user: "amladevi8765@gmail.com", amount: 1, date: "14 hours ago", status: "Completed" },
  { id: 6, type: "DEPOSIT", user: "amladevi8765@gmail.com", amount: 982.5, date: "16 hours ago", status: "Completed" }
];

const initialMockRecentCards = [
  { id: 1, number: null, holder: "sumit kethwas", email: "amladevi8765@gmail.com", type: "Virtual", status: "Active", balance: 1, issued: "06 May 2026" },
  { id: 2, number: "1198", holder: "dipesh dipesh", email: "n9867693837@icloud.com", type: "Physical", status: "Active", balance: 144, issued: "06 May 2026" },
  { id: 3, number: "1727", holder: "Aditya Kumar", email: "dxbaditya19@gmail.com", type: "Physical", status: "Active", balance: 0, issued: "14 Apr 2026" },
  { id: 4, number: "2667", holder: "Nitesh Shetty", email: "Niteshshetty25@gmail.com", type: "Physical", status: "Pending", balance: 0, issued: "14 Apr 2026" },
  { id: 5, number: null, holder: "Shubahm Tripathi", email: "shubham@recorporate.net", type: "Virtual", status: "Active", balance: 18.79, issued: "10 Apr 2026" }
];

// API service - replace with actual backend
const dashboardService = {
  getDashboardStats: async () => {
    return new Promise(resolve => {
      setTimeout(() => resolve(initialMockStats), 300);
    });
  },

  getKycStatus: async () => {
    return new Promise(resolve => {
      setTimeout(() => resolve(initialMockKycStatus), 300);
    });
  },

  getCardStatus: async () => {
    return new Promise(resolve => {
      setTimeout(() => resolve(initialMockCardStatus), 300);
    });
  },

  getRecentTransactions: async () => {
    return new Promise(resolve => {
      setTimeout(() => resolve(initialMockRecentTransactions), 300);
    });
  },

  getRecentCards: async () => {
    return new Promise(resolve => {
      setTimeout(() => resolve(initialMockRecentCards), 300);
    });
  }
};

export default function AdminPanelPage() {
  const [stats, setStats] = useState(null);
  const [kycStatus, setKycStatus] = useState([]);
  const [cardStatus, setCardStatus] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recentCards, setRecentCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, kycData, cardData, transData, cardsData] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getKycStatus(),
        dashboardService.getCardStatus(),
        dashboardService.getRecentTransactions(),
        dashboardService.getRecentCards()
      ]);
      
      setStats(statsData);
      setKycStatus(kycData);
      setCardStatus(cardData);
      setRecentTransactions(transData);
      setRecentCards(cardsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <div className="text-white/60">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-white/60 text-sm mt-1">Users & Platform</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass px-4 py-2 rounded-xl flex items-center gap-2">
            <Calendar className="h-4 w-4 text-emerald-400" />
            <span className="text-sm text-white/80">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
            </span>
          </div>
          {lastUpdated && (
            <span className="text-xs text-white/40">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-strong border-white/10">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
            <CardTitle className="text-sm font-medium text-white/60">Total Users</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Users className="h-4 w-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-bold text-white">{stats.totalUsers}</div>
            <div className="text-xs text-white/60 mt-1">0 joined today · 0 blocked</div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
            <CardTitle className="text-sm font-medium text-white/60">KYC Pending</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Shield className="h-4 w-4 text-amber-400" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-bold text-white">{stats.kycPending}</div>
            <div className="text-xs text-white/60 mt-1">0 in review · 8 approved</div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
            <CardTitle className="text-sm font-medium text-white/60">Merchants</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <BarChart2 className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-bold text-white">{stats.merchants}</div>
            <div className="text-xs text-white/60 mt-1">2 active · 2 whitelabel</div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10">
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
            <CardTitle className="text-sm font-medium text-white/60">Total Deposited</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl font-bold text-white">{formatCurrency(stats.totalDeposited)}</div>
            <div className="text-xs text-white/60 mt-1">USDT lifetime · 16 transactions</div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-strong border-white/10">
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-white text-sm font-medium">Users & KYC Status</CardTitle>
            <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300">View all →</a>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-4 gap-4">
              {kycStatus.map((item, i) => (
                <div key={i} className="text-center">
                  <div className={`text-lg font-bold text-${item.color === 'white' ? 'white' : item.color + '-400'}`}>{item.value}</div>
                  <div className="text-xs text-white/40">{item.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10">
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-white text-sm font-medium">Card Status & Type</CardTitle>
            <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300">View all →</a>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-4 gap-4">
              {cardStatus.map((item, i) => (
                <div key={i} className="text-center">
                  <div className={`text-lg font-bold text-${item.color === 'white' ? 'white' : item.color + '-400'}`}>{item.value}</div>
                  <div className="text-xs text-white/40">{item.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <Card className="glass-strong border-white/10">
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <CardTitle className="text-white text-sm font-medium">Financial Summary</CardTitle>
          <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300">Deposits →</a>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="text-xs text-white/40">Completed Deposits</div>
              <div className="text-sm"><span className="text-emerald-400">16</span> / <span className="text-amber-400">0</span> / <span className="text-red-400">0</span></div>
              <div className="text-white font-medium">{formatCurrency(stats.totalDeposited)}</div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-white/40">Manual Deposits</div>
              <div className="text-white font-medium">$62,078.00 <span className="text-white/40">(12)</span></div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-white/40">Auto / Crypto</div>
              <div className="text-white font-medium">$1,336.01 <span className="text-white/40">(4)</span></div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-white/40">Card Issuance Fees</div>
              <div className="text-white font-medium">$226.75</div>
              <div className="text-xs text-white/40">Commission Earned <span className="text-emerald-400">$345.21</span></div>
              <div className="text-xs text-white/40">Deposit Commission <span className="text-emerald-400">$23.80</span></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-strong border-white/10">
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-white text-sm font-medium">Recent Transactions</CardTitle>
            <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300">View all →</a>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-xs text-white/40 font-medium uppercase py-2">Type</th>
                    <th className="text-left text-xs text-white/40 font-medium uppercase py-2">Amount</th>
                    <th className="text-left text-xs text-white/40 font-medium uppercase py-2">User</th>
                    <th className="text-left text-xs text-white/40 font-medium uppercase py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-2"><span className="text-white/80 text-sm">{tx.type}</span></td>
                      <td className="py-2"><span className="text-white/80 text-sm">{formatCurrency(tx.amount)}</span></td>
                      <td className="py-2"><span className="text-white/60 text-sm">{tx.user}</span></td>
                      <td className="py-2"><span className="text-xs text-emerald-400">{tx.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10">
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle className="text-white text-sm font-medium">Active Merchants</CardTitle>
            <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300">Manage →</a>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">Sheno Pay</div>
                    <div className="text-white/40 text-xs">admin@shenopay.com · Whitelabel</div>
                  </div>
                  <span className="text-xs text-emerald-400">Active</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">ZentoraCapital</div>
                    <div className="text-white/40 text-xs">admin@zentoracapital.com · Whitelabel</div>
                  </div>
                  <span className="text-xs text-emerald-400">Active</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recently Issued Cards */}
      <Card className="glass-strong border-white/10">
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <CardTitle className="text-white text-sm font-medium">Recently Issued Cards</CardTitle>
          <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300">View all cards →</a>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-2">Card Number</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-2">Cardholder</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-2">Type</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-2">Status</th>
                  <th className="text-left text-xs text-white/40 font-medium uppercase py-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                {recentCards.map((card) => (
                  <tr key={card.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-2"><span className="text-white/80 text-sm">{card.number ? `**** **** **** ${card.number}` : "—"}</span></td>
                    <td className="py-2">
                      <div>
                        <div className="text-white/80 text-sm">{card.holder}</div>
                        <div className="text-white/40 text-xs">{card.email}</div>
                      </div>
                    </td>
                    <td className="py-2"><span className="text-white/60 text-sm">{card.type}</span></td>
                    <td className="py-2"><span className={`text-xs ${card.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'}`}>{card.status}</span></td>
                    <td className="py-2"><span className="text-white/80 text-sm">{formatCurrency(card.balance)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="glass-strong border-white/10">
        <CardHeader className="p-4">
          <CardTitle className="text-white text-sm font-medium">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-white/40 text-xs">Auto Deposits (last 24h)</div>
              <div className="text-white font-medium">1</div>
            </div>
            <div>
              <div className="text-white/40 text-xs">Total Card Balance</div>
              <div className="text-white font-medium">{formatCurrency(251.97)}</div>
            </div>
            <div>
              <div className="text-white/40 text-xs">Card Issuance (total fees)</div>
              <div className="text-white font-medium">$226.75</div>
            </div>
            <div>
              <div className="text-white/40 text-xs">Whitelabel Merchants</div>
              <div className="text-white font-medium">{stats.merchants}</div>
            </div>
            <div className="col-span-2">
              <div className="text-white/40 text-xs">Physical Card Pool</div>
              <div className="text-white font-medium">83 total · 79 avail.</div>
            </div>
            <div>
              <div className="text-white/40 text-xs">KYC Approval Rate</div>
              <div className="text-white font-medium">73%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}