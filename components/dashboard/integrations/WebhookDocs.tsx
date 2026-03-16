"use client";

import { useState } from "react";
import {
  BookOpen,
  Copy,
  Check,
  ArrowRight,
  Webhook,
  ShieldCheck,
  Rocket,
  Layers,
} from "lucide-react";

// ── Static data ───────────────────────────────────────────────────────────────

const STEPS = [
  {
    icon: Webhook,
    color: "bg-primary/10 text-primary",
    step: "01",
    title: "Create a Webhook",
    desc: 'Give it a name (e.g. "Meta Ads") and add routing rules. You\'ll receive a unique URL and a secret key.',
  },
  {
    icon: ShieldCheck,
    color: "bg-emerald-50 text-emerald-600",
    step: "02",
    title: "Send Leads via POST",
    desc: "POST JSON to your webhook URL. Include the secret in the X-Source-Secret header to authenticate.",
  },
  {
    icon: Rocket,
    color: "bg-secondary/10 text-secondary",
    step: "03",
    title: "Rules Route Automatically",
    desc: "Drippilot matches the lead's tags and status against your rules, then enrolls them into the right campaigns.",
  },
];

const FIELDS: {
  name: string;
  type: string;
  required: boolean;
  desc: string;
}[] = [
  {
    name: "email",
    type: "string",
    required: false,
    desc: "Lead's email address",
  },
  {
    name: "phone",
    type: "string",
    required: false,
    desc: "E.164 format — e.g. +12125551234",
  },
  {
    name: "firstName",
    type: "string",
    required: false,
    desc: "Lead's first name",
  },
  {
    name: "lastName",
    type: "string",
    required: false,
    desc: "Lead's last name",
  },
  {
    name: "name",
    type: "string",
    required: false,
    desc: "Full name (alternative to first/last)",
  },
  {
    name: "tags",
    type: "string[]",
    required: false,
    desc: "Labels used to match routing rules",
  },
  {
    name: "leadStatus",
    type: "enum",
    required: false,
    desc: "hot | warm | cold | converted",
  },
];

const SINGLE_EXAMPLE = `{
  "email": "jane@example.com",
  "phone": "+12125551234",
  "firstName": "Jane",
  "lastName": "Doe",
  "name": "Jane Doe",
  "tags": ["meta-ads", "webinar"],
  "leadStatus": "warm"
}`;

const BATCH_EXAMPLE = `{
  "leads": [
    {
      "email": "jane@example.com",
      "phone": "+12125551234",
      "name": "Jane Doe",
      "tags": ["meta-ads"],
      "leadStatus": "warm"
    },
    {
      "email": "john@example.com",
      "phone": "+12125559876",
      "name": "John Smith",
      "tags": ["google-ads"],
      "leadStatus": "hot"
    }
  ]
}`;

const CURL_EXAMPLE = `curl -X POST "https://api.drippilot.com/sources/{your-slug}" \\
  -H "Content-Type: application/json" \\
  -H "X-Source-Secret: whsec_your_secret_here" \\
  -d '{
    "email": "jane@example.com",
    "phone": "+12125551234",
    "name": "Jane Doe",
    "tags": ["meta-ads"],
    "leadStatus": "warm"
  }'`;

function CodeBlock({ code, lang = "json" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group bg-slate-900 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 border-b border-slate-700">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          {lang}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm text-emerald-300 font-mono leading-relaxed whitespace-pre">
          {code}
        </pre>
      </div>
    </div>
  );
}

// ── Tabs ─────────────────────────────────────────────────────────────────────

type Tab = "single" | "batch" | "curl";

const TABS: { id: Tab; label: string; lang: string }[] = [
  { id: "single", label: "Single Lead", lang: "json" },
  { id: "batch", label: "Batch", lang: "json" },
  { id: "curl", label: "cURL", lang: "bash" },
];

const TAB_CODE: Record<Tab, string> = {
  single: SINGLE_EXAMPLE,
  batch: BATCH_EXAMPLE,
  curl: CURL_EXAMPLE,
};

