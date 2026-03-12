export function LeadRowSkeleton() {
  return (
    <tr className="animate-pulse border-b border-slate-50">
      <td className="px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-slate-100 rounded" />
            <div className="h-3 w-48 bg-slate-100 rounded" />
          </div>
        </div>
      </td>
      <td className="px-8 py-6">
        <div className="h-6 w-16 bg-slate-100 rounded-full" />
      </td>
      <td className="px-8 py-6">
        <div className="flex gap-2">
          <div className="h-5 w-12 bg-slate-100 rounded-full" />
          <div className="h-5 w-12 bg-slate-100 rounded-full" />
        </div>
      </td>
      <td className="px-8 py-6 text-right">
        <div className="h-8 w-8 bg-slate-100 rounded-lg ml-auto" />
      </td>
    </tr>
  );
}

export function LeadListSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              {[1, 2, 3, 4].map((i) => (
                <th key={i} className="px-8 py-5 h-10">
                  <div className="h-3 w-20 bg-slate-100 rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <LeadRowSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
