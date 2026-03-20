"use client";

import { Share2, Link2 } from "lucide-react";
import { CopyButton } from "./CopyButton";
import { APP_URL } from "./config";

interface ReferralCodeCardProps {
  code: string;
}

export function ReferralCodeCard({ code }: ReferralCodeCardProps) {
  const referralLink = `${APP_URL}/auth/signup?ref=${code}`;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-1">
          <Share2 className="w-4 h-4 text-primary shrink-0" />
          <h3 className="font-heading font-black text-slate-900 text-base sm:text-lg">
            Your Referral Details
          </h3>
        </div>
        <p className="text-xs sm:text-sm font-semibold text-slate-500">
          Share your code or link — new users can enter it at signup.
        </p>
      </div>

      <div className="p-5 sm:p-6 space-y-4 sm:space-y-5">
        {/* Code */}
        <div className="space-y-2">
          <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400">
            Referral Code
          </p>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 min-w-0">
              <span className="font-mono text-lg sm:text-xl font-black text-slate-900 tracking-[0.15em] sm:tracking-[0.2em] truncate">
                {code}
              </span>
            </div>
            <CopyButton value={code} label="Referral code" />
          </div>
        </div>

        {/* Link */}
        <div className="space-y-2">
          <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400">
            Referral Link
          </p>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 sm:px-4 py-3 min-w-0">
              <Link2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-slate-500 truncate">
                {referralLink}
              </span>
            </div>
            <CopyButton value={referralLink} label="Referral link" />
          </div>
        </div>
      </div>
    </div>
  );
}
