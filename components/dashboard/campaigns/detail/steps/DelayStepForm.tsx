"use client";

import { useState } from "react";
import { DelayConfig } from "@/types/campaign";
import { Button } from "@/components/branding/Button";

interface DelayStepFormProps {
  initialConfig?: DelayConfig;
  isLoading: boolean;
  onSave: (config: DelayConfig) => void;
  onCancel: () => void;
  saveLabel?: string;
}

export function DelayStepForm({
  initialConfig,
  isLoading,
  onSave,
  onCancel,
  saveLabel = "Save Step",
}: DelayStepFormProps) {
  const [days, setDays] = useState(initialConfig?.days ?? 1);

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) setDays(Math.max(1, val));
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
          Wait Duration <span className="text-rose-500">*</span>
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={1}
            value={days}
            onChange={handleDaysChange}
            className="w-28 h-12 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          <span className="text-sm font-semibold text-slate-600">
            {days === 1 ? "day" : "days"}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 font-medium">
          Minimum 1 day between steps
        </p>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={() => onSave({ days })}
          disabled={days < 1 || isLoading}
          isLoading={isLoading}
        >
          {saveLabel}
        </Button>
      </div>
    </div>
  );
}
