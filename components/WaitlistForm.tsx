"use client";

import React, { useState } from "react";
import { Mail, ArrowRight, Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

interface WaitlistFormProps {
  source?: string;
  placeholder?: string;
  buttonLabel?: string;
  className?: string;
}

export default function WaitlistForm({
  source = "hero_section",
  placeholder = "Enter your work email...",
  buttonLabel = "Join Early Access",
  className = "",
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to register your email.");
      }

      setStatus("success");
      setMessage(data.message || "You're on the early access list! We'll be in touch soon.");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message || "Failed to submit. Please try again.");
    }
  };

  return (
    <div className={`w-full max-w-md ${className}`}>
      {status === "success" ? (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300 text-xs sm:text-sm animate-in fade-in duration-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <div className="flex-1">
            <span className="font-semibold block text-white">Access Requested!</span>
            <span>{message}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="text-[11px] font-mono text-emerald-400 underline hover:text-emerald-300 ml-2"
          >
            Add another
          </button>
        </div>
      ) : (
        <form id="waitlist-form" onSubmit={handleSubmit} className="relative">
          <div className="flex flex-col sm:flex-row items-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/80 p-1.5 backdrop-blur-xl shadow-lg focus-within:border-emerald-500/60 transition-colors">
            <div className="relative flex-1 w-full flex items-center">
              <Mail className="pointer-events-none absolute left-3.5 h-4 w-4 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent pl-10 pr-3 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-xs font-bold text-neutral-950 hover:from-emerald-400 hover:to-teal-400 transition-all shadow-md shadow-emerald-500/10 disabled:opacity-50 shrink-0"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>{buttonLabel}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>

          {status === "error" && (
            <div className="mt-2.5 flex items-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 text-xs text-rose-300 animate-in fade-in">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>{message}</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
