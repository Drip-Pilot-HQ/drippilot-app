import { useLogoutMutation } from "@/store/server/auth.queries";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types/layout";

interface SidebarUserProps {
  user: UserProfile;
  isCollapsed?: boolean;
  onLogout?: () => void;
}

export function SidebarUser({ user, isCollapsed, onLogout }: SidebarUserProps) {
  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    if (onLogout) onLogout();
    logoutMutation.mutate();
  };
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 transition-all duration-200 hover:bg-white hover:border-slate-200",
        isCollapsed && "justify-center",
      )}
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-linear-to-tr from-orange-200 to-pink-200 flex items-center justify-center shrink-0 shadow-sm">
        <span className="text-xs font-black text-primary leading-none">
          {initials}
        </span>
      </div>

      {!isCollapsed && (
        <>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-slate-900 truncate leading-tight">
              {user.name}
            </p>
            <p className="text-[10px] text-slate-500 font-semibold truncate">
              {user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all shrink-0"
            aria-label="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </>
      )}
    </div>
  );
}
