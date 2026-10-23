"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import InteractivePreview from "@/components/InteractivePreview";
import InteractiveSpecs from "@/components/InteractiveSpecs";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";

export default function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const handleScrollToPreview = () => {
    const el = document.getElementById("preview");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAuthSuccess = (email: string) => {
    setUserEmail(email);
  };

  const handleSignOut = () => {
    setUserEmail(null);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-emerald-500 selection:text-neutral-950">
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        userEmail={userEmail}
        onSignOut={handleSignOut}
        onScrollToPreview={handleScrollToPreview}
      />

      <Hero
        onOpenAuth={() => setIsAuthOpen(true)}
        onExplorePreview={handleScrollToPreview}
      />

      <Features />

      <InteractivePreview />

      <InteractiveSpecs />

      <Footer />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </main>
  );
}
