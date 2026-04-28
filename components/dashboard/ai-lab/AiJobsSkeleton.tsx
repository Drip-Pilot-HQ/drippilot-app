export function AiJobsSkeleton() {
  return (
    <div className="w-full space-y-4 animate-in fade-in duration-500 pb-20">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div
          key={i}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl shadow-sm border border-slate-100"
        >
          <div className="flex items-start gap-4 w-full">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 animate-pulse border border-slate-100" />
            <div className="w-full space-y-3 pt-1">
              <div className="flex items-center gap-3">
                <div className="h-4 bg-slate-200 rounded-md animate-pulse w-32" />
                <div className="h-3 bg-slate-100 rounded-md animate-pulse w-20" />
              </div>
              <div className="h-3.5 bg-slate-100 rounded-md animate-pulse w-3/4 max-w-[300px]" />
            </div>
          </div>
          <div className="hidden sm:block w-32 h-9 bg-slate-50 rounded-xl animate-pulse" />
        </div>
      ))}
    </div>
  );
}
