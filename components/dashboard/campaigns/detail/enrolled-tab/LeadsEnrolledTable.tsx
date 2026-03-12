"use client";

import { Users } from "lucide-react";
import { EnrolledLead } from "@/types/campaign";
import { IndeterminateCheckbox } from "../common/IndeterminateCheckbox";
import { LeadsEnrolledRow } from "./LeadsEnrolledRow";

interface LeadsEnrolledTableProps {
  isLoading: boolean;
  leads: EnrolledLead[];
  selectedIds: Set<string>;
  allOnPageSelected: boolean;
  someSelected: boolean;
  onToggleSelect: (leadId: string) => void;
  onToggleSelectAll: () => void;
  isSearching: boolean;
}

export function LeadsEnrolledTable({
  isLoading,
  leads,
  selectedIds,
  allOnPageSelected,
  someSelected,
  onToggleSelect,
  onToggleSelectAll,
  isSearching,
}: LeadsEnrolledTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-4 py-3 w-10" />
                <th className="px-4 py-3" />
                <th className="px-4 py-3 hidden sm:table-cell" />
                <th className="px-4 py-3 hidden md:table-cell" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td className="px-4 py-3">
                    <div className="w-4 h-4 rounded bg-slate-100 animate-pulse" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse shrink-0" />
                      <div className="space-y-1.5">
                        <div className="w-28 h-3 rounded bg-slate-100 animate-pulse" />
                        <div className="w-36 h-2.5 rounded bg-slate-100 animate-pulse" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="w-16 h-5 rounded-lg bg-slate-100 animate-pulse" />
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="w-24 h-3 rounded bg-slate-100 animate-pulse" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-dashed border-slate-200 rounded-2xl">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
          <Users className="w-6 h-6 text-slate-300" />
        </div>
        <h3 className="text-sm font-black text-slate-900 mb-1">
          {isSearching ? "No leads found" : "No leads enrolled"}
        </h3>
        <p className="text-xs text-slate-400 font-medium max-w-[240px] leading-relaxed">
          {isSearching
            ? "Try a different search term."
            : "Add leads to start running them through your campaign sequence."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-4 py-3 text-left w-10">
                <IndeterminateCheckbox
                  checked={allOnPageSelected}
                  indeterminate={someSelected}
                  onChange={onToggleSelectAll}
                  className="rounded w-4 h-4 accent-primary cursor-pointer"
                />
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Lead
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:table-cell">
                Status
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">
                Enrolled At
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leads.map((lead) => (
              <LeadsEnrolledRow
                key={lead.id}
                lead={lead}
                isSelected={selectedIds.has(lead.leadId)}
                onToggle={() => onToggleSelect(lead.leadId)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
