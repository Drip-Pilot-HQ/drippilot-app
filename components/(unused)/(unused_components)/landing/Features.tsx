"use client";

import React, { useEffect, useRef, useState } from "react";
import { Container } from "@/components/branding/Container";
import { cn } from "@/lib/utils";
import { AIFollowUpMock } from "./Mockups/AIFollowUpMock";
import { SmartRoutingMock } from "./Mockups/SmartRoutingMock";
import { WorkflowBuilderMock } from "./Mockups/WorkflowBuilderMock";
import {
  ACCENT_STYLES,
  FEATURES,
} from "@/components/(unused)/(unused_constants)/featureData";
import { LeadDetectionMock } from "./Mockups/LeadDetectionMock";
import { RealTimeAlertsMock } from "./Mockups/RealTimeAlertsMock";

/* ------------------------------------------------------------------ */
/* Mobile-only static feature cards                                    */
/* ------------------------------------------------------------------ */

const MobileFeatures = () => (
  <section
    className="lg:hidden py-12 md:py-20 bg-slate-950 relative overflow-hidden"
    id="features"
  >
    <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
    <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>

    <Container className="relative">
      <div className="mb-12 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6 border border-primary/30">
          All-In-One Platform
        </div>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white font-serif tracking-tight leading-tight">
          Everything you need to{" "}
          <span className="italic text-gradient">scale</span>
        </h2>
      </div>

      <div className="space-y-4">
        {FEATURES.map((feature, i) => {
          const styles = ACCENT_STYLES[feature.accent];
          const Icon = feature.icon;
          return (
            <div
              key={i}
              className="bg-white/5 rounded-[32px] border border-white/10 p-6 backdrop-blur-sm"
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    styles.bg,
                  )}
                >
                  <Icon className={cn("w-5 h-5", styles.icon)} />
                </div>
                <div className="min-w-0">
                  <div
                    className={cn(
                      "text-xs font-semibold uppercase tracking-wider mb-0.5",
                      styles.icon,
                    )}
                  >
                    {feature.label}
                  </div>
                  <h4 className="font-bold text-white text-base leading-snug">
                    {feature.title}
                  </h4>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-5 font-medium">
                {feature.description}
              </p>
              <div className="flex gap-8">
                {feature.stats.map((stat, j) => (
                  <div key={j}>
                    <div
                      className={cn("text-xl font-bold font-mono", styles.stat)}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  </section>
);

/* ------------------------------------------------------------------ */
/* Desktop scroll-driven features                                      */
/* ------------------------------------------------------------------ */

const DesktopFeatures = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;
      const scrolled = -rect.top;
      const progress = Math.max(
        0,
        Math.min(0.9999, scrolled / totalScrollable),
      );
      const index = Math.min(
        FEATURES.length - 1,
        Math.floor(progress * FEATURES.length),
      );
      setActiveIndex(index);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeStyles = ACCENT_STYLES[FEATURES[activeIndex].accent];

  return (
    <section
      ref={sectionRef}
      style={{ height: `${(FEATURES.length + 1) * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen bg-slate-950 flex items-center overflow-hidden">
        {/* Pattern & Glow Overlays */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
        <div className="absolute -top-48 -left-48 w-96 h-96 bg-primary/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

        <Container className="relative w-full max-w-7xl">
          <div className="grid grid-cols-12 gap-10 items-center">
            {/* Left: Visual mockup */}
            <div className="col-span-7 pt-34">
              <div className="absolute -inset-10 bg-primary/10 rounded-[60px] blur-[80px] pointer-events-none" />
              <div className="relative bg-slate-900 rounded-2xl overflow-hidden border border-white/10 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)] group">
                {/* Dark Mode */}
                <div className="flex items-center gap-3 px-4 py-4 bg-white/5 border-b border-white/10 backdrop-blur-md">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 bg-black/40 rounded-xl h-6 flex items-center px-4 border border-white/5">
                    <span className="text-[11px] text-slate-500 font-bold tracking-tight">
                      drippilot.com &rsaquo;{" "}
                      <span className="text-slate-300">
                        {FEATURES[activeIndex].label
                          .toLowerCase()
                          .replace(" ", "-")}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="relative h-[420px] bg-slate-950/50">
                  <WorkflowBuilderMock active={activeIndex === 0} />
                  <SmartRoutingMock active={activeIndex === 1} />
                  <AIFollowUpMock active={activeIndex === 2} />
                  <LeadDetectionMock active={activeIndex === 3} />
                  <RealTimeAlertsMock active={activeIndex === 4} />
                </div>
              </div>
            </div>

            {/* Right: Feature accordion */}
            <div className="col-span-5">
              <div className="mb-7 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6 border border-primary/30">
                  All-In-One Platform
                </div>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight font-serif">
                  Everything you need to{" "}
                  <span className="italic text-primary">scale</span>
                </h2>
              </div>

              {/* Progress track + feature list */}
              <div className="flex gap-4">
                {/* Vertical progress line */}
                <div className="flex flex-col items-center shrink-0 pt-1.5">
                  {FEATURES.map((feat, i) => (
                    <React.Fragment key={i}>
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full transition-all duration-500 shrink-0",
                          i <= activeIndex
                            ? ACCENT_STYLES[feat.accent].dot
                            : "bg-white/10",
                        )}
                        style={{
                          transform:
                            i === activeIndex ? "scale(1.4)" : "scale(1)",
                        }}
                      />
                      {i < FEATURES.length - 1 && (
                        <div className="relative w-px flex-1 min-h-[60px] bg-white/10 my-1.5 overflow-hidden">
                          <div
                            className={cn(
                              "absolute top-0 left-0 w-full transition-all duration-500",
                              activeStyles.line,
                            )}
                            style={{
                              height: i < activeIndex ? "100%" : "0%",
                            }}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Feature items */}
                <div className="flex-1 space-y-2 min-w-0">
                  {FEATURES.map((feature, i) => {
                    const styles = ACCENT_STYLES[feature.accent];
                    const isActive = activeIndex === i;
                    const Icon = feature.icon;

                    return (
                      <div
                        key={i}
                        className={cn(
                          "rounded-[20px] border p-4 transition-all duration-500",
                          isActive
                            ? cn(
                                "bg-white/5 border-white/20 shadow-2xl",
                                styles.activeBg,
                              )
                            : "bg-white/2 border-white/5 opacity-40 hover:opacity-100",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                              styles.bg,
                            )}
                          >
                            <Icon className={cn("w-4 h-4", styles.icon)} />
                          </div>
                          <div className="min-w-0">
                            <div
                              className={cn(
                                "text-xs font-semibold uppercase tracking-wider mb-0.5 transition-colors duration-500",
                                isActive ? styles.icon : "text-slate-400",
                              )}
                            >
                              {feature.label}
                            </div>
                            <h3
                              className={cn(
                                "font-bold leading-snug transition-all duration-500",
                                isActive
                                  ? "text-white text-base font-serif"
                                  : "text-slate-500 text-sm",
                              )}
                            >
                              {feature.title}
                            </h3>
                          </div>
                        </div>

                        <div
                          className={cn(
                            "overflow-hidden transition-all duration-500",
                            isActive
                              ? "max-h-48 opacity-100 mt-3"
                              : "max-h-0 opacity-0 mt-0",
                          )}
                        >
                          <p className="text-slate-400 text-sm leading-relaxed mb-5 font-medium">
                            {feature.description}
                          </p>
                          <div className="flex gap-8">
                            {feature.stats.map((stat, j) => (
                              <div key={j}>
                                <div
                                  className={cn(
                                    "text-2xl font-bold font-mono",
                                    styles.stat,
                                  )}
                                >
                                  {stat.value}
                                </div>
                                <div className="text-xs text-slate-400 mt-0.5">
                                  {stat.label}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
};

export const Features = () => (
  <div id="features">
    <MobileFeatures />
    <div className="hidden lg:block">
      <DesktopFeatures />
    </div>
  </div>
);
