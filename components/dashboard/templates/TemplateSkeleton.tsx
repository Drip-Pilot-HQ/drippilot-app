"use client";

interface TemplateSkeletonProps {
  viewMode?: "grid" | "list";
}

export function TemplateListSkeleton({
  viewMode = "list",
}: TemplateSkeletonProps) {
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="h-[240px] rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col p-5"
          >
            <div className="flex justify-between mb-8">
              <div className="w-10 h-10 rounded-xl bg-slate-100" />
              <div className="w-16 h-6 rounded-full bg-slate-50" />
            </div>
            <div className="space-y-3 mb-8">
              <div className="h-5 w-40 bg-slate-100 rounded" />
              <div className="h-4 w-56 bg-slate-100/50 rounded" />
            </div>
            <div className="mt-auto pt-4 border-t border-slate-50">
              <div className="h-3 w-32 bg-slate-50 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm"
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="w-10 h-10 rounded-xl bg-slate-100" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-1/4 bg-slate-100 rounded" />
              <div className="h-3 w-1/2 bg-slate-100/50 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:block w-20 h-5 rounded-full bg-slate-50" />
            <div className="w-8 h-8 rounded-lg bg-slate-50" />
          </div>
        </div>
      ))}
    </div>
  );
}
