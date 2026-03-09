"use client";

import React from "react";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/branding/Button";
import { AuthInput } from "@/components/auth/AuthInput";

export default function SignupPage() {
  return (
    <div className="space-y-8">
      {/* Title & Description */}
      <div className="text-left space-y-3">
        <h1 className="text-[32px] md:text-5xl font-heading font-black text-slate-900 tracking-tight leading-tight">
          Create Account
        </h1>
        <p className="text-slate-500 font-semibold text-sm md:text-lg">
          Start your 7 days free trial today.
        </p>
      </div>

      {/* Social Register Separator */}
      <div className="flex justify-center">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all font-bold text-slate-600 text-sm cursor-pointer"
        >
            <img
              src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
              alt="Google"
              className="w-3 h-3"
            />
          <span>Sign up with Google</span>
        </button>
      </div>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100" />
        </div>
        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
          <span className="bg-white px-4 text-slate-400">Or use email</span>
        </div>
      </div>

      {/* Form Section */}
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <AuthInput
          label="Full Name"
          icon={User}
          type="text"
          placeholder="Alex Rivera"
          required
        />

        <AuthInput
          label="Email Address"
          icon={Mail}
          type="email"
          placeholder="alex@company.com"
          required
        />

        <AuthInput
          label="Create Password"
          icon={Lock}
          type="password"
          placeholder="••••••••"
          required
        />

        {/* Term & Conditions */}
        <div className="flex items-center gap-3 px-1">
          <p className="text-[11px] font-semibold text-slate-400 leading-relaxed">
            By creating an account, you agree to our{" "}
            <Link
              href="/terms"
              className="text-slate-600 hover:text-primary underline underline-offset-4 decoration-slate-200 hover:decoration-primary transition-all"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="text-slate-600 hover:text-primary underline underline-offset-4 decoration-slate-200 hover:decoration-primary transition-all"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        {/* Action Button */}
        <Button
          variant="primary"
          size="md"
          className="w-full shadow-2xl shadow-primary/30 group py-4"
        >
          <span>Create Account</span>
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      {/* Footer Link */}
      <p className="text-center text-slate-500 font-semibold text-sm">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-primary hover:text-primary/80 font-black decoration-2 underline-offset-4 hover:underline transition-colors"
        >
          Log In
        </Link>
      </p>
    </div>
  );
}
