export function WebhookRowSkeleton() {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-5 animate-pulse overflow-hidden">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0" />
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="h-5 w-36 bg-slate-100 rounded-lg" />
            <div className="h-5 w-14 bg-slate-100 rounded-full" />
            <div className="h-5 w-14 bg-slate-100 rounded-full hidden sm:block" />
          </div>
          <div className="h-9 w-full bg-slate-100 rounded-xl" />
          <div className="flex flex-wrap gap-2">
            <div className="h-6 w-28 bg-slate-100 rounded-lg" />
            <div className="h-6 w-20 bg-slate-100 rounded-lg hidden sm:block" />
          </div>
          <div className="h-4 w-28 bg-slate-100 rounded" />
        </div>
        <div className="flex gap-1 shrink-0">
          <div className="h-9 w-9 sm:w-20 bg-slate-100 rounded-xl" />
          <div className="h-9 w-9 bg-slate-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function WebhookListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <WebhookRowSkeleton key={i} />
      ))}
    </div>
  );
}
