"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Settings2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/branding/Button";
import { InfoTooltip } from "@/components/common/InfoTooltip";
import {
  useAnalyticsConfigQuery,
  useUpsertAnalyticsConfigMutation,
  useResetAnalyticsConfigMutation,
} from "@/store/server/analytics.queries";
import type { UpsertAnalyticsConfigPayload } from "@/types/analytics";

interface AnalyticsConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FieldConfig {
  key: keyof UpsertAnalyticsConfigPayload;
  label: string;
  tooltip: string;
  prefix?: string;
  suffix?: string;
  step?: number;
  min?: number;
  max?: number;
  isInteger?: boolean;
}

const FINANCIAL_FIELDS: FieldConfig[] = [
  {
    key: "leadCost",
    label: "Lead Cost",
    tooltip:
      "What you pay to acquire one lead (ad spend, referral fees, etc.). This is shown as-is on the dashboard as your Lead Acquisition Cost.",
    prefix: "$",
    step: 1,
    min: 0,
  },
  {
    key: "avgDealValue",
    label: "Avg Deal Value",
    tooltip: "The typical gross sale price or contract value per closed deal.",
    prefix: "$",
    step: 1000,
    min: 0,
  },
  {
    key: "commissionPercent",
    label: "Commission %",
    tooltip:
      "Your commission percentage per deal (e.g. 2.5 for 2.5%). Revenue per closing = deal value × commission %.",
    suffix: "%",
    step: 0.1,
    min: 0,
    max: 100,
  },
  {
    key: "hotCloseRate",
    label: "Hot Close Rate",
    tooltip:
      "Expected % of hot leads you'll close. Hot leads are high-intent and actively engaged.",
    suffix: "%",
    step: 1,
    min: 0,
    max: 100,
  },
  {
    key: "warmCloseRate",
    label: "Warm Close Rate",
    tooltip:
      "Expected % of warm leads you'll close. Warm leads have shown some interest.",
    suffix: "%",
    step: 1,
    min: 0,
    max: 100,
  },
  {
    key: "monthlyPlatformCost",
    label: "Monthly Platform Cost",
    tooltip: "Your monthly subscription or platform fee (USD).",
    prefix: "$",
    step: 1,
    min: 0,
  },
  {
    key: "campaignDurationMonths",
    label: "Campaign Duration",
    tooltip:
      "How many months a typical campaign runs. Used to amortize platform cost across the campaign.",
    suffix: "months",
    step: 1,
    min: 1,
    max: 24,
    isInteger: true,
  },
];

const BENCHMARK_FIELDS: FieldConfig[] = [
  {
    key: "industryResponseRate",
    label: "Industry Response Rate",
    tooltip:
      "What % of leads the average competitor gets to respond. Used for your response rate multiplier comparison.",
    suffix: "%",
    step: 0.1,
    min: 0,
    max: 100,
  },
  {
    key: "industryCloseRate",
    label: "Industry Close Rate",
    tooltip:
      "What % of total leads the average competitor closes. Used for your close rate multiplier comparison.",
    suffix: "%",
    step: 0.1,
    min: 0,
    max: 100,
  },
  {
    key: "industryCostPerLead",
    label: "Industry Cost Per Lead",
    tooltip:
      "What the average competitor pays per lead. Displayed as a benchmark reference.",
    prefix: "$",
    step: 1,
    min: 0,
  },
  {
    key: "industryCostPerClosing",
    label: "Industry Cost Per Closing",
    tooltip:
      "What the average competitor spends to close one deal. Used for cost efficiency comparison.",
    prefix: "$",
    step: 1,
    min: 0,
  },
];

