import React from "react";
import { Container } from "@/components/branding/Container";
import { COMPARISON_FEATURES } from "@/constants/pricingData";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export const FeatureComparison = () => {
  return (
    <section
      className="py-24 bg-slate-50 relative overflow-hidden"
      id="comparison"
    >
      <div className="absolute top-0 inset-x-0 h-40 bg-linear-to-b from-white to-transparent"></div>

      <Container className="relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 font-serif">
            Deep Dive Comparison
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">
            Compare our plans side-by-side to find the perfect fit for your
            growth.
          </p>
        </div>

        <div className="overflow-x-auto rounded-[40px] border border-slate-200 shadow-xl bg-white">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="p-8 text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Features
                </th>
                <th className="p-8 text-center text-sm font-bold text-slate-900">
                  Starter
                </th>
                <th className="p-8 text-center text-sm font-bold text-accent">
                  Pro
                </th>
                <th className="p-8 text-center text-sm font-bold text-primary transition-all">
                  Teams
                </th>
                <th className="p-8 text-center text-sm font-bold text-slate-950">
                  Enterprise
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_FEATURES.map((category) => (
                <React.Fragment key={category.category}>
                  <tr className="bg-slate-50/50">
                    <td
                      colSpan={5}
                      className="p-4 px-8 text-[10px] font-bold text-primary uppercase tracking-[0.2em] border-y border-slate-100/50"
                    >
                      {category.category}
                    </td>
                  </tr>
                  {category.features.map((feature, i) => (
                    <tr
                      key={feature.name}
                      className={cn(
                        "transition-all duration-300 hover:bg-slate-50 group",
                        i < category.features.length - 1
                          ? "border-b border-slate-50"
                          : "",
                      )}
                    >
                      <td className="p-6 px-8 text-sm font-bold text-slate-900 group-hover:pl-10 transition-all">
                        {feature.name}
                      </td>
                      <td className="p-6 text-center text-sm">
                        {renderValue(feature.starter, "starter")}
                      </td>
                      <td className="p-6 text-center text-sm">
                        {renderValue(feature.pro, "pro")}
                      </td>
                      <td className="p-6 text-center text-sm">
                        {renderValue(feature.teams, "teams")}
                      </td>
                      <td className="p-6 text-center text-sm">
                        {renderValue(feature.enterprise, "enterprise")}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
};

const renderValue = (
  value: boolean | string | null,
  plan: "starter" | "pro" | "teams" | "enterprise",
) => {
  const styles = {
    starter: "text-slate-400",
    pro: "text-accent font-bold",
    teams: "text-primary font-bold",
    enterprise: "text-slate-950 font-bold",
  };

  if (value === true) {
    return (
      <div className="flex justify-center transition-all duration-300 transform group-hover:scale-110">
        <Check className={cn("w-5 h-5", styles[plan])} />
      </div>
    );
  }
  if (value === null || value === false) {
    return (
      <div className="flex justify-center">
        <Minus className="w-5 h-5 text-slate-100" />
      </div>
    );
  }
  return (
    <span
      className={cn("text-xs font-bold uppercase tracking-wider", styles[plan])}
    >
      {value}
    </span>
  );
};