// ── Main Component ────────────────────────────────────────────────────────────

export function WebhookDocs() {
  const [activeTab, setActiveTab] = useState<Tab>("single");

  return (
    <div className="bg-white border border-slate-200 rounded-[28px] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 sm:px-8 py-5 border-b border-slate-100 bg-slate-50/60">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-black text-slate-900">
            How to send leads to your webhooks
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Integration reference — your developers will need this
          </p>
        </div>
        <div className="ml-auto hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">
            Live
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* How it works — 3 steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className="relative flex flex-col gap-3 p-5 bg-slate-50 border border-slate-200 rounded-2xl"
            >
              {/* Step connector arrow — only between steps on sm+ */}
              {i < 2 && (
                <div className="hidden sm:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 bg-white border border-slate-200 rounded-full items-center justify-center shadow-sm">
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </div>
              )}
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}
                >
                  <s.icon className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-black text-slate-300 ml-auto">
                  {s.step}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 mb-1">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Fields + Code examples — 2 column on lg */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left — Request fields */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">
                Request Body Fields
              </h3>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              {/* Table header — hidden on mobile */}
              <div className="hidden sm:grid grid-cols-[1fr_auto_2fr] gap-x-4 px-4 py-2.5 bg-slate-50 border-b border-slate-200">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Field
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Type
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Description
                </span>
              </div>
              {FIELDS.map((f, i) => (
                <div
                  key={f.name}
                  className={`px-4 py-3 ${i < FIELDS.length - 1 ? "border-b border-slate-100" : ""}`}
                >
                  {/* Mobile layout */}
                  <div className="sm:hidden">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-xs font-bold text-primary font-mono">
                        {f.name}
                      </code>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg whitespace-nowrap">
                        {f.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{f.desc}</p>
                  </div>
                  {/* Desktop layout */}
                  <div className="hidden sm:grid grid-cols-[1fr_auto_2fr] gap-x-4 items-start">
                    <code className="text-xs font-bold text-primary font-mono">
                      {f.name}
                    </code>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg whitespace-nowrap self-start">
                      {f.type}
                    </span>
                    <span className="text-xs text-slate-500">{f.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Auth note */}
            <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/15 rounded-2xl">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-slate-800 mb-0.5">
                  Authentication
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Every request must include the header{" "}
                  <code className="bg-white text-primary font-mono px-1.5 py-0.5 rounded-lg border border-primary/20">
                    X-Source-Secret: whsec_...
                  </code>{" "}
                  with the secret shown when you created or regenerated the
                  webhook.
                </p>
              </div>
            </div>

            {/* Batch note */}
            <div className="flex items-start gap-3 p-4 bg-secondary/5 border border-secondary/15 rounded-2xl">
              <Layers className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-slate-800 mb-0.5">
                  Batch Mode
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Send up to hundreds of leads at once by wrapping them in a{" "}
                  <code className="bg-white text-secondary font-mono px-1.5 py-0.5 rounded-lg border border-secondary/20">
                    {'{ "leads": [...] }'}
                  </code>{" "}
                  object. All rules still apply per lead.
                </p>
              </div>
            </div>
          </div>

          {/* Right — Code examples */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">
                Code Examples
              </h3>
            </div>

            {/* Tab switcher */}
            <div className="flex p-1 bg-slate-100 rounded-xl gap-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    activeTab === t.id
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <CodeBlock
              code={TAB_CODE[activeTab]}
              lang={TABS.find((t) => t.id === activeTab)?.lang}
            />

            {/* Response note */}
            <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                <Check
                  className="w-3.5 h-3.5 text-emerald-600"
                  strokeWidth={3}
                />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 mb-0.5">
                  Success Response
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  A successful request returns{" "}
                  <code className="bg-white font-mono px-1.5 py-0.5 rounded-lg border border-slate-200">
                    202 Accepted
                  </code>
                  . Lead processing happens asynchronously — rules are evaluated
                  and enrollments queued instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
