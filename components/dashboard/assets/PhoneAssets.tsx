"use client";

import { useState } from "react";
import {
  Phone,
  MoreVertical,
  Trash2,
  Calendar,
  ShieldCheck,
  Plus,
} from "lucide-react";
import {
  usePhoneNumbersQuery,
  useReleasePhoneNumberMutation,
} from "@/store/server/assets.queries";
import { useConfirm } from "@/components/branding/ConfirmProvider";
import { useWorkspaceRole } from "@/lib/hooks/use-workspace-role";
import { useViewMode } from "@/lib/hooks/use-view-mode";
import { AssetListSkeleton } from "./AssetSkeleton";
import { BuyNumberDialog } from "./BuyNumberDialog";
import { PhoneNumber } from "@/types/assets";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/branding/Button";
import { formatNumber } from "@/lib/utils/format-number";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/common/DropdownMenu";
import { AssignPhoneNumberSubmenu } from "./AssignPhoneNumberSubmenu";
import { AssigneeBadge } from "@/components/common/AssigneeBadge";

export function PhoneAssets() {
  const { isOwnerOrAdmin } = useWorkspaceRole();
  const { isPersonal } = useViewMode();
  const { data: numbers, isLoading } = usePhoneNumbersQuery();
  const releaseMutation = useReleasePhoneNumberMutation();
  const confirm = useConfirm();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRelease = async (number: PhoneNumber) => {
    const isConfirmed = await confirm({
      title: "Release Number",
      description: `Are you sure you want to release "${number.phoneNumber}"? You will lost access to this line and all active SMS sequences will stop.`,
      confirmLabel: "Release Line",
      variant: "danger",
    });

    if (isConfirmed) {
      await releaseMutation.mutateAsync(number.id);
    }
  };

  if (isLoading) return <AssetListSkeleton />;

  if (!numbers || numbers.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white border border-slate-100 rounded-[40px] shadow-sm animate-in fade-in duration-500">
          <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-6 text-slate-300">
            <Phone className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            No phone numbers
          </h2>
          <p className="text-slate-500 max-w-sm mb-8 font-medium">
            {isPersonal
              ? "No phone numbers assigned to you yet."
              : "Create your first dedicated phone number to start reaching leads via SMS."}
          </p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="rounded-xl px-8 h-12 shadow-lg shadow-secondary/20 bg-secondary hover:bg-secondary/90 border-none"
          >
            <Plus className="w-5 h-5 mr-2" />
            Phone Number
          </Button>
        </div>

        <BuyNumberDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex items-center px-4 mb-6">
        <p className="text-sm text-slate-400 font-bold">
          Showing <span className="text-slate-900">{numbers.length}</span>{" "}
          {isOwnerOrAdmin ? "active lines" : "your lines"}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500">
        {numbers.map((number: PhoneNumber) => (
          <div
            key={number.id}
            className="group relative bg-white border border-slate-200 rounded-3xl p-5 hover:shadow-xl hover:border-secondary/20 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-2xl bg-secondary/5 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6" />
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest transition-all">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  Active
                </span>

                {isOwnerOrAdmin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none outline-none">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <AssignPhoneNumberSubmenu phoneNumber={number} />
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleRelease(number)}
                        variant="danger"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Release Line
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-black text-slate-900 truncate mb-1">
                {formatNumber(number.phoneNumber)}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Dedicated Communication Channel
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 pt-5 border-t border-slate-50">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Calendar className="w-3.5 h-3.5" />
                {formatDistanceToNow(new Date(number.createdAt), {
                  addSuffix: true,
                })}
              </div>

              {isOwnerOrAdmin ? (
                <AssigneeBadge assignedUserIds={number.assignedUserIds} />
              ) : (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {number.provider}
                </div>
              )}
            </div>
          </div>
        ))}

        <button
          onClick={() => setIsDialogOpen(true)}
          className="group relative bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-3xl p-5 flex flex-col items-center justify-center gap-3 hover:bg-secondary/5 hover:border-secondary/30 transition-all min-h-45"
        >
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:text-secondary group-hover:scale-110 transition-all shadow-sm">
            <Plus className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover:text-secondary">
            Add Number
          </span>
        </button>
      </div>

      <BuyNumberDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}
