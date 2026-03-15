"use client";

import { useState } from "react";
import { Search, Loader2, Workflow } from "lucide-react";
import { Campaign, EnrollmentScope, CampaignStatus } from "@/types/campaign";
import {
  useCampaignsQuery,
  useEnrollLeadsMutation,
} from "@/store/server/campaign.queries";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/common/DropdownMenu";

interface EnrollLeadSubmenuProps {
  leadId: string;
}

export function EnrollLeadSubmenu({ leadId }: EnrollLeadSubmenuProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const { data: campaigns, isLoading } = useCampaignsQuery({
    search: debouncedSearch || undefined,
    status: [CampaignStatus.ACTIVE],
  });

  const enrollMutation = useEnrollLeadsMutation();

  const handleEnroll = async (campaign: Campaign) => {
    try {
      await enrollMutation.mutateAsync({
        campaignId: campaign.id,
        dto: {
          leadIds: [leadId],
          scope: EnrollmentScope.SELECTION,
        },
      });

      toast.success(`Lead successfully enrolled in ${campaign.name}`);
    } catch (error) {
      console.error("Enrollment failed:", error);
      toast.error("Failed to enroll lead in campaign");
    }
  };

  const enrollingId = enrollMutation.isPending
    ? enrollMutation.variables?.campaignId
    : null;

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Workflow className="w-4 h-4" />
        Add to Campaign
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="w-64 p-0 overflow-hidden">
        <div className="p-2 border-b border-slate-100 bg-slate-50/50">
          <div className="relative group">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              autoFocus
              type="text"
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-medium"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-5 h-5 animate-spin text-slate-300" />
            </div>
          ) : campaigns && campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <button
                key={campaign.id}
                disabled={enrollingId === campaign.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEnroll(campaign);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left transition-colors",
                  enrollingId === campaign.id
                    ? "bg-slate-50 opacity-70"
                    : "hover:bg-primary/5 group",
                )}
              >
                <div
                  className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-colors",
                    enrollingId === campaign.id
                      ? "bg-slate-100 border-slate-200"
                      : "bg-white border-slate-200 group-hover:border-primary/20 group-hover:bg-primary/5",
                  )}
                >
                  {enrollingId === campaign.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                  ) : (
                    <Workflow className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary" />
                  )}
                </div>
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-xs font-bold truncate",
                      enrollingId === campaign.id
                        ? "text-slate-400"
                        : "text-slate-700 group-hover:text-primary",
                    )}
                  >
                    {campaign.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium truncate">
                    {campaign.emailBased ? "Email" : ""}
                    {campaign.emailBased && campaign.smsBased ? " & " : ""}
                    {campaign.smsBased ? "SMS" : ""}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="py-8 px-4 text-center">
              <p className="text-[11px] font-bold text-slate-400">
                No active campaigns found
              </p>
            </div>
          )}
        </div>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
