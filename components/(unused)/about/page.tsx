import { Metadata } from "next";
import { Header } from "@/components/(unused)/(unused_components)/landing/Header";
import { Footer } from "@/components/(unused)/(unused_components)/landing/Footer";
import { AboutHero } from "@/components/(unused)/(unused_components)/about/AboutHero";
import { CoreValues } from "@/components/(unused)/(unused_components)/about/CoreValues";
import { AboutStory } from "@/components/(unused)/(unused_components)/about/AboutStory";
import { LifeAtDrip } from "@/components/(unused)/(unused_components)/about/LifeAtDrip";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about the mission, values, and story behind Drip Pilot. We are building the future of outbound sales with AI precision.",
  openGraph: {
    title: "About Us | Drip Pilot",
    description:
      "Learn about the mission, values, and story behind Drip Pilot. We are building the future of outbound sales with AI precision.",
    url: "https://drippilot.com/about",
  },
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
