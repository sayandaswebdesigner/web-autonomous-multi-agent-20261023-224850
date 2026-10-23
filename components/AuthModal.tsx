"use client";

import React, { useState } from "react";
import { X, Lock, Mail, Check, AlertCircle, Sparkles, ShieldCheck, ArrowRight, Loader2, Activity } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (email: string) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [consensusRound, setConsensusRound] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === "signin") {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        setSuccess("Authentication successful! Welcome back.");
        if (onAuthSuccess) onAuthSuccess(data.user?.email || email);
        setTimeout(() => {
          onClose();
          setSuccess(null);
        }, 1200);
      } else {
        const { data, error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;
        setSuccess("Account initialized successfully!");
        if (onAuthSuccess) onAuthSuccess(data.user?.email || email);
        setTimeout(() => {
          onClose();
          setSuccess(null);
        }, 1200);
      }
    } catch (err: any) {
      setError(err?.message || "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const demoEmail = "validator@nexus-analytics.io";
      await supabase.auth.signInWithPassword({ email: demoEmail, password: "demo-password-2026" });
      setSuccess("Logged in as Demo Validator!");
      if (onAuthSuccess) onAuthSuccess(demoEmail);
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 1000);
    } catch (err: any) {
      setError(err?.message || "Demo login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleConsensusLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const roundEmail = `round${consensusRound}@consensus.nexus`;
      await supabase.auth.signInWithPassword({ email: roundEmail, password: `consensus-round-${consensusRound}-2026` });
      setSuccess(`Logged in as Consensus Round ${consensusRound} validator!`);
      if (onAuthSuccess) onAuthSuccess(roundEmail);
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 1000);
    } catch (err: any) {
      setError(err?.message || "Consensus round login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800/80">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Developer Access</h3>
              <p className="text-xs text-neutral-400">Secure API & Console Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Backend Status Pill */}
        <div className="mt-4 flex items-center justify-between rounded-lg bg-neutral-950/70 border border-neutral-800 px-3 py-2 text-xs">
          <span className="text-neutral-400 flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${isSupabaseConfigured ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
            Backend Mode:
          </span>
          <span className={`font-mono font-medium ${isSupabaseConfigured ? "text-emerald-400" : "text-amber-400"}`}>
            {isSupabaseConfigured ? "Supabase Connected" : "Local Mock Sandbox"}
          </span>
        </div>

        {/* Mode Selector Tabs */}
        <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-neutral-950/80 p-1 border border-neutral-800/80">
          <button
            type="button"
            onClick={() => { setMode("signin"); setError(null); }}
            className={`rounded-lg py-2 text-xs font-medium transition-all ${
              mode === "signin"
                ? "bg-neutral-800 text-white shadow-sm"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode("signup"); setError(null); }}
            className={`rounded-lg py-2 text-xs font-medium transition-all ${
              mode === "signup"
                ? "bg-neutral-800 text-white shadow-sm"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Feedback messages */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/30 px-3 py-2.5 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-2.5 text-xs text-emerald-300">
            <Check className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="validator@company.com"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 pl-9 pr-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 pl-9 pr-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-semibold text-neutral-950 hover:from-emerald-400 hover:to-teal-400 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>{mode === "signin" ? "Sign In to Console" : "Create Developer Account"}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast-Track Button */}
        <div className="mt-4 pt-4 border-t border-neutral-800/80">
          <button
            type="button"
            onClick={handleDemoSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-neutral-700/80 bg-neutral-800/50 px-4 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Instant Demo Session (1-Click)</span>
          </button>
        </div>

        {/* Consensus Round Switcher */}
        <div className="mt-6 pt-4 border-t border-neutral-800/80">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="font-medium text-neutral-300">Consensus Round</span>
          </div>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((round) => (
              <button
                key={round}
                type="button"
                onClick={() => setConsensusRound(round)}
                className={`rounded-full py-1.5 px-2 text-[10px] font-medium transition-all ${
                  consensusRound === round
                    ? "bg-emerald-500 text-neutral-950"
                    : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                Round {round}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleConsensusLogin}
            disabled={loading}
            className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl border border-neutral-700/80 bg-neutral-800/50 px-4 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Login as Round {consensusRound} Validator</span>
          </button>
        </div>
      </div>
    </div>
  );
}
