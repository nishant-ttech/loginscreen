import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Store,
  Coins,
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  Settings,
  Shield,
  Network,
  Sun,
  Moon,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  LogOut,
  UserCircle,
  FileCheck2,
  Wallet,
  History,
  KeyRound,
  PlusCircle,
  Server,
  Activity,
  Flame,
  Fuel,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navSections = [
  {
    id: "user",
    label: "User Portal",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard/overview" },
      { icon: FileCheck2, label: "KYC", path: "/dashboard/kyc" },
      {
        icon: Wallet,
        label: "Wallet",
        children: [
          { label: "Overview", path: "/dashboard/wallet" },
          { label: "Deposit", path: "/dashboard/wallet/deposit" },
          { label: "Withdraw", path: "/dashboard/wallet/withdraw" },
          { label: "History", path: "/dashboard/wallet/history" },
          { label: "Import Wallet", path: "/dashboard/wallet/import" },
        ],
      },
      {
        icon: CreditCard,
        label: "Cards",
        children: [
          { label: "My Cards", path: "/dashboard/cards" },
          { label: "Apply for Card", path: "/dashboard/cards/apply" },
        ],
      },
      {
        icon: UserCircle,
        label: "Profile",
        children: [
          { label: "Profile Details", path: "/dashboard/profile" },
          { label: "Change Password", path: "/dashboard/profile/change-password" },
        ],
      },
    ],
  },
  {
    id: "admin",
    label: "Admin Portal",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      {
        icon: Users,
        label: "Management",
        children: [
          { label: "Users", path: "/dashboard/users" },
          { label: "Transactions", path: "/dashboard/transactions" },
          { label: "Deposits", path: "/dashboard/deposits" },
          { label: "Withdrawals", path: "/dashboard/withdrawals" },
          { label: "Cardholders", path: "/dashboard/cardholders" },
          { label: "Cards List", path: "/dashboard/cards-list" },
          { label: "Physical Cards", path: "/dashboard/physical-cards" },
          { label: "Merchants", path: "/dashboard/merchants" },
        ],
      },
      {
        icon: Network,
        label: "Crypto",
        children: [
          { label: "Crypto", path: "/dashboard/crypto" },
          { label: "Hot Wallets", path: "/dashboard/crypto/hot-wallets" },
          { label: "Gas Treasury", path: "/dashboard/crypto/gas-treasury" },
          { label: "Crypto Deposits", path: "/dashboard/crypto/deposits" },
          { label: "Crypto Withdrawals", path: "/dashboard/crypto/withdrawals" },
        ],
      },
      {
        icon: Coins,
        label: "Commission",
        children: [
          { label: "Settings", path: "/dashboard/commission-settings" },
          { label: "History", path: "/dashboard/commission" },
        ],
      },
      { icon: Shield, label: "Security / 2FA", path: "/dashboard/security" },
      { icon: Server, label: "Server IP", path: "/dashboard/server-ip" },
    ],
  },
];

const iconMap = {
  Overview: Wallet,
  Deposit: ArrowDownRight,
  Withdraw: ArrowUpRight,
  History: History,
  "Import Wallet": KeyRound,
  "My Cards": CreditCard,
  "Apply for Card": PlusCircle,
  "Profile Details": UserCircle,
  "Change Password": KeyRound,
  Users: Users,
  Transactions: CreditCard,
  Deposits: ArrowDownRight,
  Withdrawals: ArrowUpRight,
  Cardholders: Users,
  "Cards List": CreditCard,
  "Physical Cards": CreditCard,
  Merchants: Store,
  "Crypto Dashboard": Network,
  "Hot Wallets": Flame,
  "Gas Treasury": Fuel,
  "Crypto Deposits": ArrowDownRight,
  "Crypto Withdrawals": ArrowUpRight,
  Settings: Settings,
};

