"use client";

import { useState } from "react";
import { Save, Mail, Bell, Loader2, CheckCircle2 } from "lucide-react";
import {
  useNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} from "@/store/server/notification.queries";
import { LeadStatusValue, NotificationPreference } from "@/types/notification";
import { Button } from "@/components/branding/Button";
import { PushSubscriptionPanel } from "./PushSubscriptionPanel";
import { PreferencesSkeleton } from "./NotificationSkeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ALL_STATUSES: {
  value: LeadStatusValue;
  label: string;
  emoji: string;
  desc: string;
  activeClass: string;
}[] = [
  {
    value: "hot",
    label: "Hot",
    emoji: "🔥",
    desc: "Ready to close",
    activeClass: "bg-rose-50 border-rose-300 text-rose-700",
  },
  {
    value: "warm",
    label: "Warm",
    emoji: "☀️",
    desc: "Engaged & interested",
    activeClass: "bg-amber-50 border-amber-300 text-amber-700",
  },
  {
    value: "cold",
    label: "Cold",
    emoji: "❄️",
    desc: "Needs re-engagement",
    activeClass: "bg-sky-50 border-sky-300 text-sky-700",
  },
  {
    value: "converted",
    label: "Converted",
    emoji: "✅",
    desc: "Deal closed",
    activeClass: "bg-emerald-50 border-emerald-300 text-emerald-700",
  },
  {
    value: "unsubscribed",
    label: "Unsubscribed",
    emoji: "🚫",
    desc: "Opted out",
    activeClass: "bg-slate-100 border-slate-300 text-slate-600",
  },
];

// Outer component — handles loading state, gates inner form on data
export function NotificationPreferencesCard() {
  const { data: prefs, isLoading } = useNotificationPreferencesQuery();

  if (isLoading)
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <PreferencesSkeleton />
      </div>
    );

  // key={prefs?.id} ensures form resets if the underlying record changes
  return <PreferencesForm key={prefs?.id ?? "new"} prefs={prefs ?? null} />;
}

// Inner component — state lazily initialized from props, no useEffect needed
function PreferencesForm({ prefs }: { prefs: NotificationPreference | null }) {
  const updateMutation = useUpdateNotificationPreferencesMutation();

  const [emailEnabled, setEmailEnabled] = useState(
    () => prefs?.emailEnabled ?? false,
  );
  const [notifyEmail, setNotifyEmail] = useState(
    () => prefs?.notifyEmail ?? "",
  );
  const [pushEnabled, setPushEnabled] = useState(
    () => prefs?.pushEnabled ?? false,
  );
  const [statuses, setStatuses] = useState<LeadStatusValue[]>(
    () => prefs?.notifyOnStatuses ?? ["hot", "warm"],
  );
  const [saved, setSaved] = useState(false);

  const toggleStatus = (s: LeadStatusValue) =>
    setStatuses((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  const handleSave = async () => {
    if (emailEnabled && !notifyEmail.trim()) {
      toast.error("Please enter an email address for notifications");
      return;
    }
    if (statuses.length === 0) {
      toast.error("Select at least one lead status to notify on");
      return;
    }
    await updateMutation.mutateAsync({
      emailEnabled,
      pushEnabled,
      notifyEmail: emailEnabled ? notifyEmail.trim() : null,
      notifyOnStatuses: statuses,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Card header */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
          Preferences
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Per-workspace · changes only affect this workspace
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {/* ── Email ── */}
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                  emailEnabled
                    ? "bg-primary/10 text-primary"
                    : "bg-slate-100 text-slate-400",
                )}
              >
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Email Notifications
                </p>
                <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">
                  Get emailed when leads match
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEmailEnabled((v) => !v)}
              aria-checked={emailEnabled}
              role="switch"
              className={cn(
                "relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 shrink-0",
                emailEnabled ? "bg-primary" : "bg-slate-200",
              )}
            >
              <span
                className={cn(
                  "absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform will-change-transform",
                  emailEnabled ? "translate-x-5" : "translate-x-0",
                )}
              />
            </button>
          </div>

          {emailEnabled && (
            <div className="space-y-1.5 pl-12">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Notification Email
              </label>
              <input
                type="email"
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium text-slate-900 placeholder:font-normal placeholder:text-slate-400"
              />
            </div>
          )}
        </div>

        {/* ── Push ── */}
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                pushEnabled
                  ? "bg-primary/10 text-primary"
                  : "bg-slate-100 text-slate-400",
              )}
            >
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                Push Notifications
              </p>
              <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">
                Browser push · works even when tab is closed
              </p>
            </div>
          </div>
          <PushSubscriptionPanel
            pushEnabled={pushEnabled}
            onToggle={setPushEnabled}
          />
        </div>

        {/* ── Status Filters ── */}
        <div className="px-6 py-5 space-y-3">
          <div>
            <p className="text-sm font-bold text-slate-800">
              Notify when status changes to
            </p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              Alerts fire when a lead&apos;s status changes to any selected
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {ALL_STATUSES.map((s) => {
              const active = statuses.includes(s.value);
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => toggleStatus(s.value)}
                  className={cn(
                    "flex items-start gap-2 p-3 rounded-xl border-2 text-left transition-all active:scale-[0.97]",
                    active
                      ? s.activeClass
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                  )}
                >
                  <span className="text-base leading-none mt-0.5 shrink-0">
                    {s.emoji}
                  </span>
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "text-xs font-black truncate",
                        active ? "" : "text-slate-700",
                      )}
                    >
                      {s.label}
                    </p>
                    <p
                      className={cn(
                        "text-[10px] font-medium leading-tight mt-0.5 truncate",
                        active ? "opacity-70" : "text-slate-400",
                      )}
                    >
                      {s.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Save ── */}
        <div className="px-6 py-4">
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="w-full rounded-xl h-11 text-sm font-bold"
          >
            {updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Saved!
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Preferences
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
