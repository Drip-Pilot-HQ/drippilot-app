import { Metadata } from "next";
import { Header } from "@/components/(unused)/(unused_components)/landing/Header";
import { Footer } from "@/components/(unused)/(unused_components)/landing/Footer";
import { PricingHero } from "@/components/(unused)/(unused_components)/pricing/PricingHero";
import { PricingCards } from "@/components/(unused)/(unused_components)/pricing/PricingCards";
import { PricingAddons } from "@/components/(unused)/(unused_components)/pricing/PricingAddons";
import { FeatureComparison } from "@/components/(unused)/(unused_components)/landing/FeatureComparison";
import { CTA } from "@/components/(unused)/(unused_components)/landing/CTA";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Flexible, predictable pricing for teams of all sizes. Choose the Drip Pilot plan that fits your outreach goals.",
  openGraph: {
    title: "Pricing | Drip Pilot",
    description:
      "Flexible, predictable pricing for teams of all sizes. Choose the Drip Pilot plan that fits your outreach goals.",
    url: "https://drippilot.com/pricing",
  },
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
