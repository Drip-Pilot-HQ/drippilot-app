import { Metadata } from "next";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { AboutHero } from "@/components/about/AboutHero";
import { CoreValues } from "@/components/about/CoreValues";
import { AboutStory } from "@/components/about/AboutStory";
import { LifeAtDrip } from "@/components/about/LifeAtDrip";

export const metadata: Metadata = {
  title: "About Us | Drip Pilot - Mission & Values",
  description:
    "Learn about the mission, values, and story behind Drip Pilot. We are building the future of outbound sales with AI precision.",
};

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <div className="grow">
        <AboutHero />
        <CoreValues />
        <AboutStory />
        <LifeAtDrip />
      </div>
      <Footer />
    </main>
  );
}
