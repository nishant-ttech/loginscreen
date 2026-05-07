import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, User, Phone, Mail, Calendar, Filter, Download, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import cardholdersService from "@/services/cardholdersService";

const ITEMS_PER_PAGE = 10;

const Overview = () => {
  // State management
  const [cardholders, setCardholders] = useState([]);
  const [filteredCardholders, setFilteredCardholders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    totalWasabi: 0,
    virtualLinked: 0,
    physicalLinked: 0,
    unlinked: 0,
  });

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [linkedFilter, setLinkedFilter] = useState("all");
  const [holderTypeFilter, setHolderTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, cardholdersData] = await Promise.all([
        cardholdersService.getCardholderStats(),
        cardholdersService.getCardholders(),
      ]);
      
      setStats({
        total: statsData.total || 0,
        totalWasabi: statsData.totalWasabi || 0,
        virtualLinked: statsData.virtualLinked || 0,
        physicalLinked: statsData.physicalLinked || 0,
        unlinked: statsData.unlinked || 0,
      });
      
      setCardholders(cardholdersData.data || cardholdersData || []);
      setFilteredCardholders(cardholdersData.data || cardholdersData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...cardholders];

    // Search by email or holder ID
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      filtered = filtered.filter((ch) =>
        ch.email?.toLowerCase().includes(term) ||
        ch.holderId?.toString().includes(term) ||
        ch.name?.toLowerCase().includes(term) ||
        ch.phone?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((ch) => ch.status?.toLowerCase() === statusFilter.toLowerCase());
    }

    // Linked status filter
    if (linkedFilter !== "all") {
      if (linkedFilter === "linked") {
        filtered = filtered.filter((ch) => ch.holderType && ch.holderId);
      } else if (linkedFilter === "unlinked") {
        filtered = filtered.filter((ch) => !ch.holderType || !ch.holderId);
      }
    }

    // Holder type filter
    if (holderTypeFilter !== "all") {
      filtered = filtered.filter((ch) => ch.holderType?.toLowerCase() === holderTypeFilter.toLowerCase());
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

    setFilteredCardholders(filtered);
    setCurrentPage(1);
  }, [cardholders, searchQuery, statusFilter, linkedFilter, holderTypeFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredCardholders.length / ITEMS_PER_PAGE);
  const paginatedData = filteredCardholders.slice(
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
    setLinkedFilter("all");
    setHolderTypeFilter("all");
    setSortConfig({ key: null, direction: "asc" });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "pending":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "suspended":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-white/10 text-white/60 border-white/10";
    }
  };

  // Get holder type color
  const getHolderTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "virtual":
        return "bg-blue-500/20 text-blue-400";
      case "physical":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-white/10 text-white/40";
    }
  };

  // Export data
  const handleExport = () => {
    const csvData = [
      ["Name", "Holder ID", "Card Type ID", "Status", "Flow", "Country", "Created", "Email", "Phone"],
      ...filteredCardholders.map((ch) => [
        ch.name,
        ch.holderId || "-",
        ch.cardTypeId || "-",
        ch.status || "-",
        ch.flow || "-",
        ch.country || "-",
        ch.created || "-",
        ch.email || "-",
        ch.phone || "-",
      ]),
    ];

    const csv = csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cardholders-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Cardholder Details Overview</h1>
          <p className="text-white/60 text-sm mt-1">Total Wasabi cardholders and their status breakdown</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card className="glass-strong border-white/10 hover:border-white/20 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalWasabi}</div>
                <div className="text-sm text-white/40 mt-1">Total (Wasabi)</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <User className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10 hover:border-white/20 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-400">{stats.virtualLinked}</div>
                <div className="text-sm text-white/40 mt-1">Virtual Linked</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500/20/30 flex items-center justify-center">
                <User className="h-5 w-5 text-blue-400/70" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10 hover:border-white/20 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-400">{stats.physicalLinked}</div>
                <div className="text-sm text-white/40 mt-1">Physical Linked</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <User className="h-5 w-5 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10 hover:border-white/20 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-amber-400">{stats.unlinked}</div>
                <div className="text-sm text-white/40 mt-1">Unlinked Users</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <User className="h-5 w-5 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10 hover:border-white/20 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-emerald-400">{stats.total}</div>
                <div className="text-sm text-white/40 mt-1">All Cardholders</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <User className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="glass-strong border-white/10">
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                type="text"
                placeholder="Search by email or holder ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
                <Filter className="h-4 w-4 mr-2 opacity-60" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/10">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>

            {/* Linked Status Filter */}
            <Select value={linkedFilter} onValueChange={setLinkedFilter}>
              <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Link Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/10">
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="linked">Linked</SelectItem>
                <SelectItem value="unlinked">Unlinked</SelectItem>
              </SelectContent>
            </Select>

            {/* Holder Type Filter */}
            <Select value={holderTypeFilter} onValueChange={setHolderTypeFilter}>
              <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Holder Type" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/10">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="virtual">Virtual</SelectItem>
                <SelectItem value="physical">Physical</SelectItem>
              </SelectContent>
            </Select>

            {/* Reset Button */}
            <Button
              variant="ghost"
              onClick={handleResetFilters}
              className="text-white/60 hover:text-white border border-white/10"
            >
              Reset
            </Button>

            {/* Export Button */}
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

            {/* Refresh Button */}
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

          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-white/60">
              {filteredCardholders.length} total cardholder(s)
            </div>
            <div className="text-sm text-white/40">
              Page {currentPage} of {totalPages || 1}
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="h-8 w-8 text-white/40 animate-spin" />
                <span className="text-white/40">Loading cardholders...</span>
              </div>
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/40">No cardholders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-white/10 hover:bg-transparent">
                    <TableHead
                      className="text-xs text-white/40 font-medium uppercase cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1">
                        Name
                        {sortConfig.key === "name" &&
                          (sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs text-white/40 font-medium uppercase">Holder ID</TableHead>
                    <TableHead className="text-xs text-white/40 font-medium uppercase">Card Type ID</TableHead>
                    <TableHead
                      className="text-xs text-white/40 font-medium uppercase cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center gap-1">
                        Status
                        {sortConfig.key === "status" &&
                          (sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs text-white/40 font-medium uppercase">Flow</TableHead>
                    <TableHead className="text-xs text-white/40 font-medium uppercase">Country</TableHead>
                    <TableHead
                      className="text-xs text-white/40 font-medium uppercase cursor-pointer"
                      onClick={() => handleSort("created")}
                    >
                      <div className="flex items-center gap-1">
                        Created
                        {sortConfig.key === "created" &&
                          (sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          ))}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs text-white/40 font-medium uppercase">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((cardholder) => (
                    <TableRow
                      key={cardholder.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                            <User className="h-5 w-5 text-emerald-400" />
                          </div>
                          <div>
                            <div className="text-white/80 text-sm font-medium">
                              {cardholder.name || "N/A"}
                            </div>
                            <div className="text-white/40 text-xs">
                              {cardholder.email || "—"}
                            </div>
                            {cardholder.phone && (
                              <div className="text-white/40 text-xs">
                                {cardholder.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-emerald-400 font-mono text-sm">
                          {cardholder.holderId || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-white/60 text-sm">
                          {cardholder.cardTypeId || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          className={cn(
                            "text-xs border",
                            getStatusColor(cardholder.status)
                          )}
                        >
                          {cardholder.status || "—"}
                        </Badge>
                        {cardholder.actionMessage && (
                          <div className="text-xs text-white/40 mt-1 line-clamp-1">
                            {cardholder.actionMessage}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-white/60 text-sm">
                          {cardholder.flow || "admin"}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-white/60 text-sm">
                          {cardholder.country || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-white/40 text-sm">
                          {cardholder.created || "—"}
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
                                  Cardholder Details
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-3">
                                  <div>
                                    <label className="text-xs text-white/40 uppercase">
                                      Name
                                    </label>
                                    <p className="text-white/80 mt-1">
                                      {cardholder.name || "—"}
                                    </p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-xs text-white/40 uppercase">
                                        Holder ID
                                      </label>
                                      <p className="text-emerald-400 font-mono mt-1 text-sm">
                                        {cardholder.holderId || "—"}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-xs text-white/40 uppercase">
                                        Card Type ID
                                      </label>
                                      <p className="text-white/60 mt-1 text-sm">
                                        {cardholder.cardTypeId || "—"}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-xs text-white/40 uppercase">
                                      Email
                                    </label>
                                    <p className="text-white/60 mt-1 text-sm">
                                      {cardholder.email || "—"}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-xs text-white/40 uppercase">
                                      Phone
                                    </label>
                                    <p className="text-white/60 mt-1 text-sm">
                                      {cardholder.phone || "—"}
                                    </p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-xs text-white/40 uppercase">
                                        Status
                                      </label>
                                      <Badge
                                        className={cn(
                                          "mt-1 border",
                                          getStatusColor(cardholder.status)
                                        )}
                                      >
                                        {cardholder.status || "—"}
                                      </Badge>
                                    </div>
                                    <div>
                                      <label className="text-xs text-white/40 uppercase">
                                        Holder Type
                                      </label>
                                      <Badge
                                        className={cn(
                                          "mt-1 border",
                                          getHolderTypeColor(
                                            cardholder.holderType
                                          )
                                        )}
                                      >
                                        {cardholder.holderType || "Unlinked"}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-xs text-white/40 uppercase">
                                        Flow
                                      </label>
                                      <p className="text-white/60 mt-1 text-sm">
                                        {cardholder.flow || "—"}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-xs text-white/40 uppercase">
                                        Country
                                      </label>
                                      <p className="text-white/60 mt-1 text-sm">
                                        {cardholder.country || "—"}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-xs text-white/40 uppercase">
                                      Created
                                    </label>
                                    <p className="text-white/60 mt-1 text-sm">
                                      {cardholder.created || "—"}
                                    </p>
                                  </div>
                                </div>
                                {cardholder.actionMessage && (
                                  <div className="bg-white/5 rounded-lg p-3">
                                    <label className="text-xs text-white/40 uppercase">
                                      Action Message
                                    </label>
                                    <p className="text-white/60 text-sm mt-1">
                                      {cardholder.actionMessage}
                                    </p>
                                    </div>
                                )}
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
                                 <p>Update Cardholder</p>
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

export default Overview;