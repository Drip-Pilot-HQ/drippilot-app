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
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/20">
              <th className="px-5 py-4 w-12" />
              <th className="px-5 py-4" />
              <th className="px-5 py-4 hidden sm:table-cell" />
              <th className="px-5 py-4 hidden md:table-cell" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i}>
                <td className="px-5 py-4">
                  <div className="w-5 h-5 rounded-lg bg-slate-100 animate-pulse" />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 animate-pulse shrink-0" />
                    <div className="space-y-2">
                      <div className="w-32 h-3.5 rounded bg-slate-100 animate-pulse" />
                      <div className="w-24 h-2.5 rounded bg-slate-100 animate-pulse" />
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 hidden sm:table-cell">
                  <div className="w-20 h-6 rounded-full bg-slate-100 animate-pulse" />
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <div className="w-24 h-4 rounded bg-slate-100 animate-pulse ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-20 h-20 rounded-[30px] bg-slate-50 flex items-center justify-center mb-6">
          <Users className="w-10 h-10 text-slate-200" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">
          {isSearching ? "No leads found" : "No leads enrolled"}
        </h3>
        <p className="text-slate-500 max-w-sm font-medium leading-relaxed">
          {isSearching
            ? "Try a different search term or check your filters."
            : "Add leads to start running them through your campaign sequence."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/20">
            <th className="px-5 py-4 text-left w-12">
              <IndeterminateCheckbox
                checked={allOnPageSelected}
                indeterminate={someSelected}
                onChange={onToggleSelectAll}
                className="rounded-lg w-5 h-5 accent-primary cursor-pointer border-slate-200 transition-all"
              />
            </th>
            <th className="px-5 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Lead
            </th>
            <th className="px-5 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest hidden sm:table-cell">
              Status
            </th>
            <th className="px-5 py-4 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">
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
  );
}
