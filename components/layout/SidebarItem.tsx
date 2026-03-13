import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  name: string;
  href: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick?: () => void;
  isCollapsed?: boolean;
  badge?: string | number;
}

export function SidebarItem({
  name,
  href,
  icon: Icon,
  isActive,
  onClick,
  isCollapsed,
  badge,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      prefetch={true}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group",
        isActive
          ? "bg-primary/10 text-primary font-semibold shadow-inner"
          : "text-zinc-400 font-medium hover:bg-white/5 hover:text-white",
        isCollapsed && "justify-center px-0 w-10 h-10 mx-auto",
      )}
    >
      <Icon
        className={cn(
          "w-[18px] h-[18px] shrink-0 transition-colors",
          isActive ? "text-primary" : "text-zinc-500 group-hover:text-zinc-300",
        )}
      />

      {!isCollapsed && <span className="truncate flex-1">{name}</span>}

      {!isCollapsed && badge !== undefined && (
        <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary min-w-[18px] text-center">
          {badge}
        </span>
      )}

      {!isCollapsed && isActive && badge === undefined && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
      )}

      {/* Tooltip shown when rail is collapsed */}
      {isCollapsed && (
        <span className="absolute left-14 z-50 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
          {name}
        </span>
      )}
    </Link>
  );
}
