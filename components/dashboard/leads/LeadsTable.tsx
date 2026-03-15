"use client";

import { Lead } from "@/types/lead";
import { LeadRow } from "./LeadRow";

interface LeadsTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
}

export function LeadsTable({ leads, onEdit }: LeadsTableProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-0 max-h-[calc(100vh-300px)]">
      <div className="overflow-x-auto overflow-y-auto custom-scrollbar flex-1">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur-sm shadow-sm">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                Name
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                Contact
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                Status
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                Tags
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right border-b border-slate-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leads.map((lead) => (
              <LeadRow key={lead.id} lead={lead} onEdit={onEdit} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
