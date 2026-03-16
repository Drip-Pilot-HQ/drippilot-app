"use client";

import { ChevronRight, X } from "lucide-react";
import type { OnboardingStep } from "./steps";

interface TooltipCardProps {
  step: OnboardingStep;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onSkip: () => void;
}

export function TooltipCard({
  step,
  stepIndex,
  totalSteps,
  onNext,
  onSkip,
}: TooltipCardProps) {
  const { Icon, title, description } = step;
  const isLast = stepIndex === totalSteps - 1;

  return (
    <>
      <style>{`
        @keyframes ob-card-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ob-card-in { animation: ob-card-in 0.25s cubic-bezier(0.22, 1, 0.36, 1) both; }
      `}</style>

      <div className="ob-card-in bg-white rounded-xl shadow-lg border border-slate-200/80 overflow-hidden w-[320px]">
        {/* Left-side orange accent bar */}
        <div className="flex">
          <div className="w-[3px] shrink-0 bg-primary rounded-l-xl" />

          <div className="flex-1 p-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                  <Icon
                    className="text-primary"
                    style={{ width: "14px", height: "14px" }}
                  />
                </div>
                <p className="font-bold text-slate-900 text-[14px] leading-snug">
                  {title}
                </p>
              </div>
              <button
                onClick={onSkip}
                className="w-5 h-5 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-500 transition-colors shrink-0"
                aria-label="Skip tour"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Description */}
            <p className="text-slate-500 text-[13px] leading-relaxed mb-4">
              {description}
            </p>

            {/* Progress + Actions */}
            <div className="flex items-center justify-between gap-3">
              {/* Progress dots */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={[
                      "rounded-full transition-all duration-300",
                      i < stepIndex
                        ? "w-1 h-1 bg-slate-300"
                        : i === stepIndex
                          ? "w-3 h-1.5 bg-primary"
                          : "w-1 h-1 bg-slate-200",
                    ].join(" ")}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={onSkip}
                  className="text-[12px] font-medium text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={onNext}
                  className="flex items-center gap-1 h-7 px-3 rounded-lg bg-primary hover:bg-orange-600 active:scale-[0.97] text-white text-[12px] font-bold transition-all"
                >
                  {isLast ? "Finish" : "Next"}
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
