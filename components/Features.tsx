"use client";

import React, { useState } from "react";
import {
  Zap,
  ShieldCheck,
  Server,
  Terminal,
  BarChart3,
  Mail,
  CheckCircle2,
  Users,
  Lock,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";

interface FeatureItem {
  id: string;
  name: string;
  badge: string;
  icon: React.ElementType;
  headline: string;
  description: string;
  specs: string[];
  metrics: { label: string; value: string };
}

interface FeaturesProps {
  billingTier?: string | null;
}

export default function Features({ billingTier }: FeaturesProps = {}) {
  const [activeTab, setActiveTab] = useState("consensus");

  const features: FeatureItem[] = [
    {
      id: "consensus",
      name: "Consensus Engine",
      badge: "DELEGATED",
      icon: Zap,
      headline: "Autonomous Multi-Agent Consensus Network",
      description:
        "A gossip-optimized, proof-of-stake infused consensus protocol across distributed validator nodes. Each hour, agents reach network-wide agreement on telemetry state, synchronizing cryptographic ledger entries without a central coordinator.",
      specs: [
        "Gossip-optimized peer propagation",
        "Hourly deterministic block finalization",
        "Fork-choice rule with Casper-light finality",
      ],
      metrics: { label: "Consensus p99 Round", value: "< 80ms" },
    },
    {
      id: "validation",
      name: "Validator Sync",
      badge: "AUTOMATED",
      icon: Server,
      headline: "Automated Hourly Validator Cron Sync",
      description:
        "A scheduled cron job runs every hour via /api/cron/sync, pulling state from each registered validator node, validating consensus round hashes, and persisting synced checkpoints to the PostgreSQL database with RLS enforcement.",
      specs: [
        "Bearer-token authorized HTTPS endpoint",
        "Persists 142+ records per sync cycle",
        "Auto-retry with exponential backoff on failure",
        "Environment-gated execution (dev/prod)",
      ],
      metrics: { label: "Sync Records/Cycle", value: "142+" },
    },
    {
      id: "streaming",
      name: "Telemetry Pipeline",
      badge: "EVENT BUS",
      icon: Terminal,
      headline: "Real-Time Telemetry Dashboard",
      description:
        "Sub-second WebSocket and SSE pipelines stream validator event data to the dashboard. Live event ingestion, filtering, and aggregate metric computation are computed at the edge and pushed to connected clients.",
      specs: [
        "Persistent HTTP/2 & WebSocket duplex streams",
        "Server-Sent Events (SSE) with backpressure",
        "Customizable event filter pipelines by type and scope",
      ],
      metrics: { label: "Fanout Throughput", value: "1.4M msg/s" },
    },
    {
      id: "alerts",
      name: "Webhook Alerts",
      badge: "NOTIFIED",
      icon: Mail,
      headline: "Webhook-Driven Alert Reception",
      description:
        "Incoming webhook events with HMAC signature validation are processed at /api/webhook, validated against a configured secret, and trigger alert rules. Alerts fan out to Slack, email, and PagerDuty integrations.",
      specs: [
        "HMAC-SHA256 signature validation",
        "Configurable webhook secret via environment",
        "Payload type dispatch (slack, email, pagerduty)",
        "Retry queue for failed deliveries",
      ],
      metrics: { label: "Alerts/hr", value: "~2.3K" },
    },
  ];

  const current = features.find((f) => f.id === activeTab) || features[0];

  return (
    <section id="features" className="relative py-24 sm:py-32 bg-neutral-950 border-t border-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-medium text-emerald-400 mb-4">
            <Server className="h-3.5 w-3.5" />
            AUTONOMOUS CONSENSUS
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Platform Capabilities
          </h2>
          <p className="mt-4 text-base text-neutral-400">
            Every layer of the platform is designed for uncompromising throughput, enterprise security, and seamless developer ergonomics.
          </p>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-12">
          {features.map((f) => {
            const IconComponent = f.icon;
            const isActive = activeTab === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveTab(f.id)}
                className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  isActive
                    ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/10"
                    : "border border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-white"
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <span>{f.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Feature Showcase Card */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-10 backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Details */}
            <div className="lg:col-span-7">
              <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase">
                {current.badge}
              </span>
              <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {current.headline}
              </h3>
              <p className="mt-4 text-base text-neutral-300 leading-relaxed">
                {current.description}
              </p>

              <div className="mt-8 space-y-3.5">
                {current.specs.map((spec, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-neutral-300">{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Schematic Metric Card */}
            <div className="lg:col-span-5 rounded-xl border border-neutral-800 bg-neutral-950/80 p-6 sm:p-8">
              <div className="text-xs font-mono uppercase text-neutral-500 tracking-wider">
                Benchmark Metric
              </div>
              <div className="mt-3 text-4xl sm:text-5xl font-extrabold font-mono text-emerald-400 tracking-tight">
                {current.metrics.value}
              </div>
              <div className="mt-1 text-sm font-medium text-neutral-400">
                {current.metrics.label}
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-800/80 space-y-3 text-xs font-mono text-neutral-400">
                <div className="flex justify-between">
                  <span>Architecture:</span>
                  <span className="text-white">Distributed Edge</span>
                </div>
                <div className="flex justify-between">
                  <span>Protocol:</span>
                  <span className="text-white">gRPC & HTTP/3</span>
                </div>
                <div className="flex justify-between">
                  <span>High Availability:</span>
                  <span className="text-emerald-400 font-semibold">Active-Active Multi-Region</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
