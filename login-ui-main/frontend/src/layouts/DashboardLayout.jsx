import React, { Suspense, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { X, Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import LoadingScreen from "@/components/LoadingScreen";
import DashboardSkeleton from "@/components/DashboardSkeleton";

// Lazy-loaded page components
const OverviewPage = React.lazy(() => import("@/pages/OverviewPage"));
const UsersPage = React.lazy(() => import("@/pages/UsersPage"));
const MerchantsPage = React.lazy(() => import("@/pages/MerchantsPage"));
const DepositsPage = React.lazy(() => import("@/pages/DepositsPage"));
const WithdrawalsPage = React.lazy(() => import("@/pages/WithdrawalsPage"));
const TransactionsPage = React.lazy(() => import("@/pages/TransactionsPage"));
const CryptoPage = React.lazy(() => import("@/pages/CryptoPage"));
const CommissionPage = React.lazy(() => import("@/pages/CommissionPage"));
const CommissionSettingsPage = React.lazy(() => import("@/pages/CommissionSettingsPage"));
const SecurityPage = React.lazy(() => import("@/pages/SecurityPage"));
const ServerIPPage = React.lazy(() => import("@/pages/ServerIPPage"));
const CardholdersPage = React.lazy(() => import("@/pages/CardholdersPage"));
const PhysicalCardsPage = React.lazy(() => import("@/pages/PhysicalCardsPage"));
const AdminPanelPage = React.lazy(() => import("@/pages/AdminPanelPage"));

const AUTH_KEY = "netpay-auth";

function RequireAuth({ children }) {
  const isAuthenticated = localStorage.getItem(AUTH_KEY) === "logged_in";
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const auth = localStorage.getItem(AUTH_KEY) === "logged_in";
    if (!auth) {
      window.location.href = "/";
      return;
    }
    setIsAuthenticated(true);
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <Sidebar onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:ml-0 ml-0 transition-all duration-300">
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 glass-strong">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5 text-white" />
              ) : (
                <Menu className="h-5 w-5 text-white" />
              )}
            </button>
            <span className="font-display text-lg font-bold text-white">NetPay</span>
            <div className="w-10" />
          </div>
          <div className="p-4 lg:p-6">
            <Suspense fallback={<DashboardSkeleton />}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<OverviewPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/merchants" element={<MerchantsPage />} />
                <Route path="/deposits" element={<DepositsPage />} />
                <Route path="/withdrawals" element={<WithdrawalsPage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/crypto" element={<CryptoPage />} />
                <Route path="/commission" element={<CommissionPage />} />
                <Route path="/commission-settings" element={<CommissionSettingsPage />} />
                <Route path="/security" element={<SecurityPage />} />
                <Route path="/server-ip" element={<ServerIPPage />} />
                <Route path="/cardholders" element={<CardholdersPage />} />
                <Route path="/physical-cards" element={<PhysicalCardsPage />} />
                <Route path="/np-overview" element={<OverviewPage />} />
                <Route path="/admin" element={<AdminPanelPage />} />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
