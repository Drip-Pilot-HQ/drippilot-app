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
            className="px-5 py-5 flex items-center gap-6 animate-pulse"
          >
            <div className="w-32 h-4 bg-slate-100 rounded" />
            <div className="w-48 h-4 bg-slate-100 rounded-xl" />
            <div className="w-24 h-4 bg-slate-100 rounded-md" />
            <div className="flex-1 h-4 bg-slate-100 rounded" />
            <div className="w-24 h-4 bg-slate-100 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-20 h-20 rounded-[30px] bg-slate-50 flex items-center justify-center mb-6">
          <Inbox className="w-10 h-10 text-slate-200" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">
          No history found
        </h3>
        <p className="text-slate-500 max-w-sm font-medium">
          There are no execution logs for this campaign yet. Start enrolling
          leads to see the activity.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-50 transition-all duration-500">
      {logs.map((log) => (
        <ExecutionLogRow key={log.id} log={log} />
      ))}
    </div>
  );
}
