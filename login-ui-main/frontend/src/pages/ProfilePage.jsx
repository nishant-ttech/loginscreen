import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Globe,
  ShieldCheck,
  Lock,
  KeyRound,
  CheckCircle,
  AlertCircle,
  Edit3,
} from "lucide-react";

const PROFILE = {
  firstName: "Mansab",
  lastName: "Mehta",
  email: "mansabmehta67@gmail.com",
  gender: "Male",
  dob: "1996-08-14",
  country: "United Arab Emirates",
  phoneCode: "+971",
  phone: "50 123 4567",
  street: "Al Ittihad Rd, Office 14",
  city: "Dubai",
  postal: "00000",
  kycStatus: "approved",
  twoFA: true,
  memberSince: "2025-09-21",
};

function Field({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
      <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-emerald-400" />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-white/40 uppercase tracking-wider mb-0.5">{label}</div>
        <div className="text-white text-sm break-all">{value || "—"}</div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const fullName = `${PROFILE.firstName} ${PROFILE.lastName}`.trim();
  const initials = (PROFILE.firstName[0] + PROFILE.lastName[0]).toUpperCase();
  const fullPhone = `${PROFILE.phoneCode} ${PROFILE.phone}`;

  const kycLabel = {
    approved: { label: "Verified", color: "text-emerald-400", bg: "bg-emerald-500/20", Icon: CheckCircle },
    pending: { label: "Pending", color: "text-amber-400", bg: "bg-amber-500/20", Icon: AlertCircle },
    not_submitted: { label: "Not submitted", color: "text-white/60", bg: "bg-white/10", Icon: AlertCircle },
    rejected: { label: "Rejected", color: "text-red-400", bg: "bg-red-500/20", Icon: AlertCircle },
  }[PROFILE.kycStatus];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">My Profile</h1>
          <p className="text-white/60 text-sm mt-1">Personal information and account status</p>
        </div>
        <Link to="/profile/change-password">
          <Button className="glass">
            <KeyRound className="h-4 w-4 mr-2" /> Change password
          </Button>
        </Link>
      </div>

      <Card className="glass-strong border-white/10 overflow-hidden">
        <div className="p-6 bg-gradient-to-br from-emerald-500/15 via-transparent to-emerald-500/5">
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-500/40 to-emerald-700/40 border border-emerald-500/40 flex items-center justify-center text-2xl font-bold text-emerald-300">
              {initials}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{fullName}</h2>
              <p className="text-white/50 text-sm">{PROFILE.email}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${kycLabel.bg} ${kycLabel.color}`}
                >
                  <kycLabel.Icon className="h-3 w-3" /> KYC: {kycLabel.label}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                    PROFILE.twoFA
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-white/10 text-white/60"
                  }`}
                >
                  <ShieldCheck className="h-3 w-3" />
                  2FA: {PROFILE.twoFA ? "Enabled" : "Disabled"}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                  Member since {PROFILE.memberSince}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-strong border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white text-lg">Personal information</CardTitle>
              <Link to="/kyc">
                <Button variant="ghost" size="sm" className="text-emerald-400 h-8 px-2">
                  <Edit3 className="h-3.5 w-3.5 mr-1" /> Edit via KYC
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field icon={UserCircle} label="Full name" value={fullName} />
                <Field icon={Mail} label="Email" value={PROFILE.email} />
                <Field icon={UserCircle} label="Gender" value={PROFILE.gender} />
                <Field icon={Calendar} label="Date of birth" value={PROFILE.dob} />
                <Field icon={Phone} label="Phone" value={fullPhone} />
                <Field icon={Globe} label="Country" value={PROFILE.country} />
                <Field icon={MapPin} label="Address" value={PROFILE.street} />
                <Field icon={MapPin} label="City / Postal" value={`${PROFILE.city} · ${PROFILE.postal}`} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-strong border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Security</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-3">
              <Link to="/profile/change-password" className="block">
                <button className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-amber-500/20 flex items-center justify-center">
                      <Lock className="h-4 w-4 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">Password</div>
                      <div className="text-xs text-white/40">Last changed 38 days ago</div>
                    </div>
                    <span className="text-xs text-emerald-400">Change →</span>
                  </div>
                </button>
              </Link>
              <Link to="/security" className="block">
                <button className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">Two-factor auth</div>
                      <div className="text-xs text-emerald-400">Enabled · Authenticator app</div>
                    </div>
                    <span className="text-xs text-emerald-400">Manage →</span>
                  </div>
                </button>
              </Link>
            </CardContent>
          </Card>

          <Card className="glass-strong border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Quick links</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-2">
              <Link to="/kyc">
                <Button variant="ghost" className="w-full justify-start text-white/70">
                  → Update KYC documents
                </Button>
              </Link>
              <Link to="/wallet">
                <Button variant="ghost" className="w-full justify-start text-white/70">
                  → Wallet overview
                </Button>
              </Link>
              <Link to="/cards">
                <Button variant="ghost" className="w-full justify-start text-white/70">
                  → My cards
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
