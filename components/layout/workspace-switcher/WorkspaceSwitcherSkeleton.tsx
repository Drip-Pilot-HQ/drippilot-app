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
        "w-full h-11 rounded-xl bg-slate-50 border border-slate-100 animate-pulse flex items-center px-3 gap-2.5",
        collapsed && "w-10 px-0 justify-center",
      )}
    >
      <div className="w-5 h-5 rounded bg-slate-200 shrink-0" />
      {!collapsed && <div className="w-24 h-4 bg-slate-200 rounded" />}
    </div>
  );
}
