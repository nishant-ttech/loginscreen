import React, { useState, useMemo } from "react";
import "@/App.css";
import PaymentCard3D from "@/components/PaymentCard3D";
import AuthPanel from "@/components/AuthPanel";
import { Shield, Lock, Sparkles } from "lucide-react";

function App() {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [formData, setFormData] = useState({
    // shared
    email: "",
    password: "",
    // signup
    firstName: "",
    lastName: "",
    country: "United Arab Emirates",
    gender: "",
    dob: "",
    phoneCode: "+971",
    phone: "",
    city: "",
    postalCode: "",
    street: "",
    confirmPassword: "",
    referralCode: "",
    agreedToTerms: false,
  });

  // Derive pseudo card details from input
  const cardDetails = useMemo(() => {
    const fullName = `${formData.firstName || ""} ${formData.lastName || ""}`.trim();
    const name = fullName || "ALEX MORGAN";
    const seed = (formData.email || "netpay").toLowerCase();
    // simple deterministic card number from email
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    const group = (offset) => String((h >>> offset) % 10000).padStart(4, "0");
    const number = `4${group(2).slice(1)}  ${group(6)}  ${group(10)}  ${group(14)}`;
    return {
      name: name.toUpperCase().slice(0, 22),
      number,
      expiry: "12 / 29",
    };
  }, [formData.firstName, formData.lastName, formData.email]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white" data-testid="auth-page-root">
      <div className="aurora-bg" />

      {/* Top bar */}
      <header className="relative z-20 flex items-center justify-between px-6 py-5 md:px-10">
        <div className="flex items-center gap-2" data-testid="brand-logo">
          <img
            src="/logo.png"
            alt="NetPay"
            className="h-10 w-auto select-none drop-shadow-[0_0_18px_rgba(16,185,129,0.35)]"
            draggable={false}
          />
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-emerald-200/70">
          <Shield className="h-3.5 w-3.5" />
          <span>Bank-grade 256-bit encryption</span>
        </div>
      </header>

      {/* Main split layout */}
      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-0 px-6 md:px-10 pb-10 lg:pb-0 lg:min-h-[calc(100vh-76px)]">
        {/* LEFT – 3D card + marketing */}
        <section className="flex flex-col justify-center items-start lg:pr-8 pt-4 lg:pt-0" data-testid="left-panel">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass text-[11px] uppercase tracking-[0.18em] text-emerald-200/80 mb-6">
            <Sparkles className="h-3 w-3 text-emerald-400" />
            Private Beta · Gateway v4.2
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.02] tracking-tight">
            Payments, <br />
            <span className="text-emerald-400/90">refined in green.</span>
          </h1>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-emerald-50/60">
            Accept, route and reconcile transactions across 140+ currencies with
            a ledger that never sleeps. Sign in to your treasury.
          </p>

          <div className="mt-8 lg:mt-12 w-full max-w-[560px] aspect-[16/10] rounded-3xl overflow-hidden">
            <PaymentCard3D
              number={cardDetails.number}
              holder={cardDetails.name}
              expiry={cardDetails.expiry}
            />
          </div>

          <div className="mt-6 hidden lg:flex items-center gap-5 text-[11px] uppercase tracking-[0.2em] text-white/40">
            <div className="flex items-center gap-1.5"><Lock className="h-3 w-3" /> PCI-DSS L1</div>
            <div>SOC 2 Type II</div>
            <div>ISO 27001</div>
          </div>
        </section>

        {/* RIGHT – auth form */}
        <section className="flex items-center justify-center lg:pl-8 py-4 lg:py-10" data-testid="right-panel">
          <AuthPanel
            mode={mode}
            setMode={setMode}
            formData={formData}
            setFormData={setFormData}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
