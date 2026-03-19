"use client";

import { useState } from "react";
import type { GuideStep } from "./guideSteps";
import { GuideStepCard } from "./GuideStepCard";

interface Props {
  steps: GuideStep[];
  defaultOpen?: number;
}

export function GuideAccordion({ steps, defaultOpen = 0 }: Props) {
  const [openStep, setOpenStep] = useState<number>(defaultOpen);

  const toggle = (id: number) => setOpenStep((prev) => (prev === id ? 0 : id));

  return (
    <div className="space-y-3">
      {steps.map((step) => (
        <GuideStepCard
          key={step.id}
          step={step}
          isOpen={openStep === step.id}
          onToggle={() => toggle(step.id)}
        />
      ))}
    </div>
  );
}
