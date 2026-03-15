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
            <tr className="border-b border-slate-100">
              <th className="px-5 py-3.5 w-12" />
              <th className="px-5 py-3.5" />
              <th className="px-5 py-3.5 hidden sm:table-cell" />
              <th className="px-5 py-3.5 hidden md:table-cell" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i}>
                <td className="px-5 py-4">
                  <div className="w-4 h-4 rounded bg-slate-100 animate-pulse" />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 animate-pulse shrink-0" />
                    <div className="space-y-2">
                      <div className="w-32 h-3.5 rounded bg-slate-100 animate-pulse" />
                      <div className="w-24 h-2.5 rounded bg-slate-100 animate-pulse" />
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 hidden sm:table-cell">
                  <div className="w-18 h-5 rounded-full bg-slate-100 animate-pulse" />
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
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-5">
          <Users className="w-7 h-7 text-slate-300" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1.5">
          {isSearching ? "No leads found" : "No leads enrolled"}
        </h3>
        <p className="text-sm text-slate-400 max-w-sm font-medium leading-relaxed">
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
          <tr className="border-b border-slate-100">
            <th className="px-5 py-3.5 text-left w-12">
              <IndeterminateCheckbox
                checked={allOnPageSelected}
                indeterminate={someSelected}
                onChange={onToggleSelectAll}
                className="rounded w-4 h-4 accent-primary cursor-pointer border-slate-200 transition-all"
              />
            </th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Lead
            </th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">
              Status
            </th>
            <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">
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
