import { Container } from "@/components/branding/Container";
import { GitBranch, Tag, Webhook, Zap, ChevronRight } from "lucide-react";

export const CampaignRouting = () => {
  return (
    <section
      className="flex items-center py-16 md:py-24 lg:py-32 bg-white"
      id="routing"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-primary" />
              Intelligent Routing
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-serif tracking-tight">
              Smart leads <span className="italic text-primary">routing</span>{" "}
              to campaigns.
            </h2>
            <p className="text-lg text-slate-500 mb-10 leading-relaxed font-light">
              Import leads via your CRM using webhooks with intelligent routing.
              Automate lead distribution based on complex logic and multi-rule
              sets.
            </p>
            <ul className="space-y-6">
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <GitBranch className="w-5 h-5" />
                </div>
                <span className="text-slate-700 font-medium">
                  Rule-based routing (AND/OR logic)
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Tag className="w-5 h-5" />
                </div>
                <span className="text-slate-700 font-medium">
                  Tag-based lead segmentation (e.g., Tag = Meta)
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Webhook className="w-5 h-5" />
                </div>
                <span className="text-slate-700 font-medium">
                  Seamless CRM Webhook integration
                </span>
              </li>
            </ul>
          </div>

          <div className="relative">
            {/* Background decorations */}
            <div className="absolute -inset-4 bg-linear-to-tr from-primary/5 to-secondary/5 rounded-[40px] blur-2xl"></div>

            {/* Main Mockup Card */}
            <div className="relative bg-white rounded-[32px] lg:rounded-[40px] shadow-2xl border border-slate-100 p-5 sm:p-8 overflow-hidden">
              <div className="flex items-center justify-between mb-3 border-b border-slate-50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Webhook className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 leading-tight">
                      Incoming CRM Leads
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">
                      Webhook Integration
                    </p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold border border-emerald-100 uppercase tracking-wider">
                  Active
                </div>
              </div>

              {/* Rules Canvas */}
              <div className="space-y-3">
                <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">
                    Rules Engine
                  </p>

                  <div className="space-y-2">
                    {/* Condition 1 */}
                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase w-4">
                        If
                      </span>
                      <div className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600">
                        Tags
                      </div>
                      <span className="text-xs text-slate-400">Contains</span>
                      <div className="px-3 py-1 bg-secondary/10 text-secondary rounded-lg text-xs font-bold border border-secondary/20">
                        &apos;Meta&apos;
                      </div>
                    </div>

                    {/* Logic Toggle */}
                    <div className="flex justify-center relative z-10">
                      <div className="flex p-1 bg-slate-100 rounded-lg text-[9px] font-bold cursor-pointer border border-slate-200">
                        <div className="px-2 py-0.5 bg-slate-900 text-white rounded-md shadow-sm">
                          AND
                        </div>
                        <div className="px-2 py-0.5 text-slate-400">OR</div>
                      </div>
                    </div>

                    {/* Condition 2 */}
                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase w-4">
                        If
                      </span>
                      <div className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600">
                        Lead Status
                      </div>
                      <span className="text-xs text-slate-400">IS</span>
                      <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold border border-primary/20">
                        &apos;Hot&apos;
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Block */}
                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-4">
                    Action
                  </p>
                  <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-primary/20 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Then
                      </span>
                      <p className="text-xs font-bold text-slate-800">
                        Enroll in Campaigns
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                      <div className="text-xs font-bold text-primary">
                        Enterprise Outreach...
                      </div>
                    </div>
                  </div>
                </div>
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
