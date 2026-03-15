"use client";

import { useState } from "react";
import { X, ArrowRight } from "lucide-react";

export const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-primary px-4 py-2 text-white relative z-60 overflow-hidden">
      {" "}
      <div className="absolute inset-0 bg-linear-to-r from-primary via-orange-400 to-primary opacity-50 animate-pulse"></div>
      <div className="max-w-7xl mx-auto flex items-center justify-center relative z-10">
        <p className="text-xs sm:text-sm font-medium flex items-center gap-2">
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold">
            New
          </span>
          Drip Pilot Beta is now live!
          <a
            href="/signup"
            className="underline decoration-white/30 underline-offset-4 hover:decoration-white transition-all inline-flex items-center gap-1 font-bold"
          >
            Try it for free <ArrowRight className="w-3 h-3" />
          </a>
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-0 p-1 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
