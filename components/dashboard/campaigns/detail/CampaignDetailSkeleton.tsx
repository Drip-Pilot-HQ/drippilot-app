import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

function Pulse({ className }: { className?: string }) {
  return (
    <div className={cn("bg-slate-100 rounded animate-pulse", className)} />
  );
}

export function StepCardSkeleton() {
  return (
    <div className="relative rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden h-[120px]">
      {/* Accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-100" />

      <div className="pl-4">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <Pulse className="w-6 h-6 rounded-full" />
            <Pulse className="h-2 w-16" />
          </div>
          <div className="flex gap-1">
            <Pulse className="w-6 h-6 rounded-lg" />
            <Pulse className="w-6 h-6 rounded-lg" />
          </div>
        </div>

        {/* Body */}
        <div className="px-4 py-4 flex items-center gap-3">
          <Pulse className="w-9 h-9 rounded-xl shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <Pulse className="h-3.5 w-32" />
              <Pulse className="h-3 w-12" />
            </div>
            <div className="flex gap-3">
              <Pulse className="h-2.5 w-16" />
              <Pulse className="h-2.5 w-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StepConnectorSkeleton() {
  return (
    <div className="flex flex-col items-center py-0.5 select-none pointer-events-none opacity-40">
      <div className="w-px h-3 bg-slate-400" />
      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
      <div className="w-px h-3 bg-slate-400" />
    </div>
  );
}

export function CampaignHeaderSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1.5 opacity-30">
        <Pulse className="w-3 h-3" />
        <Pulse className="h-2 w-16" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <Pulse className="w-12 h-12 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-3 pt-1">
            <div className="flex items-center gap-2.5">
              <Pulse className="h-7 w-48" />
              <Pulse className="h-5 w-16 rounded-full" />
            </div>
            <Pulse className="h-4 w-full max-w-md" />
            <div className="flex gap-2">
              <Pulse className="h-5 w-14 rounded-md" />
              <Pulse className="h-5 w-14 rounded-md" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 pt-1">
          <Pulse className="w-20 h-9 rounded-xl" />
          <Pulse className="w-24 h-9 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function TabsSkeleton() {
  return (
    <div className="border-b border-slate-200">
      <div className="flex gap-6 px-4">
        <div className="py-3.5 border-b-2 border-primary">
          <div className="flex items-center gap-2">
            <Pulse className="w-3.5 h-3.5 rounded" />
            <Pulse className="h-4 w-16" />
          </div>
        </div>
        <div className="py-3.5 border-b-2 border-transparent">
          <div className="flex items-center gap-2">
            <Pulse className="w-3.5 h-3.5 rounded" />
            <Pulse className="h-4 w-24" />
          </div>
        </div>
        <div className="py-3.5 border-b-2 border-transparent">
          <div className="flex items-center gap-2">
            <Pulse className="w-3.5 h-3.5 rounded" />
            <Pulse className="h-4 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CampaignDetailSkeleton() {
  return (
    <div className="animate-in fade-in duration-500 mx-auto">
      <div className="pb-6">
        <CampaignHeaderSkeleton />
      </div>

      <TabsSkeleton />

      <div className="pt-8 max-w-2xl mx-auto">
        <div className="space-y-0">
          {[1, 2, 3].map((i, idx) => (
            <div key={i}>
              <StepCardSkeleton />
              {idx < 2 && <StepConnectorSkeleton />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
