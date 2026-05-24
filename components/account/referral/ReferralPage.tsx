"use client";

import { toast } from "sonner";
import {
  useReferralCodeQuery,
  useEnrollReferralMutation,
  useReferralSignupsQuery,
  useReferralCommissionsQuery,
  useCommissionSummaryQuery,
} from "@/store/server/referral.queries";
import { EnrollCard } from "./EnrollCard";
import { ReferralCodeCard } from "./ReferralCodeCard";
import {
  ReferralStatsGrid,
  ReferralStatsGridSkeleton,
} from "./ReferralStatsGrid";
import { ReferredUsersTable } from "./ReferredUsersTable";
import { Briefcase } from "lucide-react";

function PageSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-28 bg-slate-100 rounded-2xl" />
      <ReferralStatsGridSkeleton />
      <div className="h-32 bg-slate-100 rounded-3xl" />
    </div>
  );
}

function HowItWorksBox() {
  return (
    <div className="bg-orange-50/50 border border-orange-200 rounded-3xl p-5 sm:p-6 lg:p-8 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5">
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white border border-orange-200 flex items-center justify-center text-primary shrink-0 shadow-sm">
        <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <div>
        <h4 className="font-heading text-base sm:text-lg font-bold text-slate-900 mb-1">
          How commissions work
        </h4>
        <p className="text-slate-600 text-xs sm:text-[13px] font-semibold leading-relaxed">
          Earn recurring commissions on active accounts you bring to Drip Pilot.
          Commissions are tracked automatically and paid out monthly.
        </p>
      </div>
    </div>
  );
}

export function ReferralPage() {
  const {
    data: referralCode,
    isLoading: codeLoading,
    isError: notEnrolled,
  } = useReferralCodeQuery();
  const isEnrolled = !!referralCode && !notEnrolled;

  const enrollMutation = useEnrollReferralMutation();
  const { data: signups = [], isLoading: signupsLoading } =
    useReferralSignupsQuery(isEnrolled);
  const { data: commissions = [], isLoading: commissionsLoading } =
    useReferralCommissionsQuery(isEnrolled);
  const { data: summary, isLoading: summaryLoading } =
    useCommissionSummaryQuery(isEnrolled);

  const dataLoading =
    isEnrolled && (signupsLoading || commissionsLoading || summaryLoading);

  const handleEnroll = () => {
    enrollMutation.mutate(undefined, {
      onError: (err: Error) => {
        toast.error(err.message || "Failed to activate sales account.");
      },
    });
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
          Sales Dashboard
        </h1>
        <p className="text-slate-500 font-medium">
          Track your accounts, pipeline activity, and commission earnings.
        </p>
      </div>

      {codeLoading && <PageSkeleton />}

      {!codeLoading && !isEnrolled && (
        <EnrollCard
          onEnroll={handleEnroll}
          isLoading={enrollMutation.isPending}
        />
      )}

      {!codeLoading && isEnrolled && referralCode && (
        <>
          <ReferralCodeCard code={referralCode.code} />

          {dataLoading ? (
            <ReferralStatsGridSkeleton />
          ) : (
            <ReferralStatsGrid signups={signups} summary={summary} />
          )}

          {!dataLoading && (
            <div className="space-y-5 sm:space-y-6">
              <ReferredUsersTable signups={signups} commissions={commissions} />
              <HowItWorksBox />
            </div>
          )}
        </>
      )}
    </div>
  );
}
