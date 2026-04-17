export function LeadRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      {/* Checkbox */}
      <td className="pl-3 pr-2 py-3 w-9">
        <div className="w-4 h-4 rounded bg-slate-100" />
      </td>
      {/* Name */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-100 shrink-0" />
          <div className="h-3.5 w-28 bg-slate-100 rounded" />
        </div>
      </td>
      {/* Contact */}
      <td className="px-3 py-3">
        <div className="space-y-1.5">
          <div className="h-3 w-36 bg-slate-100 rounded" />
          <div className="h-3 w-24 bg-slate-100 rounded" />
        </div>
      </td>
      {/* Status */}
      <td className="px-3 py-3">
        <div className="h-5 w-14 bg-slate-100 rounded-full" />
      </td>
      {/* Tags */}
      <td className="px-3 py-3">
        <div className="flex gap-1.5">
          <div className="h-5 w-12 bg-slate-100 rounded-md" />
          <div className="h-5 w-10 bg-slate-100 rounded-md" />
        </div>
      </td>
      {/* Campaigns */}
      <td className="px-3 py-3">
        <div className="flex gap-1.5">
          <div className="h-5 w-20 bg-slate-100 rounded-md" />
          <div className="h-5 w-5 bg-slate-100 rounded-md" />
        </div>
      </td>
      {/* Added On */}
      <td className="px-3 py-3">
        <div className="h-3 w-20 bg-slate-100 rounded" />
      </td>
      {/* Actions */}
      <td className="px-3 py-3 text-right">
        <div className="h-7 w-7 bg-slate-100 rounded-lg ml-auto" />
      </td>
    </tr>
  );
}

export function LeadListSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left min-w-[1040px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="pl-3 pr-2 py-3 w-9">
                <div className="w-4 h-4 rounded bg-slate-100 animate-pulse" />
              </th>
              {["w-16", "w-14", "w-12", "w-10", "w-20", "w-16"].map((w, i) => (
                <th key={i} className="px-1 py-2">
                  <div
                    className={`h-3 ${w} bg-slate-100 rounded animate-pulse ml-2`}
                  />
                </th>
              ))}
              <th className="px-3 py-3">
                <div className="h-3 w-14 bg-slate-100 rounded animate-pulse ml-auto" />
              </th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <LeadRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
