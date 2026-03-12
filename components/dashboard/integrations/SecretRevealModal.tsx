"use client";

import { useState } from "react";
import { X, Copy, Check, ShieldAlert, Webhook } from "lucide-react";
import { Button } from "@/components/branding/Button";

interface SecretRevealModalProps {
  isOpen: boolean;
  onClose: () => void;
  secret: string;
  webhookName: string;
  webhookUrl?: string;
}

export function SecretRevealModal({
  isOpen,
  onClose,
  secret,
  webhookName,
  webhookUrl,
}: SecretRevealModalProps) {
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const copy = async (text: string, setCopied: (v: boolean) => void) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" />

      <div className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Webhook Ready!
                </h2>
                <p className="text-slate-500 text-sm font-medium mt-0.5">
                  Save this secret for{" "}
                  <span className="font-bold text-slate-700">
                    {webhookName}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Warning banner */}
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
              <span className="text-lg leading-none mt-0.5">⚠️</span>
              <p className="text-sm text-amber-800 font-medium leading-relaxed">
                This secret is shown{" "}
                <span className="font-black">only once</span> and cannot be
                recovered. Copy it now and store it securely.
              </p>
            </div>

            {/* Webhook URL */}
            {webhookUrl && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Webhook className="w-3.5 h-3.5 text-slate-400" />
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Webhook URL
                  </p>
                  <span className="ml-auto text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">
                    POST
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                  <code className="text-sm text-slate-600 font-mono flex-1 truncate">
                    {webhookUrl}
                  </code>
                  <button
                    onClick={() => copy(webhookUrl, setCopiedUrl)}
                    className="shrink-0 p-1.5 rounded-xl hover:bg-slate-200 transition-all text-slate-400"
                    title="Copy URL"
                  >
                    {copiedUrl ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Secret */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Webhook Secret
                </p>
                <span className="ml-auto text-xs text-slate-400 font-medium">
                  Header:{" "}
                  <code className="text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded-lg">
                    X-Source-Secret
                  </code>
                </span>
              </div>
              <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3.5">
                <code className="text-sm text-emerald-400 font-mono flex-1 break-all leading-relaxed">
                  {secret}
                </code>
                <button
                  onClick={() => copy(secret, setCopiedSecret)}
                  className="shrink-0 p-2 rounded-xl hover:bg-slate-700 transition-all text-slate-400"
                  title="Copy secret"
                >
                  {copiedSecret ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              onClick={onClose}
              className="w-full rounded-xl h-12 text-sm font-bold"
            >
              I&apos;ve saved the secret — Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
