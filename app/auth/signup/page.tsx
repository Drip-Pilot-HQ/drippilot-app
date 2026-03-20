"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { User, Mail, Lock, ArrowRight, Gift, X } from "lucide-react";
import { Button } from "@/components/branding/Button";
import { AuthInput } from "@/components/auth/AuthInput";
import { useRegisterMutation } from "@/store/server/auth.queries";

function SignupForm() {
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref") || searchParams.get("referral") || "";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState(refCode);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const registerMutation = useRegisterMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const metadata: Record<string, string> = { full_name: fullName };
    if (referralCode.trim()) {
      metadata.referral_code = referralCode.trim().toUpperCase();
    }

    registerMutation.mutate(
      {
        email,
        password,
        options: { data: metadata },
      },
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

      {/* Referral Code Banner (when auto-filled from URL) */}
      {refCode && (
        <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3">
          <div className="w-8 h-8 rounded-xl bg-white border border-orange-200 flex items-center justify-center shrink-0">
            <Gift className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-primary uppercase tracking-wider">
              Referral code applied
            </p>
            <p className="text-sm font-bold text-slate-700 truncate">
              {refCode.toUpperCase()}
            </p>
          </div>
        </div>
      )}

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

        {/* Referral Code Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400">
            Referral Code{" "}
            <span className="normal-case font-semibold tracking-normal text-slate-300">
              (optional)
            </span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Gift className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="JOHN-A3X9"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              className="w-full pl-11 pr-11 py-3.5 rounded-3xl border border-slate-200 bg-white text-slate-900 font-mono font-bold tracking-widest text-sm placeholder:font-sans placeholder:tracking-normal placeholder:font-semibold placeholder:text-slate-300 focus:outline-none focus:border-primary/40 focus:ring-8 focus:ring-primary/5 transition-all"
            />
            {referralCode && (
              <button
                type="button"
                onClick={() => setReferralCode("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Term & Conditions */}
        <div className="flex items-center gap-3 px-1">
          <p className="text-[11px] font-semibold text-slate-400 leading-relaxed">
            By creating an account, you agree to our{" "}
            <Link
              href="https://www.drippilot.com/terms"
              className="text-slate-600 hover:text-primary underline underline-offset-4 decoration-slate-200 hover:decoration-primary transition-all"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="https://www.drippilot.com/privacy-policy"
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
          className="w-full shadow-2xl shadow-primary/30 group py-4 rounded-xl"
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

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8 animate-pulse">
          <div className="h-16 bg-slate-100 rounded-2xl" />
          <div className="h-80 bg-slate-100 rounded-2xl" />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
