"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { useExecutionLogsQuery } from "@/store/server/campaign.queries";
import { ExecutionLogTable } from "./execution-history/ExecutionLogTable";
import { ExecutionLogPagination } from "./execution-history/ExecutionLogPagination";
import { ExecutionLogStats } from "./execution-history/ExecutionLogStats";

interface ExecutionHistoryTabProps {
  campaignId: string;
}

export function ExecutionHistoryTab({ campaignId }: ExecutionHistoryTabProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);

  const { data, isLoading } = useExecutionLogsQuery(campaignId, {
    page,
    limit,
  });

  return (
    <div className="w-full max-w-[1200px] mx-auto animate-in fade-in duration-500">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Header Section */}
        <div className="px-5 py-4 md:px-6 md:py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <h1 className="text-lg font-semibold text-slate-800">
                Execution History
              </h1>
            </div>
            <p className="text-sm text-slate-400 font-medium">
              Real-time audit trail of all campaign outreach activities.
            </p>
          </div>

          <ExecutionLogStats total={data?.pagination.total || 0} />
        </div>

        {/* Content Section */}
        <div className="flex-1 min-h-[400px]">
          <ExecutionLogTable logs={data?.data || []} isLoading={isLoading} />
        </div>

        {/* Pagination Section */}
        {data && data.pagination.totalPages > 0 && (
          <ExecutionLogPagination
            currentPage={page}
            totalPages={data.pagination.totalPages}
            totalResults={data.pagination.total}
            showingResults={data.data.length}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(l) => {
              setLimit(l);
              setPage(1);
            }}
            hasPrev={page > 1}
            hasNext={page < data.pagination.totalPages}
          />
        )}
      </div>
    </div>
  );
}
