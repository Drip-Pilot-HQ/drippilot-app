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
  contextSlot?: React.ReactNode;
  onMobileClose?: () => void;
  onCollapse?: () => void;
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
        "bg-zinc-950 flex flex-col relative z-40",
        "transition-[width] duration-300 ease-in-out",
        isCollapsed ? "w-[72px]" : "w-72",
        className,
      )}
    >
      {/* Logo Row */}
      <div
        className={cn(
          "flex items-center shrink-0 h-[64px] border-b border-white/5",
          isCollapsed ? "justify-center px-3" : "pl-5 pr-3",
        )}
      >
        <div
          className={cn(
            "transition-all duration-200 flex items-center",
            isCollapsed
              ? "opacity-0 scale-90 pointer-events-none absolute"
              : "opacity-100 scale-100",
          )}
        >
          <SidebarLogo />
        </div>

        {(onCollapse || onMobileClose) && (
          <SidebarToggle
            isOpen={!isCollapsed}
            onClick={() => {
              onMobileClose?.();
              onCollapse?.();
            }}
            className={cn(
              "transition-all duration-200",
              isCollapsed ? "mx-auto" : "ml-auto",
            )}
          />
        )}
      </div>

      {/* Context Slot */}
      {contextSlot && (
        <div
          className={cn(
            "border-b border-white/5 transition-all duration-200",
            isCollapsed
              ? "px-2 py-3 flex justify-center"
              : "px-3 py-3 opacity-100",
          )}
        >
          {contextSlot}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-4 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="space-y-5">
          {navGroups.map((group, i) => (
            <div key={i}>
              {group.label && (
                <p
                  className={cn(
                    "px-3 mb-2 text-[9px] font-black text-zinc-500 uppercase tracking-[0.14em]",
                    "transition-all duration-200",
                    isCollapsed
                      ? "opacity-0 -translate-x-2 h-0 overflow-hidden"
                      : "opacity-100 translate-x-0",
                  )}
                >
                  {group.label}
                </p>
              )}

              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <SidebarItem
                    key={item.href}
                    {...item}
                    isActive={
                      item.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname === item.href ||
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

      {/* User Footer */}
      {user && (
        <div
          className={cn(
            "shrink-0 border-t border-white/5 transition-all duration-200",
            isCollapsed ? "p-2 flex justify-center" : "p-3",
          )}
        >
          <SidebarUser user={user} isCollapsed={isCollapsed} />
        </div>
      )}
    </aside>
  );
}
