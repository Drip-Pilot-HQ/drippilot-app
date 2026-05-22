"use client";

import { AppLayout } from "./AppLayout";
import { useAuthStore } from "@/store/client/useAuthStore";
import { Settings, Layers, BarChart2 } from "lucide-react";
import type { NavGroup, UserProfile } from "@/types/layout";

const navGroups: NavGroup[] = [
  {
    items: [
      { name: "Workspaces", href: "/account/workspaces", icon: Layers },
      { name: "Profile", href: "/account/profile", icon: Settings },
      // { name: "API Tokens", href: "/account/tokens", icon: Key },
      { name: "Sales Dashboard", href: "/account/referral", icon: BarChart2 },
    ],
  },
];

export function AccountLayout({ children }: { children: React.ReactNode }) {
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
      collapseMode="hide"
      mainMaxWidth="max-w-[1600px]"
    >
      {children}
    </AppLayout>
  );
}
