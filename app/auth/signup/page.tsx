"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/branding/Button";
import { AuthInput } from "@/components/auth/AuthInput";
import { useRegisterMutation } from "@/store/server/auth.queries";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const registerMutation = useRegisterMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    registerMutation.mutate(
      { email, password, options: { data: { full_name: fullName } } },
      {
        onSuccess: (data) => {
          if (data.user?.identities?.length === 0) {
            setErrorMsg("Email address is already taken.");
          } else {
            setSuccessMsg("Check your email for the verification link!");
          }
        },
        onError: (err) => {
          setErrorMsg(err.message);
        },
      },
    );
  };

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

      {errorMsg && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm font-semibold">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm font-semibold">
          {successMsg}
        </div>
      )}

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
      <form className="space-y-6" onSubmit={handleSubmit}>
        <AuthInput
          label="Full Name"
          icon={User}
          type="text"
          placeholder="Alex Rivera"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <AuthInput
          label="Email Address"
          icon={Mail}
          type="email"
          placeholder="alex@company.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthInput
          label="Create Password"
          icon={Lock}
          type="password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          disabled={registerMutation.isPending}
        >
          <span>
            {registerMutation.isPending
              ? "Creating Account..."
              : "Create Account"}
          </span>
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
