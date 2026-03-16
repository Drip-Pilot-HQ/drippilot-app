"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ONBOARDING_STEPS } from "./steps";
import { WelcomeModal } from "./WelcomeModal";
import { SpotlightOverlay } from "./SpotlightOverlay";
import { CompletionModal } from "./CompletionModal";

const STORAGE_KEY = "drippilot_onboarding_v1";

type Phase = "idle" | "welcome" | "tour" | "complete";

export function OnboardingController() {
  const router = useRouter();
  const pathname = usePathname();

  const [phase, setPhase] = useState<Phase>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      setTimeout(() => setPhase("welcome"), 0);
    }
  }, []);

  const findTarget = useCallback((target: string | null) => {
    if (target) {
      const el = document.querySelector<HTMLElement>(
        `[data-onboarding="${target}"]`,
      );
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          setTargetRect(el.getBoundingClientRect());
        }, 80);
        return;
      }
    }
    const main = document.querySelector("main");
    setTargetRect(main ? main.getBoundingClientRect() : null);
  }, []);

  useEffect(() => {
    if (phase !== "tour") return;
    const step = ONBOARDING_STEPS[stepIndex];
    if (!step) return;

    if (pathname !== step.route) {
      setTimeout(() => setTargetRect(null), 0);
      router.push(step.route);
    }
  }, [stepIndex, phase, pathname, router]);

  useEffect(() => {
    if (phase !== "tour") return;
    const step = ONBOARDING_STEPS[stepIndex];
    if (!step || pathname !== step.route) return;

    const timer = setTimeout(() => {
      findTarget(step.target);
    }, 350);

    return () => clearTimeout(timer);
  }, [pathname, stepIndex, phase, findTarget]);

  useEffect(() => {
    if (phase !== "tour") return;

    const onResize = () => {
      const step = ONBOARDING_STEPS[stepIndex];
      if (!step || pathname !== step.route) return;
      findTarget(step.target);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [phase, stepIndex, pathname, findTarget]);

  const startTour = useCallback(() => {
    setStepIndex(0);
    setPhase("tour");
  }, []);

  const skip = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "done");
    setPhase("idle");
  }, []);

  const complete = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "done");
    setPhase("complete");
  }, []);

  const next = useCallback(() => {
    const nextIndex = stepIndex + 1;
    if (nextIndex >= ONBOARDING_STEPS.length) {
      complete();
    } else {
      setStepIndex(nextIndex);
    }
  }, [stepIndex, complete]);

  const dismissComplete = useCallback(() => {
    setPhase("idle");
    router.push("/dashboard");
  }, [router]);

  if (phase === "idle") return null;

  if (phase === "welcome") {
    return <WelcomeModal onStart={startTour} onSkip={skip} />;
  }

  if (phase === "tour") {
    const step = ONBOARDING_STEPS[stepIndex];
    if (!step) return null;
    return (
      <SpotlightOverlay
        key={stepIndex}
        step={step}
        stepIndex={stepIndex}
        totalSteps={ONBOARDING_STEPS.length}
        targetRect={targetRect}
        onNext={next}
        onSkip={skip}
      />
    );
  }

  if (phase === "complete") {
    return <CompletionModal onClose={dismissComplete} />;
  }

  return null;
}
