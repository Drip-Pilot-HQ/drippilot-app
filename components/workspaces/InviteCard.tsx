import { Briefcase } from "lucide-react";

interface InviteCardProps {
  id: string;
  name: string;
  invitedBy: string;
  date: string;
}

export function InviteCard({ id, name, invitedBy, date }: InviteCardProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all duration-300 shadow-sm gap-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-primary shrink-0">
          <Briefcase className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-heading text-base font-bold text-slate-900">
            {name}
          </h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
            Invited by <span className="text-slate-900">{invitedBy}</span> •{" "}
            {date}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
          Decline
        </button>
        <button className="flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
          Accept Invitation
        </button>
      </div>
    </div>
  );
}
