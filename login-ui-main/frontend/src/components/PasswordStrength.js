import React, { useMemo } from "react";
import { motion } from "framer-motion";

function score(pw = "") {
  let s = 0;
  if (!pw) return 0;
  if (pw.length >= 6) s += 1;
  if (pw.length >= 10) s += 1;
  if (/[A-Z]/.test(pw)) s += 1;
  if (/[0-9]/.test(pw)) s += 1;
  if (/[^A-Za-z0-9]/.test(pw)) s += 1;
  return Math.min(s, 5);
}

const LABELS = ["Too short", "Weak", "Fair", "Good", "Strong", "Excellent"];
const COLORS = [
  "from-red-500/60 to-red-400/60",
  "from-red-500/70 to-orange-400/70",
  "from-amber-500/70 to-yellow-400/70",
  "from-lime-400/70 to-emerald-400/70",
  "from-emerald-500/80 to-emerald-300/80",
  "from-emerald-400/90 to-teal-300/90",
];

export default function PasswordStrength({ password = "" }) {
  const s = useMemo(() => score(password), [password]);
  const pct = (s / 5) * 100;

  return (
    <div className="mt-2" data-testid="password-strength">
      <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden flex gap-[3px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 h-full rounded-full bg-white/[0.05] overflow-hidden">
            <motion.div
              initial={false}
              animate={{ scaleX: s > i ? 1 : 0 }}
              transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
              style={{ transformOrigin: "left" }}
              className={`h-full w-full rounded-full bg-gradient-to-r ${COLORS[Math.min(s, 5)]}`}
            />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[11px] text-white/40">
        <span data-testid="password-strength-label">
          {password ? LABELS[s] : "Use 10+ chars, mix case, numbers & symbols"}
        </span>
        <span className="font-mono-card text-emerald-300/60">{password.length} / 10+</span>
      </div>
    </div>
  );
}
