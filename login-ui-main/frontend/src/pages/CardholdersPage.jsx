import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, Download, RefreshCw, User, Phone, Mail, Eye, Edit } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 10;

// Mock data matching the provided cardholder overview
const MOCK_CARDHOLDERS = [
  {
    id: 1,
    name: "sumit kethwas",
    email: "amladevi8765@gmail.com",
    phone: "+44 7853146013",
    holderId: 140030,
    cardTypeId: 111031,
    status: "Approved",
    flow: "admin",
    country: "IN",
    created: "2026-05-06T10:30:00Z",
    rejectionReason: null,
  },
  {
    id: 2,
    name: "dipesh dipesh",
    email: "n9867693837@icloud.com",
    phone: "+91 6364791340",
    holderId: 139556,
    cardTypeId: 111059,
    status: "Approved",
    flow: "channel",
    country: "IN",
    created: "2026-05-06T09:15:00Z",
    rejectionReason: null,
  },
  {
    id: 3,
    name: "Aditya Kumar",
    email: "dxbaditya19@gmail.com",
    phone: "+971 555157788",
    holderId: 117264,
    cardTypeId: 111059,
    status: "Approved",
    flow: "channel",
    country: "AE",
    created: "2026-04-14T14:20:00Z",
    rejectionReason: null,
  },
  {
    id: 4,
    name: "Nitesh Shetty",
    email: "Niteshshetty25@gmail.com",
    phone: "+971 503994142",
    holderId: 117240,
    cardTypeId: 111059,
    status: "Approved",
    flow: "channel",
    country: "AE",
    created: "2026-04-14T11:45:00Z",
    rejectionReason: null,
  },
  {
    id: 5,
    name: "Flow Tester",
    email: "flow.test@magnetpay.io",
    phone: "+971 505551234",
    holderId: 112490,
    cardTypeId: 111031,
    status: "Rejected",
    flow: "admin",
    country: "AE",
    created: "2026-04-03T16:00:00Z",
    rejectionReason: "The information on the uploaded photo is illegible. The image is blurry or unclear.",
  },
  {
    id: 6,
    name: "Raj Patel",
    email: "test.holder4@magnetpay.io",
    phone: "+971 504567890",
    holderId: 112487,
    cardTypeId: 111031,
    status: "Rejected",
    flow: "admin",
    country: "AE",
    created: "2026-04-03T15:30:00Z",
    rejectionReason: "The information on the uploaded photo is illegible. The image is blurry or unclear.",
  },
  {
    id: 7,
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 9876543210",
    holderId: 108756,
    cardTypeId: 111059,
    status: "Approved",
    flow: "channel",
    country: "IN",
    created: "2026-03-20T12:00:00Z",
    rejectionReason: null,
  },
  {
    id: 8,
    name: "Priya Singh",
    email: "priya.singh@example.ae",
    phone: "+971 501234567",
    holderId: 105432,
    cardTypeId: 111031,
    status: "Approved",
    flow: "admin",
    country: "AE",
    created: "2026-03-15T09:30:00Z",
    rejectionReason: null,
  },
  {
    id: 9,
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    phone: "+91 8765432109",
    holderId: 102345,
    cardTypeId: 111059,
    status: "Approved",
    flow: "channel",
    country: "IN",
    created: "2026-03-10T14:15:00Z",
    rejectionReason: null,
  },
  {
    id: 10,
    name: "Sara Ali",
    email: "sara.ali@example.ae",
    phone: "+971 509876543",
    holderId: 98765,
    cardTypeId: 111031,
    status: "Pending",
    flow: "admin",
    country: "AE",
    created: "2026-03-05T11:00:00Z",
    rejectionReason: null,
  },
  {
    id: 11,
    name: "Vikram Patel",
    email: "vikram.patel@example.com",
    phone: "+91 7890123456",
    holderId: 95432,
    cardTypeId: 111059,
    status: "Approved",
    flow: "channel",
    country: "IN",
    created: "2026-02-28T16:45:00Z",
    rejectionReason: null,
  },
];

