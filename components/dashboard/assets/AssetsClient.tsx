"use client";

import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import { EmailAssets } from "./EmailAssets";
import { PhoneAssets } from "./PhoneAssets";
import { cn } from "@/lib/utils";

type AssetTab = "email" | "phone";

export function AssetsClient() {
  const [activeTab, setActiveTab] = useState<AssetTab>("email");

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Assets
            </h1>
          </div>
          <p className="text-slate-500 font-medium">
            Manage your communication infrastructure and sender identities
          </p>
        </div>

        <div className="flex bg-slate-100/80 p-1 rounded-2xl border border-slate-200 w-fit">
          <button
            onClick={() => setActiveTab("email")}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === "email"
                ? "bg-white text-primary shadow-sm"
                : "text-slate-500 hover:text-slate-700",
            )}
          >
            <Mail className="w-3.5 h-3.5" />
            Email Aliases
          </button>
          <button
            onClick={() => setActiveTab("phone")}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === "phone"
                ? "bg-white text-secondary shadow-sm"
                : "text-slate-500 hover:text-slate-700",
            )}
          >
            <Phone className="w-3.5 h-3.5" />
            Phone Numbers
          </button>
        </div>
      </div>

      <div className="pt-4">
        {activeTab === "email" ? <EmailAssets /> : <PhoneAssets />}
      </div>
    </div>
  );
}
