"use client";

import {
  LayoutGrid,
  Users,
  UserPlus,
  Wallet,
  Code,
  BrainCircuit,
  Workflow,
  Webhook,
  MessageSquare,
  Box,
  BookOpenText,
} from "lucide-react";
import { AppLayout } from "./AppLayout";
import { useAuthStore } from "@/store/client/useAuthStore";
import { WorkspaceContextSwitcher } from "./workspace-switcher";
import type { NavGroup, UserProfile } from "@/types/layout";
import { OnboardingController } from "@/components/onboarding";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const base = `/dashboard`;

  const navGroups: NavGroup[] = [
    {
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
        { name: "Members", href: `${base}/members`, icon: UserPlus },
        { name: "Billings", href: `${base}/billings`, icon: Wallet },
        {
          name: "Setup Guide",
          href: `${base}/setup-guide`,
          icon: BookOpenText,
        },
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
      showNotifications
    >
      {children}
      <OnboardingController />
    </AppLayout>
  );
}
