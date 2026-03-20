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
    <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex items-start gap-3 sm:gap-4 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div
        className={cn(
          "w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0",
          iconBg,
        )}
      >
        <Icon className={cn("w-4 h-4 sm:w-5 sm:h-5", iconColor)} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400 leading-none">
          {label}
        </p>
        <p className="text-xl sm:text-2xl font-heading font-black text-slate-900 mt-1 leading-none">
          {value}
        </p>
        {sub && (
          <p className="text-[11px] font-semibold text-slate-400 mt-1">{sub}</p>
        )}
      </div>
    </div>
  );
}
