import React, { Suspense } from "react";
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
const KycPage = React.lazy(() => import("@/pages/KycPage"));
const WalletPage = React.lazy(() => import("@/pages/WalletPage"));
const WalletDepositPage = React.lazy(() => import("@/pages/WalletDepositPage"));
const WalletDepositChainPage = React.lazy(() => import("@/pages/WalletDepositChainPage"));
const WalletWithdrawPage = React.lazy(() => import("@/pages/WalletWithdrawPage"));
const WalletHistoryPage = React.lazy(() => import("@/pages/WalletHistoryPage"));
const WalletImportPage = React.lazy(() => import("@/pages/WalletImportPage"));
const CardsPage = React.lazy(() => import("@/pages/CardsPage"));
const ApplyCardPage = React.lazy(() => import("@/pages/ApplyCardPage"));
const CardDetailsPage = React.lazy(() => import("@/pages/CardDetailsPage"));
const ProfilePage = React.lazy(() => import("@/pages/ProfilePage"));
const ChangePasswordPage = React.lazy(() => import("@/pages/ChangePasswordPage"));

const AUTH_KEY = "netpay-auth";

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
        <main className="flex-1 ml-0 lg:ml-[260px] transition-all duration-300 min-w-0">
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
                <Route index element={<AdminPanelPage />} />
                <Route path="overview" element={<OverviewPage />} />

                {/* User Portal */}
                <Route path="kyc" element={<KycPage />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="wallet/deposit" element={<WalletDepositPage />} />
                <Route path="wallet/deposit/:chain" element={<WalletDepositChainPage />} />
                <Route path="wallet/withdraw" element={<WalletWithdrawPage />} />
                <Route path="wallet/history" element={<WalletHistoryPage />} />
                <Route path="wallet/import" element={<WalletImportPage />} />
                <Route path="cards" element={<CardsPage />} />
                <Route path="cards/apply" element={<ApplyCardPage />} />
                <Route path="cards/:id" element={<CardDetailsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="profile/change-password" element={<ChangePasswordPage />} />

                {/* Admin Portal */}
                <Route path="admin" element={<AdminPanelPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="merchants" element={<MerchantsPage />} />
                <Route path="deposits" element={<DepositsPage />} />
                <Route path="withdrawals" element={<WithdrawalsPage />} />
                <Route path="transactions" element={<TransactionsPage />} />
                <Route path="cardholders" element={<CardholdersPage />} />
                <Route path="cards-list" element={<CardholdersPage />} />
                <Route path="physical-cards" element={<PhysicalCardsPage />} />

                {/* Crypto */}
                <Route path="crypto" element={<CryptoPage />} />
                <Route path="crypto/hot-wallets" element={<CryptoPage />} />
                <Route path="crypto/gas-treasury" element={<CryptoPage />} />
                <Route path="crypto/deposits" element={<DepositsPage />} />
                <Route path="crypto/withdrawals" element={<WithdrawalsPage />} />

                {/* Commission */}
                <Route path="commission" element={<CommissionPage />} />
                <Route path="commission-settings" element={<CommissionSettingsPage />} />

                {/* System */}
                <Route path="security" element={<SecurityPage />} />
                <Route path="server-ip" element={<ServerIPPage />} />
                <Route path="np-overview" element={<OverviewPage />} />

                {/* Legacy /dashboard/dashboard redirect */}
                <Route path="dashboard" element={<Navigate to="/dashboard" replace />} />

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}

