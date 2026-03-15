import { cn } from "@/lib/utils";
import { BellRing, Dot } from "lucide-react";

export const RealTimeAlertsMock = ({ active }: { active: boolean }) => {
  const notifications = [
    {
      dot: "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)] animate-pulse",
      bold: true,
      title: "Sarah Kim replied to your email",
      sub: "Hot Lead · Just now",
      badge: "Reply",
      badgeCls: "bg-primary/20 text-primary border-primary/20",
      cardCls: "bg-white/[0.05] border-white/10 shadow-2xl backdrop-blur-md",
    },
    {
      dot: "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)] animate-pulse",
      bold: true,
      title: "James Rodriguez replied to your SMS",
      sub: "Warm Lead · 2 mins ago",
      badge: "Reply",
      badgeCls: "bg-primary/20 text-primary border-primary/20",
      cardCls: "bg-white/[0.05] border-white/10 shadow-xl backdrop-blur-md",
    },
    {
      dot: "bg-slate-700",
      bold: false,
      title: "Mike Torres replied to your email",
      sub: "Cold Lead · 14 mins ago",
      badge: "Reply",
      badgeCls: "bg-white/10 text-slate-500 border-white/5",
      cardCls: "bg-white/[0.05] border-white/10",
    },
  ];

  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col p-6 transition-all duration-700",
        active
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-5 pointer-events-none",
      )}
    >
      <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 shadow-lg shadow-primary/10">
            <BellRing className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Instant Alerts</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black mt-0.5">
              Omnichannel Feed
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-black uppercase tracking-widest">
          <Dot className="animate-pulse text-green-400 -mr-2 mb-1" />
          Live
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((n, i) => (
          <div
            key={i}
            className={cn(
              "flex items-start gap-3.5 p-4 rounded-2xl border transition-all duration-500 group/notif",
              n.cardCls,
            )}
          >
            <div
              className={cn(
                "w-2 h-2 mt-1.5 rounded-full flex-shrink-0 transition-transform group-hover/notif:scale-150 duration-500",
                n.dot,
              )}
            />
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  "text-sm leading-tight transition-colors duration-500",
                  n.bold
                    ? "font-bold text-white"
                    : "font-medium text-slate-400",
                )}
              >
                {n.title}
              </p>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
                {n.sub}
              </p>
            </div>
            {n.badge && (
              <div
                className={cn(
                  "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border flex-shrink-0",
                  n.badgeCls,
                )}
              >
                {n.badge}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
