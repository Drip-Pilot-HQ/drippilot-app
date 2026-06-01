export function KnowledgeBaseCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 animate-pulse">
      <div className="flex items-start justify-between mb-5">
        <div className="w-10 h-10 rounded-xl bg-slate-100 shadow-sm" />

        <div className="flex items-center gap-2">
          <div className="w-20 h-6 rounded-full bg-slate-50 border border-slate-100" />
          <div className="w-2 h-4 rounded bg-slate-100" />
        </div>
      </div>

      <div className="mb-5 space-y-3">
        {/* Title skeleton */}
        <div className="h-5 w-2/3 bg-slate-100 rounded-lg" />

        {/* Content skeleton with matches the border-l-2 style */}
        <div className="border-l-2 border-slate-100 pl-3 space-y-2">
          <div className="h-3 w-full bg-slate-50 rounded" />
          <div className="h-3 w-4/5 bg-slate-50 rounded" />
        </div>
      </div>

      <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded-full bg-slate-100" />
          <div className="h-2.5 w-16 bg-slate-100 rounded" />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded-full bg-slate-100" />
          <div className="h-2.5 w-16 bg-slate-100 rounded" />
        </div>
      </div>
    </div>
  );
}

export function KnowledgeBaseListSkeleton({
  viewMode = "list",
}: {
  viewMode?: "grid" | "list";
}) {
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <KnowledgeBaseCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white border border-slate-200 rounded-2xl p-4 animate-pulse flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="h-4 w-1/3 bg-slate-100 rounded-lg" />
            <div className="h-3 w-2/3 bg-slate-50 rounded" />
          </div>
          <div className="hidden md:flex items-center gap-6 shrink-0">
            <div className="h-3 w-20 bg-slate-50 rounded" />
            <div className="h-3 w-24 bg-slate-50 rounded" />
          </div>
          <div className="w-4 h-4 rounded bg-slate-100 shrink-0" />
        </div>
      ))}
    </div>
  );
}
