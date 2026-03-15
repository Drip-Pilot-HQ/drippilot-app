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
  X,
} from "lucide-react";
import { ConfirmDialog } from "@/components/branding/ConfirmDialog";
import {
  ADDON_CONFIGS,
  ADDON_TYPES,
  getAddonTieredCost,
  getAddonTierBreakdown,
  type AddonType,
  type BillingInterval,
} from "@/config/billing.config";
import {
  useAddAddonMutation,
  useRemoveAddonMutation,
} from "@/store/server/billing.queries";
import type { SubscriptionStatus, Addon } from "@/types/billings";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

interface AddonsListProps {
  subscription: SubscriptionStatus;
  addons: Addon[];
}

const ADDON_ICONS: Record<AddonType, React.ElementType> = {
  seat: Users,
  phone_alias: Phone,
  email_alias: Mail,
  knowledge_base: BookOpen,
};

const ADDON_ORDER: AddonType[] = [
  ADDON_TYPES.SEAT,
  ADDON_TYPES.PHONE_ALIAS,
  ADDON_TYPES.EMAIL_ALIAS,
  ADDON_TYPES.KNOWLEDGE_BASE,
];

interface AddonRowProps {
  type: AddonType;
  currentQty: number;
  interval: BillingInterval;
  anyRowSaving: boolean;
  onSaveStart: () => void;
  onSaveEnd: () => void;
  onSaved: (type: AddonType, newQty: number) => void;
  onQtyChange: (type: AddonType, qty: number) => void;
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

  const cost = getAddonTieredCost(type, interval, qty);
  const breakdown = getAddonTierBreakdown(type, interval, qty);
  const hasTiers = !!config.tiers && config.tiers.length > 1;
  const basePrice =
    interval === "yearly" ? config.yearlyPrice : config.monthlyPrice;

  const handleSave = () => setConfirming(true);
  const handleReset = () => setQty(currentQty);

  const buildDescription = () => {
    const intervalLabel = interval === "yearly" ? "annually" : "monthly";
    const newTotal = getAddonTieredCost(type, interval, qty);
    const oldTotal = getAddonTieredCost(type, interval, currentQty);
    const diff = Math.abs(newTotal - oldTotal).toFixed(2);
    if (delta > 0) {
      return `You're adding ${delta} × ${config.displayName}. Drip Pilot will charge your active payment method on file an additional $${diff}/mo billed ${intervalLabel}. The charge is prorated for the current billing period.`;
    }
    return `You're removing ${Math.abs(delta)} × ${config.displayName}. This will reduce your bill by $${diff}/mo starting next cycle.`;
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

  const isDisabled = anyRowSaving && !isSaving;

  return (
    <>
      <div
        className={`flex flex-col sm:flex-row sm:items-start justify-between p-5 rounded-2xl border-2 transition-all gap-4 ${
          currentQty > 0 || hasChanged
            ? "border-orange-100 bg-orange-50/30"
            : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/30"
        } ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
      >
        {/* Left — icon + info */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              currentQty > 0 || hasChanged
                ? "bg-orange-100 text-orange-500"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900">
              {config.displayName}
            </p>
            <p className="text-xs text-slate-400 font-medium">
              {hasTiers ? `from $${basePrice}/mo` : `$${basePrice}/mo`} ·{" "}
              {config.description}
            </p>
            {hasTiers && (
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                {config
                  .tiers!.map((t, i) => {
                    const p =
                      interval === "yearly" ? t.yearlyPrice : t.monthlyPrice;
                    if (i === 0 && t.upTo !== null)
                      return `1–${t.upTo} @ $${p}/ea`;
                    if (t.upTo === null)
                      return `${config.tiers![i - 1].upTo! + 1}+ @ $${p}/ea`;
                    return null;
                  })
                  .filter(Boolean)
                  .join("  ·  ")}
              </p>
            )}
            {breakdown.length > 1 && (
              <div className="mt-1.5 space-y-0.5">
                {breakdown.map((line, i) => (
                  <p key={i} className="text-[10px] font-medium text-slate-500">
                    {line}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — stepper + cost + save/reset */}
        <div className="flex items-center gap-3 self-end sm:self-start sm:mt-0.5">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => setQty((q) => Math.max(0, q - 1))}
              disabled={qty === 0 || isSaving}
              className="p-2.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center font-black text-slate-900 text-sm">
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => q + 1)}
              disabled={isSaving}
              className="p-2.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors disabled:cursor-not-allowed"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="w-20 text-right shrink-0">
            <p className="text-sm font-black text-slate-900">
              {qty > 0 ? `$${cost.toFixed(2)}/mo` : "—"}
            </p>
            {hasChanged && (
              <p
                className={`text-[10px] font-bold ${delta > 0 ? "text-orange-500" : "text-emerald-600"}`}
              >
                {delta > 0 ? `+${delta}` : `−${Math.abs(delta)}`}{" "}
                {delta > 0 ? "added" : "removed"}
              </p>
            )}
          </div>

          {hasChanged && (
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="h-8 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm shadow-orange-200"
              >
                {isSaving ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Check className="w-3 h-3" />
                )}
                Save
              </button>
              <button
                onClick={handleReset}
                disabled={isSaving}
                className="h-8 w-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
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
  const [savingType, setSavingType] = useState<AddonType | null>(null);

  const currentQuantities: Record<AddonType, number> = {
    seat: 0,
    phone_alias: 0,
    email_alias: 0,
    knowledge_base: 0,
  };
  for (const addon of addons) {
    currentQuantities[addon.addonType] = addon.quantity;
  }

  const [liveTotals, setLiveTotals] =
    useState<Record<AddonType, number>>(currentQuantities);
  useEffect(() => {
    setLiveTotals(currentQuantities);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addons]);

  const handleSaved = (type: AddonType, newQty: number) => {
    setLiveTotals((prev) => ({ ...prev, [type]: newQty }));
  };

  const handleQtyChange = (type: AddonType, qty: number) => {
    setLiveTotals((prev) => ({ ...prev, [type]: qty }));
  };

  const totalMonthly = ADDON_ORDER.reduce(
    (acc, type) => acc + getAddonTieredCost(type, interval, liveTotals[type]),
    0,
  );

  return (
    <div className="bg-white border border-slate-100 rounded-[32px] p-5 sm:p-8 shadow-sm">
      <div className="mb-6">
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

      <div className="space-y-3">
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
      </div>

      <div className="mt-7 pt-6 border-t border-slate-100">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
          Add-on Total ({interval})
        </p>
        <p className="text-3xl font-black text-slate-900">
          ${totalMonthly.toFixed(2)}
          <span className="text-base font-bold text-slate-400">/mo</span>
        </p>
      </div>
    </div>
  );
}
