import { Container } from "@/components/branding/Container";
import {
  Mail,
  MessageSquare,
  Clock,
  Plus,
  ChevronRight,
  Zap,
  Workflow,
  Split,
  Globe,
} from "lucide-react";

export const CampaignBuilder = () => {
  return (
    <section
      className="flex items-center py-16 md:py-24 lg:py-32 bg-white"
      id="builder"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Content Column - Left */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 border border-primary/20 uppercase tracking-widest shadow-sm">
              <Zap className="w-3.5 h-3.5 fill-primary" />
              Smart Sequencing
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 font-serif tracking-tight leading-[1.1]">
              Build <span className="italic text-gradient">sequences</span> that
              convert
            </h2>
            <p className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed font-light max-w-2xl mx-auto lg:mx-0">
              Design complex, multi-touch campaigns with an intuitive
              drag-and-drop builder. Add conditional logic, delays, and A/B
              tests in seconds.
            </p>
            <ul className="space-y-6 text-left">
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Workflow className="w-5 h-5" />
                </div>
                <span className="text-slate-700 font-medium">
                  Multi linear campaign steps
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Split className="w-5 h-5" />
                </div>
                <span className="text-slate-700 font-medium">
                  Omnichannel drip campaigns
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-slate-700 font-medium">
                  Timezone-aware delivery logic
                </span>
              </li>
            </ul>
          </div>

          {/* Mockup Column - Right */}
          <div className="relative">
            {/* Background decorations */}
            <div className="absolute -inset-4 bg-linear-to-tr from-primary/5 to-secondary/5 rounded-[40px] blur-2xl"></div>

            {/* Main Mockup Card */}
            <div className="relative bg-white rounded-[32px] lg:rounded-[40px] shadow-2xl border border-slate-100 p-6 sm:p-10 overflow-hidden">
              <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Workflow className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight">
                      Sequence Designer
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">
                      Editor: Live Mode
                    </p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-primary text-white rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer hover:bg-primary/90 transition-colors">
                  Publish
                </div>
              </div>

              <div className="relative flex flex-col items-center">
                {/* Step 1: Email */}
                <div className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-xs">
                        Action: Send Email
                      </h3>
                      <p className="text-[10px] text-slate-400">
                        Template: Q3 Pitch
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>

                {/* Connector */}
                <div className="h-6 w-px bg-slate-100"></div>

                {/* Delay Chip */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <Clock className="w-3 h-3 text-primary" />3 Days Delay
                </div>

                {/* Connector */}
                <div className="h-6 w-px bg-slate-100"></div>

                {/* Step 2: SMS */}
                <div className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group transition-all opacity-80">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-xs">
                        Action: Send SMS
                      </h3>
                      <p className="text-[10px] text-slate-400">
                        Template: Reminder
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>

                {/* Connector */}
                <div className="h-6 w-px bg-slate-100"></div>

                {/* Add Step */}
                <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-full font-bold text-[11px] shadow-lg hover:bg-slate-800 transition-all">
                  <Plus className="w-3.5 h-3.5" />
                  Add Next Step
                </button>
              </div>

              {/* Floaties */}
              <div className="absolute top-1/2 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 -left-12 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
