"use client";

import { useParams } from "next/navigation";
import {
  LayoutGrid,
  Send,
  Users,
  BarChart3,
  UserPlus,
  Wallet,
  Settings,
  ChevronDown,
} from "lucide-react";
import { AppLayout } from "./AppLayout";
import { useAuthStore } from "@/store/client/useAuthStore";
import type { NavGroup, UserProfile } from "@/types/layout";

interface WorkspaceContextSwitcherProps {
  name?: string;
  collapsed?: boolean;
}

function WorkspaceContextSwitcher({
  name = "Main Workspace",
  collapsed = false,
}: WorkspaceContextSwitcherProps) {
  if (collapsed) {
    // Icon-only rail: show initial letter in a square
    return (
      <button
        className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 hover:bg-white hover:border-primary/30 flex items-center justify-center transition-all group"
        title={name}
      >
        <span className="text-sm font-black text-slate-700 group-hover:text-primary transition-colors">
          {name[0].toUpperCase()}
        </span>
      </button>
    );
  }

  return (
    <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-white hover:border-primary/30 transition-all group">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0" />
        <span className="font-bold text-sm text-slate-700 truncate">
          {name}
        </span>
      </div>
      <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 shrink-0 ml-2 transition-colors" />
    </button>
  );
}

export function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const workspaceId = (params?.workspaceId as string) ?? "";
  const base = `/workspace/${workspaceId}`;

  const navGroups: NavGroup[] = [
    {
      label: "Overview",
      items: [
        { name: "Dashboard", href: `${base}/dashboard`, icon: LayoutGrid },
        { name: "Campaigns", href: `${base}/campaigns`, icon: Send },
        { name: "Leads", href: `${base}/leads`, icon: Users },
        { name: "Analytics", href: `${base}/analytics`, icon: BarChart3 },
      ],
    },
    {
      label: "Administration",
      items: [
        { name: "Members", href: `${base}/members`, icon: UserPlus },
        { name: "Billing", href: `${base}/billing`, icon: Wallet },
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
