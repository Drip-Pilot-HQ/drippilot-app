"use client";

import { useState } from "react";
import { Zap, Loader2, Check } from "lucide-react";
import { ConfirmDialog } from "@/components/branding/ConfirmDialog";
import {
  CREDITS_BUNDLE_DISPLAY_CONFIGS,
  VALID_CREDITS_BUNDLES,
  type BillingInterval,
  type CreditsBundle,
} from "@/config/billing.config";
import {
  useAddAddonMutation,
  useRemoveAddonMutation,
} from "@/store/server/billing.queries";
import type { Addon } from "@/types/billings";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

interface CreditsAddonRowProps {
  activeAddon: Addon | undefined;
  interval: BillingInterval;
  disabled: boolean;
  onSaveStart: () => void;
  onSaveEnd: () => void;
}

type DialogAction =
  | { type: "subscribe"; bundle: CreditsBundle }
  | { type: "switch"; bundle: CreditsBundle }
  | { type: "cancel" };

function formatCredits(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return String(n);
}

export function CreditsAddonRow({
  activeAddon,
  interval,
  disabled,
  onSaveStart,
  onSaveEnd,
}: CreditsAddonRowProps) {
  const activeBundle = activeAddon?.bundleSize ?? null;
  const [selectedBundle, setSelectedBundle] = useState<CreditsBundle | null>(
    activeBundle,
  );
  const [dialog, setDialog] = useState<DialogAction | null>(null);

  const addMutation = useAddAddonMutation();
  const removeMutation = useRemoveAddonMutation();
  const isSaving = addMutation.isPending || removeMutation.isPending;

  const hasChanged = selectedBundle !== activeBundle;
  const isActive = activeBundle !== null;

  const selectedCfg = selectedBundle
    ? CREDITS_BUNDLE_DISPLAY_CONFIGS[selectedBundle]
    : null;
  const price = selectedCfg
    ? interval === "yearly"
      ? selectedCfg.yearlyPrice
      : selectedCfg.monthlyPrice
    : 0;
  const credits = selectedCfg
    ? interval === "yearly"
      ? selectedCfg.yearlyCredits
      : selectedCfg.monthlyCredits
    : 0;

  const handleSelect = (bundle: CreditsBundle) => {
    if (isSaving || disabled) return;
    // clicking active bundle when nothing changed → deselect to allow cancel flow
    if (bundle === selectedBundle && !hasChanged) return;
    setSelectedBundle(bundle);
  };

  const handleSave = () => {
    if (!selectedBundle) return;
    if (!activeBundle) setDialog({ type: "subscribe", bundle: selectedBundle });
    else setDialog({ type: "switch", bundle: selectedBundle });
  };

  const handleReset = () => setSelectedBundle(activeBundle);

  const buildDialogContent = (): {
    title: string;
    description: string;
    confirmLabel: string;
  } => {
    if (!dialog) return { title: "", description: "", confirmLabel: "" };

    if (dialog.type === "cancel") {
      return {
        title: "Cancel Credit Bundle",
        description:
          "Cancelling your credit bundle will revoke your current period's credits (balance may go negative). Future monthly grants will stop immediately.",
        confirmLabel: "Yes, Cancel Bundle",
      };
    }

    const cfg = CREDITS_BUNDLE_DISPLAY_CONFIGS[dialog.bundle];
    const displayPrice =
      interval === "yearly" ? cfg.yearlyPrice : cfg.monthlyPrice;
    const displayCredits =
      interval === "yearly" ? cfg.yearlyCredits : cfg.monthlyCredits;
    const intervalLabel = interval === "yearly" ? "yr" : "mo";

    if (dialog.type === "subscribe") {
      return {
        title: `Activate ${formatCredits(cfg.monthlyCredits)} Credit Bundle`,
        description: `You'll be charged $${displayPrice.toLocaleString()}/${intervalLabel} and immediately receive ${formatCredits(displayCredits)} credits. Prorated for the current billing period.`,
        confirmLabel: "Yes, Activate",
      };
    }

    const oldCfg = activeBundle
      ? CREDITS_BUNDLE_DISPLAY_CONFIGS[activeBundle]
      : null;
    return {
      title: `Switch to ${formatCredits(cfg.monthlyCredits)} Bundle`,
      description: `Switching from ${oldCfg ? formatCredits(oldCfg.monthlyCredits) : "current"} bundle. Existing bundle credits are revoked and ${formatCredits(displayCredits)} credits granted immediately. Stripe prorates the billing difference.`,
      confirmLabel: "Yes, Switch Bundle",
    };
  };

  const handleConfirm = async () => {
    if (!dialog) return;
    onSaveStart();
    try {
      if (dialog.type === "cancel") {
        await removeMutation.mutateAsync({ addonType: "credits", quantity: 1 });
        setSelectedBundle(null);
        toast.success("Credit bundle cancelled.");
      } else {
        await addMutation.mutateAsync({
          addonType: "credits",
          quantity: 1,
          bundleSize: dialog.bundle,
        });
        toast.success(
          dialog.type === "switch"
            ? "Credit bundle switched."
            : "Credit bundle activated.",
        );
      }
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? (err as AxiosError<{ message: string }>)?.response?.data?.message
        : "Failed to update credit bundle.";
      toast.error(message ?? "Failed to update credit bundle.");
      setSelectedBundle(activeBundle);
    } finally {
      setDialog(null);
      onSaveEnd();
    }
  };

  const dialogContent = buildDialogContent();

  return (
    <>
      <div
        className={`rounded-3xl border-2 overflow-hidden transition-all ${
          isActive
            ? "border-orange-100 shadow-sm shadow-orange-100/50"
            : "border-slate-100 hover:border-slate-200"
        } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      >
        {/* Main row — same structure as AddonRow */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 sm:p-5 ${
            isActive ? "bg-orange-50/30" : "hover:bg-slate-50/40"
          }`}
        >
          {/* Icon + info */}
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            <div
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                isActive
                  ? "bg-orange-100 text-orange-600"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              <Zap className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                <p className="text-sm sm:text-base font-black text-slate-900 leading-tight truncate">
                  Credit Bundle
                </p>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-2 sm:line-clamp-1 leading-relaxed sm:leading-snug">
                {selectedCfg ? (
                  <>
                    <span className="font-bold text-slate-700">
                      $
                      {interval === "yearly"
                        ? selectedCfg.yearlyPrice.toLocaleString()
                        : selectedCfg.monthlyPrice.toLocaleString()}
                    </span>
                    <span className="opacity-60">
                      /{interval === "yearly" ? "yr" : "mo"}
                    </span>
                    {" · "}
                    {formatCredits(credits)} extra credits per{" "}
                    {interval === "yearly" ? "year" : "month"}
                  </>
                ) : (
                  "Boost your monthly message credits with a recurring bundle"
                )}
              </p>
            </div>
          </div>

          {/* Bundle selector + cost — sits where the stepper sits in AddonRow */}
          <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-[58px] sm:pl-0 mt-0.5 sm:mt-0">
            {/* Bundle picker — styled like a segmented stepper */}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-9 sm:h-10">
              {VALID_CREDITS_BUNDLES.map((bundle, idx) => {
                const cfg = CREDITS_BUNDLE_DISPLAY_CONFIGS[bundle];
                const displayCredits =
                  interval === "yearly"
                    ? cfg.yearlyCredits
                    : cfg.monthlyCredits;
                const isSelected = bundle === selectedBundle;
                const isFirst = idx === 0;
                const isLast = idx === VALID_CREDITS_BUNDLES.length - 1;
                return (
                  <button
                    key={bundle}
                    onClick={() => handleSelect(bundle)}
                    disabled={isSaving}
                    title={`${formatCredits(displayCredits)} credits`}
                    className={`relative h-full px-2.5 sm:px-3 text-[10px] sm:text-xs font-black transition-colors disabled:cursor-not-allowed whitespace-nowrap ${
                      !isFirst ? "border-l border-slate-100" : ""
                    } ${
                      isSelected
                        ? "bg-orange-500 text-white"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    } ${isFirst ? "rounded-l-xl" : ""} ${isLast ? "rounded-r-xl" : ""}`}
                  >
                    {isSelected && activeBundle === bundle && (
                      <Check className="w-2.5 h-2.5 inline mr-0.5 opacity-80" />
                    )}
                    {formatCredits(displayCredits)}
                  </button>
                );
              })}
            </div>

            {/* Cost display — matches AddonRow cost column */}
            <div className="w-[84px] text-right shrink-0 flex flex-row sm:flex-col items-center sm:items-end justify-end gap-1 sm:gap-0">
              <p className="text-sm sm:text-base font-black text-slate-900 tabular-nums">
                {selectedCfg ? `$${price.toLocaleString()}` : "—"}
              </p>
              {selectedCfg && (
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest sm:mt-0.5">
                  / {interval === "yearly" ? "yr" : "mo"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action bar — exact same structure as AddonRow */}
        {(hasChanged && selectedBundle !== null) ||
        (isActive && !hasChanged) ? (
          hasChanged && selectedBundle !== null ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-3 px-4 sm:px-6 py-4 sm:py-3.5 bg-orange-50 border-t border-orange-100">
              <p className="text-xs font-medium text-orange-800 flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-orange-200/60 bg-orange-100 text-orange-700 font-black text-[10px] tracking-wide tabular-nums shadow-sm">
                  {formatCredits(credits)} credits
                </span>
                <span className="hidden sm:inline">·</span>
                <span>
                  <span className="font-black">
                    ${price.toLocaleString()}/
                    {interval === "yearly" ? "yr" : "mo"}
                  </span>{" "}
                  {activeBundle ? "new bundle" : "new subscription"}
                </span>
              </p>
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 w-full sm:w-auto">
                <button
                  onClick={handleReset}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none h-9 sm:h-10 px-4 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs sm:text-sm font-bold hover:bg-slate-50 transition-colors disabled:opacity-50 shadow-sm"
                >
                  Undo
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none h-9 sm:h-10 px-5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-sm shadow-orange-200"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {activeBundle ? "Switch Bundle" : "Activate"}
                </button>
              </div>
            </div>
          ) : (
            /* Active, no change — show cancel strip */
            <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-50 border-t border-slate-100">
              <p className="text-[11px] text-slate-400 font-medium">
                Active bundle · renews{" "}
                {interval === "yearly" ? "annually" : "monthly"}
              </p>
              <button
                onClick={() => setDialog({ type: "cancel" })}
                disabled={isSaving}
                className="text-[11px] font-bold text-rose-400 hover:text-rose-600 transition-colors disabled:opacity-50"
              >
                Cancel bundle
              </button>
            </div>
          )
        ) : null}
      </div>

      {dialog && (
        <ConfirmDialog
          isOpen={!!dialog}
          onClose={() => {
            setDialog(null);
            if (dialog?.type === "cancel") setSelectedBundle(activeBundle);
          }}
          onConfirm={handleConfirm}
          isLoading={isSaving}
          title={dialogContent.title}
          description={dialogContent.description}
          confirmLabel={dialogContent.confirmLabel}
          cancelLabel="Cancel"
          variant={dialog.type === "cancel" ? "warning" : "primary"}
        />
      )}
    </>
  );
}
