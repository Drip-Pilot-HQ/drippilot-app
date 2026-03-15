"use client";

import {
  WorkspaceList,
  InviteList,
  CreateWorkspaceDialog,
} from "@/components/account/workspaces";

export default function WorkspaceSelectionPage() {
  return (
    <div className="space-y-8 lg:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-3xl lg:text-4xl font-heading font-black text-slate-900 mb-2">
            Workspaces
          </h1>
          <p className="text-slate-500 font-semibold text-md lg:text-lg">
            Manage your and other&apos;s workspaces.
          </p>
        </div>

        <CreateWorkspaceDialog />
      </div>

      {/* Workspace Grid */}
      <WorkspaceList />

      {/* Pending Invites Section */}
      <InviteList />
    </div>
  );
}
