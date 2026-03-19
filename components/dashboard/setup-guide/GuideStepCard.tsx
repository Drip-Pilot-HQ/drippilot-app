"use client";

import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { GuideStep, StepColor } from "./guideSteps";
import { PlaceholderGrid } from "./PlaceholderGrid";
import { CodeBlock } from "./CodeBlock";

const COLOR_MAP: Record<
  StepColor,
  {
    activeBorder: string;
    activeBg: string;
    numberActive: string;
    numberInactive: string;
    badge: string;
    button: string;
    tipBorder: string;
    tipBg: string;
  }
> = {
  primary: {
    activeBorder: "border-primary/20",
    activeBg: "bg-primary/[0.02]",
    numberActive: "bg-primary text-white",
    numberInactive: "bg-slate-100 text-slate-500",
    badge: "bg-primary/10 text-primary",
    button: "bg-primary text-white shadow-md shadow-primary/25",
    tipBorder: "border-primary/15",
    tipBg: "bg-primary/5",
  },
  secondary: {
    activeBorder: "border-secondary/20",
    activeBg: "bg-secondary/[0.02]",
    numberActive: "bg-secondary text-white",
    numberInactive: "bg-slate-100 text-slate-500",
    badge: "bg-secondary/10 text-secondary",
    button: "bg-secondary text-white shadow-md shadow-secondary/25",
    tipBorder: "border-secondary/15",
    tipBg: "bg-secondary/5",
  },
  accent: {
    activeBorder: "border-accent/20",
    activeBg: "bg-accent/[0.02]",
    numberActive: "bg-accent text-white",
    numberInactive: "bg-slate-100 text-slate-500",
    badge: "bg-accent/10 text-accent",
    button: "bg-accent text-white shadow-md shadow-accent/25",
    tipBorder: "border-accent/15",
    tipBg: "bg-accent/5",
  },
};

interface Props {
  step: GuideStep;
  isOpen: boolean;
  onToggle: () => void;
}

export function GuideStepCard({ step, isOpen, onToggle }: Props) {
  const c = COLOR_MAP[step.color];

  return (
    <div
      className={cn(
        "bg-white border rounded-2xl transition-all duration-200",
        isOpen
          ? `${c.activeBorder} ${c.activeBg} shadow-sm`
          : "border-slate-200 hover:border-slate-300 hover:shadow-sm",
      )}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black transition-all",
            isOpen ? c.numberActive : c.numberInactive,
          )}
        >
          {isOpen ? <CheckCircle2 className="w-4 h-4" /> : step.id}
        </span>

        <span className="flex flex-1 items-center gap-2.5 min-w-0">
          <span className="text-xl leading-none shrink-0">{step.emoji}</span>
          <span className="text-sm font-black text-slate-900 truncate">
            {step.title}
          </span>
        </span>

        <span className="text-slate-400 shrink-0">
          {isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </span>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="text-sm text-slate-500 font-medium leading-relaxed mb-5">
            {step.description}
          </p>

          {step.showPlaceholders && <PlaceholderGrid />}
          {step.codeExample && <CodeBlock code={step.codeExample} />}

          <ol className="space-y-3 mb-5">
            {step.subSteps.map((sub, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black mt-0.5",
                    c.badge,
                  )}
                >
                  {idx + 1}
                </span>
                <div className="flex-1 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-slate-700">{sub.text}</span>
                  {sub.note && (
                    <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[10px] font-bold text-slate-500">
                      {sub.note}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div
            className={cn(
              "flex items-start gap-2.5 rounded-xl border px-4 py-3 mb-5",
              c.tipBorder,
              c.tipBg,
            )}
          >
            <span className="text-base leading-none shrink-0">💡</span>
            <p className="text-sm font-medium text-slate-700">
              <span className="font-black">Tip: </span>
              {step.tip}
            </p>
          </div>

          <Link
            href={step.linkHref}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl h-10 px-5 text-sm font-black transition-all hover:brightness-110",
              c.button,
            )}
          >
            {step.linkLabel}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
