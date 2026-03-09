import { ArrowRight, Users, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/common/Badge";

interface WorkspaceCardProps {
  id: string;
  name: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
  members: number;
  lastUpdated: string;
  gradientFrom: string;
  gradientTo: string;
}

export function WorkspaceCard({
  id,
  name,
  role,
  members,
  lastUpdated,
  gradientFrom,
  gradientTo,
}: WorkspaceCardProps) {
  return (
    <Link
      href={`/workspace/${id}/dashboard`}
      className="group block overflow-hidden rounded-2xl bg-white border border-slate-200 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 active:scale-[0.98]"
    >
      {/* Visual Header */}
      <div
        className="h-32 w-full relative overflow-hidden"
        style={{
          background: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`,
        }}
      >
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--tw-gradient-from)_0%,transparent_70%)]" />

        {/* Role Badge */}
        <div className="absolute bottom-4 left-4">
          <Badge
            variant="outline"
            className="bg-black/40 backdrop-blur-md text-white border-white/20"
          >
            {role}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-primary transition-colors truncate pr-2">
            {name}
          </h3>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
        </div>

        <div className="flex items-center gap-3 text-slate-500 font-semibold text-[10px] uppercase tracking-wider">
          <div className="flex items-center gap-1.5 shrink-0">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{members} members</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-200 shrink-0" />
          <div className="flex items-center gap-1.5 truncate">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Updated {lastUpdated}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
