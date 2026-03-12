"use client";

import { CheckSquare, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/branding/Button";

interface EnrollLeadsFooterProps {
  selectedIdsCount: number;
  isMutating: boolean;
  onEnrollSelected: () => void;
  onEnrollAll: () => void;
}

export function EnrollLeadsFooter({
  selectedIdsCount,
  isMutating,
  onEnrollSelected,
  onEnrollAll,
}: EnrollLeadsFooterProps) {
  return (
    <div className="px-6 py-4 border-t border-slate-100 space-y-3 shrink-0">
      <Button
        disabled={selectedIdsCount === 0 || isMutating}
        onClick={onEnrollSelected}
        className="w-full rounded-xl h-11"
      >
        {isMutating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <CheckSquare className="w-4 h-4 mr-2" />
            Enroll Selected ({selectedIdsCount})
          </>
        )}
      </Button>
      <Button
        variant="outline"
        disabled={isMutating}
        onClick={onEnrollAll}
        className="w-full rounded-xl h-11"
      >
        {isMutating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Users className="w-4 h-4 mr-2" />
            Enroll All Workspace Leads
          </>
        )}
      </Button>
    </div>
  );
}
