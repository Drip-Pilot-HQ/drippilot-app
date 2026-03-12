"use client";

import { X, UserPlus } from "lucide-react";

interface EnrollLeadsHeaderProps {
  onClose: () => void;
}

export function EnrollLeadsHeader({ onClose }: EnrollLeadsHeaderProps) {
  return (
    <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
          <UserPlus className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-base font-black text-slate-900">Add Leads</h3>
          <p className="text-xs text-slate-500 font-medium">
            Select leads to enroll in this campaign
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-slate-50 rounded-full transition-colors"
      >
        <X className="w-5 h-5 text-slate-400" />
      </button>
    </div>
  );
}
