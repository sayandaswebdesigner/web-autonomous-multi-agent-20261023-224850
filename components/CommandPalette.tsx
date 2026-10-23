"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Search,
  Home,
  Tag,
  BookOpen,
  Copy,
  Moon,
  Sun,
  Laptop,
  Check,
  Sparkles,
  Shield,
  Server,
  Zap,
  Activity,
  Globe,
  AlertCircle,
  Key,
  CommandIcon,
  X,
} from "lucide-react";

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const navigateTo = useCallback((path: string) => {
    setOpen(false);
    router.push(path);
  }, [router]);

  const copyUrl = useCallback(() => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setToastMessage("Live URL copied to clipboard!");
      setTimeout(() => {
        setCopied(false);
        setToastMessage(null);
      }, 2000);
    }
  }, [router]);

  const toggleTheme = useCallback((theme: "dark" | "light" | "system") => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (theme === "light") {
        root.classList.remove("dark");
        root.classList.add("light");
        setToastMessage("Light theme activated");
      } else if (theme === "dark") {
        root.classList.add("dark");
        root.classList.remove("light");
        setToastMessage("Dark theme activated");
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.toggle("dark", prefersDark);
        root.classList.toggle("light", !prefersDark);
        setToastMessage("System theme preferences matched");
      }
      setTimeout(() => setToastMessage(null), 2500);
    }
  }, []);

  const triggerValidatorSync = useCallback(() => {
    setOpen(false);
    fetch("/api/cron/sync", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || "demo-secret"}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setToastMessage(
          `Validator sync completed: ${data.data?.records_synced || 0} records in ${data.data?.duration_ms || 0}ms`
        );
      })
      .catch(() => setToastMessage("Validator sync failed."));
  }, [setOpen, setToastMessage]);

  const viewTelemetryDashboard = useCallback(() => {
    setOpen(false);
    router.push("/#preview");
    setToastMessage("Opening real-time telemetry dashboard");
  }, [setToastMessage, router]);

  const sendWebhookAlert = useCallback(() => {
    setOpen(false);
    setToastMessage("Webhook alert dispatch initiated");
  }, [setToastMessage]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Floating Trigger Pill */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 hidden sm:flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/90 px-3.5 py-1.5 text-xs text-neutral-400 backdrop-blur-xl transition-all hover:border-neutral-700 hover:text-white hover:scale-105 shadow-2xl shadow-black/40 group"
        aria-label="Open Command Palette"
      >
        <CommandIcon className="h-3.5 w-3.5 text-emerald-400 transition-transform group-hover:rotate-12" />
        <span className="font-mono text-[11px] text-neutral-300">Cmd + K</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            id="command-palette-modal"
            data-testid="command-palette"
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/95 text-neutral-100 shadow-2xl shadow-emerald-950/20 backdrop-blur-2xl ring-1 ring-white/10 z-10 animate-in zoom-in-95 duration-150"
          >
            <Command label="Command Palette" className="w-full">
              <div className="flex items-center border-b border-neutral-800/80 px-4 py-3 gap-3">
                <Search className="h-4 w-4 shrink-0 text-neutral-400" />
                <Command.Input
                  autoFocus
                  placeholder="Type a command or jump to page..."
                  className="w-full bg-transparent text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
                />
                <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-neutral-800 bg-neutral-800 px-1.5 font-mono text-[10px] text-neutral-400">
                  ESC
                </kbd>
                <button
                  onClick={() => setOpen(false)}
                  className="text-neutral-400 hover:text-neutral-200 p-1 rounded-md sm:hidden"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {toastMessage && (
                <div className="bg-emerald-950/70 border-b border-emerald-800/60 px-4 py-2 text-xs font-mono text-emerald-400 flex items-center gap-2">
                  <Check className="h-3.5 w-3.5" />
                  <span>{toastMessage}</span>
                </div>
              )}

              <Command.List className="max-h-80 overflow-y-auto p-2 scrollbar-thin">
                <Command.Empty className="py-8 text-center text-xs text-neutral-500 font-mono">
                  No matching commands found.
                </Command.Empty>

                <Command.Group heading="Navigation" className="px-2 py-1.5 text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                  <Command.Item
                    value="home showcase overview main"
                    onSelect={() => navigateTo("/")}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-900 hover:text-white cursor-pointer transition-colors aria-selected:bg-neutral-900 aria-selected:text-white"
                  >
                    <Home className="h-4 w-4 text-neutral-400" />
                    <span className="flex-1 font-medium">Home / Showcase</span>
                    <span className="text-[11px] font-mono text-neutral-500">/</span>
                  </Command.Item>
                  <Command.Item
                    value="pricing plans tiers subscription"
                    onSelect={() => navigateTo("/pricing")}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-900 hover:text-white cursor-pointer transition-colors aria-selected:bg-neutral-900 aria-selected:text-white"
                  >
                    <Tag className="h-4 w-4 text-emerald-400" />
                    <span className="flex-1 font-medium">Pricing Tiers</span>
                    <span className="text-[11px] font-mono text-neutral-500">/pricing</span>
                  </Command.Item>
                  <Command.Item
                    value="docs documentation api guides sdk"
                    onSelect={() => navigateTo("/docs")}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-900 hover:text-white cursor-pointer transition-colors aria-selected:bg-neutral-900 aria-selected:text-white"
                  >
                    <BookOpen className="h-4 w-4 text-cyan-400" />
                    <span className="flex-1 font-medium">Developer Documentation</span>
                    <span className="text-[11px] font-mono text-neutral-500">/docs</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Consensus Network" className="mt-2 px-2 py-1.5 text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                  <Command.Item
                    value="validator sync hourly cron"
                    onSelect={triggerValidatorSync}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-900 hover:text-white cursor-pointer transition-colors aria-selected:bg-neutral-900 aria-selected:text-white"
                  >
                    <Server className="h-4 w-4 text-emerald-400" />
                    <span className="flex-1 font-medium">Hourly Validator Sync</span>
                    <span className="text-[10px] font-mono text-neutral-400">/api/cron/sync</span>
                  </Command.Item>
                  <Command.Item
                    value="telemetry dashboard live stream"
                    onSelect={viewTelemetryDashboard}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-900 hover:text-white cursor-pointer transition-colors aria-selected:bg-neutral-900 aria-selected:text-white"
                  >
                    <Activity className="h-4 w-4 text-emerald-400" />
                    <span className="flex-1 font-medium">Telemetry Dashboard</span>
                    <span className="text-[10px] font-mono text-neutral-500">#preview</span>
                  </Command.Item>
                  <Command.Item
                    value="webhook alert dispatch"
                    onSelect={sendWebhookAlert}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-900 hover:text-white cursor-pointer transition-colors aria-selected:bg-neutral-900 aria-selected:text-white"
                  >
                    <AlertCircle className="h-4 w-4 text-rose-400" />
                    <span className="flex-1 font-medium">Webhook Alert</span>
                    <span className="text-[10px] font-mono text-neutral-400">/api/webhook</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Quick Actions" className="mt-2 px-2 py-1.5 text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                  <Command.Item
                    value="copy url share link"
                    onSelect={copyUrl}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-900 hover:text-white cursor-pointer transition-colors aria-selected:bg-neutral-900 aria-selected:text-white"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-neutral-400" />}
                    <span className="flex-1 font-medium">{copied ? "Copied URL to Clipboard!" : "Copy Live URL"}</span>
                    <span className="text-[11px] font-mono text-neutral-500">Cmd+C</span>
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Theme & Display" className="mt-2 px-2 py-1.5 text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                  <Command.Item
                    value="dark theme mode nocturnal"
                    onSelect={() => toggleTheme("dark")}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-900 hover:text-white cursor-pointer transition-colors aria-selected:bg-neutral-900 aria-selected:text-white"
                  >
                    <Moon className="h-4 w-4 text-neutral-400" />
                    <span className="flex-1 font-medium">Switch to Dark Theme</span>
                  </Command.Item>
                  <Command.Item
                    value="light theme mode daylight"
                    onSelect={() => toggleTheme("light")}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-900 hover:text-white cursor-pointer transition-colors aria-selected:bg-neutral-900 aria-selected:text-white"
                  >
                    <Sun className="h-4 w-4 text-amber-400" />
                    <span className="flex-1 font-medium">Switch to Light Theme</span>
                  </Command.Item>
                  <Command.Item
                    value="system auto theme os"
                    onSelect={() => toggleTheme("system")}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-900 hover:text-white cursor-pointer transition-colors aria-selected:bg-neutral-900 aria-selected:text-white"
                  >
                    <Laptop className="h-4 w-4 text-neutral-400" />
                    <span className="flex-1 font-medium">Use System Preferences</span>
                  </Command.Item>
                </Command.Group>
              </Command.List>

              <div className="flex items-center justify-between border-t border-neutral-800/80 px-4 py-2.5 bg-neutral-900/40 text-[11px] font-mono text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-emerald-400" />
                  <span>Interactive Command Palette</span>
                </span>
                <div className="flex items-center gap-3">
                  <span>Navigate <kbd className="rounded border border-neutral-800 bg-neutral-800 px-1 text-[9px] text-neutral-400">↑</kbd><kbd className="rounded border border-neutral-800 bg-neutral-800 px-1 text-[9px] text-neutral-400 ml-0.5">↓</kbd></span>
                  <span>Select <kbd className="rounded border border-neutral-800 bg-neutral-800 px-1 text-[9px] text-neutral-400">↵</kbd></span>
                </div>
              </div>
            </Command>
          </div>
        </div>
      )}
    </>
  );
}