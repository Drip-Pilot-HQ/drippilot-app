import { Plus } from "lucide-react";
import { WorkspaceCard } from "@/components/workspaces/WorkspaceCard";
import { InviteCard } from "@/components/workspaces/InviteCard";
import { Button } from "@/components/branding/Button";
import { Badge } from "@/components/common/Badge";

const activeWorkspaces = [
  {
    id: "1",
    name: "Real Estate Team",
    role: "ADMIN" as const,
    members: 12,
    lastUpdated: "2h ago",
    gradientFrom: "#fb923c",
    gradientTo: "#f472b6",
  },
  {
    id: "2",
    name: "SaaS Growth",
    role: "EDITOR" as const,
    members: 5,
    lastUpdated: "1d ago",
    gradientFrom: "#22d3ee",
    gradientTo: "#fb923c",
  },
];

const pendingInvites = [
  {
    id: "3",
    name: "Agency Hub",
    invitedBy: "Marketing Pro",
    date: "3 days ago",
  },
];

export default function WorkspaceSelectionPage() {
  return (
    <div className="space-y-8 lg:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-3xl lg:text-4xl font-heading font-black text-slate-900 mb-2">
            Active Workspaces
          </h1>
          <p className="text-slate-500 font-semibold text-md lg:text-lg">
            Manage your project environments and teams.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          className="gap-2 shrink-0 mx-auto md:mx-0"
        >
          <Plus className="w-5 h-5" />
          <span>Create Workspace</span>
        </Button>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {activeWorkspaces.map((ws) => (
          <WorkspaceCard key={ws.id} {...ws} />
        ))}

        <button className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary/40 hover:bg-primary/5 transition-all p-8 group min-h-64 sm:min-h-72">
          <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
            <Plus className="w-6 h-6 lg:w-8 lg:h-8" />
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-600 group-hover:text-primary transition-colors">
              Add Workspace
            </p>
            <p className="text-[10px] lg:text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
              New Environment
            </p>
          </div>
        </button>
      </div>

      {/* Pending Invites Section */}
      {pendingInvites.length > 0 && (
        <div className="pt-8 border-t border-slate-200">
          <div className="flex items-center gap-3 mb-6 lg:mb-8">
            <h2 className="text-xl lg:text-2xl font-heading font-bold text-slate-900">
              Pending Invites
            </h2>
            <Badge
              variant="orange"
              className="h-6 min-w-6 flex items-center justify-center rounded-full"
            >
              {pendingInvites.length}
            </Badge>
          </div>

          <div className="space-y-4">
            {pendingInvites.map((invite) => (
              <InviteCard key={invite.id} {...invite} />
            ))}
          </div>
        </div>
      )}

      {/* Footer Support */}
      <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-100 mt-12 lg:mt-20 opacity-60">
        <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">
          Need help managing your workspaces?
        </p>
        <div className="flex items-center gap-6 text-slate-400 font-black text-[10px] uppercase tracking-widest">
          <a href="#" className="hover:text-primary transition-colors">
            Docs
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Support
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Changelog
          </a>
        </div>
      </div>
    </div>
  );
}
