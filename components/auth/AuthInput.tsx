"use client";

import React, { useState } from "react";
import { Eye, EyeOff, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  error?: string;
}

export function AuthInput({
  label,
  icon: Icon,
  type,
  error,
  className,
  ...props
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="space-y-2 w-full">
      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center text-slate-400 group-focus-within:text-primary transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        <input
          {...props}
          type={inputType}
          className={cn(
            "w-full pl-14 pr-12 py-4 rounded-3xl bg-slate-50 border border-slate-100 focus:border-primary/30 focus:bg-white focus:ring-8 focus:ring-primary/5 outline-none transition-all font-semibold text-slate-900 text-sm placeholder:text-slate-400",
            error &&
              "border-red-200 bg-red-50/30 focus:border-red-300 focus:ring-red-100",
            isPassword && "pr-14",
            className,
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-[10px] font-bold text-red-500 ml-1 mt-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}
