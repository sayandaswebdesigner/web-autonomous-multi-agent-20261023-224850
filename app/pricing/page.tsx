"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import { Check, HelpCircle, ChevronDown, Sparkles, ArrowRight, Zap, Shield, ShieldCheck } from "lucide-react";

interface PlanTier {
  id: string;
  name: string;
  badge?: string;
  popular?: boolean;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: string[];
  cta: string;
}

interface FaqItem {
  q: string;
  a: string;
}

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const plans: PlanTier[] = [
    {
      id: "starter",
      name: "Validator Node",
      badge: "ENTRY",
      monthlyPrice: 0,
      annualPrice: 0,
      description: "Ideal for indie developers, sandbox verification, and early consensus participation.",
      features: [
        "10,000 monthly consensus rounds",
        "7-day checkpoint retention",
        "1 active validator key",
        "Standard global edge routing",
        "Community forum access",
      ],
      cta: "Join Waitlist",
    },
    {
      id: "growth",
      name: "Consensus Pro",
      badge: "MOST POPULAR",
      popular: true,
      monthlyPrice: 59,
      annualPrice: 49,
      description: "Designed for fast-growing production applications and validator operators.",
      features: [
        "500,000 monthly consensus rounds",
        "90-day checkpoint retention",
        "Unlimited scoped API tokens",
        "Real-time WebSocket & SSE streams",
        "Priority 24/7 engineering support",
        "Automatic validator rotation",
      ],
      cta: "Launch Pro Trial",
    },
    {
      id: "enterprise",
      name: "Dedicated Consensus Cluster",
      badge: "HIGH THROUGHPUT",
      monthlyPrice: 349,
      annualPrice: 299,
      description: "Custom infrastructure clusters, dedicated VPCs, and compliance guarantees for enterprise validator networks.",
      features: [
        "1B+ monthly consensus rounds (scalable)",
        "Up to 7-year cold checkpoint retention",
        "99.999% uptime guarantee SLA",
        "Dedicated Anycast IP & VPC peering",
        "SOC 2 Type II & HIPAA BAA",
        "Dedicated solutions engineer",
        "Custom consensus finality thresholds",
      ],
      cta: "Talk to Solutions",
    },
  ];

  const comparisonMatrix = [
    { feature: "Edge Ingestion Latency", starter: "< 5ms", growth: "< 1.2ms", enterprise: "< 0.8ms (Dedicated)" },
    { feature: "Monthly Included Events", starter: "1,000,000", growth: "50,000,000", enterprise: "Custom / 1B+" },
    { feature: "Data Retention Window", starter: "7 Days", growth: "90 Days", enterprise: "Up to 7 Years" },
    { feature: "Cryptographic API Tokens", starter: "3 Keys", growth: "Unlimited", enterprise: "Unlimited + HSM" },
    { feature: "Real-Time SSE & WebSockets", starter: "Basic", growth: "High-Throughput", enterprise: "Dedicated Cluster" },
    { feature: "Support Response SLA", starter: "Community", growth: "4 Hours", enterprise: "15-Minute Dedicated" },
    { feature: "Custom Subdomain Routing", starter: "No", growth: "Yes (Cloudflare CNAME)", enterprise: "Custom SSL + Anycast" },
    { feature: "Compliance & Security", starter: "Standard", growth: "SOC 2 Type II", enterprise: "SOC 2, HIPAA, GDPR" },
  ];

  const faqs: FaqItem[] = [
    {
      q: "Can I upgrade or downgrade my tier at any time?",
      a: "Yes. All plans are prorated automatically. When upgrading, immediate quota expansion occurs within milliseconds across all global edge nodes, and validator round participation synchronizes instantly.",
    },
    {
      q: "How are monthly consensus rounds counted?",
      a: "A consensus round is counted when a validator node successfully reaches network-wide agreement and a checkpoint is finalized and persisted to the distributed ledger.",
    },
    {
      q: "What happens if I exceed my tier's consensus round limit?",
      a: "We never drop your incoming production telemetry. Usage above tier limits is billed at an overage rate of $0.000002 per additional round, or you can opt for automated soft-capping in settings.",
    },
    {
      q: "Is there a free trial for the Consensus Pro tier?",
      a: "Yes! Every new account includes 14 days of unrestricted Consensus Pro access without requiring a credit card, including 500,000 monthly consensus rounds.",
    },
    {
      q: "Do you offer discounts for open-source or educational projects?",
      a: "Absolutely. We sponsor verified open-source maintainers and university research initiatives with complimentary Consensus Pro-tier allocations for academic validator network participation.",
    },
    {
      q: "How does the hourly validator cron sync work?",
      a: "A scheduled cron job runs every hour via /api/cron/sync, pulling state from each registered validator node, validating consensus round hashes, and persisting synced checkpoints to the PostgreSQL database with RLS enforcement. Records synced per cycle typically range from 100 to 200 depending on node online ratio.",
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        userEmail={userEmail}
        onSignOut={() => setUserEmail(null)}
      />

      <section className="relative pt-16 pb-24 sm:pt-24 sm:pb-32 overflow-hidden">
        {/* Glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[700px] rounded-full bg-emerald-500/10 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono font-medium text-emerald-400 mb-4">
              <Zap className="h-3.5 w-3.5" />
              TRANSPARENT VALUE
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
              Predictable Pricing for High-Scale Teams
            </h1>
            <p className="mt-4 text-base sm:text-lg text-neutral-400">
              Start prototyping for free. Scale to billions of requests with transparent, predictable tier economics.
            </p>

            {/* Annual/Monthly Billing Toggle */}
            <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-neutral-800 bg-neutral-900/80 p-1.5 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setIsAnnual(false)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  !isAnnual ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-400 hover:text-white"
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setIsAnnual(true)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  isAnnual
                    ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span>Annual Billing</span>
                <span className="rounded-full bg-neutral-900/20 px-1.5 py-0.5 text-[10px] uppercase font-bold text-neutral-950">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan) => {
              const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col justify-between rounded-2xl p-7 sm:p-8 backdrop-blur-xl transition-all ${
                    plan.popular
                      ? "border-2 border-emerald-500/70 bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 shadow-2xl shadow-emerald-500/10 scale-105 z-10"
                      : "border border-neutral-800 bg-neutral-900/40 hover:border-neutral-700"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3 py-0.5 text-[10px] font-mono font-bold uppercase text-neutral-950 shadow-sm tracking-wider">
                      {plan.badge}
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <p className="mt-2 text-xs text-neutral-400 min-h-[36px]">{plan.description}</p>

                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-mono">
                        ${price}
                      </span>
                      <span className="text-xs font-mono text-neutral-400">/ month</span>
                    </div>
                    {isAnnual && price > 0 && (
                      <span className="text-[11px] font-mono text-emerald-400 block mt-1">Billed annually</span>
                    )}

                    <div className="mt-8 space-y-3 pt-6 border-t border-neutral-800/80">
                      {plan.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-300">
                          <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAuthOpen(true)}
                    className={`mt-8 w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all ${
                      plan.popular
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-neutral-950 hover:from-emerald-400 hover:to-teal-400 shadow-md"
                        : "border border-neutral-700 bg-neutral-800/60 text-white hover:bg-neutral-800"
                    }`}
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Feature Comparison Table */}
          <div className="mt-24">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Comprehensive Capability Matrix
              </h2>
              <p className="mt-2 text-sm text-neutral-400">
                Direct feature-by-feature breakdown across our architecture tiers.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-xl">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-950/80 text-neutral-400 font-mono">
                    <th className="py-4 px-6 font-semibold">Tier Metric / Feature</th>
                    <th className="py-4 px-6 font-semibold">Developer</th>
                    <th className="py-4 px-6 font-semibold text-emerald-400">Scale / Pro</th>
                    <th className="py-4 px-6 font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {comparisonMatrix.map((row, i) => (
                    <tr key={i} className="hover:bg-neutral-900/40 transition-colors">
                      <td className="py-4 px-6 font-medium text-white">{row.feature}</td>
                      <td className="py-4 px-6 text-neutral-400">{row.starter}</td>
                      <td className="py-4 px-6 font-semibold text-emerald-400">{row.growth}</td>
                      <td className="py-4 px-6 text-neutral-300">{row.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-24 max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900/80 px-3 py-1 text-xs text-neutral-300 font-mono mb-2">
                <HelpCircle className="h-3.5 w-3.5 text-emerald-400" />
                FREQUENTLY ASKED
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Common Questions & Terms
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-md overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm font-semibold text-white hover:text-emerald-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform ${openFaq === idx ? "rotate-180 text-emerald-400" : "text-neutral-500"}`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-400 leading-relaxed border-t border-neutral-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(email) => setUserEmail(email)}
      />
    </main>
  );
}
