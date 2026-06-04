"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Phone,
  Mail,
  BookOpen,
  Plus,
  Minus,
  Loader2,
  Check,
} from "lucide-react";
import { ConfirmDialog } from "@/components/branding/ConfirmDialog";
import {
  ADDON_CONFIGS,
  ADDON_TYPES,
  getAddonTieredCost,
  type BillingInterval,
  type QuantityAddonType,
} from "@/config/billing.config";
import {
  useAddAddonMutation,
  useRemoveAddonMutation,
} from "@/store/server/billing.queries";
import type { SubscriptionStatus, Addon } from "@/types/billings";
import { CreditsAddonRow } from "./CreditsAddonRow";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

interface AddonsListProps {
  subscription: SubscriptionStatus;
  addons: Addon[];
}

const ADDON_ICONS: Record<QuantityAddonType, React.ElementType> = {
  seat: Users,
  phone_alias: Phone,
  email_alias: Mail,
  knowledge_base: BookOpen,
};

const ADDON_ORDER: QuantityAddonType[] = [
  ADDON_TYPES.SEAT,
  ADDON_TYPES.PHONE_ALIAS,
  ADDON_TYPES.EMAIL_ALIAS,
  ADDON_TYPES.KNOWLEDGE_BASE,
];

interface AddonRowProps {
  type: QuantityAddonType;
  currentQty: number;
  interval: BillingInterval;
  anyRowSaving: boolean;
  onSaveStart: () => void;
  onSaveEnd: () => void;
  onSaved: (type: QuantityAddonType, newQty: number) => void;
  onQtyChange: (type: QuantityAddonType, qty: number) => void;
}

