"use client";

import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { Lead } from "@/types/lead";
import { LeadRow } from "./LeadRow";
import { LeadSortField, LeadSortOrder } from "./LeadsSort";
import { cn } from "@/lib/utils";

interface LeadsTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  sortBy: LeadSortField | null;
  sortOrder: LeadSortOrder;
  onSortChange: (field: LeadSortField, order: LeadSortOrder) => void;
}

const SORTABLE_COLUMNS: { label: string; field: LeadSortField }[] = [
  { label: "Name", field: "name" },
  { label: "Contact", field: "email" },
  { label: "Status", field: "status" },
  { label: "Tags", field: "tags" },
];

function SortIcon({
  field,
  sortBy,
  sortOrder,
}: {
  field: LeadSortField;
  sortBy: LeadSortField | null;
  sortOrder: LeadSortOrder;
}) {
  if (sortBy !== field)
    return (
      <ChevronsUpDown className="w-4 h-4 text-slate-600 group-hover:text-slate-900 transition-colors" />
    );
  return sortOrder === "asc" ? (
    <ChevronUp className="w-4 h-4" />
  ) : (
    <ChevronDown className="w-4 h-4" />
  );
}

export function LeadsTable({
  leads,
  onEdit,
  sortBy,
  sortOrder,
  onSortChange,
}: LeadsTableProps) {
  const handleHeaderClick = (field: LeadSortField) => {
    if (sortBy === field) {
      onSortChange(field, sortOrder === "asc" ? "desc" : "asc");
    } else {
      onSortChange(field, "asc");
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {SORTABLE_COLUMNS.map(({ label, field }) => (
                <th key={field} className="px-6 py-4">
                  <button
                    onClick={() => handleHeaderClick(field)}
                    className={cn(
                      "group flex items-center gap-1.5 text-xs font-black uppercase tracking-wider transition-all select-none rounded-lg px-2.5 py-1.5",
                      sortBy === field
                        ? "bg-primary/10 text-primary"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100",
                    )}
                  >
                    {label}
                    <SortIcon
                      field={field}
                      sortBy={sortBy}
                      sortOrder={sortOrder}
                    />
                  </button>
                </th>
              ))}
              <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <LeadRow key={lead.id} lead={lead} onEdit={onEdit} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
