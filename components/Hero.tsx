"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Terminal,
  Sparkles,
  Activity,
  ShieldCheck,
  Zap,
  Copy,
  Check,
  Server,
  Mail,
  AlertCircle,
  AlertTriangle,
  Zap as Zap2,
} from "lucide-react";
import WaitlistForm from "@/components/WaitlistForm";

interface HeroProps {
  onOpenAuth: () => void;
  onExplorePreview?: () => void;
  billingTier?: string | null;
}

export default function Hero({ onOpenAuth, onExplorePreview, billingTier }: HeroProps) {
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [consensusStatus, setConsensusStatus] = useState<"syncing" | "synced" | "error">("synced");

  const curlSnippet = `curl -X POST https://api.nexus-analytics.io/v1/events \\
  -H "Authorization: Bearer nx_live_demo" \\
  -d '{"event": "validator.sync", "latency_ms": 1.2, "round": "consensus_1"}'`;

  const handleCopyCurl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(curlSnippet);
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    }
  };

  const refreshConsensus = () => {
    setConsensusStatus("syncing");
    setTimeout(() => setConsensusStatus("synced"), 2500);
  };

  return (
    <section id="overview" className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      {/* Background Radial Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-emerald-500/10 blur-[130px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/90 px-3.5 py-1.5 text-xs text-neutral-300 backdrop-blur-md shadow-inner mb-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-emerald-400 font-medium">NEXUS v3.2 LIVE</span>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-400">Autonomous Consensus Engine</span>
          </div>

          {/* Consensus Sync Status */}
          <div className="mt-2 flex items-center gap-2 text-sm text-neutral-400">
            <span className={`h-3 w-3 rounded-full ${consensusStatus === "syncing" ? "bg-emerald-500 animate-pulse" : consensusStatus === "synced" ? "bg-emerald-400" : "bg-rose-500"}`} />
            <span className="font-medium text-neutral-300">
              {consensusStatus === "syncing" ? "Hourly Sync in progress" : consensusStatus === "synced" ? "Validator cache synced" : "Sync error — retrying"}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Autonomous{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Multi-Agent Consensus
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-neutral-400 max-w-2xl leading-relaxed">
            Distributed validator nodes reach network-wide agreement hourly, streamlining telemetry ingestion and synchronizing cryptographic state across all edge endpoints with zero downtime.
          </p>

          {/* Live Waitlist Signup */}
          <div className="mt-8 w-full flex justify-center">
            <WaitlistForm
              placeholder="Join validator early access waitlist..."
              buttonLabel="Join Consensus Network"
              source="hero_waitlist"
            />
          </div>

          {/* Action CTAs */}
          <div className="mt-5 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3.5 text-sm font-bold text-neutral-950 hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-500/20"
            >
              <span>Launch Developer Console</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => { onExplorePreview?.(); refreshConsensus(); }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/80 px-6 py-3.5 text-sm font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
              title="Refresh validator sync status"
            >
              <Activity className="h-4 w-4 text-emerald-400" />
              <span>Refresh Validator Sync</span>
            </button>
          </div>

          {/* Flagship Metrics Row */}
          <div className="mt-14 grid grid-cols-3 gap-4 sm:gap-8 w-full max-w-3xl pt-8 border-t border-neutral-900">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">{"< 80ms"}</div>
              <div className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-mono">Consensus p99 Round</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">99.999%</div>
              <div className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-mono">Uptime SLA</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">10K+</div>
              <div className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-mono">Active Validators</div>
            </div>
          </div>

          {/* Interactive Hero Code Card */}
          <div className="mt-12 w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4 sm:p-5 text-left backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-xs text-neutral-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                <span className="ml-2 text-neutral-300 font-medium">bash — validator-sync.sh</span>
              </div>
              <button
                onClick={handleCopyCurl}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
                title="Copy cURL snippet"
              >
                {copiedCurl ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="mt-3 font-mono text-xs sm:text-sm text-neutral-300 overflow-x-auto leading-relaxed">
              <code>{curlSnippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