const CardholdersPage = () => {
  const [cardholders, setCardholders] = useState([]);
  const [filteredCardholders, setFilteredCardholders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [flowFilter, setFlowFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  // Stats state
  const [stats, setStats] = useState({
    total: 0,
    virtualLinked: 0,
    physicalLinked: 0,
    unlinked: 0,
  });

  // Fetch cardholders (simulating API call)
  const fetchCardholders = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In production: const response = await cardholdersService.getCardholders();
      setCardholders(MOCK_CARDHOLDERS);
    } catch (error) {
      console.error("Error fetching cardholders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCardholders();
  }, [fetchCardholders]);

  // Calculate stats whenever cardholders change
  useEffect(() => {
    const total = cardholders.length;

    // Assuming cardTypeId 111031 = Virtual, 111059 = Physical (infer from mock data pattern)
    const virtualLinked = cardholders.filter(
      (c) => c.cardTypeId === 111031 && c.status === "Approved"
    ).length;
    const physicalLinked = cardholders.filter(
      (c) => c.cardTypeId === 111059 && c.status === "Approved"
    ).length;
    const unlinked = cardholders.filter((c) => c.status === "Rejected").length;

    setStats({
      total,
      virtualLinked,
      physicalLinked,
      unlinked,
    });
  }, [cardholders]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...cardholders];

    // Search by email or holder ID
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.email?.toLowerCase().includes(term) ||
          c.holderId?.toString().toLowerCase().includes(term) ||
          c.name?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (c) => c.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Flow filter
    if (flowFilter !== "all") {
      filtered = filtered.filter(
        (c) => c.flow?.toLowerCase() === flowFilter.toLowerCase()
      );
    }

    // Country filter
    if (countryFilter !== "all") {
      filtered = filtered.filter(
        (c) => c.country?.toUpperCase() === countryFilter.toUpperCase()
      );
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
  }, [cardholders, searchQuery, statusFilter, flowFilter, countryFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredCardholders.length / ITEMS_PER_PAGE);
  const paginatedData = filteredCardholders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setFlowFilter("all");
    setCountryFilter("all");
    setSortConfig({ key: null, direction: "asc" });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCardholders();
    setRefreshing(false);
  };

  // Export to CSV
  const handleExport = () => {
    const csvData = [
      [
        "Name",
        "Email",
        "Phone",
        "Holder ID",
        "Card Type ID",
        "Status",
        "Flow",
        "Country",
        "Created",
      ],
      ...filteredCardholders.map((c) => [
        c.name,
        c.email,
        c.phone,
        c.holderId,
        c.cardTypeId,
        c.status,
        c.flow,
        c.country,
        format(new Date(c.created), "MMM dd, yyyy"),
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
    link.download = `cardholders-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      case "pending":
        return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
      default:
        return "bg-white/10 text-white/60 border border-white/10";
    }
  };

  // Get flow color
  const getFlowColor = (flow) => {
    switch (flow?.toLowerCase()) {
      case "admin":
        return "bg-blue-500/20 text-blue-400";
      case "channel":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-white/10 text-white/40";
    }
  };

  // Get unique countries for filter
  const uniqueCountries = useMemo(() => {
    const countries = [...new Set(cardholders.map((c) => c.country))];
    return countries.sort();
  }, [cardholders]);

  // Format date
  const formatDate = (dateStr) => {
    try {
      return format(new Date(dateStr), "MMM dd, yyyy");
    } catch {
      return dateStr;
    }
  };

  // Card Details Dialog
  const CardDetailsDialog = ({ cardholder, trigger }) => {
    return (
      <Dialog>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{trigger}</TooltipTrigger>
            <TooltipContent className="bg-[#1a1a1a] border-white/10">
              <p>View Details</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent className="max-w-md bg-[#1a1a1a] border border-white/10 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5 text-emerald-400" />
              Cardholder Details
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
              <div className="h-14 w-14 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <User className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-white font-medium text-lg">
                  {cardholder.name}
                </div>
                <div className="text-white/40 text-sm">{cardholder.email}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white/40 uppercase">
                  Holder ID
                </label>
                <div className="text-emerald-400 font-mono mt-1">
                  {cardholder.holderId}
                </div>
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase">
                  Card Type ID
                </label>
                <div className="text-emerald-400 font-mono mt-1">
                  {cardholder.cardTypeId}
                </div>
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase">Email</label>
                <div className="text-white/80 mt-1 text-sm flex items-center gap-2">
                  <Mail className="h-3 w-3 text-white/40" />
                  {cardholder.email}
                </div>
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase">Phone</label>
                <div className="text-white/80 mt-1 text-sm flex items-center gap-2">
                  <Phone className="h-3 w-3 text-white/40" />
                  {cardholder.phone}
                </div>
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase">Status</label>
                <div className="mt-1">
                  <Badge className={cn("text-xs border", getStatusColor(cardholder.status))}>
                    {cardholder.status}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase">Flow</label>
                <div className="mt-1">
                  <Badge className={cn("text-xs", getFlowColor(cardholder.flow))}>
                    {cardholder.flow}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase">Country</label>
                <div className="text-white/80 mt-1 text-sm font-medium">
                  {cardholder.country}
                </div>
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase">Created</label>
                <div className="text-white/60 mt-1 text-sm flex items-center gap-2">
                  {formatDate(cardholder.created)}
                </div>
              </div>
            </div>

            {cardholder.status === "Rejected" && cardholder.rejectionReason && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <label className="text-xs text-red-400 uppercase font-medium">
                  Rejection Reason
                </label>
                <p className="text-red-300 text-sm mt-1">
                  {cardholder.rejectionReason}
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">
            Cardholders
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Total ({stats.total}) cardholders on Wasabi
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="glass hover:bg-white/10 transition-colors"
        >
          <RefreshCw
            className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")}
          />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="glass-strong border-white/10 hover:border-white/20 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">
                  {stats.total}
                </div>
                <div className="text-sm text-white/40 mt-1">
                  All cardholders on Wasabi
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <User className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10 hover:border-white/20 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {stats.virtualLinked}
                </div>
                <div className="text-sm text-white/40 mt-1">
                  Virtual Linked
                </div>
                <div className="text-xs text-white/60 mt-1">
                  Users with virtual holder ID
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <div className="h-5 w-5 rounded-full border-2 border-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10 hover:border-white/20 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {stats.physicalLinked}
                </div>
                <div className="text-sm text-white/40 mt-1">
                  Physical Linked
                </div>
                <div className="text-xs text-white/60 mt-1">
                  Users with physical holder ID
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10 hover:border-white/20 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-amber-400">
                  {stats.unlinked}
                </div>
                <div className="text-sm text-white/40 mt-1">
                  Unlinked Users
                </div>
                <div className="text-xs text-white/60 mt-1">
                  No Wasabi holder assigned
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="glass-strong border-white/10">
        <CardContent className="p-5">
          <div className="flex flex-col gap-4">
            {/* Search row */}
            <div className="flex flex-col sm:flex-row gap-3">
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

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={flowFilter} onValueChange={setFlowFilter}>
                <SelectTrigger className="w-[160px] bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="All Flows" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10">
                  <SelectItem value="all">All Flows</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="channel">Channel</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={countryFilter}
                onValueChange={setCountryFilter}
              >
                <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10">
                  <SelectItem value="all">All Countries</SelectItem>
                  {uniqueCountries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
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
            </div>

            {/* Results count */}
            <div className="text-sm text-white/60">
              {filteredCardholders.length} total cardholder(s)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cardholders Table */}
      <Card className="glass-strong border-white/10">
        <CardContent className="p-0">
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
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-white/10 hover:bg-transparent">
                      <TableHead
                        className="text-xs text-white/40 font-medium uppercase py-3 px-2 cursor-pointer"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center gap-1">
                          Name
                          {sortConfig.key === "name" &&
                            (sortConfig.direction === "asc" ? (
                              <span className="text-[10px]">↑</span>
                            ) : (
                              <span className="text-[10px]">↓</span>
                            ))}
                        </div>
                      </TableHead>
                      <TableHead
                        className="text-xs text-white/40 font-medium uppercase py-3 px-2 cursor-pointer"
                        onClick={() => handleSort("holderId")}
                      >
                        <div className="flex items-center gap-1">
                          Holder ID
                          {sortConfig.key === "holderId" &&
                            (sortConfig.direction === "asc" ? (
                              <span className="text-[10px]">↑</span>
                            ) : (
                              <span className="text-[10px]">↓</span>
                            ))}
                        </div>
                      </TableHead>
                      <TableHead
                        className="text-xs text-white/40 font-medium uppercase py-3 px-2 cursor-pointer"
                        onClick={() => handleSort("cardTypeId")}
                      >
                        <div className="flex items-center gap-1">
                          Card Type ID
                          {sortConfig.key === "cardTypeId" &&
                            (sortConfig.direction === "asc" ? (
                              <span className="text-[10px]">↑</span>
                            ) : (
                              <span className="text-[10px]">↓</span>
                            ))}
                        </div>
                      </TableHead>
                      <TableHead
                        className="text-xs text-white/40 font-medium uppercase py-3 px-2 cursor-pointer"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center gap-1">
                          Status
                          {sortConfig.key === "status" &&
                            (sortConfig.direction === "asc" ? (
                              <span className="text-[10px]">↑</span>
                            ) : (
                              <span className="text-[10px]">↓</span>
                            ))}
                        </div>
                      </TableHead>
                      <TableHead
                        className="text-xs text-white/40 font-medium uppercase py-3 px-2 cursor-pointer"
                        onClick={() => handleSort("flow")}
                      >
                        <div className="flex items-center gap-1">
                          Flow
                          {sortConfig.key === "flow" &&
                            (sortConfig.direction === "asc" ? (
                              <span className="text-[10px]">↑</span>
                            ) : (
                              <span className="text-[10px]">↓</span>
                            ))}
                        </div>
                      </TableHead>
                      <TableHead
                        className="text-xs text-white/40 font-medium uppercase py-3 px-2 cursor-pointer"
                        onClick={() => handleSort("country")}
                      >
                        <div className="flex items-center gap-1">
                          Country
                          {sortConfig.key === "country" &&
                            (sortConfig.direction === "asc" ? (
                              <span className="text-[10px]">↑</span>
                            ) : (
                              <span className="text-[10px]">↓</span>
                            ))}
                        </div>
                      </TableHead>
                      <TableHead
                        className="text-xs text-white/40 font-medium uppercase py-3 px-2 cursor-pointer"
                        onClick={() => handleSort("created")}
                      >
                        <div className="flex items-center gap-1">
                          Created
                          {sortConfig.key === "created" &&
                            (sortConfig.direction === "asc" ? (
                              <span className="text-[10px]">↑</span>
                            ) : (
                              <span className="text-[10px]">↓</span>
                            ))}
                        </div>
                      </TableHead>
                      <TableHead className="text-xs text-white/40 font-medium uppercase py-3 px-2">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((cardholder) => (
                      <TableRow
                        key={cardholder.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <TableCell className="py-3 px-2">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-emerald-500/20 flex items-center justify-center">
                              <User className="h-4 w-4 text-emerald-400" />
                            </div>
                            <div>
                              <div className="text-white/80 text-sm font-medium">
                                {cardholder.name}
                              </div>
                              <div className="text-white/40 text-xs flex items-center gap-1">
                                <Mail className="h-2.5 w-2.5" />
                                {cardholder.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-2">
                          <span className="text-emerald-400 font-mono text-sm">
                            {cardholder.holderId}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-2">
                          <span className="text-blue-400 font-mono text-sm">
                            {cardholder.cardTypeId}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-2">
                          <Badge
                            className={cn(
                              "text-xs border",
                              getStatusColor(cardholder.status)
                            )}
                          >
                            {cardholder.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 px-2">
                          <Badge className={cn("text-xs", getFlowColor(cardholder.flow))}>
                            {cardholder.flow}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 px-2">
                          <span className="text-white/60 text-sm font-medium">
                            {cardholder.country}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-2">
                          <span className="text-white/40 text-xs">
                            {formatDate(cardholder.created)}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-2">
                          <div className="flex items-center gap-1">
                            <CardDetailsDialog
                              cardholder={cardholder}
                              trigger={
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 px-2 text-xs text-white/60 hover:text-white"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  Details
                                </Button>
                              }
                            />
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 px-2 text-xs text-amber-400 hover:text-amber-300"
                                  >
                                    <Edit className="h-3 w-3 mr-1" />
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

              {/* Pagination */}
              {!loading && filteredCardholders.length > 0 && totalPages > 1 && (
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
                        <span key={pageNum} className="text-white/40 px-2">
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CardholdersPage;
