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
    return <ChevronsUpDown className="w-3 h-3 opacity-40" />;
  return sortOrder === "asc" ? (
    <ChevronUp className="w-3 h-3 text-primary" />
  ) : (
    <ChevronDown className="w-3 h-3 text-primary" />
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
          <thead className="bg-slate-50/90 shadow-sm">
            <tr>
              {SORTABLE_COLUMNS.map(({ label, field }) => (
                <th key={field} className="px-6 py-4 border-b border-slate-200">
                  <button
                    onClick={() => handleHeaderClick(field)}
                    className={cn(
                      "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-colors select-none",
                      sortBy === field
                        ? "text-primary"
                        : "text-slate-400 hover:text-slate-600",
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
