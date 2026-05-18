"use client";

import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { Lead } from "@/types/lead";
import { LeadRow } from "./LeadRow";
import { LeadSortField, LeadSortOrder } from "./LeadsSort";
import { useWorkspaceRole } from "@/lib/hooks/use-workspace-role";
import { cn } from "@/lib/utils";

interface LeadsTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  sortBy: LeadSortField | null;
  sortOrder: LeadSortOrder;
  onSortChange: (field: LeadSortField, order: LeadSortOrder) => void;
  selectedLeadIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleAll: (ids: string[]) => void;
  memberMap?: Map<string, string>;
}

const BASE_COLUMNS: { label: string; field: LeadSortField }[] = [
  { label: "Name", field: "name" },
  { label: "Contact", field: "email" },
  { label: "Status", field: "status" },
  { label: "Tags", field: "tags" },
  { label: "Campaigns", field: "campaigns" },
  { label: "Address", field: "address" },
  { label: "Added On", field: "createdAt" },
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
      <ChevronsUpDown className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-900 transition-colors" />
    );
  return sortOrder === "asc" ? (
    <ChevronUp className="w-3.5 h-3.5" />
  ) : (
    <ChevronDown className="w-3.5 h-3.5" />
  );
}

export function LeadsTable({
  leads,
  onEdit,
  sortBy,
  sortOrder,
  onSortChange,
  selectedLeadIds,
  onToggleSelect,
  onToggleAll,
  memberMap,
}: LeadsTableProps) {
  const { isOwnerOrAdmin } = useWorkspaceRole();
  const handleHeaderClick = (field: LeadSortField) => {
    onSortChange(
      field,
      sortBy === field && sortOrder === "asc"
        ? "desc"
        : sortBy === field
          ? "asc"
          : "asc",
    );
  };

  const allIds = leads.map((l) => l.id);
  const allSelected =
    allIds.length > 0 && allIds.every((id) => selectedLeadIds.has(id));
  const someSelected =
    allIds.some((id) => selectedLeadIds.has(id)) && !allSelected;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left min-w-[1200px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {isOwnerOrAdmin && (
                <th className="pl-3 pr-2 py-3 w-9">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={() => onToggleAll(allIds)}
                    className="w-4 h-4 rounded border-slate-300 text-primary accent-primary cursor-pointer"
                  />
                </th>
              )}
              {BASE_COLUMNS.slice(0, -1).map(({ label, field }) => (
                <th key={field} className="px-1 py-2">
                  <button
                    onClick={() => handleHeaderClick(field)}
                    className={cn(
                      "group flex items-center gap-1 text-[11px] font-black uppercase tracking-wider transition-all select-none rounded-lg px-2 py-1.5",
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
              {isOwnerOrAdmin && (
                <th className="px-2 py-2">
                  <span className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-slate-500 px-2 py-1.5">
                    Assigned To
                  </span>
                </th>
              )}
              {BASE_COLUMNS.slice(-1).map(({ label, field }) => (
                <th key={field} className="px-1 py-2">
                  <button
                    onClick={() => handleHeaderClick(field)}
                    className={cn(
                      "group flex items-center gap-1 text-[11px] font-black uppercase tracking-wider transition-all select-none rounded-lg px-2 py-1.5",
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
              <th className="px-3 py-3 text-[11px] font-black text-slate-500 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <LeadRow
                key={lead.id}
                lead={lead}
                onEdit={onEdit}
                isSelected={selectedLeadIds.has(lead.id)}
                onToggleSelect={onToggleSelect}
                isOwnerOrAdmin={isOwnerOrAdmin}
                memberMap={memberMap}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
