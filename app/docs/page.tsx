"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import {
  Terminal,
  Key,
  Layers,
  Zap,
  Code,
  Copy,
  Check,
  ChevronRight,
  BookOpen,
  Shield,
  Server,
  ArrowRight,
} from "lucide-react";

interface DocSection {
  id: string;
  category: string;
  title: string;
  description: string;
  codeSnippets: { lang: string; title: string; code: string }[];
  params?: { name: string; type: string; required: boolean; description: string }[];
}

export default function DocsPage() {
  const [activeSectionId, setActiveSectionId] = useState("quickstart");
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState<string>("bash");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const docSections: DocSection[] = [
    {
      id: "quickstart",
      category: "Getting Started",
      title: "Edge Consensus Quickstart",
      description:
        "Submit high-throughput telemetry directly to the Anycast edge cluster using standard HTTP/1.1, HTTP/2, or HTTP/3 protocols with sub-millisecond p99 acknowledgement. Validator nodes reach consensus hourly via gossip-optimized protocol.",
      codeSnippets: [
        {
          lang: "bash",
          title: "cURL - Validator Sync",
          code: `curl -X POST https://api.nexus-analytics.io/v1/cron/sync \\
  -H "Authorization: Bearer nx_live_demo" \\
  -H "Idempotency-Key: round-1"`,
        },
        {
          lang: "typescript",
          title: "TypeScript / Node - Init Client",
          code: `import { NexusClient } from "@nexus/sdk";

const client = new NexusClient({
  apiKey: process.env.NEXUS_API_KEY,
  maxRetries: 4,
  flushIntervalMs: 2000,
  maxBatchSize: 500,
});`,
        },
        {
          lang: "python",
          title: "Python - Track Event",
          code: `from nexus import NexusClient

client = NexusClient(api_key="nx_live_demo8f3b92")

client.track(
    event="validator.sync",
    properties={
        "round": 1,
        "latency_ms": 45,
        "nodes_online": 142
    }
)`,
        },
      ],
      params: [
        { name: "event", type: "string", required: true, description: "Unique name of the emitted telemetry or audit event" },
        { name: "latency_ms", type: "number", required: false, description: "Consensus round latency in milliseconds" },
        { name: "round", type: "integer", required: true, description: "Consensus round number" },
        { name: "properties", type: "object", required: false, description: "Arbitrary structured JSON metadata payload" },
        { name: "timestamp", type: "ISO-8601", required: false, description: "Event timestamp (defaults to edge arrival time)" },
      ],
    },
    {
      id: "auth",
      category: "Authentication",
      title: "API Keys & Consensus Auth Claims",
      description:
        "Requests must include an Authorization Bearer header containing either a cryptographically signed HMAC token (`nx_live_...`) or a verified Supabase JWT claim. Token scopes determine consensus participation rights.",
      codeSnippets: [
        {
          lang: "bash",
          title: "cURL Header - Consensus Auth",
          code: `curl -H "Authorization: Bearer <API_SECRET_TOKEN>" \\
  https://api.nexus-analytics.io/v1/consensus/round/status`,
        },
        {
          lang: "typescript",
          title: "Supabase JWT Sync",
          code: `import { supabase } from "@/lib/supabaseClient";

const { data: { session } } = await supabase.auth.getSession();

const res = await fetch("https://api.nexus-analytics.io/v1/consensus/round/status", {
  headers: {
    Authorization: \`Bearer \${session?.access_token}\`,
  },
});`,
        },
      ],
      params: [
        { name: "Authorization", type: "header", required: true, description: "Bearer token with `nx_live_` or `nx_ro_` scope" },
        { name: "X-Nexus-Tenant", type: "header", required: false, description: "Explicit multi-tenant partition identifier" },
        { name: "X-Consensus-Round", type: "header", required: false, description: "Specific consensus round number to query" },
      ],
    },
    {
      id: "streaming",
      category: "Real-Time Streaming",
      title: "Server-Sent Events & WebSocket Egress",
      description:
        "Connect directly to live event streams with filtered predicates to stream telemetry to your browser consoles or monitoring stacks in real-time. Live validator round events are pushed at 2.2s cadence.",
      codeSnippets: [
        {
          lang: "typescript",
          title: "Browser EventSource - Consensus Stream",
          code: `const stream = new EventSource(
  "https://api.nexus-analytics.io/v1/stream?filter=validator.status&round=1"
);

stream.onmessage = (e) => {
  const telemetry = JSON.parse(e.data);
  console.log("Real-time consensus event:", telemetry);
};`,
        },
      ],
      params: [
        { name: "filter", type: "query string", required: false, description: "Prefix or glob pattern matching event names (e.g. validator., consensus.)" },
        { name: "sample_rate", type: "float", required: false, description: "Downsampling fraction from 0.01 to 1.0 (default: 1.0)" },
        { name: "round", type: "query string", required: false, description: "Specific consensus round to filter by" },
      ],
    },
    {
      id: "webhooks",
      category: "Webhooks & Alerts",
      title: "Webhook-Driven Alert Reception",
      description:
        "Incoming webhook events with HMAC signature validation are processed at /api/webhook, validated against a configured secret, and trigger alert rules. Supports consensus round finalization, validator status changes, and telemetry alert dispatch.",
      codeSnippets: [
        {
          lang: "bash",
          title: "cURL - Finalized Round Alert",
          code: `curl -X POST https://api.nexus-analytics.io/api/webhook \\
  -H "x-signature-256: sha256=..." \\
  -H "x-event-id: evt_12345" \\
  -H "x-event-type: consensus_round_finalized" \\
  -d '{"event":"consensus_round_finalized","round":1,"checkpoints":42,"status":"success"}'`,
        },
      ],
      params: [
        { name: "x-event-type", type: "header", required: true, description: "Event type: consensus_round_finalized, validator_status_change, telemetry_ingest, alert_dispatched" },
        { name: "x-signature-256", type: "header", required: true, description: "HMAC-SHA256 signature verified against WEBHOOK_SECRET" },
        { name: "x-event-id", type: "header", required: false, description: "Unique event identifier" },
      ],
    },
  ];

  const currentSection = docSections.find((s) => s.id === activeSectionId) || docSections[0];

  const handleCopy = (code: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedSnippet(id);
      setTimeout(() => setCopiedSnippet(null), 2000);
    }
  };

  const categories = Array.from(new Set(docSections.map((s) => s.category)));

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        userEmail={userEmail}
        onSignOut={() => setUserEmail(null)}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Breadcrumb Bar */}
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-8 border-b border-neutral-900 pb-4">
          <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
          <span>Documentation</span>
          <ChevronRight className="h-3 w-3 text-neutral-600" />
          <span className="text-neutral-300">{currentSection.category}</span>
          <ChevronRight className="h-3 w-3 text-neutral-600" />
          <span className="text-emerald-400 font-semibold">{currentSection.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Categorized Navigation Sidebar (3 Cols) */}
          <aside className="lg:col-span-3 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4 sm:p-5 backdrop-blur-xl sticky top-24">
            <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold mb-4 px-2">
              Platform Guides
            </div>

            <nav className="space-y-6">
              {categories.map((cat) => (
                <div key={cat}>
                  <div className="text-[11px] font-mono text-neutral-500 uppercase font-semibold px-2 mb-1.5">
                    {cat}
                  </div>
                  <div className="space-y-1">
                    {docSections
                      .filter((s) => s.category === cat)
                      .map((sec) => (
                        <button
                          key={sec.id}
                          type="button"
                          onClick={() => setActiveSectionId(sec.id)}
                          className={`w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition-colors ${
                            activeSectionId === sec.id
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold"
                              : "text-neutral-400 hover:text-white hover:bg-neutral-800/40"
                          }`}
                        >
                          <span className="truncate">{sec.title}</span>
                          {activeSectionId === sec.id && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </nav>

            <div className="mt-8 pt-4 border-t border-neutral-800/80">
              <a
                href="/pricing"
                className="flex items-center justify-between text-xs text-neutral-400 hover:text-emerald-400 px-2 py-1 transition-colors"
              >
                <span>View Quotas & Pricing</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </aside>

          {/* Right Column: Documentation Body (9 Cols) */}
          <article className="lg:col-span-9 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-10 backdrop-blur-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-medium text-emerald-400 mb-3">
              <Terminal className="h-3.5 w-3.5" />
              {currentSection.category.toUpperCase()}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentSection.title}
            </h1>

            <p className="mt-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
              {currentSection.description}
            </p>

            {/* Code Snippets Section */}
            <div className="mt-8 rounded-xl border border-neutral-800 bg-neutral-950/90 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-800/80 bg-neutral-900/60">
                <div className="flex items-center gap-2">
                  {currentSection.codeSnippets.map((snip, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveLang(snip.lang)}
                      className={`text-xs font-mono px-2.5 py-1 rounded transition-colors ${
                        (activeLang === snip.lang || (i === 0 && !currentSection.codeSnippets.some(s => s.lang === activeLang)))
                          ? "bg-neutral-800 text-white font-semibold"
                          : "text-neutral-400 hover:text-neutral-200"
                      }`}
                    >
                      {snip.title}
                    </button>
                  ))}
                </div>

                {(() => {
                  const currentSnip =
                    currentSection.codeSnippets.find((s) => s.lang === activeLang) ||
                    currentSection.codeSnippets[0];
                  return (
                    <button
                      type="button"
                      onClick={() => handleCopy(currentSnip.code, currentSnip.title)}
                      className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
                    >
                      {copiedSnippet === currentSnip.title ? (
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
                  );
                })()}
              </div>

              {(() => {
                const currentSnip =
                  currentSection.codeSnippets.find((s) => s.lang === activeLang) ||
                  currentSection.codeSnippets[0];
                return (
                  <pre className="p-4 text-xs sm:text-sm font-mono text-neutral-200 overflow-x-auto leading-relaxed">
                    <code>{currentSnip.code}</code>
                  </pre>
                );
              })()}
            </div>

            {/* Parameters Table */}
            {currentSection.params && currentSection.params.length > 0 && (
              <div className="mt-10">
                <h3 className="text-lg font-bold text-white mb-4">Request Parameters & Headers</h3>
                <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-950/60">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-400 font-mono text-xs">
                        <th className="py-3 px-4 font-semibold">Parameter</th>
                        <th className="py-3 px-4 font-semibold">Type</th>
                        <th className="py-3 px-4 font-semibold">Requirement</th>
                        <th className="py-3 px-4 font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60 font-mono text-xs">
                      {currentSection.params.map((p, i) => (
                        <tr key={i} className="hover:bg-neutral-900/30">
                          <td className="py-3 px-4 font-bold text-emerald-400">{p.name}</td>
                          <td className="py-3 px-4 text-neutral-300">{p.type}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                                p.required
                                  ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                  : "bg-neutral-800 text-neutral-400"
                              }`}
                            >
                              {p.required ? "Required" : "Optional"}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-sans text-neutral-300">{p.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </article>
        </div>
      </div>

      <Footer />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(email) => setUserEmail(email)}
      />
    </main>
  );
}
