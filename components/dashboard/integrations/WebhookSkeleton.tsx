export function WebhookRowSkeleton() {
  return (
    <div className="px-5 py-4 sm:px-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0 space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-slate-100 shrink-0" />
            <div className="h-4 w-36 bg-slate-100 rounded-md" />
          </div>
          <div className="h-3.5 w-72 max-w-full bg-slate-100 rounded" />
          <div className="flex gap-3">
            <div className="h-3 w-16 bg-slate-100 rounded" />
            <div className="h-3 w-24 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          <div className="h-8 w-8 sm:w-20 bg-slate-100 rounded-lg" />
          <div className="h-8 w-8 bg-slate-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function WebhookListSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">
      {[1, 2, 3].map((i) => (
        <WebhookRowSkeleton key={i} />
      ))}
    </div>
  );
}
