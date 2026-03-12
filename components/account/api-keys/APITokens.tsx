"use client";

import { Shield } from "lucide-react";
import { ApiKeyList, CreateApiKeyDialog } from "@/components/account/api-keys";

export function APITokens() {
  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-3xl lg:text-4xl font-heading font-black text-slate-900 mb-2">
            API Tokens
          </h1>
          <p className="text-slate-500 font-semibold text-md lg:text-lg">
            Manage your personal access tokens for API authorization.
          </p>
        </div>

        <CreateApiKeyDialog />
      </div>

      <ApiKeyList />

      <div className="bg-orange-50/50 border border-orange-200 rounded-3xl p-6 lg:p-8 flex items-start gap-5">
        <div className="w-12 h-12 rounded-2xl bg-white border border-orange-200 flex items-center justify-center text-primary shrink-0 shadow-sm">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-heading text-lg font-bold text-slate-900 mb-1">
            Security Recommendation
          </h4>
          <p className="text-slate-600 text-[13px] font-semibold leading-relaxed">
            Tokens should be kept secret! Never share them in public
            repositories. We recommend using environment variables to manage
            your tokens securely.
          </p>
        </div>
      </div>
    </div>
  );
}
