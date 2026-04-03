"use client";

import { useState } from "react";
import { AlertCircle, Users, Clock, Workflow } from "lucide-react";
import { TemplateChannel } from "@/types/template";
import {
  useCampaignQuery,
  useCampaignStepsQuery,
  useEnrolledLeadsQuery,
  useExecutionLogsQuery,
} from "@/store/server/campaign.queries";
import { CampaignDetailHeader } from "./CampaignDetailHeader";
import { StepList } from "./steps/StepList";
import { LeadsEnrolledTab } from "./LeadsEnrolledTab";
import { ExecutionHistoryTab } from "./ExecutionHistoryTab";
import { cn } from "@/lib/utils";
import { CampaignDetailSkeleton } from "./CampaignDetailSkeleton";

type Tab = "workflow" | "leads" | "history";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: "workflow",
    label: "Workflow",
    icon: <Workflow className="w-4 h-4" />,
  },
  {
    id: "leads",
    label: "Leads Enrolled",
    icon: <Users className="w-4 h-4" />,
  },
  {
    id: "history",
    label: "Execution History",
    icon: <Clock className="w-4 h-4" />,
  },
];

interface CampaignDetailClientProps {
  campaignId: string;
}

function getAllowedChannels(
  emailBased: boolean,
  smsBased: boolean,
): TemplateChannel[] {
  const channels: TemplateChannel[] = [];
  if (emailBased) channels.push(TemplateChannel.EMAIL);
  if (smsBased) channels.push(TemplateChannel.SMS);
  return channels;
}

export function CampaignDetailClient({
  campaignId,
}: CampaignDetailClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>("workflow");

  const {
    data: campaign,
    isLoading: isCampaignLoading,
    isError: isCampaignError,
  } = useCampaignQuery(campaignId);

  const { data: steps = [], isLoading: isStepsLoading } =
    useCampaignStepsQuery(campaignId);

  const { data: enrolledLeadsResponse } = useEnrolledLeadsQuery(campaignId, {
    page: 1,
    limit: 500,
    search: undefined,
  });

  const { data: executionLogsResponse } = useExecutionLogsQuery(campaignId, {
    page: 1,
    limit: 100,
  });

  if (isCampaignLoading) {
    return <CampaignDetailSkeleton />;
  }

  if (isCampaignError || !campaign) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-5">
          <AlertCircle className="w-8 h-8 text-rose-400" />
        </div>
        <h2 className="text-lg font-black text-slate-900 mb-1">
          Campaign not found
        </h2>
        <p className="text-sm text-slate-500 font-medium max-w-sm">
          This campaign may have been deleted or you don&apos;t have access to
          it.
        </p>
      </div>
    );
  }

  const allowedChannels = getAllowedChannels(
    campaign.emailBased,
    campaign.smsBased,
  );

  return (
    <div className="animate-in fade-in duration-500 mx-auto">
      <div className="pb-6">
        <CampaignDetailHeader campaign={campaign} stepsCount={steps.length} />
      </div>

      <div className="border-b border-slate-200">
        <nav className="-mb-px flex gap-0 overflow-x-auto custom-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-3.5 text-sm font-bold whitespace-nowrap border-b-2 transition-all",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300",
              )}
            >
              <span
                className={cn(
                  activeTab === tab.id ? "text-primary" : "text-slate-400",
                )}
              >
                {tab.icon}
              </span>
              {tab.label}
              {tab.id === "workflow" && steps.length > 0 && (
                <span
                  className={cn(
                    "inline-flex items-center justify-center min-w-[20px] px-1 h-5 rounded-full text-[10px] font-black",
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "bg-slate-100 text-slate-500",
                  )}
                >
                  {steps.length}
                </span>
              )}
              {tab.id === "leads" &&
                enrolledLeadsResponse?.pagination?.total !== undefined &&
                enrolledLeadsResponse.pagination.total > 0 && (
                  <span
                    className={cn(
                      "inline-flex items-center justify-center min-w-[20px] px-1 h-5 rounded-full text-[10px] font-black",
                      activeTab === tab.id
                        ? "bg-primary/10 text-primary"
                        : "bg-slate-100 text-slate-500",
                    )}
                  >
                    {enrolledLeadsResponse.pagination.total}
                  </span>
                )}
              {tab.id === "history" &&
                executionLogsResponse?.pagination?.total !== undefined &&
                executionLogsResponse.pagination.total > 0 && (
                  <span
                    className={cn(
                      "inline-flex items-center justify-center min-w-[20px] px-1 h-5 rounded-full text-[10px] font-black",
                      activeTab === tab.id
                        ? "bg-primary/10 text-primary"
                        : "bg-slate-100 text-slate-500",
                    )}
                  >
                    {executionLogsResponse.pagination.total}
                  </span>
                )}
            </button>
          ))}
        </nav>
      </div>

      <div className="pt-8">
        {activeTab === "workflow" && (
          <div className="max-w-2xl mx-auto">
            <StepList
              steps={steps}
              campaign={campaign}
              isLoading={isStepsLoading}
              allowedChannels={allowedChannels}
            />
          </div>
        )}
        {activeTab === "leads" && <LeadsEnrolledTab campaign={campaign} />}
        {activeTab === "history" && (
          <ExecutionHistoryTab campaignId={campaignId} />
        )}
      </div>
    </div>
  );
}
