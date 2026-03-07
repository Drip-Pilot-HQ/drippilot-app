import { Container } from "@/components/branding/Container";
import { BellRing, Smartphone, BarChart3, Airplay } from "lucide-react";

export const RealTimePush = () => {
  return (
    <section
      className="flex items-center py-16 md:py-24 lg:py-32 bg-white"
      id="realtime-push"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Mockup Column - Left on Desktop */}
          <div className="relative order-2 lg:order-1">
            {/* Background decorations */}
            <div className="absolute -inset-4 bg-linear-to-tr from-primary/5 to-accent/5 rounded-[40px] blur-2xl"></div>

            <div className="relative bg-white p-5 sm:p-8 rounded-[32px] lg:rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-50">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <BellRing className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-tight">
                    Instant Alerts
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5 whitespace-nowrap">
                    Real-time Engagement Tracking
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Notification Item 1 */}
                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex gap-4 transform transition-transform hover:scale-[1.02] duration-300">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0 animate-pulse"></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">
                      Sarah Jenkins opened your email
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      3rd open • 2 minutes ago
                    </p>
                  </div>
                </div>

                {/* Notification Item 2 */}
                <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex gap-4 transform transition-transform hover:scale-[1.02] duration-300">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0"></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-tight">
                      Mike Ross clicked pricing link
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      High Intent • Just now
                    </p>
                  </div>
                </div>

                {/* Notification Item 3 */}
                <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 flex gap-4 opacity-60">
                  <div className="w-2 h-2 mt-2 rounded-full bg-slate-300 shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Weekly report is ready
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Performance • 1 hour ago
                    </p>
                  </div>
                </div>
              </div>

              {/* Floaties */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="absolute top-0 -left-6 w-24 h-24 bg-accent/5 rounded-full blur-3xl"></div>
            </div>
          </div>

          {/* Content Column - Right on Desktop */}
          <div className="order-1 lg:order-2 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 border border-primary/20 uppercase tracking-widest shadow-sm">
              <Smartphone className="w-3.5 h-3.5" />
              Instant Outreach
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 leading-[1.1] text-slate-900 font-serif tracking-tight">
              Act when they&apos;re actually{" "}
              <span className="text-gradient italic">interested</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed font-light max-w-2xl mx-auto lg:mx-0">
              Get instant alerts on your phone, desktop, and tablet the moment a
              lead shows buying intent. Strike while the iron is hot.{" "}
              <span className="text-primary font-medium underline decoration-primary/20 underline-offset-4">
                Precision engagement, zero delays.
              </span>
            </p>

            <ul className="space-y-6 mb-12 text-left">
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Airplay className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-slate-700 font-medium block">
                    Multi-Device Sync
                  </span>
                  <span className="text-sm text-slate-500">
                    Live notifications across iOS, Android, and Desktop.
                  </span>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-slate-700 font-medium block">
                    Lead Intent Detection
                  </span>
                  <span className="text-sm text-slate-500">
                    Only get notified for high-value engagement signals.
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
};
