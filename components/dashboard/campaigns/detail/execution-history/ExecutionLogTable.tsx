"use client";

import { Inbox } from "lucide-react";
import { ExecutionLog } from "@/types/campaign";
import { ExecutionLogRow } from "./ExecutionLogRow";

interface ExecutionLogTableProps {
  logs: ExecutionLog[];
  isLoading: boolean;
}

export function ExecutionLogTable({ logs, isLoading }: ExecutionLogTableProps) {
  if (isLoading) {
    return (
      <div className="divide-y divide-slate-100">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="px-5 py-4 flex items-center gap-5 animate-pulse"
          >
            <div className="w-28 h-3.5 bg-slate-100 rounded" />
            <div className="w-40 h-3.5 bg-slate-100 rounded" />
            <div className="w-20 h-3.5 bg-slate-100 rounded" />
            <div className="flex-1 h-3.5 bg-slate-100 rounded" />
            <div className="w-20 h-5 bg-slate-100 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-5">
          <Inbox className="w-7 h-7 text-slate-300" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-1.5">
          No history found
        </h3>
        <p className="text-sm text-slate-400 max-w-sm font-medium leading-relaxed">
          There are no execution logs for this campaign yet. Start enrolling
          leads to see the activity.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-50">
      {logs.map((log) => (
        <ExecutionLogRow key={log.id} log={log} />
      ))}
    </div>
  );
}
