"use client";

import React, { useState, useEffect } from "react";
import {
  Key,
  Copy,
  Check,
  Terminal,
  Play,
  Pause,
  RefreshCw,
  Activity,
  Shield,
  Sparkles,
  Filter,
  Zap,
  Globe,
} from "lucide-react";

interface StreamEvent {
  id: string;
  type: "consensus" | "validation" | "stream" | "alert";
  endpoint: string;
  status: number;
  durationMs: number;
  timestamp: string;
  round?: number;
}

interface InteractivePreviewProps {
  billingTier?: string | null;
}

export default function InteractivePreview({ billingTier }: InteractivePreviewProps = {}) {
  // API Key Generator State (Consensus Node Authentication)
  const [keyName, setKeyName] = useState("Validator Node Key");
  const [permission, setPermission] = useState<"read" | "write" | "admin">("write");
  const [generatedKey, setGeneratedKey] = useState("nx_val_0a1b2c3d4e5f6g7h8i9j0k1l");
  const [copied, setCopied] = useState(false);

  // Real-time Event Stream State (Consensus Network Events)
  const [isStreaming, setIsStreaming] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [events, setEvents] = useState<StreamEvent[]>([
    {
      id: "evt_001",
      type: "consensus",
      endpoint: "/v1/consensus/round/1",
      status: 200,
      durationMs: 45,
      timestamp: "14:02:01",
      round: 1,
    },
    {
      id: "evt_002",
      type: "validation",
      endpoint: "/v1/validator/status",
      status: 200,
      durationMs: 12,
      timestamp: "14:02:02",
    },
    {
      id: "evt_003",
      type: "stream",
      endpoint: "/v1/telemetry/ingest",
      status: 200,
      durationMs: 8,
      timestamp: "14:02:03",
    },
    {
      id: "evt_004",
      type: "alert",
      endpoint: "/v1/webhook/alert",
      status: 202,
      durationMs: 38,
      timestamp: "14:02:05",
    },
    {
      id: "evt_005",
      type: "consensus",
      endpoint: "/v1/consensus/round/2",
      status: 200,
      durationMs: 52,
      timestamp: "14:02:06",
      round: 2,
    },
  ]);

  const handleGenerateKey = () => {
    const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const prefix = permission === "admin" ? "nx_admin_" : permission === "write" ? "nx_write_" : "nx_ro_";
    setGeneratedKey(`${prefix}${randomHex}`);
    setCopied(false);
  };

  const handleCopyKey = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Simulate real-time consensus event arrivals
  useEffect(() => {
    if (!isStreaming) return;

    const endpoints = [
      { type: "consensus" as const, endpoint: "/v1/consensus/round", status: 200, min: 30, max: 80 },
      { type: "validation" as const, endpoint: "/v1/validator/ping", status: 200, min: 5, max: 15 },
      { type: "stream" as const, endpoint: "/v1/telemetry/ingest", status: 200, min: 5, max: 20 },
      { type: "alert" as const, endpoint: "/v1/webhook/alert", status: 202, min: 18, max: 45 },
      { type: "consensus" as const, endpoint: "/v1/consensus/finality", status: 200, min: 20, max: 55 },
    ];

    const timer = setInterval(() => {
      const template = endpoints[Math.floor(Math.random() * endpoints.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      const newEvt: StreamEvent = {
        id: `evt_${Date.now().toString().slice(-4)}`,
        type: template.type,
        endpoint: template.endpoint,
        status: template.status,
        durationMs: Math.floor(Math.random() * (template.max - template.min) + template.min),
        timestamp: timeStr,
      };

      setEvents((prev) => [newEvt, ...prev.slice(0, 14)]);
    }, 2200);

    return () => clearInterval(timer);
  }, [isStreaming]);

  const filteredEvents = filterType === "all" ? events : events.filter((e) => e.type === filterType);

  return (
    <section id="preview" className="relative py-24 sm:py-32 bg-neutral-950 border-t border-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-medium text-emerald-400 mb-4">
            <Zap className="h-3.5 w-3.5 animate-pulse" />
            CONSENSUS NETWORK PREVIEW
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Real-Time Consensus Pipeline
          </h2>
          <p className="mt-4 text-base text-neutral-400">
            Observe live validator consensus rounds, telemetry ingestion, and webhook alert dispatch across the autonomous multi-agent network.
          </p>
        </div>

        {/* Dual Module Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Module 1: Validator API Key Generator (5 Cols) */}
          <div className="lg:col-span-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-7 backdrop-blur-xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <Key className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">Validator Key Generator</h3>
                    <p className="text-xs text-neutral-400">Provision scoped consensus node tokens</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">
                  HMAC-SHA256
                </span>
              </div>

              {/* Key Configuration Controls */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Token Label
                  </label>
                  <input
                    type="text"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 px-3.5 py-2 text-sm text-neutral-100 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Permission Scope
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["read", "write", "admin"] as const).map((perm) => (
                      <button
                        key={perm}
                        type="button"
                        onClick={() => setPermission(perm)}
                        className={`rounded-xl border py-2 text-xs font-medium capitalize transition-all ${
                          permission === perm
                            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-sm"
                            : "border-neutral-800 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700"
                        }`}
                      >
                        {perm}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generated Key Card */}
                <div className="mt-6 rounded-xl border border-neutral-800/90 bg-neutral-950/90 p-4">
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
                    <span className="font-mono">Active Consensus Token</span>
                    <span className="text-[11px] text-emerald-400">Ready for headers</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 font-mono text-xs sm:text-sm text-emerald-300 bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
                    <span className="truncate">{generatedKey}</span>
                    <button
                      onClick={handleCopyKey}
                      className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors shrink-0"
                      title="Copy Key"
                    >
                      {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-neutral-800/80">
              <button
                type="button"
                onClick={handleGenerateKey}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 hover:from-emerald-400 hover:to-teal-400 transition-all"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Issue New Validator Token</span>
              </button>
            </div>
          </div>

          {/* Module 2: Real-time Consensus Event Stream Preview (7 Cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-7 backdrop-blur-xl shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-800 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Terminal className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Consensus Event Stream</h3>
                  <p className="text-xs text-neutral-400">Live validator round events & alerts</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setIsStreaming(!isStreaming)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors ${
                    isStreaming
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                      : "border-neutral-700 bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {isStreaming ? (
                    <>
                      <Pause className="h-3.5 w-3.5" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5" /> Resume
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setEvents([])}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono text-neutral-400 hover:text-white border border-neutral-800 bg-neutral-950/60 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-neutral-500 flex items-center gap-1 shrink-0 font-mono text-[11px]">
                <Filter className="h-3 w-3" /> Filters:
              </span>
              {["all", "consensus", "validation", "stream", "alert"].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilterType(f)}
                  className={`capitalize px-2.5 py-1 rounded-md text-xs font-medium font-mono transition-colors shrink-0 ${
                    filterType === f
                      ? "bg-neutral-800 text-white border border-neutral-700"
                      : "text-neutral-400 hover:text-neutral-300"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Event Terminal Output Box */}
            <div className="mt-4 h-[300px] overflow-y-auto rounded-xl border border-neutral-800/80 bg-neutral-950/95 p-3 font-mono text-xs space-y-2">
              {filteredEvents.length === 0 ? (
                <div className="h-full flex items-center justify-center text-neutral-500 font-mono text-xs">
                  Awaiting consensus events...
                </div>
              ) : (
                filteredEvents.map((evt) => {
                  const typeColor =
                    evt.type === "consensus"
                      ? "text-emerald-400 bg-emerald-950/40 border-emerald-800/50"
                      : evt.type === "validation"
                      ? "text-amber-400 bg-amber-950/40 border-amber-800/50"
                      : evt.type === "stream"
                      ? "text-cyan-400 bg-cyan-950/40 border-cyan-800/50"
                      : "text-rose-400 bg-rose-950/40 border-rose-800/50";

                  return (
                    <div
                      key={evt.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-neutral-900/50 border border-neutral-800/60 hover:border-neutral-700 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="text-[11px] text-neutral-500">{evt.timestamp}</span>
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${typeColor}`}>
                          {evt.type}
                        </span>
                        <span className="text-neutral-200 font-medium truncate">{evt.endpoint}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 text-[11px]">
                        <span className="text-emerald-400 font-semibold">{evt.status} OK</span>
                        <span className="text-neutral-500">{evt.durationMs}ms</span>
                        {evt.round && <span className="text-[10px] text-neutral-500">Round {evt.round}</span>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Stream Footer Metric */}
            <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-3 border-t border-neutral-800/60">
              <span className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${isStreaming ? "bg-emerald-400 animate-pulse" : "bg-neutral-600"}`} />
                Status: {isStreaming ? "Listening (2.2s cadence)" : "Paused"}
              </span>
              <span>Buffer: {filteredEvents.length} items</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
