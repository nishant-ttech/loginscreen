import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, CreditCard, Filter, Download, RefreshCw, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import cardholdersService from "@/services/cardholdersService";

const ITEMS_PER_PAGE = 10;

const CardsPage = () => {
  // State management
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalCards: 0,
    active: 0,
    frozen: 0,
    cancelled: 0,
    virtualCards: 0,
    physicalCards: 0,
    totalBalance: 0,
  });

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Wasabi lookup state
  const [wasabiEmail, setWasabiEmail] = useState("");
  const [wasabiLoading, setWasabiLoading] = useState(false);
  const [wasabiResults, setWasabiResults] = useState([]);

  // Fetch card data from backend
  const fetchCardData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch cardholders data which includes card information
      const cardholdersData = await cardholdersService.getCardholders();
      const cardholders = cardholdersData.data || cardholdersData || [];

      // Transform cardholder data into cards format
      const transformedCards = cardholders.map((ch, index) => ({
        id: ch.id || index,
        cardNo: ch.holderId || `WC${Date.now()}${index}`,
        wasabiId: ch.holderId || "—",
        holder: ch.name || "Unknown",
        email: ch.email || "—",
        type: ch.holderType?.toLowerCase() === "virtual" ? "Virtual" : "Physical",
        status: ch.status || "Active",
        balance: ch.balance || 0,
        expires: ch.expiry || "—",
        created: ch.created || "—",
        last4: ch.cardLast4 || Math.floor(1000 + Math.random() * 9000).toString(),
        brand: ch.cardType || "VISA",
      }));

      setCards(transformedCards);
      setFilteredCards(transformedCards);

      // Calculate stats
      const active = transformedCards.filter((c) => c.status === "Active").length;
      const frozen = transformedCards.filter((c) => c.status === "Frozen").length;
      const cancelled = transformedCards.filter((c) => c.status === "Cancelled").length;
      const virtual = transformedCards.filter((c) => c.type === "Virtual").length;
      const physical = transformedCards.filter((c) => c.type === "Physical").length;
      const totalBalance = transformedCards.reduce((sum, c) => sum + (c.balance || 0), 0);

      setStats({
        totalCards: transformedCards.length,
        active,
        frozen,
        cancelled,
        virtualCards: virtual,
        physicalCards: physical,
        totalBalance,
      });
    } catch (error) {
      console.error("Error fetching card data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCardData();
    setRefreshing(false);
  }, [fetchCardData]);

  useEffect(() => {
    fetchCardData();
  }, [fetchCardData]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...cards];

    // Search by card number or email
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      filtered = filtered.filter((c) =>
        c.cardNo?.toLowerCase().includes(term) ||
        c.wasabiId?.toString().toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.holder?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.status?.toLowerCase() === statusFilter.toLowerCase());
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((c) => c.type?.toLowerCase() === typeFilter.toLowerCase());
    }

    // Sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredCards(filtered);
    setCurrentPage(1);
  }, [cards, searchQuery, statusFilter, typeFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredCards.length / ITEMS_PER_PAGE);
  const paginatedData = filteredCards.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Sort handler
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setTypeFilter("all");
    setSortConfig({ key: null, direction: "asc" });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "frozen":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "pending":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default:
        return "bg-white/10 text-white/60 border-white/10";
    }
  };

  // Get type color
  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "virtual":
        return "bg-blue-500/20 text-blue-400";
      case "physical":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-white/10 text-white/40";
    }
  };

  // Wasabi card lookup
  const handleWasabiLookup = async () => {
    if (!wasabiEmail) return;
    setWasabiLoading(true);
    try {
      // Simulate API call to fetch cards from Wasabi
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const mockWasabiCards = [
        {
          id: `wasabi-${Date.now()}`,
          cardNo: `WC${Date.now()}`.slice(0, 20),
          wasabiId: Math.floor(100000 + Math.random() * 900000),
          holder: wasabiEmail.split("@")[0],
          email: wasabiEmail,
          type: Math.random() > 0.5 ? "Virtual" : "Physical",
          status: "Pending",
          balance: 0,
          expires: "12/29",
          created: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
          last4: Math.floor(1000 + Math.random() * 9000).toString(),
          brand: "VISA",
        },
      ];
      setWasabiResults(mockWasabiCards);
    } catch (error) {
      console.error("Wasabi lookup error:", error);
    } finally {
      setWasabiLoading(false);
    }
  };

  const handleMapCard = async (card) => {
    try {
      // Simulate mapping card to backend
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newCard = { ...card, status: "Active", id: Date.now() };
      setCards((prev) => [newCard, ...prev]);
      setFilteredCards((prev) => [newCard, ...prev]);
      setWasabiResults([]);
      setWasabiEmail("");
    } catch (error) {
      console.error("Map card error:", error);
    }
  };

  // Export data
  const handleExport = () => {
    const csvData = [
      ["Card Number", "Holder", "Type", "Status", "Balance", "Wasabi Holder ID", "Expires", "Created", "Email"],
      ...filteredCards.map((c) => [
        c.cardNo,
        c.holder,
        c.type,
        c.status,
        c.balance,
        c.wasabiId,
        c.expires,
        c.created,
        c.email,
      ]),
    ];

    const csv = csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cards-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Status Overview</h1>
          <p className="text-white/60 text-sm mt-1">Total issued cards and their status breakdown</p>
        </div>
        <Button className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
          <CreditCard className="h-4 w-4 mr-2" />
          Issue New Card
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="glass-strong border-white/10 hover:border-white/20 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalCards}</div>
                <div className="text-sm text-white/40 mt-1">Total Cards</div>
                <div className="text-xs text-white/60 mt-1">All issued cards</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10 hover:border-white/20 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-emerald-400">{stats.active}</div>
                <div className="text-sm text-white/40 mt-1">Active</div>
                <div className="text-xs text-white/60 mt-1">Currently active</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-500/20/30 flex items-center justify-center">
                <div className="h-5 w-5 rounded-full border-2 border-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10 hover:border-white/20 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-400">{stats.frozen}</div>
                <div className="text-sm text-white/40 mt-1">Frozen</div>
                <div className="text-xs text-white/60 mt-1">Temporarily frozen</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10 hover:border-white/20 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-400">{stats.cancelled}</div>
                <div className="text-sm text-white/40 mt-1">Cancelled</div>
                <div className="text-xs text-white/60 mt-1">1 other status</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* By Type & Balance */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="glass-strong border-white/10 hover:border-white/20 transition-colors">
          <CardContent className="p-5">
            <div className="text-2xl font-bold text-blue-400">{stats.virtualCards}</div>
            <div className="text-sm text-white/40 mt-1">Virtual Cards</div>
            <div className="text-xs text-white/60 mt-1">Issued as virtual</div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10 hover:border-white/20 transition-colors">
          <CardContent className="p-5">
            <div className="text-2xl font-bold text-purple-400">{stats.physicalCards}</div>
            <div className="text-sm text-white/40 mt-1">Physical Cards</div>
            <div className="text-xs text-white/60 mt-1">Issued as physical</div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10 hover:border-white/20 transition-colors sm:col-span-2">
          <CardContent className="p-5">
            <div className="text-2xl font-bold text-emerald-400">${stats.totalBalance.toFixed(2)}</div>
            <div className="text-sm text-white/40 mt-1">Total Balance</div>
            <div className="text-xs text-white/60 mt-1">Across all active cards</div>
          </CardContent>
        </Card>
      </div>

      {/* Wasabi Live Card Lookup */}
      <Card className="glass-strong border-white/10">
        <CardContent className="p-5">
          <h3 className="text-white font-medium mb-3">Wasabi Live Card Lookup</h3>
          <p className="text-white/40 text-sm mb-4">
            Search by user email — fetches all cards from Wasabi API (including pending activation). Cards missing from the backend can be mapped with one click.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Input
                type="email"
                placeholder="User Email"
                value={wasabiEmail}
                onChange={(e) => setWasabiEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <Button
              onClick={handleWasabiLookup}
              disabled={wasabiLoading || !wasabiEmail}
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/40"
            >
              {wasabiLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Fetching...
                </>
              ) : (
                "Fetch Cards"
              )}
            </Button>
          </div>
          <p className="text-white/30 text-xs mt-2">
            Fetches cards from both virtual holder ID and physical holder ID of the user.
          </p>

          {wasabiResults.length > 0 && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <h4 className="text-white/80 text-sm mb-3">Wasabi Results - Not in Backend</h4>
              <div className="space-y-2">
                {wasabiResults.map((card) => (
                  <div
                    key={card.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-900 flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white/80 text-sm font-medium">
                          **** **** **** {card.last4}
                        </div>
                        <div className="text-white/40 text-xs">{card.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={cn(
                          "text-xs border",
                          getTypeColor(card.type)
                        )}
                      >
                        {card.type}
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => handleMapCard(card)}
                        className="h-7 px-3 text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40"
                      >
                        Map Card
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cards Table */}
      <Card className="glass-strong border-white/10">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                type="text"
                placeholder="Search card no, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
                <Filter className="h-4 w-4 mr-2 opacity-60" />
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/10">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Virtual">Virtual Cards</SelectItem>
                <SelectItem value="Physical">Physical Cards</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/10">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Frozen">Frozen</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              onClick={handleResetFilters}
              className="text-white/60 hover:text-white border border-white/10"
            >
              Reset
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

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    onClick={handleRefresh}
                    disabled={refreshing || loading}
                    className="text-white/60 hover:text-white border border-white/10"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#1a1a1a] border-white/10">
                  <p>Refresh Data</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-white/60">
              {filteredCards.length} cards
            </div>
            <div className="text-sm text-white/40">
              Page {currentPage} of {totalPages || 1}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="h-8 w-8 text-white/40 animate-spin" />
                <span className="text-white/40">Loading cards...</span>
              </div>
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/40">No cards found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-white/10 hover:bg-transparent">
                    <TableHead
                      className="text-xs text-white/40 font-medium uppercase cursor-pointer"
                      onClick={() => handleSort("cardNo")}
                    >
                      <div className="flex items-center gap-1">
                        Card No / Wasabi ID
                        {sortConfig.key === "cardNo" &&
                          (sortConfig.direction === "asc" ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs text-white/40 font-medium uppercase">Holder</TableHead>
                    <TableHead
                      className="text-xs text-white/40 font-medium uppercase cursor-pointer"
                      onClick={() => handleSort("type")}
                    >
                      <div className="flex items-center gap-1">
                        Type
                        {sortConfig.key === "type" &&
                          (sortConfig.direction === "asc" ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead
                      className="text-xs text-white/40 font-medium uppercase cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center gap-1">
                        Status
                        {sortConfig.key === "status" &&
                          (sortConfig.direction === "asc" ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead
                      className="text-xs text-white/40 font-medium uppercase cursor-pointer text-right"
                      onClick={() => handleSort("balance")}
                    >
                      <div className="flex items-center justify-end gap-1">
                        Balance
                        {sortConfig.key === "balance" &&
                          (sortConfig.direction === "asc" ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs text-white/40 font-medium uppercase">Wasabi Holder ID</TableHead>
                    <TableHead className="text-xs text-white/40 font-medium uppercase">Expires</TableHead>
                    <TableHead
                      className="text-xs text-white/40 font-medium uppercase cursor-pointer"
                      onClick={() => handleSort("created")}
                    >
                      <div className="flex items-center gap-1">
                        Created
                        {sortConfig.key === "created" &&
                          (sortConfig.direction === "asc" ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs text-white/40 font-medium uppercase">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((card) => (
                    <TableRow
                      key={card.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <TableCell className="py-4">
                        <div>
                          <div className="text-emerald-400 font-mono text-sm">{card.cardNo}</div>
                          <div className="text-white/40 text-xs">{card.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="text-white/80 text-sm">{card.holder}</div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          className={cn(
                            "text-xs border",
                            getTypeColor(card.type)
                          )}
                        >
                          {card.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          className={cn(
                            "text-xs border",
                            getStatusColor(card.status)
                          )}
                        >
                          {card.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <span className="text-emerald-400 font-bold">
                          ${card.balance.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-emerald-400 font-mono text-sm">
                          {card.wasabiId}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-white/60 text-sm">
                          {card.expires}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-white/40 text-xs">
                          {card.created}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-1">
                          <Dialog>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-7 px-2 text-xs text-white/60 hover:text-white"
                                    >
                                      Details
                                    </Button>
                                  </DialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent className="bg-[#1a1a1a] border-white/10">
                                  <p>View Details</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <DialogContent className="max-w-md bg-[#1a1a1a] border border-white/10 text-white max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-white">
                                  Card Details
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-3">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-xs text-white/40 uppercase">
                                        Card Number
                                      </label>
                                      <p className="text-emerald-400 font-mono mt-1 text-sm">
                                        **** **** **** {card.last4}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-xs text-white/40 uppercase">
                                        Wasabi ID
                                      </label>
                                      <p className="text-emerald-400 font-mono mt-1 text-sm">
                                        {card.wasabiId}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-xs text-white/40 uppercase">
                                        Holder
                                      </label>
                                      <p className="text-white/80 mt-1 text-sm">
                                        {card.holder}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-xs text-white/40 uppercase">
                                        Email
                                      </label>
                                      <p className="text-white/60 mt-1 text-sm">
                                        {card.email}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-xs text-white/40 uppercase">
                                        Type
                                      </label>
                                      <Badge
                                        className={cn(
                                          "mt-1 border",
                                          getTypeColor(card.type)
                                        )}
                                      >
                                        {card.type}
                                      </Badge>
                                    </div>
                                    <div>
                                      <label className="text-xs text-white/40 uppercase">
                                        Status
                                      </label>
                                      <Badge
                                        className={cn(
                                          "mt-1 border",
                                          getStatusColor(card.status)
                                        )}
                                      >
                                        {card.status}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-xs text-white/40 uppercase">
                                        Balance
                                      </label>
                                      <p className="text-emerald-400 font-bold mt-1 text-sm">
                                        ${card.balance.toFixed(2)}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-xs text-white/40 uppercase">
                                        Brand
                                      </label>
                                      <p className="text-white/60 mt-1 text-sm">
                                        {card.brand}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-xs text-white/40 uppercase">
                                        Expires
                                      </label>
                                      <p className="text-white/60 mt-1 text-sm">
                                        {card.expires}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-xs text-white/40 uppercase">
                                        Created
                                      </label>
                                      <p className="text-white/60 mt-1 text-sm">
                                        {card.created}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 px-2 text-xs text-amber-400 hover:text-amber-300"
                                >
                                  Update
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-[#1a1a1a] border-white/10">
                                <p>Update Card</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {!loading && paginatedData.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
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
                        currentPage === pageNum
                          ? ""
                          : "text-white/60 hover:text-white"
                      }`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                }
                if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return (
                    <span
                      key={pageNum}
                      className="text-white/40 px-2"
                    >
                      ...
                    </span>
                  );
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
        </CardContent>
      </Card>
    </div>
  );
};

export default CardsPage;
