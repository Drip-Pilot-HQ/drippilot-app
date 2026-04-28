export function CampaignSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 animate-pulse">
      <div className="flex items-start justify-between mb-5">
        <div className="w-10 h-10 rounded-xl bg-slate-100" />
        <div className="w-16 h-6 rounded-full bg-slate-100" />
      </div>
      <div className="space-y-3 mb-5">
        <div className="h-4 w-3/4 bg-slate-100 rounded" />
        <div className="h-3 w-full bg-slate-100 rounded" />
        <div className="h-3 w-1/2 bg-slate-100 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-4 pt-5 border-t border-slate-100">
        <div className="h-3 w-20 bg-slate-100 rounded" />
        <div className="h-3 w-20 bg-slate-100 rounded ml-auto" />
      </div>
    </div>
  );
}

export function CampaignListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <CampaignSkeleton key={i} />
      ))}
    </div>
  );
}
