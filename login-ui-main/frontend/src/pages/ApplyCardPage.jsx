import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Globe,
  Truck,
} from "lucide-react";

const CARD_CATALOG = [
  {
    id: "v-basic",
    type: "virtual",
    name: "Virtual Standard",
    minDeposit: 30,
    issuance: 5,
    feePct: 1.5,
    desc: "Instant issuance · USD-denominated · Online payments",
  },
  {
    id: "v-pro",
    type: "virtual",
    name: "Virtual Pro",
    minDeposit: 100,
    issuance: 15,
    feePct: 1.0,
    desc: "Higher limits · Subscription friendly · Apple Pay ready",
  },
  {
    id: "p-classic",
    type: "physical",
    name: "Physical Classic",
    minDeposit: 200,
    issuance: 25,
    feePct: 2.0,
    desc: "Worldwide acceptance · Chip + contactless · 7-14 day delivery",
  },
  {
    id: "p-metal",
    type: "physical",
    name: "Physical Metal",
    minDeposit: 500,
    issuance: 80,
    feePct: 1.5,
    desc: "Premium metal card · Concierge perks · Priority support",
  },
];

export default function ApplyCardPage() {
  const [tab, setTab] = useState("virtual");
  const [selectedId, setSelectedId] = useState("v-basic");
  const [holderEmail, setHolderEmail] = useState("");
  const [holderMobile, setHolderMobile] = useState("");
  const [delivery, setDelivery] = useState({
    name: "",
    address: "",
    city: "",
    country: "United Arab Emirates",
    postal: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [duplicateCheck, setDuplicateCheck] = useState({ checking: false, isDuplicate: false });

  const filtered = CARD_CATALOG.filter((c) => c.type === tab);
  const selected = CARD_CATALOG.find((c) => c.id === selectedId) || filtered[0];

  const total = selected ? selected.minDeposit + selected.issuance : 0;
  const balance = 12500.5;
  const balanceOK = total <= balance;

  const onEmailBlur = () => {
    if (!holderEmail) return;
    setDuplicateCheck({ checking: true, isDuplicate: false });
    setTimeout(() => {
      setDuplicateCheck({
        checking: false,
        isDuplicate: holderEmail.toLowerCase() === "duplicate@netpay.com",
      });
    }, 600);
  };

  const isPhysical = tab === "physical";
  const requiredFilled =
    selected &&
    holderEmail.includes("@") &&
    holderMobile.length >= 8 &&
    !duplicateCheck.isDuplicate &&
    balanceOK &&
    (!isPhysical ||
      (delivery.name &&
        delivery.address &&
        delivery.city &&
        delivery.country &&
        delivery.postal &&
        delivery.phone));

  const onSubmit = (e) => {
    e.preventDefault();
    if (!requiredFilled) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/cards">
            <Button variant="ghost" size="sm" className="text-white/60">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to cards
            </Button>
          </Link>
        </div>
        <Card className="glass-strong border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="p-12 text-center">
            <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Application submitted</h2>
            <p className="text-white/60 max-w-md mx-auto mb-6">
              Your <strong className="text-white">{selected.name}</strong> card application is being
              processed. {isPhysical ? "Delivery takes 7-14 days." : "Your virtual card will be ready in a few minutes."}
            </p>
            <div className="flex justify-center gap-3">
              <Link to="/cards">
                <Button className="glass">View my cards</Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="ghost" className="text-white/60">
                  Go to dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/cards">
          <Button variant="ghost" size="sm" className="text-white/60">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Apply for a New Card</h1>
          <p className="text-white/60 text-sm mt-1">Choose virtual or physical and fill in details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <Card className="glass-strong border-white/10">
            <CardContent className="p-3">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "virtual", label: "Virtual Card", Icon: Globe },
                  { id: "physical", label: "Physical Card", Icon: Truck },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTab(t.id);
                      setSelectedId(CARD_CATALOG.find((c) => c.type === t.id).id);
                    }}
                    className={`p-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                      tab === t.id
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "text-white/60 hover:bg-white/5"
                    }`}
                  >
                    <t.Icon className="h-4 w-4" />
                    <span className="font-medium text-sm">{t.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Catalog */}
          <Card className="glass-strong border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Choose card type</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-3">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    selectedId === c.id
                      ? "bg-emerald-500/10 border-emerald-500/40"
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">{c.name}</span>
                    <span className="text-emerald-400 font-bold">${c.issuance} issuance</span>
                  </div>
                  <p className="text-xs text-white/50">{c.desc}</p>
                  <div className="flex gap-4 mt-2 text-xs text-white/60">
                    <span>Min deposit ${c.minDeposit}</span>
                    <span>·</span>
                    <span>Top-up fee {c.feePct}%</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Holder details */}
          <form onSubmit={onSubmit}>
            <Card className="glass-strong border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Cardholder information</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/70 text-sm mb-2 block">Holder email</Label>
                    <Input
                      type="email"
                      value={holderEmail}
                      onChange={(e) => setHolderEmail(e.target.value)}
                      onBlur={onEmailBlur}
                      placeholder="card.holder@email.com"
                      className="bg-white/5 border-white/10 text-white"
                    />
                    {duplicateCheck.checking && (
                      <p className="text-xs text-white/40 mt-1">Checking…</p>
                    )}
                    {duplicateCheck.isDuplicate && (
                      <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> Email already used for another card
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-white/70 text-sm mb-2 block">Mobile</Label>
                    <Input
                      value={holderMobile}
                      onChange={(e) => setHolderMobile(e.target.value)}
                      placeholder="+971 50 000 0000"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                {isPhysical && (
                  <div className="pt-4 border-t border-white/10 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="h-4 w-4 text-amber-400" />
                      <span className="text-sm font-medium text-white">Delivery address</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white/70 text-sm mb-2 block">Recipient name</Label>
                        <Input
                          value={delivery.name}
                          onChange={(e) => setDelivery({ ...delivery, name: e.target.value })}
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white/70 text-sm mb-2 block">Phone</Label>
                        <Input
                          value={delivery.phone}
                          onChange={(e) => setDelivery({ ...delivery, phone: e.target.value })}
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-white/70 text-sm mb-2 block">Street address</Label>
                        <Input
                          value={delivery.address}
                          onChange={(e) => setDelivery({ ...delivery, address: e.target.value })}
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white/70 text-sm mb-2 block">City</Label>
                        <Input
                          value={delivery.city}
                          onChange={(e) => setDelivery({ ...delivery, city: e.target.value })}
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white/70 text-sm mb-2 block">Country</Label>
                        <Input
                          value={delivery.country}
                          onChange={(e) => setDelivery({ ...delivery, country: e.target.value })}
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white/70 text-sm mb-2 block">Postal code</Label>
                        <Input
                          value={delivery.postal}
                          onChange={(e) => setDelivery({ ...delivery, postal: e.target.value })}
                          className="bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={!requiredFilled}
                  className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 disabled:opacity-50"
                >
                  Submit application
                </Button>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Sticky summary */}
        <div className="space-y-4 lg:sticky lg:top-6 self-start">
          <Card className="glass-strong border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg">Fee breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-3 text-sm">
              {selected ? (
                <>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="h-4 w-4 text-emerald-400" />
                      <span className="text-white font-medium">{selected.name}</span>
                    </div>
                    <p className="text-xs text-white/50">{selected.desc}</p>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Minimum deposit</span>
                    <span className="text-white">${selected.minDeposit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Issuance fee</span>
                    <span className="text-white">${selected.issuance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Top-up fee</span>
                    <span className="text-white">{selected.feePct}%</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between">
                    <span className="text-white font-medium">Due today</span>
                    <span className="text-emerald-400 font-bold text-lg">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/40">Wallet balance</span>
                    <span className={balanceOK ? "text-emerald-400" : "text-red-400"}>
                      ${balance.toLocaleString()} {balanceOK ? "✓" : "(insufficient)"}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-white/40 text-sm">Select a card type to see fees</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
