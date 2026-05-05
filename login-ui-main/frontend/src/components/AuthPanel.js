import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import PartitionAnimator from "@/components/PartitionAnimator";
import PasswordStrength from "@/components/PasswordStrength";

const FieldIcon = ({ children }) => (
  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-300/60 pointer-events-none">
    {children}
  </div>
);

const Input = ({ icon, type = "text", error, rightSlot, ...props }) => (
  <div className="relative">
    {icon && <FieldIcon>{icon}</FieldIcon>}
    <input
      type={type}
      {...props}
      className={`input-glow w-full rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 text-[14px] py-3.5 pl-11 ${rightSlot ? "pr-11" : "pr-4"} transition-colors`}
    />
    {rightSlot && (
      <div className="absolute right-2 top-1/2 -translate-y-1/2">{rightSlot}</div>
    )}
    {error && <p className="mt-1.5 ml-1 text-[11px] text-red-300/90">{error}</p>}
  </div>
);

function SocialRow() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        data-testid="social-google-btn"
        className="flex items-center justify-center gap-2.5 rounded-xl glass py-3 text-sm text-white/85 hover:bg-white/[0.08] hover:border-emerald-400/30 transition-all"
      >
        <FcGoogle className="h-[18px] w-[18px]" />
        <span>Google</span>
      </button>
      <button
        type="button"
        data-testid="social-apple-btn"
        className="flex items-center justify-center gap-2.5 rounded-xl glass py-3 text-sm text-white/85 hover:bg-white/[0.08] hover:border-emerald-400/30 transition-all"
      >
        <FaApple className="h-[18px] w-[18px] text-white" />
        <span>Apple</span>
      </button>
    </div>
  );
}

function Divider() {
  return (
    <div className="relative flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-white/35">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <span>or continue with email</span>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </div>
  );
}

function SignInForm({ formData, setFormData, onSubmit, loading, errors, showPw, setShowPw }) {
  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit} data-testid="signin-form">
      <div>
        <h2 className="font-display text-[28px] font-semibold tracking-tight leading-none">
          Welcome back.
        </h2>
        <p className="mt-1.5 text-[13px] text-white/50">
          Sign in to your treasury dashboard.
        </p>
      </div>

      <SocialRow />
      <Divider />

      <Input
        data-testid="signin-email-input"
        icon={<Mail className="h-4 w-4" />}
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
        value={formData.email}
        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
        error={errors.email}
      />

      <Input
        data-testid="signin-password-input"
        icon={<Lock className="h-4 w-4" />}
        type={showPw ? "text" : "password"}
        autoComplete="current-password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
        error={errors.password}
        rightSlot={
          <button
            type="button"
            data-testid="toggle-password-visibility"
            onClick={() => setShowPw((s) => !s)}
            className="p-2 rounded-lg text-white/50 hover:text-emerald-300 transition-colors"
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
      />

      <div className="flex items-center justify-between text-[12px]">
        <label className="flex items-center gap-2 text-white/60 cursor-pointer select-none" data-testid="remember-me-label">
          <input
            data-testid="remember-me-checkbox"
            type="checkbox"
            className="peer sr-only"
            defaultChecked
          />
          <span className="h-4 w-4 rounded-[5px] border border-white/20 bg-white/5 peer-checked:bg-emerald-500 peer-checked:border-emerald-400 flex items-center justify-center transition-all">
            <CheckCircle2 className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100" />
          </span>
          Remember me for 30 days
        </label>
        <button
          type="button"
          data-testid="forgot-password-link"
          className="text-emerald-300/80 hover:text-emerald-200 transition-colors"
        >
          Forgot password?
        </button>
      </div>

      <button
        data-testid="signin-submit-btn"
        type="submit"
        disabled={loading}
        className="btn-emerald relative mt-2 flex items-center justify-center gap-2 w-full rounded-xl py-3.5 text-[14px] font-semibold text-white"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Authenticating…
          </>
        ) : (
          <>
            Sign in securely <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}

