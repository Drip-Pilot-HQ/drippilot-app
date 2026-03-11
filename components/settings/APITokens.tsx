"use client";

import { Key, Copy, Trash2, Plus, Eye, EyeOff, Shield } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/branding/Button";
import { Badge } from "@/components/common/Badge";

const initialTokens = [
  {
    id: "1",
    name: "Production API",
    lastFour: "8x2k",
    created: "Oct 12, 2024",
  },
  {
    id: "2",
    name: "Development Env",
    lastFour: "m9q3",
    created: "Jan 05, 2025",
  },
];

export function APITokens() {
  const [tokens, setTokens] = useState(initialTokens);
  const [showToken, setShowToken] = useState<string | null>(null);

  const deleteToken = (id: string) => {
    setTokens(tokens.filter((t) => t.id !== id));
  };

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

        <Button
          variant="primary"
          size="md"
          className="gap-2 shrink-0 mx-auto md:mx-0"
        >
          <Plus className="w-5 h-5" />
          <span>New Token</span>
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 lg:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xl font-heading font-bold text-slate-900">
            Your Tokens
          </h2>
          <Badge variant="slate">Total: {tokens.length}</Badge>
        </div>

        <div className="divide-y divide-slate-100">
          {tokens.length > 0 ? (
            tokens.map((token) => (
              <div
                key={token.id}
                className="p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-slate-50/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 text-primary flex items-center justify-center shrink-0">
                    <Key className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-slate-900 truncate pr-2">
                      {token.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <p className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        •••• {token.lastFour}
                      </p>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {token.created}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() =>
                      setShowToken(showToken === token.id ? null : token.id)
                    }
                    className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-primary hover:border-primary/30 transition-all shadow-sm"
                  >
                    {showToken === token.id ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                  <button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                    <Copy className="w-4 h-4" />
                  </button>
                  <div className="w-px h-8 bg-slate-200 mx-2" />
                  <button
                    onClick={() => deleteToken(token.id)}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-500/30 transition-all shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-16 lg:p-20 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
                <Key className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">
                No active tokens
              </h3>
              <p className="text-slate-500 font-medium">
                You haven&apos;t created any API tokens yet.
              </p>
            </div>
          )}
        </div>
      </div>

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