function AddonRow({
  type,
  currentQty,
  interval,
  anyRowSaving,
  onSaveStart,
  onSaveEnd,
  onSaved,
  onQtyChange,
}: AddonRowProps) {
  const [qty, setQty] = useState(currentQty);

  useEffect(() => {
    onQtyChange(type, qty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qty]);

  const [confirming, setConfirming] = useState(false);

  const addMutation = useAddAddonMutation();
  const removeMutation = useRemoveAddonMutation();
  const isSaving = addMutation.isPending || removeMutation.isPending;

  const config = ADDON_CONFIGS[type];
  const Icon = ADDON_ICONS[type];
  const hasChanged = qty !== currentQty;
  const delta = qty - currentQty;
  const isActive = currentQty > 0 || hasChanged;

  const isYearly = interval === "yearly";
  const intervalSuffix = isYearly ? "yr" : "mo";
  const costPerPeriod =
    getAddonTieredCost(type, interval, qty) * (isYearly ? 12 : 1);
  const basePrice =
    (isYearly ? config.yearlyPrice : config.monthlyPrice) * (isYearly ? 12 : 1);
  const hasTiers = !!config.tiers && config.tiers.length > 1;

  const isDisabled = anyRowSaving && !isSaving;

  const handleSave = () => setConfirming(true);
  const handleReset = () => setQty(currentQty);

  const buildDescription = () => {
    const intervalLabel = isYearly ? "annually" : "monthly";
    const newTotal =
      getAddonTieredCost(type, interval, qty) * (isYearly ? 12 : 1);
    const oldTotal =
      getAddonTieredCost(type, interval, currentQty) * (isYearly ? 12 : 1);
    const diff = Math.abs(newTotal - oldTotal).toFixed(2);
    if (delta > 0) {
      return `You're adding ${delta} × ${config.displayName}. Drip Pilot will charge your active payment method an additional $${diff}/${intervalSuffix} billed ${intervalLabel}. The charge is prorated for the current billing period.`;
    }
    return `You're removing ${Math.abs(delta)} × ${config.displayName}. This will reduce your bill by $${diff}/${intervalSuffix} starting next cycle.`;
  };

  const handleConfirm = async () => {
    onSaveStart();
    try {
      if (delta > 0) {
        await addMutation.mutateAsync({ addonType: type, quantity: delta });
        toast.success(`${config.displayName} updated.`);
      } else {
        await removeMutation.mutateAsync({
          addonType: type,
          quantity: Math.abs(delta),
        });
        toast.success(`${config.displayName} updated.`);
      }
      onSaved(type, qty);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? (err as AxiosError<{ message: string }>)?.response?.data?.message
        : "Failed to update add-on.";
      toast.error(message ?? "Failed to update add-on.");
      setQty(currentQty);
    } finally {
      setConfirming(false);
      onSaveEnd();
    }
  };

  return (
    <>
      <div
        className={`rounded-3xl border-2 overflow-hidden transition-all ${
          isActive
            ? "border-orange-100 shadow-sm shadow-orange-100/50"
            : "border-slate-100 hover:border-slate-200"
        } ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
      >
        {/* Main row */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 sm:p-5 ${
            isActive ? "bg-orange-50/30" : "hover:bg-slate-50/40"
          }`}
        >
          {/* Header & Icon */}
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            {/* Icon */}
            <div
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                isActive
                  ? "bg-orange-100 text-orange-600"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                <p className="text-sm sm:text-base font-black text-slate-900 leading-tight truncate">
                  {config.displayName}
                </p>
                {hasTiers && (
                  <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-black tracking-[0.2em] uppercase bg-emerald-100 text-emerald-700">
                    Tiered
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-2 sm:line-clamp-1 leading-relaxed sm:leading-snug">
                <span className="font-bold text-slate-700">
                  {hasTiers ? `Starts at $${basePrice}` : `$${basePrice}`}
                </span>
                <span className="opacity-60">/{intervalSuffix}</span> ·{" "}
                {config.description}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-[58px] sm:pl-0 mt-0.5 sm:mt-0">
            {/* Stepper */}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-9 sm:h-10">
              <button
                onClick={() => setQty((q) => Math.max(0, q - 1))}
                disabled={qty === 0 || isSaving}
                className="w-10 h-full flex items-center justify-center hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <div className="w-10 h-full flex items-center justify-center border-l border-r border-slate-100 bg-slate-50/50">
                <span className="font-black text-slate-900 text-sm tabular-nums">
                  {qty}
                </span>
              </div>
              <button
                onClick={() => setQty((q) => q + 1)}
                disabled={isSaving}
                className="w-10 h-full flex items-center justify-center hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors disabled:cursor-not-allowed"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Cost text */}
            <div className="w-[84px] text-right shrink-0 flex flex-row sm:flex-col items-center sm:items-end justify-end gap-1 sm:gap-0">
              <p className="text-sm sm:text-base font-black text-slate-900 tabular-nums">
                {qty > 0 ? `$${costPerPeriod.toFixed(2)}` : "—"}
              </p>
              {qty > 0 && (
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest sm:mt-0.5">
                  / {intervalSuffix}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action bar — only visible when quantity has changed */}
        {hasChanged && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-3 px-4 sm:px-6 py-4 sm:py-3.5 bg-orange-50 border-t border-orange-100">
            <p className="text-xs font-medium text-orange-800 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-orange-200/60 bg-orange-100 text-orange-700 font-black text-[10px] tracking-wide tabular-nums shadow-sm">
                {delta > 0 ? `+${delta}` : `${delta}`} {config.displayName}
              </span>
              <span className="hidden sm:inline">·</span>
              <span>
                <span className="font-black">
                  ${costPerPeriod.toFixed(2)}/{intervalSuffix}
                </span>{" "}
                new total
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
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

      {confirming && (
        <ConfirmDialog
          isOpen={confirming}
          onClose={() => {
            setConfirming(false);
            setQty(currentQty);
          }}
          onConfirm={handleConfirm}
          isLoading={isSaving}
          title={
            delta > 0
              ? `Add ${config.displayName}`
              : `Remove ${config.displayName}`
          }
          description={buildDescription()}
          confirmLabel={delta > 0 ? "Yes, Add" : "Yes, Remove"}
          cancelLabel="Cancel"
          variant={delta > 0 ? "primary" : "warning"}
        />
      )}
    </>
  );
}

export function AddonsList({ subscription, addons }: AddonsListProps) {
  const interval = (subscription.billingInterval ??
    "monthly") as BillingInterval;
  const [savingType, setSavingType] = useState<
    QuantityAddonType | "credits" | null
  >(null);

  const currentQuantities: Record<QuantityAddonType, number> = {
    seat: 0,
    phone_alias: 0,
    email_alias: 0,
    knowledge_base: 0,
  };
  for (const addon of addons) {
    if (addon.addonType !== "credits") {
      currentQuantities[addon.addonType as QuantityAddonType] = addon.quantity;
    }
  }

  const creditsAddon = addons.find((a) => a.addonType === "credits");

  const [liveTotals, setLiveTotals] =
    useState<Record<QuantityAddonType, number>>(currentQuantities);
  useEffect(() => {
    setLiveTotals(currentQuantities);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addons]);

  const handleSaved = (type: QuantityAddonType, newQty: number) => {
    setLiveTotals((prev) => ({ ...prev, [type]: newQty }));
  };

  const handleQtyChange = (type: QuantityAddonType, qty: number) => {
    setLiveTotals((prev) => ({ ...prev, [type]: qty }));
  };

  const isYearly = interval === "yearly";
  const intervalSuffix = isYearly ? "yr" : "mo";
  const addonTotal = ADDON_ORDER.reduce(
    (acc, type) =>
      acc +
      getAddonTieredCost(type, interval, liveTotals[type]) *
        (isYearly ? 12 : 1),
    0,
  );

  return (
    <div className="bg-white border border-slate-100 rounded-[32px] p-5 sm:p-8 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900 font-heading mb-1">
          Add-ons
        </h2>
        <p className="text-slate-500 text-sm font-medium">
          Extra resources billed at{" "}
          <span className="text-slate-900 font-bold capitalize">
            {interval}
          </span>{" "}
          rate. Each add-on is saved independently.
        </p>
      </div>

      <div className="space-y-2.5">
        {ADDON_ORDER.map((type) => (
          <AddonRow
            key={type}
            type={type}
            currentQty={currentQuantities[type]}
            interval={interval}
            anyRowSaving={savingType !== null}
            onSaveStart={() => setSavingType(type)}
            onSaveEnd={() => setSavingType(null)}
            onSaved={handleSaved}
            onQtyChange={handleQtyChange}
          />
        ))}

        <CreditsAddonRow
          activeAddon={creditsAddon}
          interval={interval}
          disabled={savingType !== null && savingType !== "credits"}
          onSaveStart={() => setSavingType("credits")}
          onSaveEnd={() => setSavingType(null)}
        />
      </div>

      <div className="mt-6 pt-5 border-t border-slate-100 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Add-on Total ({interval})
          </p>
          <p className="text-3xl font-black text-slate-900 tabular-nums">
            ${addonTotal.toFixed(2)}
            <span className="text-base font-bold text-slate-400">
              /{intervalSuffix}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
