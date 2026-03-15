import { cn } from "@/lib/utils";

interface WorkspaceSwitcherSkeletonProps {
  collapsed?: boolean;
}

export function WorkspaceSwitcherSkeleton({
  collapsed,
}: WorkspaceSwitcherSkeletonProps) {
  return (
    <div
      className={cn(
        "w-full h-11 rounded-xl bg-white/5 border border-white/5 animate-pulse flex items-center px-3 gap-2.5",
        collapsed && "w-10 px-0 justify-center",
      )}
    >
      <div className="w-5 h-5 rounded bg-white/10 shrink-0" />
      {!collapsed && <div className="w-24 h-3.5 bg-white/10 rounded" />}
    </div>
  );
}
