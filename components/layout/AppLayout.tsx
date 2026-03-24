"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";
import { SidebarToggle } from "./SidebarToggle";
import { cn } from "@/lib/utils";
import type { NavGroup, UserProfile } from "@/types/layout";

/**
 * collapseMode:
 *  "hide"      – sidebar slides fully off-screen (desktop). A floating button reappears.
 *  "icon-only" – sidebar shrinks to icon-only rail (workspace style).
 */
export type CollapseMode = "hide" | "icon-only";

interface AppLayoutProps {
  children: React.ReactNode;
  navGroups: NavGroup[];
  user?: UserProfile;
  /**
   * Render prop — receives `isCollapsed` so you can render different UI.
   * e.g. full workspace switcher when expanded, initial-letter square when collapsed.
   */
  sidebarContextSlot?: (isCollapsed: boolean) => React.ReactNode;
  collapseMode?: CollapseMode;
  /** Tailwind max-width class for the page content area */
  mainMaxWidth?: string;
  /** Show the notification bell — only for workspace-scoped layouts */
  showNotifications?: boolean;
}

export function AppLayout({
  children,
  navGroups,
  user,
  sidebarContextSlot,
  collapseMode = "hide",
  mainMaxWidth = "max-w-6xl",
  showNotifications = false,
}: AppLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setIsMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const iconOnly = collapseMode === "icon-only" && isCollapsed;

  return (
    <div className="flex h-screen bg-[#FAFAFA] overflow-hidden">
      {/*
       * "hide" mode   → container width 0 ↔ 288px, sidebar clipped
       * "icon-only"   → container fluid; Sidebar controls its own width
       */}
      <div
        className={cn(
          "hidden lg:flex shrink-0 border-r border-slate-200 transition-all duration-300 ease-in-out z-30",
          collapseMode === "hide"
            ? isCollapsed
              ? "w-0 overflow-hidden"
              : "w-72"
            : isCollapsed
              ? "w-[72px] overflow-visible"
              : "w-72",
        )}
      >
        <Sidebar
          navGroups={navGroups}
          user={user}
          contextSlot={sidebarContextSlot?.(iconOnly)}
          isCollapsed={iconOnly}
          onCollapse={() => setIsCollapsed((v) => !v)}
          className="h-full"
        />
      </div>

      {/* Floating re-open — hide mode only */}
      {collapseMode === "hide" && isCollapsed && (
        <div className="fixed top-5 left-4 z-40 hidden lg:flex animate-in fade-in duration-200">
          <SidebarToggle isOpen={false} onClick={() => setIsCollapsed(false)} />
        </div>
      )}

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          isMobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300",
            isMobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setIsMobileOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-72 bg-white shadow-2xl transition-transform duration-300 ease-in-out",
            isMobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {/* Mobile drawer always renders at full width — never collapsed */}
          <Sidebar
            navGroups={navGroups}
            user={user}
            contextSlot={sidebarContextSlot?.(false)}
            onMobileClose={() => setIsMobileOpen(false)}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        <MobileHeader
          onMenuClick={() => setIsMobileOpen(true)}
          showNotifications={showNotifications}
        />
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden scroll-smooth custom-scrollbar">
          <div
            className={cn(
              "mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8",
              mainMaxWidth,
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
