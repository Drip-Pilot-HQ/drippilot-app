"use client";

import {
  Workflow,
  Settings,
  Bell,
  PlayCircle,
  Clock,
  Clapperboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TutorialSection {
  id: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  videoId: string; // Replace with your YouTube video ID
  duration?: string;
}

const SECTIONS: TutorialSection[] = [
  {
    id: "campaign",
    icon: Workflow,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    title: "Creating a Campaign",
    description:
      "Learn how to build and launch your first automated outreach campaign — from setting up sequences to enrolling your first leads.",
    videoId: "Fm3JTPxlkyM",
    duration: "5 min",
  },
  {
    id: "account",
    icon: Settings,
    iconColor: "text-cyan-600",
    iconBg: "bg-cyan-50",
    title: "Complete Account Setup Walkthrough",
    description:
      "Walk through workspace configuration, connecting your phone numbers, importing contacts, and getting your team ready to go.",
    videoId: "H7GBtVgMs2I",
    duration: "10 min",
  },
  {
    id: "notifications",
    icon: Bell,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    title: "Push Notifications for Messaging",
    description:
      "Configure push notification alerts for incoming messages so you never miss a reply from a lead.",
    videoId: "-xTZZuuDcxA",
    duration: "4 min",
  },
];

function VideoEmbed({ videoId, title }: { videoId: string; title: string }) {
  const isPlaceholder = videoId === "REPLACE_WITH_VIDEO_ID";

  if (isPlaceholder) {
    return (
      <div className="aspect-video w-full bg-slate-100 rounded-xl flex flex-col items-center justify-center gap-3 border border-dashed border-slate-300">
        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
          <PlayCircle className="w-6 h-6 text-slate-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-slate-500">Video coming soon</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Replace videoId in TutorialsClient.tsx
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}

function SectionCard({
  section,
  index,
}: {
  section: TutorialSection;
  index: number;
}) {
  const Icon = section.icon;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Section header */}
      <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center gap-4">
        <div
          className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
            section.iconBg,
          )}
        >
          <Icon className={cn("w-4 h-4", section.iconColor)} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Tutorial {index + 1}
            </span>
            {section.duration && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <Clock className="w-2.5 h-2.5" />
                {section.duration}
              </span>
            )}
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight mt-0.5">
            {section.title}
          </h2>
        </div>
      </div>

      {/* Video */}
      <div className="p-4 sm:p-6">
        <VideoEmbed videoId={section.videoId} title={section.title} />
        <p className="text-sm text-slate-500 font-medium mt-4 leading-relaxed">
          {section.description}
        </p>
      </div>
    </div>
  );
}

export function TutorialsClient() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Video Tutorials
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Step-by-step walkthroughs to get the most out of Drip Pilot
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
            <Clapperboard className="w-3 h-3 text-primary" />
            {SECTIONS.length} Videos
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
            <Clock className="w-3 h-3 text-cyan-500" />
            ~18 Min Total
          </span>
        </div>
      </div>

      {/* Tutorial cards */}
      <div className="space-y-6">
        {SECTIONS.map((section, i) => (
          <SectionCard key={section.id} section={section} index={i} />
        ))}
      </div>
    </div>
  );
}
