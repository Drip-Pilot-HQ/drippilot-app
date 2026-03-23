"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  X,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mail,
  Save,
  CheckCircle2,
  Activity,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useNotificationsBellQuery,
  useNotificationsQuery,
  useDeleteAllNotificationsMutation,
  useNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} from "@/store/server/notification.queries";
import { NotificationItem } from "@/components/dashboard/notifications/NotificationItem";
import { PushSubscriptionPanel } from "@/components/dashboard/notifications/PushSubscriptionPanel";
import type {
  LeadStatusValue,
  NotificationPreference,
} from "@/types/notification";
import { useConfirm } from "@/components/branding/ConfirmProvider";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

// ─── Feed Panel ──────────────────────────────────────────────────────────────

function FeedPanel() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useNotificationsQuery(page);
  const deleteAll = useDeleteAllNotificationsMutation();
  const confirm = useConfirm();
  const PAGE_SIZE = 20;
  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1;

  const handleClearAll = async () => {
    if (!data?.data.length) return;
    const ok = await confirm({
      title: "Clear all notifications",
      description:
        "This will permanently delete all notifications in this workspace.",
      confirmLabel: "Clear All",
      variant: "danger",
    });
    if (ok) {
      await deleteAll.mutateAsync();
      setPage(1);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Sub-header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50/70 sticky top-0">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Recent Activity
        </span>
        <button
          onClick={handleClearAll}
          disabled={deleteAll.isPending || !data?.data.length}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-bold text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all disabled:opacity-30 disabled:pointer-events-none"
        >
          {deleteAll.isPending ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Trash2 className="w-3 h-3" />
          )}
          Clear all
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-14">
          <Loader2 className="w-5 h-5 animate-spin text-slate-300" />
        </div>
      ) : !data?.data.length ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <Bell className="w-8 h-8 text-slate-200" />
          <div className="text-center">
            <p className="text-xs font-bold text-slate-500">
              No notifications yet
            </p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              Lead status changes will appear here
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {data.data.map((n) => (
            <NotificationItem key={n.id} notification={n} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 bg-slate-50/70 sticky bottom-0">
          <p className="text-[11px] text-slate-500 font-medium">
            Page {page} of {totalPages} · {data?.total ?? 0} total
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-bold text-slate-600 px-0.5">
              {page}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Preferences Panel ────────────────────────────────────────────────────────

const ALL_STATUSES: {
  value: LeadStatusValue;
  label: string;
  emoji: string;
  activeClass: string;
}[] = [
  {
    value: "hot",
    label: "Hot",
    emoji: "🔥",
    activeClass: "bg-rose-50 border-rose-300 text-rose-700",
  },
  {
    value: "warm",
    label: "Warm",
    emoji: "☀️",
    activeClass: "bg-amber-50 border-amber-300 text-amber-700",
  },
];

function PreferencesInner({ prefs }: { prefs: NotificationPreference | null }) {
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
    () => prefs?.notifyOnStatuses ?? [],
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
    <div className="divide-y divide-slate-100">
      {/* Email */}
      <div className="px-4 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                emailEnabled
                  ? "bg-primary/10 text-primary"
                  : "bg-slate-100 text-slate-400",
              )}
            >
              <Mail className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                Email Notifications
              </p>
              <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">
                Get emailed on lead status changes
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEmailEnabled((v) => !v)}
            aria-checked={emailEnabled}
            role="switch"
            className={cn(
              "relative w-10 h-5 rounded-full transition-colors shrink-0 ml-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1",
              emailEnabled ? "bg-primary" : "bg-slate-200",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform will-change-transform",
                emailEnabled ? "translate-x-5" : "translate-x-0",
              )}
            />
          </button>
        </div>
        {emailEnabled && (
          <input
            type="email"
            value={notifyEmail}
            onChange={(e) => setNotifyEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs font-medium text-slate-900 placeholder:text-slate-400"
          />
        )}
      </div>

      {/* Push */}
      <div className="px-4 py-4 space-y-3">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
              pushEnabled
                ? "bg-primary/10 text-primary"
                : "bg-slate-100 text-slate-400",
            )}
          >
            <Bell className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">
              Push Notifications
            </p>
            <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">
              Browser push · works when tab is closed
            </p>
          </div>
        </div>
        <PushSubscriptionPanel
          pushEnabled={pushEnabled}
          onToggle={setPushEnabled}
        />
      </div>

      {/* Status Filters */}
      <div className="px-4 py-4 space-y-2.5">
        <div>
          <p className="text-xs font-bold text-slate-800">
            Notify when status changes to
          </p>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
            Alerts fire when a lead&apos;s status matches any selected
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
                  "flex items-center gap-2 p-3 rounded-xl border-2 transition-all active:scale-[0.97]",
                  active
                    ? s.activeClass
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                )}
              >
                <span className="text-sm leading-none shrink-0">{s.emoji}</span>
                <p
                  className={cn(
                    "text-xs font-black",
                    !active && "text-slate-700",
                  )}
                >
                  {s.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Save */}
      <div className="px-4 py-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="w-full flex items-center justify-center gap-2 h-9 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all disabled:opacity-60 active:scale-[0.98]"
        >
          {updateMutation.isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : saved ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              Save Preferences
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function PreferencesPanel() {
  const { data: prefs, isLoading } = useNotificationPreferencesQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-14">
        <Loader2 className="w-5 h-5 animate-spin text-slate-300" />
      </div>
    );
  }

  return <PreferencesInner key={prefs?.id ?? "new"} prefs={prefs ?? null} />;
}

// ─── Main Bell ────────────────────────────────────────────────────────────────

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"feed" | "prefs">("feed");
  const { data } = useNotificationsBellQuery();
  const unreadCount = (data?.data ?? []).filter((n) => !n.isRead).length;
  const qc = useQueryClient();

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "NOTIFICATION_RECEIVED") {
        qc.invalidateQueries({ queryKey: ["notifications"] });
      }
    };
    navigator.serviceWorker.addEventListener("message", handler);
    return () => navigator.serviceWorker.removeEventListener("message", handler);
  }, [qc]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
        )}
      </button>

      {open && (
        <>
          {/* Backdrop — dark on mobile, transparent on desktop */}
          <div
            className="fixed inset-0 z-40 bg-black/30 md:bg-transparent"
            onClick={() => setOpen(false)}
          />

          {/* Panel — bottom drawer on mobile, dropdown on desktop */}
          <div
            className={cn(
              "fixed inset-x-0 bottom-0 z-50 flex flex-col bg-white shadow-2xl border border-slate-200",
              "rounded-t-3xl max-h-[85svh]",
              "md:absolute md:inset-auto md:right-0 md:top-full md:mt-2 md:w-[400px] md:max-h-[620px] md:rounded-2xl",
              "animate-in fade-in slide-in-from-bottom-4 md:slide-in-from-bottom-0 md:slide-in-from-top-2 duration-200",
            )}
          >
            {/* Drag handle — mobile only */}
            <div className="md:hidden flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 bg-slate-200 rounded-full" />
            </div>

            {/* Panel header with tabs */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0">
              <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
                <button
                  onClick={() => setTab("feed")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all",
                    tab === "feed"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700",
                  )}
                >
                  <Activity className="w-3 h-3" />
                  Activity
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[9px] font-black rounded-full leading-none">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setTab("prefs")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all",
                    tab === "prefs"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700",
                  )}
                >
                  <Settings2 className="w-3 h-3" />
                  Settings
                </button>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {tab === "feed" ? <FeedPanel /> : <PreferencesPanel />}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
