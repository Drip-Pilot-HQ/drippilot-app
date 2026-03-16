"use client";

import { Search } from "lucide-react";

interface MembersFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function MembersFilter({
  searchQuery,
  onSearchChange,
}: MembersFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          placeholder="Find teammate by name or email..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
        />
      </div>
    </div>
  );
}
