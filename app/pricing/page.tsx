import { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { PricingHero } from "@/components/pricing/PricingHero";
import { PricingCards } from "@/components/pricing/PricingCards";
import { PricingAddons } from "@/components/pricing/PricingAddons";
import { FeatureComparison } from "@/components/landing/FeatureComparison";
import { CTA } from "@/components/landing/CTA";

export const metadata: Metadata = {
  title: "Pricing | Drip Pilot - Data-Driven Growth Engine",
  description:
    "Flexible, predictable pricing for teams of all sizes. Choose the Drip Pilot plan that fits your outreach goals.",
};

export default function PricingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <PricingHero />
      <PricingCards />
      <FeatureComparison />
      <PricingAddons />
      <CTA />
      <Footer />
    </main>
  );
}
