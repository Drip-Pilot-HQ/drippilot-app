import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "dark";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-white hover:brightness-110 shadow-lg shadow-primary/25",
      secondary: "bg-secondary text-white hover:brightness-110 shadow-lg shadow-secondary/25",
      accent: "bg-accent text-white hover:brightness-110 shadow-xl shadow-accent/20",
      dark: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
      outline: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50",
      ghost: "text-slate-500 hover:text-slate-900",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-2.5 text-md",
      lg: "px-8 py-4 text-lg",
      xl: "px-10 py-5 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
