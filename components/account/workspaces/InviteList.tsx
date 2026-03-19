import { useWorkspaceInvitesQuery } from "@/store/server/account.queries";
import { InviteCard } from "./InviteCard";

export function InviteList() {
  const { data: invites, isLoading, isError } = useWorkspaceInvitesQuery();

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 mt-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 animate-pulse gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0" />
              <div className="flex flex-col gap-2">
                <div className="h-5 w-40 bg-slate-100 rounded-md" />
                <div className="h-3 w-32 bg-slate-100 rounded-md" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-24 bg-slate-50 rounded-xl" />
              <div className="h-10 w-32 bg-slate-100 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) return null;
  if (!invites || invites.length === 0) return null;

  return (
    <div className="space-y-4 p-4 mt-6">
      <div className="px-1 flex items-center justify-between">
        <h2 className="text-orange-950 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
          Pending Invitations ({invites.length})
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {invites.map((invite) => (
          <InviteCard key={invite.id} invite={invite} />
        ))}
      </div>
    </div>
  );
}
