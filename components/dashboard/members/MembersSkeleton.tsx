"use client";

export function MembersSkeleton() {
  return (
    <div className="space-y-6 md:space-y-0 md:bg-white md:border md:border-slate-200 md:rounded-[32px] md:overflow-hidden md:shadow-sm md:divide-y md:divide-slate-100">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 p-5 md:px-8 md:py-5 bg-white md:bg-transparent border border-slate-100 md:border-none rounded-3xl md:rounded-none shadow-sm md:shadow-none animate-pulse"
        >
          {/* Member Info */}
          <div className="col-span-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 bg-slate-100 rounded" />
              <div className="h-3 w-48 bg-slate-100 rounded" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 md:contents">
            {/* Role */}
            <div className="col-span-2">
              <div className="md:hidden h-2 w-16 bg-slate-50 rounded mb-2" />
              <div className="h-8 w-24 bg-slate-100 rounded-xl" />
            </div>

            {/* Status */}
            <div className="col-span-2">
              <div className="md:hidden h-2 w-16 bg-slate-50 rounded mb-2" />
              <div className="h-8 w-24 bg-slate-100 rounded-xl" />
            </div>

            {/* Date */}
            <div className="col-span-2 md:text-center">
              <div className="md:hidden h-2 w-16 bg-slate-50 rounded mb-2" />
              <div className="space-y-1 flex flex-col md:items-center">
                <div className="h-3 w-20 bg-slate-100 rounded" />
                <div className="h-2 w-12 bg-slate-50 rounded" />
              </div>
            </div>

            {/* Action */}
            <div className="col-span-1 flex justify-end">
              <div className="h-10 w-10 bg-slate-100 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
