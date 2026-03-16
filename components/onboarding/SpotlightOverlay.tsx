"use client";

import { useMemo } from "react";
import { TooltipCard } from "./TooltipCard";
import type { OnboardingStep } from "./steps";

interface SpotlightOverlayProps {
  step: OnboardingStep;
  stepIndex: number;
  totalSteps: number;
  targetRect: DOMRect | null;
  onNext: () => void;
  onSkip: () => void;
}

const TOOLTIP_WIDTH = 320;
const TOOLTIP_HEIGHT = 220;
const TOOLTIP_OFFSET = 18;
const EDGE_PADDING = 16;

export function SpotlightOverlay({
  step,
  stepIndex,
  totalSteps,
  targetRect,
  onNext,
  onSkip,
}: SpotlightOverlayProps) {
  const spotlight = useMemo(() => {
    if (typeof window === "undefined") {
      return { top: 0, left: 0, width: 0, height: 0, borderRadius: 16 };
    }

    if (!targetRect) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      return {
        top: vh * 0.12,
        left: vw * 0.1,
        width: vw * 0.8,
        height: vh * 0.65,
        borderRadius: 16,
      };
    }

    const pad = step.spotlightPadding ?? 10;
    return {
      top: targetRect.top - pad,
      left: targetRect.left - pad,
      width: targetRect.width + pad * 2,
      height: targetRect.height + pad * 2,
      borderRadius: 12,
    };
  }, [targetRect, step.spotlightPadding]);

  const tooltipStyle = useMemo(() => {
    if (typeof window === "undefined") return { top: 0, left: 0 };

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const spoBottom = spotlight.top + spotlight.height;
    const spoRight = spotlight.left + spotlight.width;
    const spoCenter = spotlight.left + spotlight.width / 2;
    const spoMiddle = spotlight.top + spotlight.height / 2;

    let top: number;
    let left: number;

    switch (step.tooltipPosition) {
      case "bottom":
        top = spoBottom + TOOLTIP_OFFSET;
        left = spoCenter - TOOLTIP_WIDTH / 2;
        break;
      case "top":
        top = spotlight.top - TOOLTIP_HEIGHT - TOOLTIP_OFFSET;
        left = spoCenter - TOOLTIP_WIDTH / 2;
        break;
      case "right":
        top = spoMiddle - TOOLTIP_HEIGHT / 2;
        left = spoRight + TOOLTIP_OFFSET;
        break;
      case "left":
        top = spoMiddle - TOOLTIP_HEIGHT / 2;
        left = spotlight.left - TOOLTIP_WIDTH - TOOLTIP_OFFSET;
        break;
    }

    // Clamp to viewport with padding
    left = Math.max(
      EDGE_PADDING,
      Math.min(left!, vw - TOOLTIP_WIDTH - EDGE_PADDING),
    );
    top = Math.max(
      EDGE_PADDING,
      Math.min(top!, vh - TOOLTIP_HEIGHT - EDGE_PADDING),
    );

    return { top, left };
  }, [spotlight, step.tooltipPosition]);

  return (
    <>
      <style>{`
        @keyframes ob-spotlight-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes ob-ring-pulse {
          0%   { opacity: 0.8; box-shadow: 0 0 0 0px rgba(251,146,60,0.4); }
          100% { opacity: 0;   box-shadow: 0 0 0 12px rgba(251,146,60,0); }
        }
        .ob-overlay-in { animation: ob-spotlight-in 0.25s ease both; }
        .ob-ring-pulse { animation: ob-ring-pulse 2s ease-out infinite; }
      `}</style>

      {/* Full-screen click blocker */}
      <div
        className="ob-overlay-in fixed inset-0 z-9998"
        style={{ pointerEvents: "all" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Spotlight "hole" via box-shadow trick */}
        <div
          style={{
            position: "fixed",
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
            borderRadius: spotlight.borderRadius,
            boxShadow: "0 0 0 9999px rgba(2, 6, 23, 0.72)",
            transition:
              "top 0.4s cubic-bezier(0.4,0,0.2,1), left 0.4s cubic-bezier(0.4,0,0.2,1), width 0.4s cubic-bezier(0.4,0,0.2,1), height 0.4s cubic-bezier(0.4,0,0.2,1)",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        >
          {/* Orange glow ring */}
          <div
            className="ob-ring-pulse"
            style={{
              position: "absolute",
              inset: -3,
              borderRadius: spotlight.borderRadius + 3,
              border: "2px solid rgba(251,146,60,0.6)",
            }}
          />
        </div>

        {/* Tooltip card */}
        <div
          key={stepIndex}
          style={{
            position: "fixed",
            top: tooltipStyle.top,
            left: tooltipStyle.left,
            width: TOOLTIP_WIDTH,
            zIndex: 10000,
            pointerEvents: "all",
          }}
        >
          <TooltipCard
            step={step}
            stepIndex={stepIndex}
            totalSteps={totalSteps}
            onNext={onNext}
            onSkip={onSkip}
          />
        </div>
      </div>
    </>
  );
}
