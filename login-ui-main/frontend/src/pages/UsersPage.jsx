import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Users, Shield, BarChart2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// User data structure - will come from API
const initialMockUsers = [
  { id: 1, name: "sumit kethwas", email: "amladevi8765@gmail.com", country: "IN", merchant: "Sheno Pay", registered: "05 May 2026", time: "06:40 PM", kyc: "Approved", status: "Active", twofa: "On", balance: 981.50, chains: null, autoDeposits: 0 },
  { id: 2, name: "dipesh dipesh", email: "n9867693837@icloud.com", country: "IN", merchant: "Sheno Pay", registered: "03 May 2026", time: "07:15 PM", kyc: "Approved", status: "Active", twofa: "On", balance: 0, chains: null, autoDeposits: 0 },
  { id: 3, name: "Shubham Tripathi", email: "info@netpay247.com", country: "AE", merchant: "Sheno Pay", registered: "03 May 2026", time: "06:56 PM", kyc: "Not Submitted", status: "Active", twofa: "Off", balance: 0, chains: null, autoDeposits: 0 },
  { id: 4, name: "Muhammad Jafar", email: "jafar_acca@yahoo.com", country: "PK", merchant: null, registered: "17 Apr 2026", time: "09:13 AM", kyc: "Not Submitted", status: "Active", twofa: "On", balance: 0, chains: null, autoDeposits: 0 },
  { id: 5, name: "Ravi Mahaseth", email: "rmpravi1@gmail.com", country: "AE", merchant: null, registered: "07 Apr 2026", time: "03:59 PM", kyc: "Rejected", status: "Active", twofa: "On", balance: 1, chains: null, autoDeposits: 0 },
  { id: 6, name: "Nitesh Shetty", email: "Niteshshetty25@gmail.com", country: "AE", merchant: "ZentoraCapital", registered: "07 Apr 2026", time: "03:58 PM", kyc: "Approved", status: "Active", twofa: "On", balance: 2, chains: null, autoDeposits: 0 },
  { id: 7, name: "Aditya Kumar", email: "dxbaditya19@gmail.com", country: "AE", merchant: "ZentoraCapital", registered: "07 Apr 2026", time: "03:57 PM", kyc: "Approved", status: "Active", twofa: "On", balance: 2, chains: null, autoDeposits: 0 },
  { id: 8, name: "Kavita Kavita", email: "kavitachilana@gmail.com", country: "IN", merchant: null, registered: "02 Apr 2026", time: "11:22 AM", kyc: "Approved", status: "Active", twofa: "On", balance: 12, chains: null, autoDeposits: 0 },
  { id: 9, name: "Shubahm Tripathi", email: "shubham@recorporate.net", country: "AE", merchant: null, registered: "30 Mar 2026", time: "01:57 PM", kyc: "Approved", status: "Active", twofa: "On", balance: 60046.22, chains: null, autoDeposits: 0 },
  { id: 10, name: "Nishant Kumar", email: "n4nishant@gmail.com", country: "IN", merchant: null, registered: "30 Mar 2026", time: "01:54 PM", kyc: "Approved", status: "Active", twofa: "On", balance: 986.01, chains: "—", autoDeposits: 0 },
  { id: 11, name: "Ajit Kumar", email: "ajjuk9311@gmail.com", country: "IN", merchant: null, registered: "30 Mar 2026", time: "12:04 PM", kyc: "Approved", status: "Active", twofa: "On", balance: 50, chains: null, autoDeposits: 0 }
];

