import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Check,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub } from "react-icons/fa6";
import PartitionAnimator from "@/components/PartitionAnimator";
import PasswordStrength from "@/components/PasswordStrength";

const COUNTRIES = [
  { name: "United Arab Emirates", code: "+971" },
  { name: "United States", code: "+1" },
  { name: "United Kingdom", code: "+44" },
  { name: "India", code: "+91" },
  { name: "Saudi Arabia", code: "+966" },
  { name: "Pakistan", code: "+92" },
  { name: "Egypt", code: "+20" },
  { name: "Bangladesh", code: "+880" },
  { name: "Philippines", code: "+63" },
  { name: "Indonesia", code: "+62" },
  { name: "Australia", code: "+61" },
  { name: "Canada", code: "+1" },
  { name: "Germany", code: "+49" },
  { name: "France", code: "+33" },
  { name: "Singapore", code: "+65" },
  { name: "Qatar", code: "+974" },
  { name: "Kuwait", code: "+965" },
  { name: "Bahrain", code: "+973" },
  { name: "Oman", code: "+968" },
  { name: "Turkey", code: "+90" },
  { name: "Japan", code: "+81" },
  { name: "China", code: "+86" },
  { name: "South Africa", code: "+27" },
  { name: "Brazil", code: "+55" },
  { name: "Mexico", code: "+52" },
];

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
    <div className="grid grid-cols-3 gap-3">
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
        data-testid="social-facebook-btn"
        className="flex items-center justify-center gap-2.5 rounded-xl glass py-3 text-sm text-white/85 hover:bg-white/[0.08] hover:border-emerald-400/30 transition-all"
      >
        <FaFacebook className="h-[18px] w-[18px] text-[#1877f2]" />
        <span>Facebook</span>
      </button>
      <button
        type="button"
        data-testid="social-github-btn"
        className="flex items-center justify-center gap-2.5 rounded-xl glass py-3 text-sm text-white/85 hover:bg-white/[0.08] hover:border-emerald-400/30 transition-all"
      >
        <FaGithub className="h-[18px] w-[18px] text-white" />
        <span>GitHub</span>
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

function LField({ label, required, error, children, hint }) {
  return (
    <div>
      <label className="flex items-baseline gap-1.5 text-[10px] uppercase tracking-[0.18em] font-semibold text-emerald-300/80 mb-1.5">
        <span>{label}</span>
        {required && <span className="text-red-400">*</span>}
        {hint && <span className="ml-1 lowercase tracking-normal text-[10px] text-white/35 italic">{hint}</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-[11px] text-red-300/90">{error}</p>}
    </div>
  );
}

const baseInputCls =
  "input-glow w-full rounded-lg bg-white/[0.06] border border-white/10 text-white placeholder:text-white/30 text-[13px] py-2.5 px-3 transition-colors";

const PInput = React.forwardRef(function PInput(props, ref) {
  return <input ref={ref} {...props} className={baseInputCls} />;
});

function PSelect({ children, ...props }) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`${baseInputCls} appearance-none pr-9 cursor-pointer`}
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-emerald-300/70"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M5 8l5 5 5-5z" />
      </svg>
    </div>
  );
}

function SectionHeader({ children }) {
  return (
    <div className="flex items-center gap-3 pt-0.5">
      <div className="text-[10px] uppercase tracking-[0.22em] font-semibold text-emerald-400/85">
        {children}
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-emerald-400/30 via-white/10 to-transparent" />
    </div>
  );
}

