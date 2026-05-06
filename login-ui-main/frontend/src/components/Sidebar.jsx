import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Store,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Settings,
  Shield,
  Network,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Users", path: "/users", badge: "24" },
  { icon: Store, label: "Merchants", path: "/merchants" },
  { icon: Coins, label: "Deposits", path: "/deposits" },
  { icon: ArrowDownRight, label: "Withdrawals", path: "/withdrawals" },
  { icon: CreditCard, label: "Transactions", path: "/transactions" },
  { icon: Network, label: "Crypto", path: "/crypto", badge: "Live" },
  { icon: Coins, label: "Commission", path: "/commission" },
  { icon: Settings, label: "Commission Settings", path: "/commission-settings" },
  { icon: Shield, label: "Security / 2FA", path: "/security" },
  { icon: Network, label: "Server IP", path: "/server-ip" },
  { icon: CreditCard, label: "Cardholders", path: "/cardholders" },
  { icon: CreditCard, label: "Physical Card Numbers", path: "/physical-cards" },
  { icon: LayoutDashboard, label: "NP Overview", path: "/np-overview" },
  { icon: Shield, label: "Admin Panel", path: "/admin" },
];

export default function Sidebar({ onClose }) {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState("dark");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("netpay-theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("netpay-theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
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

  return (
    <aside
      className={cn(
        "fixed lg:static inset-y-0 left-0 z-40 flex flex-col border-r border-white/10 glass-strong transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[260px] lg:w-[280px]"
      )}
    >
      {/* Header */}
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
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all relative group",
                collapsed ? "justify-center" : "justify-start",
                isActive
                  ? "text-emerald-400 bg-emerald-500/10 border-r-2 border-emerald-500/50"
                  : "text-white/60 hover:text-emerald-300 hover:bg-white/5"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
              {item.badge && !collapsed && (
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  {item.badge}
                </span>
              )}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-emerald-500" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer - Theme toggle & Logout */}
      <div className="border-t border-white/10 p-4 shrink-0">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors w-full text-left"
            aria-label="Toggle theme"
          >
            <div className="relative h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-emerald-500" />
              )}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {!collapsed && (
              <span className="text-sm">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            )}
          </button>
        </div>

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
