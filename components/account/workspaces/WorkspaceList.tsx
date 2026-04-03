import { useWorkspacesQuery } from "@/store/server/account.queries";
import { WorkspaceCard } from "./WorkspaceCard";

export function WorkspaceList() {
  const { data: workspaces, isLoading, isError } = useWorkspacesQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0" />
              <div className="flex flex-col gap-2">
                <div className="h-4 w-32 bg-slate-100 rounded-md" />
                <div className="h-3 w-16 bg-slate-100 rounded-md" />
              </div>
            </div>
            <div className="w-5 h-5 rounded-full bg-slate-50 mr-1" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 rounded-2xl bg-red-50 text-red-600 text-center border border-red-100">
        Failed to load workspaces. Please try again later.
      </div>
    );
  }

  if (!workspaces || workspaces.length === 0) {
    return (
      <div className="p-12 rounded-2xl bg-slate-50 text-slate-500 text-center border border-slate-100 italic">
        No workspaces found. Create one to get started!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {workspaces.map((workspace) => (
        <WorkspaceCard key={workspace.id} workspace={workspace} />
      ))}
    </div>
  );
}
