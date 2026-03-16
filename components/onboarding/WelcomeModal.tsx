"use client";

import { Rocket, X } from "lucide-react";

interface WelcomeModalProps {
  onStart: () => void;
  onSkip: () => void;
}

const FEATURE_PILLS = [
  "Campaigns",
  "Messages",
  "Leads",
  "AI Responses",
  "Integrations",
];

export function WelcomeModal({ onStart, onSkip }: WelcomeModalProps) {
  return (
    <>
      <style>{`
        @keyframes ob-welcome-in {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes ob-fade-stagger {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ob-welcome-in { animation: ob-welcome-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .ob-s1 { animation: ob-fade-stagger 0.35s 0.08s cubic-bezier(0.22,1,0.36,1) both; }
        .ob-s2 { animation: ob-fade-stagger 0.35s 0.16s cubic-bezier(0.22,1,0.36,1) both; }
        .ob-s3 { animation: ob-fade-stagger 0.35s 0.24s cubic-bezier(0.22,1,0.36,1) both; }
        .ob-s4 { animation: ob-fade-stagger 0.35s 0.32s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-9998 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card */}
        <div className="ob-welcome-in relative w-full max-w-[400px] bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
          {/* Top accent line */}
          <div className="h-[3px] w-full bg-primary" />

          {/* Skip */}
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Skip tour"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-slate-100">
            <div className="ob-s1 flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                <Rocket className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
                  Quick Setup Tour
                </p>
                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                  Welcome to Drip Pilot
                </h1>
              </div>
            </div>

            <p className="ob-s2 text-slate-500 text-[14px] leading-relaxed">
              Take a 60-second tour of your workspace and learn how to build
              campaigns, manage leads, and let AI do the heavy lifting.
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-6">
            {/* Feature pills */}
            <p className="ob-s3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
              What you&apos;ll explore
            </p>
            <div className="ob-s3 flex flex-wrap gap-1.5 mb-7">
              {FEATURE_PILLS.map((label) => (
                <span
                  key={label}
                  className="text-[12px] font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md"
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="ob-s4 flex flex-col gap-2.5">
              <button
                onClick={onStart}
                className="w-full h-11 rounded-xl bg-primary text-white font-bold text-[14px] hover:bg-orange-600 transition-colors active:scale-[0.98]"
              >
                Start Tour
              </button>
              <button
                onClick={onSkip}
                className="w-full h-9 rounded-xl text-slate-400 text-[13px] font-medium hover:text-slate-600 transition-colors"
              >
                Skip, I&apos;ll explore on my own
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
