"use client";

import { ShieldOff } from "lucide-react";
import { useRouter } from "next/navigation";

export function AccessRestricted() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-sm mx-auto px-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
          <ShieldOff className="w-7 h-7 text-slate-400" />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">
          Access Restricted
        </h2>
        <p className="text-slate-500 text-sm font-medium mb-6">
          This page is only available to workspace owners and admins.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-all"
        >
          Back to Overview
        </button>
      </div>
    </div>
  );
}
