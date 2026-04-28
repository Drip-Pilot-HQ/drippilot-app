"use client";

import {
  useAiCampaignsJobsQuery,
  useAiCampaignJobStatusQuery,
} from "@/store/server/ai-campaign.queries";
import {
  AiCampaignJobStatus,
  AiCampaignJobResponseDto,
} from "@/types/ai-campaign";
import { formatDistanceToNow } from "date-fns";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AiJobsSkeleton } from "./AiJobsSkeleton";

export function AiJobsHistory({
  activeJobId,
}: {
  activeJobId?: string | null;
}) {
  const queryClient = useQueryClient();
  const { data: jobs, isLoading } = useAiCampaignsJobsQuery(20);
  const { data: activeJob } = useAiCampaignJobStatusQuery(activeJobId || null);

  // If the active job completes, invalidate the main jobs list to refresh
  useEffect(() => {
    if (
      activeJob &&
      (activeJob.status === AiCampaignJobStatus.COMPLETED ||
        activeJob.status === AiCampaignJobStatus.FAILED)
    ) {
      queryClient.invalidateQueries({ queryKey: ["ai-campaign-jobs"] });
    }
  }, [activeJob, queryClient]);

  const displayJobs = useMemo(() => {
    const list: AiCampaignJobResponseDto[] = jobs ? [...jobs] : [];
    if (activeJob) {
      const idx = list.findIndex((j) => j.jobId === activeJob.jobId);
      if (idx !== -1) {
        list[idx] = activeJob;
      } else {
        list.unshift(activeJob);
      }
    }
    return list;
  }, [jobs, activeJob]);

  if (isLoading) return <AiJobsSkeleton />;

  if (displayJobs.length === 0) {
    return (
      <div className="w-full bg-white/60 backdrop-blur-xl border border-white/40 shadow-sm rounded-3xl p-12 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-orange-400" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">No jobs yet</h3>
        <p className="text-slate-500 font-medium">
          Generate your first campaign to see it appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-h-[600px] overflow-y-auto pr-2 space-y-4 animate-in slide-in-from-bottom-4 duration-500 pb-8 custom-scrollbar">
      {displayJobs.map((job) => (
        <JobCard key={job.jobId} job={job} />
      ))}
    </div>
  );
}

function JobCard({ job }: { job: AiCampaignJobResponseDto }) {
  const statusColors: Record<string, string> = {
    [AiCampaignJobStatus.PENDING]:
      "bg-amber-100 text-amber-700 border-amber-200",
    [AiCampaignJobStatus.PROCESSING]:
      "bg-indigo-100 text-indigo-700 border-indigo-200",
    [AiCampaignJobStatus.COMPLETED]:
      "bg-emerald-100 text-emerald-700 border-emerald-200",
    [AiCampaignJobStatus.FAILED]: "bg-red-100 text-red-700 border-red-200",
    [AiCampaignJobStatus.CANCELLED]:
      "bg-slate-100 text-slate-700 border-slate-200",
  };

  const statusIcons: Record<string, React.ElementType> = {
    [AiCampaignJobStatus.PENDING]: Clock,
    [AiCampaignJobStatus.PROCESSING]: Loader2,
    [AiCampaignJobStatus.COMPLETED]: CheckCircle2,
    [AiCampaignJobStatus.FAILED]: XCircle,
    [AiCampaignJobStatus.CANCELLED]: XCircle,
  };

  const StatusIcon = statusIcons[job.status] || Clock;
  const colorClass =
    statusColors[job.status] || "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-orange-100 transition-all">
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border",
            colorClass,
            job.status === AiCampaignJobStatus.PROCESSING && "animate-pulse",
          )}
        >
          <StatusIcon
            className={cn(
              "w-5 h-5",
              job.status === AiCampaignJobStatus.PROCESSING && "animate-spin",
            )}
          />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h4 className="font-bold text-slate-900 text-sm">Generation Job</h4>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {formatDistanceToNow(new Date(job.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          {job.status === AiCampaignJobStatus.COMPLETED && (
            <p className="text-sm font-medium text-slate-500">
              {job.result
                ? `Generated ${job.result.stepCount} steps and ${job.result.templatesCreated} templates.`
                : "Generation completed successfully."}
            </p>
          )}
          {job.status === AiCampaignJobStatus.FAILED && job.error && (
            <p className="text-sm font-medium text-red-500 line-clamp-1">
              Error: {job.error}
            </p>
          )}
          {(job.status === AiCampaignJobStatus.PENDING ||
            job.status === AiCampaignJobStatus.PROCESSING) && (
            <p className="text-sm font-medium text-slate-500">
              Magic in progress... this might take a minute.
            </p>
          )}
        </div>
      </div>

      {job.status === AiCampaignJobStatus.COMPLETED &&
        job.result?.campaignId && (
          <Link
            href={`/dashboard/campaigns/${job.result.campaignId}`}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-orange-400 hover:text-orange-500 rounded-xl text-sm font-bold transition-all border border-orange-200 hover:border-orange-300"
          >
            View Campaign
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
    </div>
  );
}
