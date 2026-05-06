import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Lock,
  ShieldCheck,
} from "lucide-react";

function checkStrength(pwd) {
  if (!pwd) return { score: 0, label: "Empty", color: "bg-white/10", text: "text-white/40" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { score: 20, label: "Very weak", color: "bg-red-500", text: "text-red-400" };
  if (score === 2) return { score: 40, label: "Weak", color: "bg-orange-500", text: "text-orange-400" };
  if (score === 3) return { score: 60, label: "Fair", color: "bg-amber-500", text: "text-amber-400" };
  if (score === 4) return { score: 80, label: "Strong", color: "bg-emerald-500", text: "text-emerald-400" };
  return { score: 100, label: "Very strong", color: "bg-emerald-500", text: "text-emerald-400" };
}

export default function ChangePasswordPage() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const strength = useMemo(() => checkStrength(next), [next]);

  const validations = {
    minLength: next.length >= 8,
    hasUpper: /[A-Z]/.test(next),
    hasNumber: /[0-9]/.test(next),
    hasSymbol: /[^A-Za-z0-9]/.test(next),
    different: next !== current && next.length > 0,
    matches: confirm.length > 0 && confirm === next,
  };

  const allValid = Object.values(validations).every(Boolean) && current.length > 0;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!allValid) return;
    setSubmitted(true);
    setTimeout(() => navigate("/profile"), 1800);
  };

  const ToggleEye = ({ show, setShow }) => (
    <button
      type="button"
      onClick={() => setShow((s) => !s)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
    >
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link to="/profile">
          <Button variant="ghost" size="sm" className="text-white/60">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to profile
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Change Password</h1>
          <p className="text-white/60 text-sm mt-1">Set a strong, unique password for your NetPay account</p>
        </div>
      </div>

      {submitted && (
        <Card className="glass-strong border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="p-5 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5" />
            <div>
              <p className="text-emerald-300 font-medium">Password updated successfully</p>
              <p className="text-white/60 text-sm mt-1">Redirecting to your profile...</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-strong border-white/10 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Lock className="h-5 w-5 text-emerald-400" /> Update password
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label className="text-white/70 text-sm mb-2 block">Current password</Label>
                <div className="relative">
                  <Input
                    type={showCurrent ? "text" : "password"}
                    value={current}
                    onChange={(e) => setCurrent(e.target.value)}
                    placeholder="Enter your current password"
                    className="bg-white/5 border-white/10 text-white pr-10"
                  />
                  <ToggleEye show={showCurrent} setShow={setShowCurrent} />
                </div>
              </div>

              <div>
                <Label className="text-white/70 text-sm mb-2 block">New password</Label>
                <div className="relative">
                  <Input
                    type={showNext ? "text" : "password"}
                    value={next}
                    onChange={(e) => setNext(e.target.value)}
                    placeholder="Enter a new password"
                    className="bg-white/5 border-white/10 text-white pr-10"
                  />
                  <ToggleEye show={showNext} setShow={setShowNext} />
                </div>
                {next && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${strength.color}`}
                        style={{ width: `${strength.score}%` }}
                      />
                    </div>
                    <p className={`text-xs mt-1 ${strength.text}`}>Strength: {strength.label}</p>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-white/70 text-sm mb-2 block">Confirm new password</Label>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter the new password"
                    className="bg-white/5 border-white/10 text-white pr-10"
                  />
                  <ToggleEye show={showConfirm} setShow={setShowConfirm} />
                </div>
                {confirm && !validations.matches && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Passwords do not match
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={!allValid || submitted}
                className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 disabled:opacity-50"
              >
                <ShieldCheck className="h-4 w-4 mr-2" />
                {submitted ? "Updating..." : "Update password"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Requirements</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-2 text-sm">
            {[
              { ok: validations.minLength, text: "At least 8 characters" },
              { ok: validations.hasUpper, text: "One uppercase letter" },
              { ok: validations.hasNumber, text: "One number" },
              { ok: validations.hasSymbol, text: "One special character" },
              { ok: validations.different, text: "Different from current password" },
              { ok: validations.matches, text: "Both fields match" },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                {r.ok ? (
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-white/20 shrink-0" />
                )}
                <span className={r.ok ? "text-white/80" : "text-white/40"}>{r.text}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
