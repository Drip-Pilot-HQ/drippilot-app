import { DollarSign } from "lucide-react";
import { CommissionBadge } from "./CommissionBadge";
import { formatCents, formatDate } from "./config";
import { ReferralCommission } from "@/types/account";

interface CommissionsTableProps {
  commissions: ReferralCommission[];
}

export function CommissionsTable({ commissions }: CommissionsTableProps) {
  if (commissions.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center shadow-sm">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
        </div>
        <h4 className="font-heading font-bold text-slate-900 text-sm sm:text-base">
          No commissions yet
        </h4>
        <p className="text-slate-500 text-xs sm:text-sm font-semibold mt-1">
          Commissions are generated when referred users pay their invoices.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center gap-2">
        <DollarSign className="w-4 h-4 text-primary shrink-0" />
        <h3 className="font-heading font-black text-slate-900 text-base sm:text-lg">
          Commission History
        </h3>
        <span className="ml-auto px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider shrink-0">
          {commissions.length} records
        </span>
      </div>

      {/* Desktop column headers */}
      <div className="hidden sm:grid sm:grid-cols-4 px-6 py-2.5 bg-slate-50 border-b border-slate-100">
        {["Invoice Amount", "Commission", "Rate", "Status"].map((h) => (
          <p
            key={h}
            className="text-[10px] font-black uppercase tracking-widest text-slate-400"
          >
            {h}
          </p>
        ))}
      </div>

      <div className="divide-y divide-slate-100">
        {commissions.map((c) => (
          <div
            key={c.id}
            className="px-5 sm:px-6 py-4 hover:bg-slate-50/60 transition-colors"
          >
            {/* Mobile: stacked card layout */}
            <div className="sm:hidden flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <p className="text-xs font-semibold text-slate-400">
                  {formatDate(c.createdAt)}
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {formatCents(c.invoiceAmountCents)}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-black text-primary">
                    +{formatCents(c.commissionAmountCents)}
                  </p>
                  <span className="text-xs font-black text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md">
                    {c.commissionRate}%
                  </span>
                </div>
              </div>
              <CommissionBadge status={c.status} />
            </div>

            {/* Desktop: grid row */}
            <div className="hidden sm:grid sm:grid-cols-4 items-center gap-0">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {formatCents(c.invoiceAmountCents)}
                </p>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                  {formatDate(c.createdAt)}
                </p>
              </div>
              <p className="text-sm font-black text-primary">
                +{formatCents(c.commissionAmountCents)}
              </p>
              <span className="text-xs font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg w-fit">
                {c.commissionRate}%
              </span>
              <CommissionBadge status={c.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
