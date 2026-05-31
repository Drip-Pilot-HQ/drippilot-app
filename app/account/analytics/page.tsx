"use client";

import { WorkspaceAnalyticsClient } from "@/components/account/analytics/WorkspaceAnalyticsClient";

export default function WorkspaceAnalyticsPage() {
  return (
    <div className="space-y-8 lg:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center md:text-left">
        <h1 className="text-3xl lg:text-4xl font-heading font-black text-slate-900 mb-2">
          Analytics
        </h1>
        <p className="text-slate-500 font-semibold text-md lg:text-lg">
          Performance overview across all your workspaces.
        </p>
      </div>

      <WorkspaceAnalyticsClient />
    </div>
  );
}
