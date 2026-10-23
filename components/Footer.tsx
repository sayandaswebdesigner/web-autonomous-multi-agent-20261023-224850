"use client";

import React from "react";
import { Terminal, Shield, ArrowUpRight } from "lucide-react";
import WaitlistForm from "@/components/WaitlistForm";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-900 bg-neutral-950 py-16 text-neutral-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-900">
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 border border-neutral-800 text-emerald-400">
                <Terminal className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">NEXUS ENGINE</span>
            </div>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              Autonomous, sub-millisecond developer telemetry and real-time streaming pipeline.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              All Global Edge Clusters Operational
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase font-bold text-white tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">Overview</a></li>
              <li><a href="/#features" className="hover:text-white transition-colors">Edge Engine</a></li>
              <li><a href="/pricing" className="hover:text-white transition-colors">Pricing & Plans</a></li>
              <li><a href="/docs" className="hover:text-white transition-colors">Documentation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase font-bold text-white tracking-wider mb-3">Integrations</h4>
            <ul className="space-y-2 text-sm">
              <li><span className="text-neutral-300">Supabase Auth & DB</span></li>
              <li><span className="text-neutral-300">Next.js 15 App Router</span></li>
              <li><span className="text-neutral-300">Cloudflare Edge DNS</span></li>
              <li><span className="text-neutral-300">Vercel Production</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase font-bold text-white tracking-wider mb-3">Early Access</h4>
            <p className="text-xs text-neutral-400 mb-3">Get notified about new engine capabilities.</p>
            <WaitlistForm source="footer" placeholder="Email address..." buttonLabel="Subscribe" />
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <div>
            © {new Date().getFullYear()} NEXUS Systems Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>SOC 2 Type II Certified</span>
            <span>•</span>
            <span>ISO/IEC 27001</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
