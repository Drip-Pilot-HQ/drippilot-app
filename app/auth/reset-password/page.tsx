"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/branding/Button";
import { AuthInput } from "@/components/auth/AuthInput";
import { useResetPasswordMutation } from "@/store/server/auth.queries";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const resetPasswordMutation = useResetPasswordMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    resetPasswordMutation.mutate(password, {
      onSuccess: () => {
        setSuccessMsg("Password successfully reset. You can now login.");
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      },
      onError: (err) => {
        setErrorMsg(err.message);
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Title & Description */}
      <div className="text-left space-y-3">
        <h1 className="text-[32px] md:text-5xl font-heading font-black text-slate-900 tracking-tight leading-tight">
          New Password
        </h1>
        <p className="text-slate-500 font-semibold text-sm md:text-lg">
          Create a secure password for your workspace.
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

      {/* Form Section */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <AuthInput
          label="New Password"
          icon={Lock}
          type="password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <AuthInput
          label="Confirm Password"
          icon={Lock}
          type="password"
          placeholder="••••••••"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {/* Action Button */}
        <Button
          variant="primary"
          size="md"
          className="w-full shadow-2xl shadow-primary/30 group py-4"
          disabled={resetPasswordMutation.isPending}
        >
          <span>
            {resetPasswordMutation.isPending
              ? "Resetting..."
              : "Reset Password"}
          </span>
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      {/* Back to Login */}
      <div className="pt-4 flex justify-center border-t border-slate-100">
        <Link
          href="/auth/login"
          className="flex items-center gap-2 text-slate-500 hover:text-primary font-bold text-sm transition-all group py-2"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Login</span>
        </Link>
      </div>
    </div>
  );
}
