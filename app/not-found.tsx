import Link from "next/link";
import { Terminal, ArrowLeft, Home, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[650px] rounded-full bg-emerald-500/10 blur-[130px]" />

      <div className="relative z-10 max-w-md w-full text-center rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 sm:p-10 backdrop-blur-xl shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-800/80 border border-neutral-700/80 text-emerald-400 mb-6 shadow-inner">
          <Terminal className="h-7 w-7" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-950/80 px-3 py-1 text-xs font-mono text-emerald-400 mb-3">
          HTTP 404 — ROUTE NOT FOUND
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Page Does Not Exist
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-neutral-400 leading-relaxed">
          The requested endpoint or URL was not found on this edge server. It may have been moved, renamed, or is currently unrouted.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-2.5 px-4 text-xs font-bold text-neutral-950 hover:from-emerald-400 hover:to-teal-400 transition-all shadow-md shadow-emerald-500/10"
          >
            <Home className="h-4 w-4" />
            <span>Return to Home</span>
          </Link>
          <Link
            href="/docs"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-800/60 py-2.5 px-4 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            <span>Read Docs</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