export default function Sidebar({ onClose, collapsed = false, onToggleCollapsed, sidebarOpen = true }) {
  const [theme, setTheme] = useState("dark");
  const [openGroups, setOpenGroups] = useState({ Wallet: true, Cards: true });
  const [showUserPortal, setShowUserPortal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("netpay-theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    if (savedTheme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, []);

  useEffect(() => {
    navSections[showUserPortal ? 0 : 1].items.forEach((item) => {
      if (item.children && item.children.some((c) => location.pathname === c.path)) {
        setOpenGroups((prev) => ({ ...prev, [item.label]: true }));
      }
    });
  }, [location.pathname, showUserPortal]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("netpay-theme", newTheme);
    if (newTheme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  const togglePortal = () => {
    setShowUserPortal((prev) => !prev);
  };

  const handleNavClick = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("netpay-auth");
    navigate("/");
    window.location.reload();
  };

  const toggleGroup = (label) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

   const isPathActive = (path) => {
     return location.pathname === path;
   };

  const currentSection = navSections[showUserPortal ? 0 : 1];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-white/10 glass-strong transition-all duration-300 h-screen",
        collapsed ? "w-[72px]" : "w-[260px] lg:w-[280px]",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-emerald-700/30 border border-emerald-500/30 flex items-center justify-center">
              <svg
                className="h-5 w-5 text-emerald-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-display text-lg font-bold text-white">NetPay</span>
          </div>
        )}
        <button
          onClick={() => onToggleCollapsed && onToggleCollapsed()}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 sidebar-scroll">
        <div className="mb-2">
          {!collapsed && (
            <div className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-[0.18em] text-white/30 font-medium">
              {currentSection.label}
            </div>
          )}
          {currentSection.items.map((item) => {
            const Icon = item.icon;
            if (item.children) {
              const open = !!openGroups[item.label];
              const groupActive = item.children.some((c) => isPathActive(c.path));
              return (
                <div key={item.label}>
                  <button
                    onClick={() => (collapsed ? handleNavClick(item.children[0].path) : toggleGroup(item.label))}
                     className={cn(
                       "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all relative",
                       collapsed ? "justify-center" : "justify-start",
                       groupActive
                         ? "text-emerald-400"
                         : "text-white/60 hover:text-emerald-300 hover:bg-white/5"
                     )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="truncate flex-1 text-left">{item.label}</span>
                        {open ? (
                          <ChevronDown className="h-4 w-4 text-white/40" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-white/40" />
                        )}
                      </>
                    )}
                  </button>
                  {!collapsed && open && (
                    <div className="pl-4">
                      {item.children.map((child) => {
                        const ChildIcon = iconMap[child.label] || ChevronRight;
                        const active = isPathActive(child.path);
                        return (
                          <button
                            key={child.path}
                            onClick={() => handleNavClick(child.path)}
                            className={cn(
                              "w-full flex items-center gap-3 pl-6 pr-4 py-2 text-sm transition-all relative group",
                              active
                                ? "text-emerald-400 bg-emerald-500/10 border-r-2 border-emerald-500/50"
                                : "text-white/50 hover:text-emerald-300 hover:bg-white/5"
                            )}
                          >
                            <ChildIcon className="h-4 w-4 shrink-0" />
                            <span className="truncate text-left">{child.label}</span>
                            {active && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-emerald-500" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }
            const active = isPathActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all relative group",
                  collapsed ? "justify-center" : "justify-start",
                  active
                    ? "text-emerald-400 bg-emerald-500/10 border-r-2 border-emerald-500/50"
                    : "text-white/60 hover:text-emerald-300 hover:bg-white/5"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {item.badge && !collapsed && (
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                    {item.badge}
                  </span>
                )}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-white/10 p-4 shrink-0 space-y-3">
        <button
          onClick={togglePortal}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
            showUserPortal
              ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
              : "bg-white/5 text-white/60 hover:bg-white/10"
          )}
        >
          {showUserPortal ? (
            <>
              <LayoutDashboard className="h-4 w-4" />
              {!collapsed && <span>Switch to Admin</span>}
            </>
          ) : (
            <>
              <UserCircle className="h-4 w-4" />
              {!collapsed && <span>Switch to User</span>}
            </>
          )}
        </button>

        <button
          onClick={toggleTheme}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors w-full",
            collapsed && "justify-center"
          )}
          aria-label="Toggle theme"
        >
          <div className="relative h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-emerald-500" />
            )}
          </div>
          {!collapsed && (
            <span className="text-sm text-white/80">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          )}
        </button>

        {!collapsed && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-3 px-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500/30 to-transparent border border-emerald-500/30 flex items-center justify-center">
                <UserCircle className="h-4 w-4 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">Admin User</p>
                <p className="text-xs text-emerald-400 truncate">admin@netpay.com</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-left"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
