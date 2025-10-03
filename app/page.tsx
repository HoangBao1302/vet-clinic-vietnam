"use client";

import Header from "@/components/Header";
import ForexHero from "@/components/ForexHero";
import Features from "@/components/Features";
import Strategy from "@/components/Strategy";
import Proof from "@/components/Proof";
import LiveResults from "@/components/LiveResults";
import ForexContact from "@/components/ForexContact";
import Footer from "@/components/Footer";
import StickyCallToAction from "@/components/StickyCallToAction";
export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <ForexHero />
        <Features />
        <Strategy />
        <Proof />
        <LiveResults />
        <ForexContact />
      </main>
      <Footer />
      <StickyCallToAction />
    </div>
  );
} 