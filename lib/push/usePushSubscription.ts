"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  useVapidPublicKeyQuery,
  useRegisterPushMutation,
  useUnregisterPushMutation,
} from "@/store/server/notification.queries";
import { useAccountStore } from "@/store/client/useAccountStore";
import { apiClient } from "@/lib/api/axios";

export type PushStatus =
  | "checking"
  | "unsupported"
  | "denied"
  | "not-subscribed"
  | "subscribed"
  | "subscribing"
  | "unsubscribing";

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(b64);
  return Uint8Array.from(Array.from(raw).map((c) => c.charCodeAt(0)));
}

export function usePushSubscription() {
  const [status, setStatus] = useState<PushStatus>("checking");
  const activeWorkspaceId = useAccountStore((s) => s.activeWorkspace?.id);

  const { data: vapidKey } = useVapidPublicKeyQuery();
  const registerMutation = useRegisterPushMutation();
  const unregisterMutation = useUnregisterPushMutation();

  // check() asks the BACKEND whether this workspace has a subscription registered.
  // We do not rely on reg.pushManager.getSubscription() for workspace state because
  // the browser holds a single subscription with no concept of workspaces — switching
  // workspaces would otherwise always show "subscribed" once any workspace subscribed.
  const check = useCallback(async () => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window) ||
      !("Notification" in window)
    ) {
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setStatus("denied");
      return;
    }
    try {
      const { data } = await apiClient.get<{ subscribed: boolean }>(
        "/notifications/push/status",
      );
      setStatus(data.subscribed ? "subscribed" : "not-subscribed");
    } catch {
      // API unavailable — fall back to browser-level check
      try {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        setStatus(sub ? "subscribed" : "not-subscribed");
      } catch {
        setStatus("not-subscribed");
      }
    }
  }, []);

  // Re-check whenever the active workspace changes so the status correctly
  // reflects the current workspace's subscription state.
  useEffect(() => {
    let cancelled = false;
    Promise.resolve()
      .then(() => {
        if (!cancelled) return check();
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [check, activeWorkspaceId]);

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!vapidKey) {
      toast.error("Push configuration unavailable");
      return false;
    }
    setStatus("subscribing");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        toast.error(
          "Permission denied. Enable notifications in browser settings.",
        );
        return false;
      }
      const reg = await navigator.serviceWorker.ready;
      // Reuse existing subscription or create new one
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
        });
      }
      const json = sub.toJSON();
      // Register with backend for THIS workspace (x-workspace-id header auto-added)
      await registerMutation.mutateAsync({
        endpoint: sub.endpoint,
        p256dh: json.keys?.p256dh ?? "",
        auth: json.keys?.auth ?? "",
        userAgent: navigator.userAgent,
      });
      setStatus("subscribed");
      toast.success("Push notifications enabled for this workspace");
      return true;
    } catch (err) {
      console.error("Push subscribe error:", err);
      setStatus("not-subscribed");
      toast.error("Failed to enable push notifications");
      return false;
    }
  }, [vapidKey, registerMutation]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    setStatus("unsubscribing");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        // Remove ONLY from current workspace backend — browser subscription stays
        // (same endpoint may be registered for other workspaces)
        await unregisterMutation.mutateAsync(sub.endpoint);
      }
      setStatus("not-subscribed");
      toast.success("Push notifications disabled for this workspace");
      return true;
    } catch {
      setStatus("subscribed");
      toast.error("Failed to disable push notifications");
      return false;
    }
  }, [unregisterMutation]);

  return {
    status,
    isChecking: status === "checking",
    isSubscribed: status === "subscribed",
    isUnsupported: status === "unsupported",
    isDenied: status === "denied",
    isBusy: status === "subscribing" || status === "unsubscribing",
    subscribe,
    unsubscribe,
    refresh: check,
  };
}
