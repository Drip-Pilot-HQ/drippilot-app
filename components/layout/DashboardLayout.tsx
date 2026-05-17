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
  LifeBuoy,
  Sparkles,
} from "lucide-react";
import { AppLayout } from "./AppLayout";
import { useAuthStore } from "@/store/client/useAuthStore";
import { useWorkspaceRole } from "@/lib/hooks/use-workspace-role";
import { WorkspaceContextSwitcher } from "./workspace-switcher";
import type { NavGroup, NavItem, UserProfile } from "@/types/layout";
import { WorkspaceRole } from "@/types/account";
import { OnboardingController } from "@/components/onboarding";

const ADMIN_ONLY = [WorkspaceRole.OWNER, WorkspaceRole.ADMIN];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const base = `/dashboard`;
  const { role } = useWorkspaceRole();

  const allItems: NavItem[] = [
    { name: "Overview", href: `${base}`, icon: LayoutGrid },
    { name: "Campaigns", href: `${base}/campaigns`, icon: Workflow },
    {
      name: "AI Campaign Lab",
      href: `${base}/ai-lab`,
      icon: Sparkles,
      badge: "Beta",
    },
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
    {
      name: "Members",
      href: `${base}/members`,
      icon: UserPlus,
      allowedRoles: ADMIN_ONLY,
    },
    {
      name: "Billings",
      href: `${base}/billings`,
      icon: Wallet,
      allowedRoles: ADMIN_ONLY,
    },
    {
      name: "Setup Guide",
      href: `${base}/setup-guide`,
      icon: BookOpenText,
    },
    {
      name: "Help & Support",
      href: `${base}/support`,
      icon: LifeBuoy,
    },
  ];

  const navGroups: NavGroup[] = [
    {
      items: allItems.filter(
        (item) => !item.allowedRoles || item.allowedRoles.includes(role),
      ),
    },
  ];

  const { user } = useAuthStore();

  const activeUser: UserProfile = {
    name:
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.email?.split("@")[0] ||
      "User",
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
