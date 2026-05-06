import React, { useState, useMemo, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "@/App.css";
import AuthPanel from "@/components/AuthPanel";
import { Shield, Lock, Sparkles, Sun, Moon } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";

const THEME_KEY = "netpay-theme";
const AUTH_KEY = "netpay-auth";

function AuthFlow() {
  const [mode, setMode] = useState("signin");
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem(THEME_KEY) || "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const [formData, setFormData] = useState({
    email: "", password: "", firstName: "", lastName: "",
    country: "United Arab Emirates", gender: "", dob: "",
    phoneCode: "+971", phone: "", city: "", postalCode: "",
    street: "", confirmPassword: "", referralCode: "", agreedToTerms: false,
  });

  const DUMMY_CREDENTIALS = { email: "admin@netpay.com", password: "admin123" };

  const cardDetails = useMemo(() => {
    const fullName = `${formData.firstName || ""} ${formData.lastName || ""}`.trim();
    const name = fullName || "ALEX MORGAN";
    const seed = (formData.email || "netpay").toLowerCase();
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    const group = (offset) => String((h >>> offset) % 10000).padStart(4, "0");
    const number = `4${group(2).slice(1)}  ${group(6)}  ${group(10)}  ${group(14)}`;
    return { name: name.toUpperCase().slice(0, 22), number, expiry: "12 / 29" };
  }, [formData.firstName, formData.lastName, formData.email]);

  const handleSignInSubmit = (ev) => {
    ev.preventDefault();
    if (formData.email === DUMMY_CREDENTIALS.email && formData.password === DUMMY_CREDENTIALS.password) {
      localStorage.setItem(AUTH_KEY, "logged_in");
      window.location.href = "/dashboard";
    } else {
      alert("Invalid credentials. Use admin@netpay.com / admin123");
    }
  };

  const handleSignUpFinish = () => {
    localStorage.setItem(AUTH_KEY, "logged_in");
    window.location.href = "/dashboard";
  };

  const switchMode = () => setMode((m) => (m === "signin" ? "signup" : "signin"));

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white" data-testid="auth-page-root">
      <div className="aurora-bg" />
      <header className="relative z-20 flex items-center justify-between px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-5 w-full shrink-0">
        <div className="flex items-center gap-2" data-testid="brand-logo">
          <img src="/logo.png" alt="NetPay" className="h-14 sm:h-16 md:h-20 w-auto select-none drop-shadow-[0_0_22px_rgba(16,185,129,0.40)]" draggable={false} />
        </div>
        <div className="flex items-center gap-3">
          <button type="button" data-testid="theme-toggle" onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            className="relative h-9 w-9 rounded-full glass-strong flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
            {theme === "dark" ? <Sun className="h-4 w-4 text-emerald-300" /> : <Moon className="h-4 w-4 text-emerald-700" />}
          </button>
        </div>
      </header>
      <main className="relative z-10 grid grid-cols-1 grid-rows-[auto_1fr] lg:grid-cols-2 lg:grid-rows-1 gap-0 lg:gap-0 w-full min-h-[100vh] overflow-hidden">
        <section className="order-2 lg:order-1 flex flex-col justify-start lg:justify-center items-start lg:pr-0 pt-4 lg:pt-0 px-4 lg:px-24 pb-6 lg:pb-0 overflow-y-auto lg:overflow-visible" data-testid="left-panel">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-full glass text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-emerald-200/80 mb-3 lg:mb-5">
            <Sparkles className="h-3 w-3 flex-shrink-0" /> Private Beta · Gateway v4.2
          </div>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-semibold leading-[1.05] tracking-tight mb-2 lg:mb-3">
            Secure Digital Payments
          </h1>
          <p className="text-[13px] sm:text-[14px] lg:text-[15px] leading-relaxed text-emerald-50/60 max-w-md lg:max-w-lg mb-4 lg:mb-5">
            Accept, route and reconcile transactions across 140+ currencies with a ledger that never sleeps. Sign in to your treasury.
          </p>
          <div className="w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[480px] xl:max-w-[560px] mx-auto lg:mx-0">
            <img src="/card.png" alt="Digital Payment Card" className="w-full h-auto aspect-[16/10] object-contain" />
          </div>
          <div className="hidden lg:flex items-center gap-4 mt-5 lg:mt-6 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-white/40">
            <div className="flex items-center gap-1.5"><Lock className="h-3 w-3 flex-shrink-0" /> PCI-DSS L1</div>
            <div>SOC 2 Type II</div>
            <div>ISO 27001</div>
          </div>
        </section>
        <section className="order-1 lg:order-2 flex items-start lg:items-center justify-center lg:pl-0 py-3 lg:py-0 px-4 lg:px-8 w-full" data-testid="right-panel">
          <div className="w-full max-w-[460px] flex-shrink-0">
            <AuthPanel mode={mode} setMode={setMode} formData={formData} setFormData={setFormData} cardDetails={cardDetails}
              onSignIn={handleSignInSubmit} onSignUp={handleSignUpFinish} onAuthSuccess={() => {}} />
            <div className="hidden md:flex items-center justify-center gap-2 mt-4 text-[11px] text-emerald-200/70">
              <Shield className="h-3.5 w-3.5 flex-shrink-0" /> <span>Bank-grade 256-bit encryption</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthFlow />} />
        <Route path="/dashboard/*" element={<DashboardLayout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
