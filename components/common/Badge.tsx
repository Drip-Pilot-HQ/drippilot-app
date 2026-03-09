import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "accent"
    | "outline"
    | "slate"
    | "success"
    | "orange";
  className?: string;
}

export function Badge({ children, variant = "slate", className }: BadgeProps) {
  const variants = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary/10 text-secondary border-secondary/20",
    accent: "bg-accent/10 text-accent border-accent/20",
    outline: "bg-transparent text-slate-600 border-slate-200",
    slate: "bg-slate-100 text-slate-600 border-slate-200",
    success: "bg-emerald-50 text-emerald-600 border-emerald-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
  };

  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
