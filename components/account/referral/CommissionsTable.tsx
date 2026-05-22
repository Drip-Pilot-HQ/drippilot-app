import { DollarSign } from "lucide-react";
import { CommissionBadge } from "./CommissionBadge";
import { formatCents, formatDate } from "./config";
import { ReferralCommission } from "@/types/account";

interface CommissionsTableProps {
  commissions: ReferralCommission[];
}

function CommissionAmount({ cents }: { cents: number }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 border border-green-100 text-green-700 text-xs font-black w-fit">
      + {formatCents(cents)}
    </span>
  );
}

export function CommissionsTable({ commissions }: CommissionsTableProps) {
  if (commissions.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-10 sm:p-14 text-center shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-6 h-6 text-slate-300" />
        </div>
        <h4 className="font-heading font-bold text-slate-900 text-sm sm:text-base mb-1">
          No commissions yet
        </h4>
        <p className="text-slate-400 text-xs sm:text-sm font-semibold max-w-xs mx-auto">
          Commissions are generated when accounts pay their invoices.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
          <DollarSign className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-heading font-black text-slate-900 text-base sm:text-lg leading-none">
            Commission History
          </h3>
          <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
            {commissions.length}{" "}
            {commissions.length === 1 ? "record" : "records"}
          </p>
        </div>
      </div>

      {/* Desktop column headers */}
      <div className="hidden sm:grid sm:grid-cols-[2fr_1.5fr_1fr] px-6 py-3 bg-slate-50/80 border-b border-slate-100 gap-4">
        {["Invoice", "Earned", "Status"].map((h) => (
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
            className="px-5 sm:px-6 py-4 sm:py-5 hover:bg-slate-50/60 transition-colors"
          >
            {/* Mobile */}
            <div className="sm:hidden space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {formatCents(c.invoiceAmountCents)}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                    {formatDate(c.createdAt)}
                  </p>
                </div>
                <CommissionBadge status={c.status} />
              </div>
              <CommissionAmount cents={c.commissionAmountCents} />
            </div>

            {/* Desktop */}
            <div className="hidden sm:grid sm:grid-cols-[2fr_1.5fr_1fr] items-center gap-4">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {formatCents(c.invoiceAmountCents)}
                </p>
                <p className="text-[11px] font-semibold text-slate-400 mt-0.5">
                  {formatDate(c.createdAt)}
                </p>
              </div>
              <CommissionAmount cents={c.commissionAmountCents} />
              <CommissionBadge status={c.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
