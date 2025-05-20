"use client";
import { useLenis } from "@/hooks/useLenis";
import { LandingBackground } from "@/components/landing-background";
import { LandingNavbar } from "@/components/landing-navbar";
import { LandingHero } from "@/components/landing-hero";
import { LandingFooter } from "@/components/landing-footer";
import { LandingKeyBenefits } from "@/components/landing-key-benefits";
import { LandingHowItWorks } from "@/components/landing-how-it-works";
import { LandingDualUseCases } from "@/components/landing-dual-use-cases";
import { LandingTrustSecurity } from "@/components/landing-trust-security";
import { LandingIntegrationShowcase } from "@/components/landing-integration-showcase";
import { LandingTestimonials } from "@/components/landing-testimonials";
import { LandingPricing } from "@/components/landing-pricing";
import { LandingFAQ } from "@/components/landing-faq";
import { LandingFinalCTA } from "@/components/landing-final-cta";
import { WalletConnectButton } from "@/components/WalletConnectButton";

export default function Home() {
  useLenis();
  return (
    <div className="relative min-h-screen flex flex-col bg-transparent">
      <LandingBackground />
      <LandingNavbar />
      <main className="flex-1 flex flex-col items-center justify-center">
        <LandingHero />
        <LandingKeyBenefits />
        <LandingHowItWorks />
        <LandingDualUseCases />
        <LandingTrustSecurity />
        <LandingIntegrationShowcase />
        <LandingTestimonials />
        <LandingPricing />
        <LandingFAQ />
        <LandingFinalCTA />
        <WalletConnectButton />
      </main>
      <LandingFooter />
    </div>
  );
}
