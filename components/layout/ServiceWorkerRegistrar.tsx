"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator))
      return;
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        reg.addEventListener("updatefound", () => {
          const next = reg.installing;
          if (next) {
            next.addEventListener("statechange", () => {
              if (
                next.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                console.log("[SW] Update available — reload to activate");
              }
            });
          }
        });
      })
      .catch((err) => console.warn("[SW] Registration failed:", err));
  }, []);
  return null;
}