// API service - replace with actual backend calls
const userService = {
  getUsers: async (params = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...initialMockUsers];
        
        if (params.search) {
          const term = params.search.toLowerCase();
          filtered = filtered.filter(u => 
            u.name.toLowerCase().includes(term) || 
            u.email.toLowerCase().includes(term)
          );
        }
        
        if (params.kyc && params.kyc !== "all") {
          filtered = filtered.filter(u => u.kyc === params.kyc);
        }
        
        if (params.status && params.status !== "all") {
          filtered = filtered.filter(u => u.status.toLowerCase() === params.status.toLowerCase());
        }
        
        if (params.merchant && params.merchant !== "all") {
          filtered = filtered.filter(u => u.merchant === params.merchant);
        }
        
        resolve({
          data: filtered,
          total: filtered.length,
          page: params.page || 1,
          limit: params.limit || 50
        });
      }, 300);
    });
  },

  loginAsUser: async (userId) => {
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 500));
  }
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [kycFilter, setKycFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [merchantFilter, setMerchantFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    blocked: 0,
    today: 0
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userService.getUsers({
        search: searchQuery,
        kyc: kycFilter,
        status: statusFilter,
        merchant: merchantFilter
      });
      
      setUsers(response.data);
      setFilteredUsers(response.data);
      
      const total = response.data.length;
      const active = response.data.filter(u => u.status === "Active").length;
      const blocked = response.data.filter(u => u.status === "Blocked").length;
      
      setStats({ total, active, blocked, today: 0 });
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, kycFilter, statusFilter, merchantFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, fetchUsers]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKycFilter = (value) => {
    setKycFilter(value);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
  };

  const handleMerchantFilter = (value) => {
    setMerchantFilter(value);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setKycFilter("all");
    setStatusFilter("all");
    setMerchantFilter("all");
  };

  const handleLoginAsUser = async (userId) => {
    try {
      await userService.loginAsUser(userId);
    } catch (error) {
      console.error("Error logging in as user:", error);
    }
  };

  const kycApproved = users.filter(u => u.kyc === "Approved").length;
  const kycPending = users.filter(u => u.kyc === "Pending" || u.kyc === "In Review").length;
  const kycRejected = users.filter(u => u.kyc === "Rejected").length;
  const kycNotSubmitted = users.filter(u => u.kyc === "Not Submitted").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Users</h1>
          <p className="text-white/60 text-sm mt-1">Manage registered users and merchants</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="glass-strong border-white/10">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-white/40">Total Users</div>
            <div className="text-xs text-white/60 mt-1">All registered accounts</div>
          </CardContent>
        </Card>
        <Card className="glass-strong border-white/10">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-emerald-400">{stats.active}</div>
            <div className="text-sm text-white/40">Active</div>
            <div className="text-xs text-white/60 mt-1">Not blocked</div>
          </CardContent>
        </Card>
        <Card className="glass-strong border-white/10">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-400">{stats.blocked}</div>
            <div className="text-sm text-white/40">Blocked</div>
            <div className="text-xs text-white/60 mt-1">Access restricted</div>
          </CardContent>
        </Card>
        <Card className="glass-strong border-white/10">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{stats.today}</div>
            <div className="text-sm text-white/40">Today</div>
            <div className="text-xs text-white/60 mt-1">New signups today</div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-strong border-white/10">
        <CardHeader className="p-4">
          <CardTitle className="text-white text-sm font-medium">KYC Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-lg font-bold text-emerald-400">{kycApproved}</div>
              <div className="text-xs text-white/40">KYC Approved</div>
              <div className="text-xs text-white/60">Fully verified users</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">{kycPending}</div>
              <div className="text-xs text-white/40">KYC Pending</div>
              <div className="text-xs text-white/60">Submitted, awaiting review</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">0</div>
              <div className="text-xs text-white/40">In Review</div>
              <div className="text-xs text-white/60">Under manual review</div>
            </div>
            <div>
              <div className="text-lg font-bold text-amber-400">{kycRejected + kycNotSubmitted}</div>
              <div className="text-xs text-white/40">KYC Rejected</div>
              <div className="text-xs text-white/60">{kycNotSubmitted} not submitted</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            type="text"
            placeholder="Search name or email..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
          />
        </div>
        <select 
          value={kycFilter} 
          onChange={(e) => handleKycFilter(e.target.value)}
          className="glass bg-white/5 border-white/10 text-white text-sm rounded-lg px-3 py-2"
        >
          <option value="all">All KYC</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="In Review">In Review</option>
          <option value="Rejected">Rejected</option>
          <option value="Not Submitted">Not Submitted</option>
        </select>
        <select 
          value={statusFilter} 
          onChange={(e) => handleStatusFilter(e.target.value)}
          className="glass bg-white/5 border-white/10 text-white text-sm rounded-lg px-3 py-2"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Blocked">Blocked</option>
        </select>
        <select 
          value={merchantFilter} 
          onChange={(e) => handleMerchantFilter(e.target.value)}
          className="glass bg-white/5 border-white/10 text-white text-sm rounded-lg px-3 py-2"
        >
          <option value="all">All Merchants</option>
          <option value="Sheno Pay">Sheno Pay</option>
          <option value="ZentoraCapital">ZentoraCapital</option>
        </select>
        <Button variant="ghost" onClick={resetFilters} className="text-white/60 hover:text-white">
          Reset
        </Button>
      </div>

      <Card className="glass-strong border-white/10">
        <CardContent className="p-0">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-white font-medium">{filteredUsers.length} users</h3>
          </div>
          {loading ? (
            <div className="p-8 text-center">
              <div className="text-white/60">Loading users...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">User</th>
                    <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Merchant</th>
                    <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Registered</th>
                    <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">KYC Status</th>
                    <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Account</th>
                    <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">2FA</th>
                    <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Wallet Balance</th>
                    <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Chains</th>
                    <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Auto Deposits</th>
                    <th className="text-left text-xs text-white/40 font-medium uppercase py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-2">
                        <div>
                          <div className="text-white/80 text-sm font-medium">{user.name}</div>
                          <div className="text-white/40 text-xs">{user.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-white/80 text-sm">{user.merchant || "—"}</span>
                      </td>
                      <td className="py-3 px-2">
                        <div>
                          <div className="text-white/80 text-sm">{user.registered}</div>
                          <div className="text-white/40 text-xs">{user.time}</div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.kyc === "Approved" ? "bg-emerald-500/20 text-emerald-400" :
                          user.kyc === "Rejected" ? "bg-red-500/20 text-red-400" :
                          "bg-amber-500/20 text-amber-400"
                        }`}>
                          {user.kyc}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-emerald-400 text-sm">{user.status}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-xs ${user.twofa === "On" ? "text-emerald-400" : "text-white/40"}`}>{user.twofa}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-white/80 text-sm">${user.balance.toLocaleString()}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-white/60 text-sm">{user.chains || "None"}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="text-white/60 text-sm">{user.autoDeposits}</span>
                      </td>
                      <td className="py-3 px-2">
                        <Button 
                          size="sm" 
                          className="h-7 px-2 text-xs glass hover:bg-white/10"
                          onClick={() => handleLoginAsUser(user.id)}
                        >
                          Login
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}