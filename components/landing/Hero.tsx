import { Button } from "@/components/branding/Button";
import { Container } from "@/components/branding/Container";
import { PlayCircle, Box, Mountain, Sun, Waves, Cloud } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden mesh-gradient">
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none"></div>
      <Container className="relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-8 border border-primary/20 uppercase tracking-wider">
          Advanced Marketing Platform
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-4xl mx-auto leading-[1.1] text-slate-900">
          Drip Pilot - Your <br />
          <span className="text-gradient">AI-Powered</span>
          <br />
          Sales <span className="italic font-serif">Assistant</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          Automate your outreach, engage leads instantly, and close deals faster
          with the smartest drip campaign assistant.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button
            variant="primary"
            size="md"
            className="shadow-xl shadow-primary/20 w-full sm:w-auto"
          >
            Join the Beta
          </Button>
          <Button
            variant="outline"
            size="md"
            className="w-full sm:w-auto bg-white border-slate-200"
          >
            Get Started
          </Button>
        </div>

        <div className="max-w-5xl mx-auto metallic-bezel mt-12 overflow-hidden">
          <div className="aspect-video bg-slate-900 rounded-2xl flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-slate-800 opacity-20 group-hover:opacity-10 transition-opacity"></div>
            <PlayCircle className="w-20 h-20 text-white opacity-50 group-hover:scale-110 transition-transform cursor-pointer" />
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
              <div className="h-1 w-full bg-white/20 rounded-full mr-4">
                <div className="h-full w-1/3 bg-primary rounded-full"></div>
              </div>
              <span className="text-white/60 text-xs font-mono">03:42</span>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-10">
          <p className="text-xs font-semibold text-slate-400 mb-8 uppercase tracking-[0.2em]">
            Trusted by innovative teams worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 font-bold text-lg">
              <Box className="w-5 h-5" /> Frosty
            </div>
            <div className="flex items-center gap-2 font-bold text-lg">
              <Mountain className="w-5 h-5" /> Vertex
            </div>
            <div className="flex items-center gap-2 font-bold text-lg">
              <Sun className="w-5 h-5" /> Solis
            </div>
            <div className="flex items-center gap-2 font-bold text-lg">
              <Waves className="w-5 h-5" /> Tide
            </div>
            <div className="flex items-center gap-2 font-bold text-lg">
              <Cloud className="w-5 h-5" /> Nimbus
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
