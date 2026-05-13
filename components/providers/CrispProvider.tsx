"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/client/useAuthStore";
import { useAccountStore } from "@/store/client/useAccountStore";

declare global {
  interface Window {
    $crisp: unknown[];
    CRISP_WEBSITE_ID: string;
  }
}

const SUPPORT_PATH = "/dashboard/support";

export function CrispProvider() {
  const { user } = useAuthStore();
  const activeWorkspace = useAccountStore(
    (s) => s.workspaces.find((w) => w.id === s.activeWorkspaceId) ?? null,
  );
  const pathname = usePathname();

  useEffect(() => {
    const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
    if (!websiteId) return;

    window.$crisp = [];
    window.CRISP_WEBSITE_ID = websiteId;
    window.$crisp.push(["do", "chat:hide"]);

    const script = document.createElement("script");
    script.src = "https://client.crisp.chat/l.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Hide + close chat whenever navigating away from the support page
  useEffect(() => {
    if (!window.$crisp) return;
    if (!pathname.startsWith(SUPPORT_PATH)) {
      window.$crisp.push(["do", "chat:close"]);
      window.$crisp.push(["do", "chat:hide"]);
    }
  }, [pathname]);

  // Sync user identity + workspace context into every session
  useEffect(() => {
    if (!window.$crisp || !user) return;

    const name =
      user.user_metadata?.name || user.email?.split("@")[0] || "User";

    if (user.email) window.$crisp.push(["set", "user:email", [user.email]]);
    window.$crisp.push(["set", "user:nickname", [name]]);

    const sessionData: [string, string][] = [
      ["user_id", user.id],
      ["user_name", name],
      ["user_email", user.email ?? ""],
    ];

    if (activeWorkspace) {
      sessionData.push(["workspace_id", activeWorkspace.id]);
      sessionData.push(["workspace_name", activeWorkspace.name]);
      sessionData.push(["workspace_role", activeWorkspace.role]);
    }

    window.$crisp.push(["set", "session:data", [sessionData]]);
  }, [user, activeWorkspace]);

  return null;
}
