export function ThreadListSkeleton() {
  return (
    <div className="flex flex-col gap-1 p-2 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-3 rounded-xl bg-slate-50"
        >
          <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="h-3.5 w-32 bg-slate-200 rounded" />
              <div className="h-3 w-10 bg-slate-100 rounded" />
            </div>
            <div className="h-3 w-full bg-slate-100 rounded" />
            <div className="h-3 w-2/3 bg-slate-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ThreadDetailSkeleton() {
  return (
    <div className="flex flex-col h-full animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-40 bg-slate-100 rounded" />
          <div className="h-3 w-24 bg-slate-100 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-slate-100 rounded-lg" />
          <div className="h-8 w-8 bg-slate-100 rounded-lg" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-5 py-4 space-y-4 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`h-12 rounded-2xl bg-slate-100 ${i % 2 === 0 ? "w-56" : "w-64"}`}
            />
          </div>
        ))}
      </div>

      {/* Composer */}
      <div className="px-5 py-4 border-t border-slate-100">
        <div className="h-24 w-full bg-slate-100 rounded-xl" />
        <div className="flex justify-between items-center mt-3">
          <div className="h-4 w-20 bg-slate-100 rounded" />
          <div className="h-9 w-24 bg-slate-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
