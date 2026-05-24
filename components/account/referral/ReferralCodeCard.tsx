"use client";

import { Link2 } from "lucide-react";
import { CopyButton } from "./CopyButton";
import { APP_URL } from "./config";

interface ReferralCodeCardProps {
  code: string;
}

export function ReferralCodeCard({ code }: ReferralCodeCardProps) {
  const referralLink = `${APP_URL}/auth/signup?ref=${code}`;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-4 py-3.5 border-b border-slate-100">
        <p className="font-bold text-slate-900 text-sm">Sales Credentials</p>
        <p className="text-xs text-slate-400 mt-0.5">
          Your unique tracking code and signup link
        </p>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Code */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
            Tracking Code
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 min-w-0">
              <span className="font-mono text-lg font-black text-slate-900 tracking-[0.15em] truncate">
                {code}
              </span>
            </div>
            <CopyButton value={code} label="Tracking code" />
          </div>
        </div>

        {/* Link */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
            Signup Link
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 min-w-0">
              <Link2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-xs font-medium text-slate-500 truncate">
                {referralLink}
              </span>
            </div>
            <CopyButton value={referralLink} label="Signup link" />
          </div>
        </div>
      </div>
    </div>
  );
}
