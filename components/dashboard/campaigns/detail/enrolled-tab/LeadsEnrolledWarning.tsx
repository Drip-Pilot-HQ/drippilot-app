"use client";

import { AlertTriangle } from "lucide-react";

interface LeadsEnrolledWarningProps {
  isActive: boolean;
}

export function LeadsEnrolledWarning({ isActive }: LeadsEnrolledWarningProps) {
  if (isActive) return null;

  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-50/80 border border-amber-100">
      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
      <div>
        <p className="text-sm font-semibold text-amber-700 mb-0.5">
          Campaign not active
        </p>
        <p className="text-xs font-medium text-amber-600/80">
          Activate this campaign before enrolling or removing leads.
        </p>
      </div>
    </div>
  );
}
