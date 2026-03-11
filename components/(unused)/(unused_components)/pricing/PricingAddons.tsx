import { Container } from "@/components/branding/Container";
import {
  ADDONS,
  CREDIT_GUIDE,
} from "@/components/(unused)/(unused_constants)/pricingData";
import {
  Users,
  Phone,
  Database,
  ShieldCheck,
  MessageSquare,
  Bot,
  Mail,
} from "lucide-react";

const iconMap = {
  users: Users,
  phone: Phone,
  database: Database,
  message: MessageSquare,
  bot: Bot,
  mail: Mail,
};

export const PricingAddons = () => {
  return (
    <section className="py-32">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 font-serif">
            Need more capacity?
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">
            Targeted add-ons to fit your team&apos;s workflow perfectly without
            upgrading your whole plan.
          </p>
        </div>

        {/* Addons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {ADDONS.map((addon, index) => {
            const Icon = iconMap[addon.icon as keyof typeof iconMap];
            return (
              <div
                key={index}
                className="group bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">
                    {addon.name}
                  </h3>
                  <div className="text-right">
                    <span className="text-lg font-bold text-primary">
                      ${addon.price}
                    </span>
                    <span className="text-xs text-slate-400 font-bold block uppercase tracking-tighter">
                      /{addon.unit}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  {addon.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Overage Protection Banner */}
        <div className="relative overflow-hidden bg-slate-950 rounded-[40px] p-8 md:p-12 mb-16 shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-primary/20 to-transparent pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center justify-between gap-12 lg:flex-row">
            <div className="max-w-xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6 border border-primary/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Zero-Stop Infrastructure
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 font-serif leading-tight">
                Seamless Campaign{" "}
                <span className="italic text-primary">Continuity</span>
              </h3>
              <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed">
                Never let a zero credit balance pause your growth. By enabling
                Overage Flow, your messages continue uninterrupted even if you
                run out of credits. We simply track your usage and process a
                charge only when you hit a threshold.
              </p>
            </div>

            <div className="relative w-full max-w-[450px] aspect-square lg:aspect-video bg-white/3 border border-white/10 rounded-3xl p-6 backdrop-blur-sm overflow-hidden flex items-center justify-center group/visual">
              {/* Abstract Visual Design Item */}
              <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-50"></div>

              <div className="relative w-full space-y-6">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <span>257 Credits Used</span>
                  <span className="text-primary font-black animate-pulse">
                    Overage Enabled
                  </span>
                </div>

                {/* Progress Visual */}
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                  <div className="h-full w-[62%] bg-linear-to-r from-primary/60 to-primary rounded-full relative shadow-[0_0_15px_rgba(var(--primary),0.5)]">
                    <div className="absolute top-0 right-0 h-full w-8 bg-white/20 blur-md"></div>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                      Accrued Usage
                    </div>
                    <div className="text-2xl font-bold text-white font-serif">
                      $15.42
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                      Billing Trigger
                    </div>
                    <div className="text-sm font-bold text-primary">$25.00</div>
                  </div>
                </div>

                {/* Micro-Interaction Label */}
                <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-[9px] text-slate-400 font-medium leading-tight">
                    Campaign continuity is{" "}
                    <span className="text-primary font-bold">Enabled</span>.
                    Your outreach engine will never stall.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Credit Guide Table */}
        <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-xl">
          <div className="p-8 md:p-10 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 font-serif">
                Credit Consumption Guide
              </h3>
              <p className="text-sm text-slate-500 font-medium tracking-tight">
                Understand how your credits are utilized across the Drip Pilot
                platform.
              </p>
            </div>
            <div className="bg-primary/5 border border-primary/10 rounded-2xl px-6 py-3 flex items-center justify-center">
              <span className="text-sm font-bold text-primary tracking-widest uppercase">
                100 Credits = $6.00
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    Service Type
                  </th>
                  <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    Description
                  </th>
                  <th className="px-10 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    Cost
                  </th>
                  <th className="px-10 py-5 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {CREDIT_GUIDE.map((item, i) => {
                  const Icon = iconMap[item.icon as keyof typeof iconMap];
                  return (
                    <tr
                      key={i}
                      className="hover:bg-slate-50/50 transition-colors duration-300"
                    >
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                            <Icon className="w-5 h-5 text-slate-600" />
                          </div>
                          <span className="text-sm font-bold text-slate-900">
                            {item.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-sm text-slate-500 font-medium">
                        {item.description}
                      </td>
                      <td className="px-10 py-8">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-tighter shadow-sm border border-primary/10">
                          {item.cost}
                        </span>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline transition-all">
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-8 md:p-10 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-center gap-6">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              All prices are in USD and subject to regional tax where
              applicable.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};
