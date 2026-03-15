"use client";

import {
  LayoutGrid,
  Users,
  UserPlus,
  Wallet,
  Settings,
  Code,
  BrainCircuit,
  Workflow,
  Webhook,
  Bell,
  MessageSquare,
  Box,
} from "lucide-react";
import { AppLayout } from "./AppLayout";
import { useAuthStore } from "@/store/client/useAuthStore";
import { WorkspaceContextSwitcher } from "./workspace-switcher";
import type { NavGroup, UserProfile } from "@/types/layout";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const base = `/dashboard`;

  const navGroups: NavGroup[] = [
    {
      label: "Automations",
      items: [
        { name: "Overview", href: `${base}`, icon: LayoutGrid },
        { name: "Campaigns", href: `${base}/campaigns`, icon: Workflow },
        { name: "Messages", href: `${base}/messages`, icon: MessageSquare },
        { name: "Leads", href: `${base}/leads`, icon: Users },
        { name: "Assets", href: `${base}/assets`, icon: Box },
        { name: "Templates", href: `${base}/templates`, icon: Code },
        {
          name: "Knowledge Base",
          href: `${base}/knowledge-base`,
          icon: BrainCircuit,
        },
        { name: "Integrations", href: `${base}/integrations`, icon: Webhook },
        { name: "Notifications", href: `${base}/notifications`, icon: Bell },
      ],
    },
    {
      label: "Administration",
      items: [
        { name: "Members", href: `${base}/members`, icon: UserPlus },
        { name: "Billings", href: `${base}/billings`, icon: Wallet },
        { name: "Settings", href: `${base}/settings`, icon: Settings },
      ],
    },
  ];

  const { user } = useAuthStore();

  const activeUser: UserProfile = {
    name: user?.user_metadata?.name || user?.email?.split("@")[0] || "User",
    email: user?.email || "",
  };

  return (
    <AppLayout
      navGroups={navGroups}
      user={activeUser}
      sidebarContextSlot={(isCollapsed) => (
        <WorkspaceContextSwitcher collapsed={isCollapsed} />
      )}
      collapseMode="icon-only"
      mainMaxWidth="max-w-[1600px]"
    >
      {children}
    </AppLayout>
  );
}
