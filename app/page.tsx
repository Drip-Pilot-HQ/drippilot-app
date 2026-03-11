// import { Header } from "@/components/landing/Header";
// import { Hero } from "@/components/landing/Hero";
// import { Metrics } from "@/components/landing/Metrics";
// import { CampaignRouting } from "@/components/landing/CampaignRouting";
// import { RealTimePush } from "@/components/landing/RealTimePush";
// import { CampaignBuilder } from "@/components/landing/CampaignBuilder";
// import { Features } from "@/components/landing/Features";
// import { Solutions } from "@/components/landing/Solutions";
// import { HowItWorks } from "@/components/landing/HowItWorks";
// import { WhyChoose } from "@/components/landing/WhyChoose";
// import { CTA } from "@/components/landing/CTA";
// import { Footer } from "@/components/landing/Footer";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    // <div className="flex flex-col min-h-screen">
    //   <Header />
    //   <main className="grow">
    //     <Hero />
    //     <Metrics />
    //     <CampaignBuilder />
    //     <RealTimePush />
    //     <CampaignRouting />
    //     <Features />
    //     <HowItWorks />
    //     <Solutions />
    //     <WhyChoose />
    //     <CTA />
    //   </main>
    //   <Footer />
    // </div>
    redirect('/auth/login')
  );
}
