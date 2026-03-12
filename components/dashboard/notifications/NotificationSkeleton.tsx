import { cn } from "@/lib/utils";

function Pulse({ className }: { className?: string }) {
  return (
    <div className={cn("bg-slate-100 rounded animate-pulse", className)} />
  );
}

export function NotificationItemSkeleton() {
  return (
    <div className="flex items-start gap-3 sm:gap-4 px-4 sm:px-6 py-4">
      <Pulse className="w-9 h-9 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2 py-0.5">
        <div className="flex items-center gap-2">
          <Pulse className="h-4 w-32" />
          <Pulse className="h-5 w-14 rounded-full" />
        </div>
        <Pulse className="h-3 w-52" />
        <Pulse className="h-3 w-20" />
      </div>
    </div>
  );
}

export function NotificationFeedSkeleton() {
  return (
    <div className="divide-y divide-slate-100">
      {[1, 2, 3, 4, 5].map((i) => (
        <NotificationItemSkeleton key={i} />
      ))}
    </div>
  );
}

export function PreferencesSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      {[1, 2].map((i) => (
        <div key={i} className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Pulse className="w-9 h-9 rounded-xl" />
              <div className="space-y-1.5">
                <Pulse className="h-3.5 w-28" />
                <Pulse className="h-2.5 w-20" />
              </div>
            </div>
            <Pulse className="w-11 h-6 rounded-full" />
          </div>
        </div>
      ))}
      <div className="space-y-2 pt-1">
        <Pulse className="h-3.5 w-40" />
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Pulse key={i} className="h-[60px] rounded-xl" />
          ))}
        </div>
      </div>
      <Pulse className="h-11 w-full rounded-xl mt-2" />
    </div>
  );
}
