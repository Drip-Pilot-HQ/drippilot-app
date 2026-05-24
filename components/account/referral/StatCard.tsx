import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  sub?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  sub,
}: StatCardProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-[28px] p-4 sm:p-5 shadow-sm flex flex-col gap-3">
      <div
        className={cn(
          "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0",
          iconBg,
        )}
      >
        <Icon className={cn("w-5 h-5", iconColor)} />
      </div>
      <div>
        <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {value}
        </p>
        {sub && (
          <p className="text-sm text-slate-400 font-medium mt-0.5">{sub}</p>
        )}
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
          {label}
        </p>
      </div>
    </div>
  );
}
