import { Users } from "lucide-react";
import { formatDate } from "./config";
import { ReferralSignup } from "@/types/account";

interface ReferredUsersTableProps {
  signups: ReferralSignup[];
}

function UserAvatar({ name, email }: { name: string; email: string }) {
  const initial = (name || email)?.[0]?.toUpperCase() ?? "?";
  return (
    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-linear-to-br from-primary/20 to-pink-400/20 flex items-center justify-center shrink-0">
      <span className="text-xs sm:text-sm font-black text-primary">
        {initial}
      </span>
    </div>
  );
}

export function ReferredUsersTable({ signups }: ReferredUsersTableProps) {
  if (signups.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center shadow-sm">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
        </div>
        <h4 className="font-heading font-bold text-slate-900 text-sm sm:text-base">
          No accounts yet
        </h4>
        <p className="text-slate-500 text-xs sm:text-sm font-semibold mt-1">
          New signups using your tracking link will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center gap-2">
        <Users className="w-4 h-4 text-primary shrink-0" />
        <h3 className="font-heading font-black text-slate-900 text-base sm:text-lg">
          Managed Accounts
        </h3>
        <span className="ml-auto px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider shrink-0">
          {signups.length} total
        </span>
      </div>

      {/* Desktop column headers */}
      <div className="hidden sm:grid grid-cols-[1fr_auto] px-6 py-2.5 bg-slate-50 border-b border-slate-100">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Account
        </p>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Joined
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {signups.map((signup) => (
          <div
            key={signup.referredUserId}
            className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 hover:bg-slate-50/60 transition-colors gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <UserAvatar
                name={signup.referredName}
                email={signup.referredEmail}
              />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {signup.referredName || "—"}
                </p>
                <p className="text-[11px] sm:text-xs font-semibold text-slate-400 truncate">
                  {signup.referredEmail}
                </p>
              </div>
            </div>
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
              {formatDate(signup.createdAt)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