function ConfigField({
  field,
  value,
  isCustom,
  onChange,
}: {
  field: FieldConfig;
  value: string;
  isCustom: boolean;
  onChange: (key: keyof UpsertAnalyticsConfigPayload, value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {field.label}
        </label>
        <InfoTooltip text={field.tooltip} />
        {isCustom && (
          <span className="ml-auto text-[10px] font-bold text-primary bg-primary/8 px-2 py-0.5 rounded-full">
            Custom
          </span>
        )}
      </div>
      <div className="relative flex items-center">
        {field.prefix && (
          <span className="absolute left-3.5 text-sm font-bold text-slate-400 pointer-events-none">
            {field.prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
          step={field.step ?? 1}
          min={field.min ?? 0}
          max={field.max}
          className={`w-full rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-900 text-sm py-3 ${
            field.prefix ? "pl-7 pr-4" : field.suffix ? "pl-4 pr-14" : "px-4"
          }`}
        />
        {field.suffix && (
          <span className="absolute right-3.5 text-sm font-bold text-slate-400 pointer-events-none">
            {field.suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export function AnalyticsConfigPanel({
  isOpen,
  onClose,
}: AnalyticsConfigPanelProps) {
  const { data: config, isLoading } = useAnalyticsConfigQuery();
  const upsertMutation = useUpsertAnalyticsConfigMutation();
  const resetMutation = useResetAnalyticsConfigMutation();

  const [form, setForm] = useState<Record<string, string>>({});
  const [prevConfig, setPrevConfig] = useState(config);

  if (config !== prevConfig) {
    setPrevConfig(config);
    if (config) {
      setForm({
        leadCost: String(config.leadCost.value),
        avgDealValue: String(config.avgDealValue.value),
        commissionPercent: String(config.commissionPercent.value),
        hotCloseRate: String(config.hotCloseRate.value),
        warmCloseRate: String(config.warmCloseRate.value),
        monthlyPlatformCost: String(config.monthlyPlatformCost.value),
        campaignDurationMonths: String(config.campaignDurationMonths.value),
        industryResponseRate: String(config.industryResponseRate.value),
        industryCloseRate: String(config.industryCloseRate.value),
        industryCostPerLead: String(config.industryCostPerLead.value),
        industryCostPerClosing: String(config.industryCostPerClosing.value),
      });
    }
  }

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    key: keyof UpsertAnalyticsConfigPayload,
    raw: string,
  ) => {
    setForm((prev) => ({ ...prev, [key]: raw }));
  };

  const buildPayload = (): UpsertAnalyticsConfigPayload => {
    const payload: UpsertAnalyticsConfigPayload = {};
    const allFields = [...FINANCIAL_FIELDS, ...BENCHMARK_FIELDS];

    for (const field of allFields) {
      const raw = form[field.key];
      if (raw === undefined || raw === "") continue;
      const parsed = field.isInteger ? parseInt(raw, 10) : parseFloat(raw);
      if (!isNaN(parsed)) {
        (payload as Record<string, number>)[field.key] = parsed;
      }
    }

    return payload;
  };

  const handleSave = async () => {
    try {
      await upsertMutation.mutateAsync(buildPayload());
      toast.success("Analytics config saved");
      onClose();
    } catch {
      toast.error("Failed to save config");
    }
  };

  const handleReset = async () => {
    try {
      await resetMutation.mutateAsync();
      toast.success("Config reset to platform defaults");
      onClose();
    } catch {
      toast.error("Failed to reset config");
    }
  };

  const isSaving = upsertMutation.isPending;
  const isResetting = resetMutation.isPending;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full sm:max-w-2xl bg-white rounded-t-[28px] sm:rounded-[40px] shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[95vh] animate-in slide-in-from-bottom-4 duration-300 pb-[env(safe-area-inset-bottom,0px)] sm:pb-0">
        {/* Drag handle — mobile only */}
        <div className="sm:hidden flex justify-center pt-3 pb-2 shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-8 pt-3 sm:pt-8 pb-4 shrink-0 border-b border-slate-100">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Settings2 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Analytics Config
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm font-medium">
                Customize your financial assumptions &amp; benchmarks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors shrink-0"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 sm:px-8 py-5 sm:py-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-2xl bg-slate-100 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Financial Settings */}
              <section>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  Financial Settings
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {FINANCIAL_FIELDS.map((field) => (
                    <ConfigField
                      key={field.key}
                      field={field}
                      value={form[field.key] ?? ""}
                      isCustom={config?.[field.key]?.isCustom ?? false}
                      onChange={handleChange}
                    />
                  ))}
                </div>
              </section>

              {/* Industry Benchmarks */}
              <section>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  Industry Benchmarks
                </p>
                <p className="text-xs text-slate-400 font-medium mb-4">
                  These values represent the &ldquo;average competitor&rdquo;
                  used to calculate how you compare to the market.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {BENCHMARK_FIELDS.map((field) => (
                    <ConfigField
                      key={field.key}
                      field={field}
                      value={form[field.key] ?? ""}
                      isCustom={config?.[field.key]?.isCustom ?? false}
                      onChange={handleChange}
                    />
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-5 sm:px-8 py-4 sm:py-6 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={handleReset}
            disabled={isResetting || isSaving}
            className="flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to defaults
          </button>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSaving || isResetting}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              isLoading={isSaving}
              disabled={isLoading || isResetting}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
