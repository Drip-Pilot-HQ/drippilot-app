export function OverviewSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-slate-100 rounded-[28px] h-32" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-100 rounded-[28px] h-80" />
        <div className="bg-slate-100 rounded-[28px] h-80" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-100 rounded-[28px] h-80" />
        <div className="bg-slate-100 rounded-[28px] h-80" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-100 rounded-[28px] h-64" />
        <div className="bg-slate-100 rounded-[28px] h-64" />
      </div>
    </div>
  );
}