function Stepper({ current, total, labels }) {
  return (
    <div className="flex items-center gap-2" data-testid="signup-stepper">
      {Array.from({ length: total }).map((_, i) => {
        const idx = i + 1;
        const isActive = idx === current;
        const isDone = idx < current;
        return (
          <React.Fragment key={i}>
            <div className="flex items-center gap-2 min-w-0">
              <motion.div
                animate={{
                  scale: isActive ? 1.05 : 1,
                  backgroundColor:
                    isActive || isDone
                      ? "rgba(16,185,129,0.22)"
                      : "rgba(255,255,255,0.04)",
                  borderColor:
                    isActive || isDone
                      ? "rgba(52,211,153,0.65)"
                      : "rgba(255,255,255,0.12)",
                  boxShadow: isActive
                    ? "0 0 0 4px rgba(16,185,129,0.12)"
                    : "0 0 0 0 rgba(0,0,0,0)",
                }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                className="h-7 w-7 shrink-0 rounded-full border flex items-center justify-center text-[11px] font-semibold text-white"
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : idx}
              </motion.div>
              <span
                className={`text-[11px] hidden sm:inline truncate ${
                  isActive
                    ? "text-white/90 font-medium"
                    : isDone
                    ? "text-emerald-200/75"
                    : "text-white/40"
                }`}
              >
                {labels[i]}
              </span>
            </div>
            {idx < total && (
              <div
                className={`flex-1 h-px transition-colors ${
                  isDone ? "bg-emerald-400/55" : "bg-white/10"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

const STEP_TITLES = ["Personal Information", "Contact & Address", "Security"];

function SignUpForm({
  formData,
  setFormData,
  loading,
  errors,
  showPw,
  setShowPw,
  step,
  setStep,
  validateStep,
  direction,
  setDirection,
}) {
  const totalSteps = 3;

  const goNext = () => {
    if (!validateStep(step)) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, totalSteps));
  };
  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (loading) return;
    if (step < totalSteps) {
      goNext();
    } else if (validateStep(step)) {
    }
  };

  const update = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((p) => ({ ...p, [field]: value }));
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    const found = COUNTRIES.find((c) => c.name === country);
    setFormData((p) => ({
      ...p,
      country,
      phoneCode: found ? found.code : p.phoneCode,
    }));
  };

  const slideVariants = {
    initial: (d) => ({ opacity: 0, x: d > 0 ? 28 : -28 }),
    animate: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: d > 0 ? -28 : 28 }),
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} data-testid="signup-form">
      <div>
        <h2 className="font-display text-[26px] font-semibold tracking-tight leading-none">
          Create your account.
        </h2>
        <p className="mt-1.5 text-[12px] text-white/50">
          Step {step} of {totalSteps} —{" "}
          <span className="text-emerald-300/80">{STEP_TITLES[step - 1]}</span>
        </p>
      </div>
      <Stepper current={step} total={totalSteps} labels={["Personal", "Contact", "Security"]} />
      <AnimatePresence mode="wait" custom={direction} initial={false}>
        {step === 1 && (
          <motion.div
            key="step-1"
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex flex-col gap-4"
            data-testid="signup-step-1"
          >
            <SectionHeader>Personal Information</SectionHeader>
            <div className="grid grid-cols-2 gap-3">
              <LField label="First Name" required error={errors.firstName}>
                <PInput
                  data-testid="signup-firstname-input"
                  type="text"
                  autoComplete="given-name"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={update("firstName")}
                />
              </LField>
              <LField label="Last Name" required error={errors.lastName}>
                <PInput
                  data-testid="signup-lastname-input"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={update("lastName")}
                />
              </LField>
            </div>
            <LField label="Email Address" required error={errors.email}>
              <PInput
                data-testid="signup-email-input"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={update("email")}
              />
            </LField>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            key="step-2"
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex flex-col gap-4"
            data-testid="signup-step-2"
          >
            <SectionHeader>Contact Details</SectionHeader>
            <LField label="Country" required error={errors.country}>
              <PSelect
                data-testid="signup-country-select"
                value={formData.country}
                onChange={handleCountryChange}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.name} value={c.name} className="bg-zinc-900 text-white">
                    {c.name}
                  </option>
                ))}
              </PSelect>
            </LField>
            <div className="grid grid-cols-2 gap-3">
              <LField label="Gender" required error={errors.gender}>
                <PSelect
                  data-testid="signup-gender-select"
                  value={formData.gender}
                  onChange={update("gender")}
                >
                  <option value="" className="bg-zinc-900 text-white">Select…</option>
                  <option value="male" className="bg-zinc-900 text-white">Male</option>
                  <option value="female" className="bg-zinc-900 text-white">Female</option>
                  <option value="other" className="bg-zinc-900 text-white">Other</option>
                  <option value="prefer-not-to-say" className="bg-zinc-900 text-white">
                    Prefer not to say
                  </option>
                </PSelect>
              </LField>
              <LField label="Date of Birth" required error={errors.dob}>
                <PInput
                  data-testid="signup-dob-input"
                  type="date"
                  value={formData.dob}
                  onChange={update("dob")}
                />
              </LField>
            </div>
            <LField label="Phone Number" required error={errors.phone}>
              <div className="flex gap-2">
                <div className="flex items-center justify-center px-3 rounded-lg bg-white/[0.06] border border-white/10 text-[13px] text-emerald-300/90 font-medium min-w-[68px]">
                  {formData.phoneCode || "+971"}
                </div>
                <PInput
                  data-testid="signup-phone-input"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Enter mobile number"
                  value={formData.phone}
                  onChange={update("phone")}
                />
              </div>
            </LField>
            <SectionHeader>Address</SectionHeader>
            <div className="grid grid-cols-2 gap-3">
              <LField label="City / Town" required error={errors.city}>
                <PInput
                  data-testid="signup-city-input"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="City"
                  value={formData.city}
                  onChange={update("city")}
                />
              </LField>
              <LField label="Postal / Zip Code" required error={errors.postalCode}>
                <PInput
                  data-testid="signup-postal-input"
                  type="text"
                  autoComplete="postal-code"
                  placeholder="Postal code"
                  value={formData.postalCode}
                  onChange={update("postalCode")}
                />
              </LField>
            </div>
            <LField label="Street Address" required error={errors.street}>
              <PInput
                data-testid="signup-street-input"
                type="text"
                autoComplete="street-address"
                placeholder="Street address"
                value={formData.street}
                onChange={update("street")}
              />
            </LField>
          </motion.div>
        )}
        {step === 3 && (
          <motion.div
            key="step-3"
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex flex-col gap-4"
            data-testid="signup-step-3"
          >
            <SectionHeader>Security</SectionHeader>
            <div className="grid grid-cols-2 gap-3">
              <LField label="Password" required error={errors.password}>
                <div className="relative">
                  <input
                    data-testid="signup-password-input"
                    type={showPw ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Min. 8 characters"
                    value={formData.password}
                    onChange={update("password")}
                    className={`${baseInputCls} pr-9`}
                  />
                  <button
                    type="button"
                    data-testid="toggle-password-visibility-signup"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-white/50 hover:text-emerald-300 transition-colors"
                  >
                    {showPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </LField>
              <LField label="Confirm Password" required error={errors.confirmPassword}>
                <PInput
                  data-testid="signup-confirm-password-input"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={update("confirmPassword")}
                />
              </LField>
            </div>
            <PasswordStrength password={formData.password} />
            <LField label="Referral Code" hint="(optional)" error={errors.referralCode}>
              <PInput
                data-testid="signup-referral-input"
                type="text"
                placeholder="Enter referral code (optional)"
                value={formData.referralCode}
                onChange={update("referralCode")}
              />
            </LField>
            <div>
              <label
                data-testid="signup-terms-label"
                className="flex items-start gap-2.5 text-[12px] text-white/70 cursor-pointer select-none"
              >
                <input
                  data-testid="signup-terms-checkbox"
                  type="checkbox"
                  className="peer sr-only"
                  checked={!!formData.agreedToTerms}
                  onChange={update("agreedToTerms")}
                />
                <span className="mt-[2px] h-4 w-4 shrink-0 rounded-[5px] border border-white/20 bg-white/5 peer-checked:bg-emerald-500 peer-checked:border-emerald-400 flex items-center justify-center transition-all">
                  <Check className="h-3 w-3 text-white opacity-0 peer-checked:opacity-100" />
                </span>
                <span className="leading-snug">
                  I agree to the{" "}
                  <span className="text-emerald-300/90 hover:text-emerald-200">
                    Terms and Conditions
                  </span>{" "}
                  and{" "}
                  <span className="text-emerald-300/90 hover:text-emarthod:green-200">
                    Privacy Policy
                  </span>{" "}
                  of Netpay
                </span>
              </label>
              {errors.agreedToTerms && (
                <p className="mt-1 ml-7 text-[11px] text-red-300/90">{errors.agreedToTerms}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex items-center gap-3 mt-1">
        {step > 1 && (
          <button
            type="button"
            data-testid="signup-back-btn"
            onClick={goBack}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl glass py-3 px-5 text-[13px] text-white/85 hover:bg-white/[0.08] hover:border-emerald-400/30 transition-all"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        )}
        <button
          data-testid="signup-submit-btn"
          type="submit"
          disabled={loading}
          className="btn-emerald relative flex items-center justify-center gap-2 flex-1 rounded-xl py-3.5 text-[14px] font-semibold text-white"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Creating account…
            </>
          ) : step < 3 ? (
            <>
              Continue <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            <>
              Create account <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default function AuthPanel({ mode, setMode, formData, setFormData, cardDetails, onSignIn, onSignUp, onAuthSuccess }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [toast, setToast] = useState(null);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const panelRef = useRef(null);

  const validateSignIn = () => {
    const e = {};
    if (!formData.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Invalid email format";
    if (!formData.password) e.password = "Password is required";
    else if (formData.password.length < 6) e.password = "At least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!formData.firstName?.trim()) e.firstName = "Required";
      if (!formData.lastName?.trim()) e.lastName = "Required";
      if (!formData.email) e.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Invalid email format";
    } else if (s === 2) {
      if (!formData.country) e.country = "Required";
      if (!formData.gender) e.gender = "Required";
      if (!formData.dob) e.dob = "Required";
      if (!formData.phone?.trim()) e.phone = "Required";
      if (!formData.city?.trim()) e.city = "Required";
      if (!formData.postalCode?.trim()) e.postalCode = "Required";
      if (!formData.street?.trim()) e.street = "Required";
    } else if (s === 3) {
      if (!formData.password) e.password = "Password is required";
      else if (formData.password.length < 8) e.password = "Min. 8 characters";
      if (!formData.confirmPassword) e.confirmPassword = "Confirm your password";
      else if (formData.confirmPassword !== formData.password) e.confirmPassword = "Passwords do not match";
      if (!formData.agreedToTerms) e.agreedToTerms = "You must agree to continue";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignInSubmit = (ev) => {
    ev.preventDefault();
    if (!validateSignIn()) return;
    // Call parent's sign-in handler (which handles auth and redirect)
    if (onSignIn) onSignIn(ev);
  };

  const handleSignUpFinish = () => {
    if (!validateStep(3)) return;
    // Call parent's sign-up handler
    if (onSignUp) onSignUp();
  };

  const switchMode = () => {
    setErrors({});
    setStep(1);
    setDirection(1);
    setMode((m) => (m === "signin" ? "signup" : "signin"));
  };

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
        const msg = mode === "signin" ? "Welcome back — redirecting to your dashboard." : "Account created — check your inbox to verify.";
        setToast(msg);
        setTimeout(() => setToast(null), 3000);
        if (onAuthSuccess) onAuthSuccess();
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [loading, mode, onAuthSuccess]);

  return (
    <div className="relative w-full max-w-[460px]" ref={panelRef}>
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
        <PartitionAnimator activeKey={mode}>
          {mode === "signin" ? (
            <SignInForm
              key="signin"
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSignInSubmit}
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
              loading={loading}
              errors={errors}
              showPw={showPw}
              setShowPw={setShowPw}
              step={step}
              setStep={setStep}
              validateStep={validateStep}
              direction={direction}
              setDirection={setDirection}
            />
          )}
        </PartitionAnimator>
        <div className="mt-6 text-center text-[12px] text-white/40">
          {mode === "signin" ? "New to Netpay?" : "Already have an account?"}{" "}
          <button
            data-testid="switch-mode-inline"
            onClick={switchMode}
            className="text-emerald-300 hover:text-emerald-200 transition-colors font-medium"
          >
            {mode === "signin" ? "Create an account" : "Sign in instead"}
          </button>
        </div>
      </div>
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
