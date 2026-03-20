import { BadgeCheck, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommissionStatus } from "@/types/account";

export function CommissionBadge({ status }: { status: CommissionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
        status === "paid"
          ? "bg-green-50 text-green-600 border border-green-100"
          : "bg-amber-50 text-amber-600 border border-amber-100",
      )}
    >
      {status === "paid" ? (
        <BadgeCheck className="w-3 h-3" />
      ) : (
        <Clock className="w-3 h-3" />
      )}
      {status}
    </span>
  );
}
