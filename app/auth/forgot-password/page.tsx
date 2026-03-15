"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/branding/Button";
import { AuthInput } from "@/components/auth/AuthInput";
import { useForgotPasswordMutation } from "@/store/server/auth.queries";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const forgotPasswordMutation = useForgotPasswordMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    forgotPasswordMutation.mutate(email, {
      onSuccess: () => {
        setSuccessMsg(
          "If your email is registered, you will receive a password reset link.",
        );
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
          Reset Access
        </h1>
        <p className="text-slate-500 font-semibold text-sm md:text-lg">
          No worries! Enter your email to receive instructions.
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
      <form className="space-y-8" onSubmit={handleSubmit}>
        <AuthInput
          label="Email Address"
          icon={Mail}
          type="email"
          placeholder="alex@company.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Action Button */}
        <Button
          variant="primary"
          size="md"
          className="w-full shadow-2xl shadow-primary/30 group py-4"
          disabled={forgotPasswordMutation.isPending}
        >
          <span>
            {forgotPasswordMutation.isPending
              ? "Sending Link..."
              : "Send Reset Link"}
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
