"use client";

import { AppLayout } from "./AppLayout";
import { Settings, Key, Layers } from "lucide-react";
import type { NavGroup, UserProfile } from "@/types/layout";

const navGroups: NavGroup[] = [
  {
    items: [
      { name: "Workspaces", href: "/account/workspaces", icon: Layers },
      { name: "Profile", href: "/account/profile", icon: Settings },
      { name: "API Tokens", href: "/account/tokens", icon: Key },
    ],
  },
];

// TODO: replace with real user from auth context
const MOCK_USER: UserProfile = {
  name: "Alex Rivera",
  email: "alex@drippilot.com",
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout navGroups={navGroups} user={MOCK_USER} collapseMode="hide">
      {children}
    </AppLayout>
  );
}
