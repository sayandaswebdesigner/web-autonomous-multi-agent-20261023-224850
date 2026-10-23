"use client";

import React, { useState } from "react";
import {
  Terminal,
  Shield,
  Server,
  Check,
  X,
  ArrowRight,
  Mail,
  AlertCircle,
  Zap,
  Activity,
  Sparkles,
  Menu,
} from "lucide-react";

interface NavbarProps {
  onOpenAuth: () => void;
  userEmail?: string | null;
  onSignOut?: () => void;
  onScrollToPreview?: () => void;
  billingTier?: string | null;
}

export default function Navbar({ onOpenAuth, userEmail, onSignOut, onScrollToPreview, billingTier }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [consensusSynced, setConsensusSynced] = useState(true);

  const navLinks = [
    { name: "Overview", href: "/#overview", description: "Agent consensus status" },
    { name: "Features", href: "/#features", description: "Multi-agent capabilities" },
    { name: "Live Preview", href: "/#preview", description: "Real-time telemetry" },
    { name: "Pricing", href: "/pricing", description: "Tier comparison" },
    { name: "Docs", href: "/docs", description: "API reference" },
  ];

  const handleConsensusSync = async () => {
    setConsensusSynced(false);
    try {
      const resp = await fetch("/api/cron/sync", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || "demo-secret"}`,
        },
      });
      const data = await resp.json();
      if (data.success) {
        setConsensusSynced(true);
      } else {
        setConsensusSynced(false);
      }
    } catch (e) {
      setConsensusSynced(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Identity */}
        <a href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700/60 shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-transform group-hover:scale-105">
            <Server className="h-5 w-5 text-emerald-400 transition-colors" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              NEXUS <span className="text-xs font-mono font-normal px-1.5 py-0.5 rounded bg-emerald-950/70 border border-emerald-800/80 text-emerald-400">ENGINE</span>
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-500">Autonomous Consensus</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-neutral-400 transition-colors hover:text-white"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          {userEmail ? (
            <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs">
              <Check className="h-4 w-4 text-emerald-400" />
              <span className="text-neutral-300 font-mono truncate max-w-[150px]">{userEmail}</span>
              {onSignOut && (
                <button
                  onClick={onSignOut}
                  className="text-neutral-500 hover:text-rose-400 font-medium ml-1 transition-colors"
                >
                  Sign Out
                </button>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={onOpenAuth}
                className="text-xs font-medium text-neutral-300 hover:text-white px-3 py-2 rounded-lg hover:bg-neutral-800/60 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={handleConsensusSync}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3.5 py-2 text-xs font-semibold text-neutral-950 hover:from-emerald-400 hover:to-teal-400 transition-all shadow-md shadow-emerald-500/10"
                title="Trigger hourly validator sync"
              >
                <Activity className="h-3.5 w-3.5" />
                <span>Cron Sync</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-800 bg-neutral-950/95 px-4 pb-6 pt-2 backdrop-blur-xl space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-medium text-neutral-300 hover:bg-neutral-900 hover:text-white"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2 border-t border-neutral-800">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-neutral-950"
            >
              Sign In to Console
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
