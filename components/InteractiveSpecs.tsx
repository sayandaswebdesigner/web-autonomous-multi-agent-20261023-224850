"use client";

import React, { useState } from "react";
import { Sliders, Cpu, ShieldCheck, Zap, Layers, Server } from "lucide-react";

interface InteractiveSpecsProps {
  billingTier?: string | null;
}

export default function InteractiveSpecs({ billingTier }: InteractiveSpecsProps = {}) {
  const [selectedCategory, setSelectedCategory] = useState<"edge" | "storage" | "security" | "sla">("edge");

  const specsData = {
    edge: [
      { label: "Edge PoPs", value: "320+ Worldwide" },
      { label: "TLS Termination", value: "TLS 1.3 / HTTP/3 QUIC" },
      { label: "p99 Ingest Latency", value: "< 1.2ms" },
      { label: "Throughput Capacity", value: "10,000,000 req/sec" },
      { label: "Compression Engine", value: "zstandard / Brotli" },
    ],
    storage: [
      { label: "Primary Store", value: "ClickHouse Columnar" },
      { label: "Buffer Queue", value: "Apache Kafka + Redpanda" },
      { label: "Retention Policy", value: "Configurable 30d - 7yr" },
      { label: "Storage Engine", value: "NVMe Tiered with S3 Glacier" },
      { label: "Query Parallelism", value: "Distributed MPP" },
    ],
    security: [
      { label: "Authentication", value: "HMAC-SHA256 & Supabase JWT" },
      { label: "Encryption in Transit", value: "AES-256-GCM / TLS 1.3" },
      { label: "Encryption at Rest", value: "KMS Envelope Encryption" },
      { label: "Compliance", value: "SOC 2 Type II, HIPAA, GDPR" },
      { label: "Rate Limiter", value: "Sliding Window Leaky Bucket" },
    ],
    sla: [
      { label: "Availability SLA", value: "99.999% Guaranteed" },
      { label: "Recovery Point (RPO)", value: "0 Seconds (Synchronous)" },
      { label: "Recovery Time (RTO)", value: "< 30 Seconds Auto-Failover" },
      { label: "Incident Response", value: "15-minute 24/7/365 Pager" },
      { label: "Backup Cadence", value: "Continuous Real-Time WAL" },
    ],
  };

  const categories = [
    { key: "edge" as const, name: "Edge Ingestion", icon: Zap },
    { key: "storage" as const, name: "Storage & DB", icon: Server },
    { key: "security" as const, name: "Auth & Crypto", icon: ShieldCheck },
    { key: "sla" as const, name: "Reliability & SLA", icon: Cpu },
  ];

  return (
    <section id="specs" className="relative py-24 sm:py-32 bg-neutral-950 border-t border-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/80 px-3 py-1 text-xs font-mono font-medium text-neutral-300 mb-4">
            <Sliders className="h-3.5 w-3.5 text-emerald-400" />
            DATASHEET & CAPACITIES
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Technical Architecture Specifications
          </h2>
          <p className="mt-4 text-base text-neutral-400">
            Deep dive into the runtime tolerances, encryption algorithms, and infrastructure limits powering NEXUS.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10">
          {categories.map((c) => {
            const IconComp = c.icon;
            const isSelected = selectedCategory === c.key;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setSelectedCategory(c.key)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                  isSelected
                    ? "bg-neutral-800 text-white border border-neutral-700 shadow-sm"
                    : "border border-neutral-800/80 bg-neutral-900/40 text-neutral-400 hover:text-white"
                }`}
              >
                <IconComp className="h-4 w-4" />
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>

        {/* Specs Table */}
        <div className="max-w-4xl mx-auto rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8 backdrop-blur-xl">
          <div className="divide-y divide-neutral-800/80">
            {specsData[selectedCategory].map((row, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 text-sm">
                <span className="font-medium text-neutral-400">{row.label}</span>
                <span className="font-mono text-emerald-400 font-semibold mt-1 sm:mt-0">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
