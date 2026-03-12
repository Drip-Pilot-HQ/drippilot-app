"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/branding/Button";
import { useRouter } from "next/navigation";
import { AuthInput } from "@/components/auth/AuthInput";
import { useLoginMutation } from "@/store/server/auth.queries";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const loginMutation = useLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          router.push("/account/workspaces");
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
          Welcome Back
        </h1>
        <p className="text-slate-500 font-semibold text-sm md:text-lg">
          Log in with your credentials to continue.
        </p>
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Form Section */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <AuthInput
          label="Email Address"
          icon={Mail}
          type="email"
          placeholder="alex@company.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-[11px] font-bold text-accent hover:text-primary transition-colors hover:underline underline-offset-4"
            >
              Forgot password?
            </Link>
          </div>
          <AuthInput
            label=""
            icon={Lock}
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Action Button */}
        <Button
          variant="primary"
          size="md"
          className="w-full shadow-2xl shadow-primary/30 group py-4"
          disabled={loginMutation.isPending}
        >
          <span>{loginMutation.isPending ? "Logging In..." : "Log In"}</span>
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      {/* Social Login Separator */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100" />
        </div>
        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
          <span className="bg-white px-4 text-slate-400">Or sign in with</span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="flex justify-center">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all font-bold text-slate-600 text-sm cursor-pointer"
        >
          <Image
            src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
            alt="Google"
            width={12}
            height={12}
            className="w-3 h-3"
            unoptimized
          />
          <span>Sign in with Google</span>
        </button>
      </div>

      {/* Footer Link */}
      <p className="text-center text-slate-500 font-semibold text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          className="text-primary hover:text-primary/80 font-black decoration-2 underline-offset-4 hover:underline transition-colors"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
