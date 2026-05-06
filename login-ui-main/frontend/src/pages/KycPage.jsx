import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Camera,
  Image as ImageIcon,
  X,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DOC_TYPES = [
  { id: "passport", label: "Passport", desc: "International travel document" },
  { id: "national_id", label: "National ID", desc: "Government-issued ID card" },
  { id: "driving_license", label: "Driving License", desc: "Valid driving permit" },
];

function FileUploader({ label, file, onChange, accept = "image/jpeg,image/png,image/jpg,application/pdf" }) {
  const id = `file-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="space-y-2">
      <Label className="text-white/70 text-sm">{label}</Label>
      <label
        htmlFor={id}
        className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-white/15 bg-white/5 hover:bg-white/10 hover:border-emerald-500/40 cursor-pointer transition-all"
      >
        {file ? (
          <>
            <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="text-sm text-white truncate max-w-[200px]">{file.name}</span>
            <span className="text-xs text-white/40">{(file.size / 1024).toFixed(1)} KB</span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onChange(null);
              }}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Remove
            </button>
          </>
        ) : (
          <>
            <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
              <Upload className="h-5 w-5 text-white/60" />
            </div>
            <span className="text-sm text-white/70">Click to upload</span>
            <span className="text-xs text-white/40">JPG, PNG or PDF — max 1MB</span>
          </>
        )}
        <input
          id={id}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
        />
      </label>
    </div>
  );
}

export default function KycPage() {
  const [kycStatus] = useState({
    status: "not_submitted",
    rejection_reason: null,
  });

  const [docType, setDocType] = useState("passport");
  const [idNumber, setIdNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [docFront, setDocFront] = useState(null);
  const [docBack, setDocBack] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const isValidExpiry = !issueDate || !expiryDate || new Date(expiryDate) > new Date(issueDate);
  const canSubmit =
    idNumber.trim().length > 3 &&
    issueDate &&
    expiryDate &&
    isValidExpiry &&
    docFront &&
    docBack &&
    selfie;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
  };

  const statusBadge = {
    not_submitted: { label: "Not Submitted", color: "bg-white/10 text-white/70", Icon: Clock },
    pending: { label: "Pending Review", color: "bg-amber-500/20 text-amber-400", Icon: Clock },
    in_review: { label: "In Review", color: "bg-blue-500/20 text-blue-400", Icon: Clock },
    approved: { label: "Approved", color: "bg-emerald-500/20 text-emerald-400", Icon: CheckCircle },
    rejected: { label: "Rejected", color: "bg-red-500/20 text-red-400", Icon: AlertCircle },
  };

  const status = submitted ? "pending" : kycStatus.status;
  const badge = statusBadge[status];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">KYC Verification</h1>
          <p className="text-white/60 text-sm mt-1">
            Verify your identity to unlock deposits, withdrawals and card issuance
          </p>
        </div>
        <div className={`px-4 py-2 rounded-xl flex items-center gap-2 ${badge.color}`}>
          <badge.Icon className="h-4 w-4" />
          <span className="text-sm font-medium">{badge.label}</span>
        </div>
      </div>

      {submitted && (
        <Card className="glass-strong border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="p-5 flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5" />
            <div>
              <p className="text-emerald-300 font-medium">Documents submitted successfully!</p>
              <p className="text-white/60 text-sm mt-1">
                Review takes 1-2 business days. You'll be notified by email once approved.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-strong border-white/10 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white text-lg">Document Information</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <Label className="text-white/70 text-sm mb-2 block">Document Type</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {DOC_TYPES.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDocType(d.id)}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        docType === d.id
                          ? "bg-emerald-500/10 border-emerald-500/50"
                          : "bg-white/5 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <FileText
                          className={`h-4 w-4 ${
                            docType === d.id ? "text-emerald-400" : "text-white/60"
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            docType === d.id ? "text-emerald-400" : "text-white/80"
                          }`}
                        >
                          {d.label}
                        </span>
                      </div>
                      <p className="text-xs text-white/40">{d.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-white/70 text-sm mb-2 block">ID Number</Label>
                  <Input
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="Enter ID number"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white/70 text-sm mb-2 block">Issue Date</Label>
                  <Input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white/70 text-sm mb-2 block">Expiry Date</Label>
                  <Input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                  {!isValidExpiry && (
                    <p className="text-xs text-red-400 mt-1">Expiry must be after issue date</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FileUploader label="Document Front" file={docFront} onChange={setDocFront} />
                <FileUploader label="Document Back" file={docBack} onChange={setDocBack} />
                <FileUploader
                  label="Selfie with Document"
                  file={selfie}
                  onChange={setSelfie}
                  accept="image/jpeg,image/png,image/jpg"
                />
              </div>

              <Button
                type="submit"
                disabled={!canSubmit || submitted}
                className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShieldCheck className="h-4 w-4 mr-2" />
                {submitted ? "Submitted" : "Submit for Verification"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="glass-strong border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Requirements</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-4">
            <div className="space-y-3 text-sm">
              {[
                "Clear, readable images with no glare",
                "Maximum file size 1MB per file",
                "JPG, PNG or PDF accepted",
                "Document must not be expired",
                "Selfie must show face + document",
                "Information must match registration",
              ].map((req) => (
                <div key={req} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-white/70">{req}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-white">Selfie tips</span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                Take the selfie in good lighting. Hold your document next to your face so both are
                clearly visible. Don't cover any details on the document.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
