"use client";

import { usePathname } from "next/navigation";
import { SidebarItem } from "./SidebarItem";
import { SidebarUser } from "./SidebarUser";
import { SidebarToggle } from "./SidebarToggle";
import { SidebarLogo } from "./SidebarLogo";
import { cn } from "@/lib/utils";
import type { NavGroup, UserProfile } from "@/types/layout";

interface SidebarProps {
  navGroups: NavGroup[];
  user?: UserProfile;
  /** Pre-resolved ReactNode — AppLayout calls the render prop before passing here */
  contextSlot?: React.ReactNode;
  onMobileClose?: () => void;
  onCollapse?: () => void;
  /** When true the sidebar renders in icon-only rail mode */
  isCollapsed?: boolean;
  className?: string;
}

export function Sidebar({
  navGroups,
  user,
  contextSlot,
  onMobileClose,
  onCollapse,
  isCollapsed = false,
  className,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "bg-white flex flex-col overflow-hidden transition-all duration-300",
        isCollapsed ? "w-[72px]" : "w-72",
        className,
      )}
    >
      {/* ── Logo row ─────────────────────────────────── */}
      <div
        className={cn(
          "flex items-center shrink-0 h-[64px] border-b border-slate-100",
          isCollapsed ? "justify-center px-3" : "pl-5 pr-3",
        )}
      >
        {/* Logo hidden in icon-only collapsed rail to save space */}
        {!isCollapsed && <SidebarLogo />}

        {!isCollapsed && (onCollapse || onMobileClose) && (
          <SidebarToggle
            isOpen
            onClick={() => {
              onMobileClose?.();
              onCollapse?.();
            }}
            className="ml-auto"
          />
        )}

        {isCollapsed && onCollapse && (
          <SidebarToggle isOpen={false} onClick={onCollapse} />
        )}
      </div>

      {/* ── Context slot ─────────────────────────────── */}
      {contextSlot && (
        <div
          className={cn(
            "border-b border-slate-100",
            isCollapsed ? "px-2 py-3 flex justify-center" : "px-3 py-3",
          )}
        >
          {contextSlot}
        </div>
      )}

      {/* ── Navigation ───────────────────────────────── */}
      <nav className="flex-1 px-2.5 py-4 overflow-y-auto custom-scrollbar">
        <div className="space-y-5">
          {navGroups.map((group, i) => (
            <div key={i}>
              {!isCollapsed && group.label && (
                <p className="px-3 mb-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.14em]">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <SidebarItem
                    key={item.href}
                    {...item}
                    isActive={
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/")
                    }
                    onClick={onMobileClose}
                    isCollapsed={isCollapsed}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* ── User footer ──────────────────────────────── */}
      {user && (
        <div
          className={cn(
            "shrink-0 border-t border-slate-100",
            isCollapsed ? "p-2" : "p-3",
          )}
        >
          <SidebarUser user={user} isCollapsed={isCollapsed} />
        </div>
      )}
    </aside>
  );
}
