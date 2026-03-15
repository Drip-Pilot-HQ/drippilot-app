import { Header } from "@/components/(unused)/(unused_components)/landing/Header";
import { Footer } from "@/components/(unused)/(unused_components)/landing/Footer";
import { PrivacyHero } from "@/components/(unused)/(unused_components)/legal/PrivacyHero";
import { PrivacyContent } from "@/components/(unused)/(unused_components)/legal/PrivacyContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn about how Drip Pilot handles your data and our commitment to privacy and AI ethics.",
  openGraph: {
    title: "Privacy Policy | Drip Pilot",
    description:
      "Learn about how Drip Pilot handles your data and our commitment to privacy and AI ethics.",
    url: "https://drippilot.com/privacy-policy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow">
        <PrivacyHero />
        <PrivacyContent />
      </main>
      <Footer />
    </div>
  );
}
