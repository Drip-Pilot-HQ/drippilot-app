"use client";

import { PanelLeftOpen } from "lucide-react";
import { NotificationBell } from "./NotificationBell";

interface MobileHeaderProps {
  onMenuClick: () => void;
  showNotifications?: boolean;
}

export function MobileHeader({
  onMenuClick,
  showNotifications = false,
}: MobileHeaderProps) {
  return (
    <header className="flex items-center h-14 px-4 bg-white border-b border-slate-100 sticky top-0 z-40">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        aria-label="Open navigation"
      >
        <PanelLeftOpen className="w-5 h-5" />
      </button>
      {/* <Link href="/" className="lg:hidden mx-auto">
        <Image
          src="/assets/logo-icon.png"
          alt="Drip Pilot"
          width={32}
          height={32}
          className="object-contain"
        />
      </Link> */}
      <div className="flex-1" />
      {showNotifications && <NotificationBell />}
    </header>
  );
}
