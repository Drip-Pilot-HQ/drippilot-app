import type { LucideIcon } from "lucide-react";
import type { WorkspaceRole } from "@/types/account";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  allowedRoles?: WorkspaceRole[];
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
}
