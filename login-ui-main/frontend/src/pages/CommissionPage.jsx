import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Download, RefreshCw, User, Coins, TrendingUp, CreditCard, Wallet } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 15;

const TRANSACTION_TYPES = {
  DEPOSIT: "Deposit",
  WITHDRAWAL: "Withdrawal",
  CARD_ISSUANCE: "Card Issuance",
  CARD_ISSUANCE_PHYSICAL: "Card Issuance Physical",
  CARD_ISSUANCE_VIRTUAL: "Card Issuance Virtual",
  CARD_TOPUP: "Card Topup",
};

const USERS = [
  { id: 17, name: "sumit kethwas" },
  { id: 16, name: "dipesh dipesh" },
  { id: 8, name: "Nishant Kumar" },
  { id: 9, name: "Shubahm Tripathi" },
  { id: 11, name: "Ajit Kumar" },
  { id: 10, name: "Nishant Kumar" },
  { id: 6, name: "Kavita Kavita" },
  { id: 5, name: "Ravi Mahaseth" },
  { id: 4, name: "Muhammad Jafar" },
];

// Generate realistic mock transaction data (83 entries)
const generateMockTransactions = () => {
  const transactions = [];
  const types = Object.values(TRANSACTION_TYPES);

  let counter = 83;
  const now = new Date();

  for (let i = 0; i < 83; i++) {
    const user = USERS[Math.floor(Math.random() * USERS.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    let grossAmount, commissionRate, commissionAmount, netAmount, transactionId;

    switch (type) {
      case TRANSACTION_TYPES.DEPOSIT:
        grossAmount = Math.floor(Math.random() * 5000) + 100;
        commissionRate = 0.0175;
        commissionAmount = grossAmount * commissionRate;
        netAmount = grossAmount - commissionAmount;
        transactionId = `AUTO-${Math.floor(Math.random() * 9999999999)}`;
        break;
      case TRANSACTION_TYPES.WITHDRAWAL:
        grossAmount = Math.floor(Math.random() * 3000) + 50;
        commissionRate = 0.02;
        commissionAmount = grossAmount * commissionRate;
        netAmount = grossAmount - commissionAmount;
        transactionId = `WDR${Math.floor(Math.random() * 99999999)}`;
        break;
      case TRANSACTION_TYPES.CARD_ISSUANCE_PHYSICAL:
        grossAmount = 100;
        commissionRate = 100; // flat
        commissionAmount = grossAmount;
        netAmount = 0;
        transactionId = `CARD-${Math.random().toString(36).substring(2, 15)}`.toUpperCase();
        break;
      case TRANSACTION_TYPES.CARD_ISSUANCE_VIRTUAL:
        grossAmount = 1;
        commissionRate = 0.001;
        commissionAmount = grossAmount * commissionRate;
        netAmount = grossAmount - commissionAmount;
        transactionId = `CARD-${Math.random().toString(36).substring(2, 15)}`.toUpperCase();
        break;
      case TRANSACTION_TYPES.CARD_TOPUP:
        grossAmount = Math.floor(Math.random() * 200) + 10;
        commissionRate = 0.015;
        commissionAmount = grossAmount * commissionRate;
        netAmount = grossAmount - commissionAmount;
        transactionId = `TOPUP-${Math.random().toString(36).substring(2, 15)}`.toUpperCase();
        break;
      default:
        grossAmount = 0;
        commissionRate = 0;
        commissionAmount = 0;
        netAmount = 0;
        transactionId = `UNK-${counter}`;
    }

    const date = new Date(now);
    date.setMinutes(date.getMinutes() - i * 30);

    transactions.push({
      id: counter,
      transactionId,
      user: user.name,
      userId: user.id,
      type,
      grossAmount,
      commission: commissionAmount,
      netAmount,
      rate: commissionRate === 100 ? "$100.00 flat" : `${(commissionRate * 100).toFixed(2)}%`,
      date: date.toISOString(),
      createdAt: date,
    });

    counter--;
  }

  return transactions;
};

const CommissionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [userIdFilter, setUserIdFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState({
    totalEarned: 0,
    depositCommissions: 0,
    withdrawalCommissions: 0,
    cardIssuanceFees: 0,
  });

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockData = generateMockTransactions();
      setTransactions(mockData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    const total = transactions.reduce((sum, t) => sum + t.commission, 0);
    const deposit = transactions
      .filter((t) => t.type === TRANSACTION_TYPES.DEPOSIT)
      .reduce((sum, t) => sum + t.commission, 0);
    const withdrawal = transactions
      .filter((t) => t.type === TRANSACTION_TYPES.WITHDRAWAL)
      .reduce((sum, t) => sum + t.commission, 0);
    const cardIssuance = transactions
      .filter((t) =>
        [TRANSACTION_TYPES.CARD_ISSUANCE, TRANSACTION_TYPES.CARD_ISSUANCE_PHYSICAL, TRANSACTION_TYPES.CARD_ISSUANCE_VIRTUAL].includes(t.type)
      )
      .reduce((sum, t) => sum + t.commission, 0);

    setStats({
      totalEarned: total,
      depositCommissions: deposit,
      withdrawalCommissions: withdrawal,
      cardIssuanceFees: cardIssuance,
    });
  }, [transactions]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...transactions];

    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.user?.toLowerCase().includes(term) ||
          t.transactionId?.toLowerCase().includes(term) ||
          t.type?.toLowerCase().includes(term) ||
          t.userId?.toString().includes(term)
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((t) => t.type === typeFilter);
    }

    if (userIdFilter) {
      const userId = parseInt(userIdFilter, 10);
      if (!isNaN(userId)) {
        filtered = filtered.filter((t) => t.userId === userId);
      }
    }

    // Sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "date") {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }

        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();

        if (aValue < bValue) return sortConfig.direction === "desc" ? 1 : -1;
        if (aValue > bValue) return sortConfig.direction === "desc" ? -1 : 1;
        return 0;
      });
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [transactions, searchQuery, typeFilter, userIdFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedData = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setUserIdFilter("");
    setSortConfig({ key: null, direction: "desc" });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDateTime = (dateStr) => {
    try {
      return format(new Date(dateStr), "MMM dd, yyyy HH:mm");
    } catch {
      return dateStr;
    }
  };

  // Get user ID from transaction
  const getUserId = (transaction) => {
    return transaction.userId || "—";
  };

  // Export to CSV
  const handleExport = () => {
    const csvData = [
      [
        "#",
        "Transaction ID",
        "User",
        "User ID",
        "Type",
        "Gross Amount",
        "Commission",
        "Net Amount",
        "Rate",
        "Date",
      ],
      ...filteredTransactions.map((t) => [
        t.id,
        t.transactionId,
        t.user,
        t.userId,
        t.type,
        formatCurrency(t.grossAmount),
        formatCurrency(t.commission),
        formatCurrency(t.netAmount),
        t.rate,
        formatDateTime(t.date),
      ]),
    ];

    const csv = csvData
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob(["\ufeff" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `commission-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Get transaction type color
  const getTypeColor = (type) => {
    switch (type) {
      case TRANSACTION_TYPES.DEPOSIT:
        return "bg-emerald-500/20 text-emerald-400";
      case TRANSACTION_TYPES.WITHDRAWAL:
        return "bg-red-500/20 text-red-400";
      case TRANSACTION_TYPES.CARD_ISSUANCE_PHYSICAL:
      case TRANSACTION_TYPES.CARD_ISSUANCE_VIRTUAL:
        return "bg-blue-500/20 text-blue-400";
      case TRANSACTION_TYPES.CARD_TOPUP:
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-white/10 text-white/60";
    }
  };

  // Unique types for filter
  const uniqueTypes = useMemo(() => {
    const types = [...new Set(transactions.map((t) => t.type))];
    return types.sort();
  }, [transactions]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Commission</h1>
          <p className="text-white/60 text-sm mt-1">Track commissions from deposits, withdrawals, and card fees</p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="glass hover:bg-white/10 transition-colors"
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-strong border-white/10 hover:border-white/20 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Coins className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  ${stats.totalEarned.toFixed(2)}USDT
                </div>
                <div className="text-sm text-white/40 mt-1">Total Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10 hover:border-white/20 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-400">
                  ${stats.depositCommissions.toFixed(2)}USDT
                </div>
                <div className="text-sm text-white/40 mt-1">Deposit Commissions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10 hover:border-white/20 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">
                  ${stats.withdrawalCommissions.toFixed(2)}USDT
                </div>
                <div className="text-sm text-white/40 mt-1">Withdrawal Commissions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10 hover:border-white/20 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  ${stats.cardIssuanceFees.toFixed(2)}USDT
                </div>
                <div className="text-sm text-white/40 mt-1">Card Issuance Fees</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-strong border-white/10">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  type="text"
                  placeholder="Search by Transaction ID, User, or Type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10">
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Filter by User ID"
                value={userIdFilter}
                onChange={(e) => setUserIdFilter(e.target.value)}
                className="w-[160px] bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />

              <Button
                variant="ghost"
                onClick={handleResetFilters}
                className="text-white/60 hover:text-white border border-white/10"
              >
                Clear
              </Button>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={handleExport}
                      className="text-white/60 hover:text-white border border-white/10"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#1a1a1a] border-white/10">
                    <p>Export to CSV</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="text-sm text-white/60">
              {filteredTransactions.length} records found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="glass-strong border-white/10">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="h-8 w-8 text-white/40 animate-spin" />
                <span className="text-white/40">Loading transactions...</span>
              </div>
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/40">No transactions found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-white/10 hover:bg-transparent">
                      <TableHead
                        className="text-xs text-white/40 font-medium uppercase py-3 px-2 cursor-pointer"
                        onClick={() => handleSort("id")}
                      >
                        <div className="flex items-center gap-1">
                          #
                          {sortConfig.key === "id" &&
                            (sortConfig.direction === "desc" ? "↓" : "↑")}
                        </div>
                      </TableHead>
                      <TableHead
                        className="text-xs text-white/40 font-medium uppercase py-3 px-2 cursor-pointer"
                        onClick={() => handleSort("transactionId")}
                      >
                        <div className="flex items-center gap-1">
                          Transaction ID
                          {sortConfig.key === "transactionId" &&
                            (sortConfig.direction === "desc" ? "↓" : "↑")}
                        </div>
                      </TableHead>
                      <TableHead
                        className="text-xs text-white/40 font-medium uppercase py-3 px-2 cursor-pointer"
                        onClick={() => handleSort("user")}
                      >
                        <div className="flex items-center gap-1">
                          User
                          {sortConfig.key === "user" &&
                            (sortConfig.direction === "desc" ? "↓" : "↑")}
                        </div>
                      </TableHead>
                      <TableHead
                        className="text-xs text-white/40 font-medium uppercase py-3 px-2 cursor-pointer"
                        onClick={() => handleSort("type")}
                      >
                        <div className="flex items-center gap-1">
                          Type
                          {sortConfig.key === "type" &&
                            (sortConfig.direction === "desc" ? "↓" : "↑")}
                        </div>
                      </TableHead>
                      <TableHead
                        className="text-xs text-white/40 font-medium uppercase py-3 px-2 text-right cursor-pointer"
                        onClick={() => handleSort("grossAmount")}
                      >
                        <div className="flex items-center justify-end gap-1">
                          Gross Amount
                          {sortConfig.key === "grossAmount" &&
                            (sortConfig.direction === "desc" ? "↓" : "↑")}
                        </div>
                      </TableHead>
                      <TableHead
                        className="text-xs text-white/40 font-medium uppercase py-3 px-2 text-right cursor-pointer"
                        onClick={() => handleSort("commission")}
                      >
                        <div className="flex items-center justify-end gap-1">
                          Commission
                          {sortConfig.key === "commission" &&
                            (sortConfig.direction === "desc" ? "↓" : "↑")}
                        </div>
                      </TableHead>
                      <TableHead
                        className="text-xs text-white/40 font-medium uppercase py-3 px-2 text-right cursor-pointer"
                        onClick={() => handleSort("netAmount")}
                      >
                        <div className="flex items-center justify-end gap-1">
                          Net Amount
                          {sortConfig.key === "netAmount" &&
                            (sortConfig.direction === "desc" ? "↓" : "↑")}
                        </div>
                      </TableHead>
                      <TableHead className="text-xs text-white/40 font-medium uppercase py-3 px-2">
                        Rate
                      </TableHead>
                      <TableHead
                        className="text-xs text-white/40 font-medium uppercase py-3 px-2 cursor-pointer"
                        onClick={() => handleSort("date")}
                      >
                        <div className="flex items-center gap-1">
                          Date
                          {sortConfig.key === "date" &&
                            (sortConfig.direction === "desc" ? "↓" : "↑")}
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <TableCell className="py-3 px-2">
                          <span className="text-white/60 text-sm">{transaction.id}</span>
                        </TableCell>
                        <TableCell className="py-3 px-2">
                          <span className="text-emerald-400 font-mono text-sm">
                            {transaction.transactionId}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-2">
                          <div>
                            <div className="text-white/80 text-sm font-medium">
                              {transaction.user}
                            </div>
                            <div className="text-white/40 text-xs">
                              ID: {transaction.userId}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-2">
                          <Badge className={cn("text-xs", getTypeColor(transaction.type))}>
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 px-2 text-right">
                          <span className="text-white/80 text-sm font-mono">
                            {formatCurrency(transaction.grossAmount)}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-2 text-right">
                          <span className="text-emerald-400 text-sm font-mono">
                            {formatCurrency(transaction.commission)}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-2 text-right">
                          <span className="text-white/60 text-sm font-mono">
                            {formatCurrency(transaction.netAmount)}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-2">
                          <span className="text-white/60 text-sm">{transaction.rate}</span>
                        </TableCell>
                        <TableCell className="py-3 px-2">
                          <span className="text-white/40 text-xs">
                            {formatDateTime(transaction.date)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {!loading && filteredTransactions.length > 0 && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 p-4 border-t border-white/10">
                  <Button
                    size="sm"
                    variant={currentPage === 1 ? "ghost" : "default"}
                    className={`h-8 px-3 ${currentPage === 1 ? "text-white/40" : ""}`}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={pageNum}
                          size="sm"
                          variant={currentPage === pageNum ? "default" : "ghost"}
                          className={`h-8 w-8 px-0 ${
                            currentPage === pageNum ? "" : "text-white/60 hover:text-white"
                          }`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                    if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                      return <span key={pageNum} className="text-white/40 px-2">...</span>;
                    }
                    return null;
                  })}
                  <Button
                    size="sm"
                    variant={currentPage === totalPages ? "ghost" : "default"}
                    className={`h-8 px-3 ${currentPage === totalPages ? "text-white/40" : ""}`}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommissionPage;
