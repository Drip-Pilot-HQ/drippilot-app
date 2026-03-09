"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AuthVisual } from "@/components/auth/AuthVisual";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Determine auth type for visual
  const getType = () => {
    if (pathname.includes("signup")) return "signup";
    if (pathname.includes("forgot")) return "forgot";
    if (pathname.includes("reset")) return "reset";
    return "login";
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden relative">
      {/* Back to Home Button */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/80 backdrop-blur-xl border border-slate-200 text-slate-600 hover:text-primary hover:border-primary/30 transition-all font-bold text-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Form Section (Left) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-white">
        {/* Background Decorative Elements for Mobile */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none lg:hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
        </div>

        <div className="w-full max-w-[440px] z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Auth Card */}
          <div className="bg-white lg:bg-transparent rounded-[40px] lg:rounded-none shadow-[0_20px_60px_rgba(0,0,0,0.04)] lg:shadow-none border border-slate-100 lg:border-none p-8 sm:p-10 lg:p-0 overflow-hidden relative">
            {/* Top Gradient Border - Mobile Only */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-primary via-accent to-secondary lg:hidden" />
            {children}
          </div>
        </div>
      </div>

      {/* Visual Section (Right - Desktop Only) */}
      <div className="hidden lg:block w-1/2 relative bg-slate-50 border-l border-slate-100">
        <AuthVisual type={getType()} />
      </div>
    </div>
  );
}