function SignUpForm({ formData, setFormData, onSubmit, loading, errors, showPw, setShowPw }) {
  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit} data-testid="signup-form">
      <div>
        <h2 className="font-display text-[28px] font-semibold tracking-tight leading-none">
          Create your account.
        </h2>
        <p className="mt-1.5 text-[13px] text-white/50">
          Launch your payment gateway in under 60 seconds.
        </p>
      </div>

      <SocialRow />
      <Divider />

      <Input
        data-testid="signup-name-input"
        icon={<User className="h-4 w-4" />}
        type="text"
        autoComplete="name"
        placeholder="Full name"
        value={formData.name}
        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
        error={errors.name}
      />

      <Input
        data-testid="signup-email-input"
        icon={<Mail className="h-4 w-4" />}
        type="email"
        autoComplete="email"
        placeholder="Work email"
        value={formData.email}
        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
        error={errors.email}
      />

      <div>
        <Input
          data-testid="signup-password-input"
          icon={<Lock className="h-4 w-4" />}
          type={showPw ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Create a password"
          value={formData.password}
          onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
          error={errors.password}
          rightSlot={
            <button
              type="button"
              data-testid="toggle-password-visibility-signup"
              onClick={() => setShowPw((s) => !s)}
              className="p-2 rounded-lg text-white/50 hover:text-emerald-300 transition-colors"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        <PasswordStrength password={formData.password} />
      </div>

      <p className="text-[11px] text-white/40 leading-relaxed">
        By continuing you agree to Verdant·Pay's{" "}
        <span className="text-emerald-300/80">Terms</span> &{" "}
        <span className="text-emerald-300/80">Privacy Policy</span>.
      </p>

      <button
        data-testid="signup-submit-btn"
        type="submit"
        disabled={loading}
        className="btn-emerald relative flex items-center justify-center gap-2 w-full rounded-xl py-3.5 text-[14px] font-semibold text-white"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Creating account…
          </>
        ) : (
          <>
            Create account <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}

export default function AuthPanel({ mode, setMode, formData, setFormData }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [toast, setToast] = useState(null);
  const panelRef = useRef(null);

  const validate = () => {
    const e = {};
    if (!formData.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Invalid email format";
    if (!formData.password) e.password = "Password is required";
    else if (formData.password.length < 6) e.password = "At least 6 characters";
    if (mode === "signup" && !formData.name?.trim()) e.name = "Name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setToast(
        mode === "signin"
          ? "Welcome back — redirecting to your dashboard."
          : "Account created — check your inbox to verify."
      );
      setTimeout(() => setToast(null), 3500);
    }, 1400);
  };

  const switchMode = () => {
    setErrors({});
    setMode((m) => (m === "signin" ? "signup" : "signin"));
  };

  return (
    <div className="relative w-full max-w-[460px]" ref={panelRef}>
      {/* Outer emerald glow halo */}
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[36px] pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(16,185,129,0.18) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative rounded-[28px] glass-strong p-7 md:p-9 overflow-hidden"
        data-testid="auth-panel-card"
      >
        {/* Tab switcher */}
        <div
          className="relative grid grid-cols-2 p-1 rounded-xl bg-white/[0.03] border border-white/10 mb-7 text-[12px] font-medium"
          data-testid="auth-tabs"
        >
          <motion.div
            layout
            layoutId="tab-pill"
            className="absolute inset-y-1 w-[calc(50%-4px)] rounded-lg bg-gradient-to-b from-emerald-500/25 to-emerald-700/20 border border-emerald-400/30"
            style={{ left: mode === "signin" ? 4 : "calc(50% + 0px)" }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
          />
          <button
            type="button"
            data-testid="tab-signin"
            onClick={() => mode !== "signin" && switchMode()}
            className={`relative z-10 py-2.5 rounded-lg transition-colors ${mode === "signin" ? "text-white" : "text-white/50 hover:text-white/80"}`}
          >
            Sign in
          </button>
          <button
            type="button"
            data-testid="tab-signup"
            onClick={() => mode !== "signup" && switchMode()}
            className={`relative z-10 py-2.5 rounded-lg transition-colors ${mode === "signup" ? "text-white" : "text-white/50 hover:text-white/80"}`}
          >
            Create account
          </button>
        </div>

        {/* Animated form area */}
        <PartitionAnimator activeKey={mode}>
          {mode === "signin" ? (
            <SignInForm
              key="signin"
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              loading={loading}
              errors={errors}
              showPw={showPw}
              setShowPw={setShowPw}
            />
          ) : (
            <SignUpForm
              key="signup"
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              loading={loading}
              errors={errors}
              showPw={showPw}
              setShowPw={setShowPw}
            />
          )}
        </PartitionAnimator>

        {/* Subtle bottom helper */}
        <div className="mt-6 text-center text-[12px] text-white/40">
          {mode === "signin" ? "New to Verdant·Pay?" : "Already have an account?"}{" "}
          <button
            data-testid="switch-mode-inline"
            onClick={switchMode}
            className="text-emerald-300 hover:text-emerald-200 transition-colors font-medium"
          >
            {mode === "signin" ? "Create an account" : "Sign in instead"}
          </button>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            data-testid="auth-toast"
            className="absolute left-1/2 -translate-x-1/2 -bottom-14 whitespace-nowrap px-4 py-2.5 rounded-xl glass-strong text-[13px] text-emerald-100 glow-emerald flex items-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
