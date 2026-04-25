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
    desc: "Drip Pilot matches the lead's tags and status against your rules, then enrolls them into the right campaigns.",
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
    required: true,
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
  {
    name: "address",
    type: "string",
    required: false,
    desc: "Lead's mailing or physical address",
  },
];

const SINGLE_EXAMPLE = `{
  "leads": [
    {
      "email": "jane@example.com",
      "phone": "+12125551234",
      "firstName": "Jane",
      "lastName": "Doe",
      "name": "Jane Doe",
      "address": "123 Main St, New York, NY 10001",
      "tags": ["meta-ads", "webinar"],
      "leadStatus": "warm"
    }
  ]
}`;

const BATCH_EXAMPLE = `{
  "leads": [
    {
      "email": "jane@example.com",
      "phone": "+12125551234",
      "name": "Jane Doe",
      "address": "123 Main St, New York, NY 10001",
      "tags": ["meta-ads"],
      "leadStatus": "warm"
    },
    {
      "email": "john@example.com",
      "phone": "+12125559876",
      "name": "John Smith",
      "address": "456 Elm Ave, Los Angeles, CA 90001",
      "tags": ["google-ads"],
      "leadStatus": "hot"
    }
  ]
}`;

const CURL_EXAMPLE = `curl -X POST "https://api.drippilot.com/v1/lead-sources/webhook/{your-slug}" \\
  -H "Content-Type: application/json" \\
  -H "X-Source-Secret: whsec_your_secret_here" \\
  -d '{
    "leads": [
      {
        "email": "jane@example.com",
        "phone": "+12125551234",
        "name": "Jane Doe",
        "address": "123 Main St, New York, NY 10001",
        "tags": ["meta-ads"],
        "leadStatus": "warm"
      }
    ]
  }'`;

function CodeBlock({ code, lang = "json" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/50 border-b border-slate-800">
        <span className="text-xs font-medium text-slate-400">{lang}</span>
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
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-4 px-6 sm:px-8 py-6 border-b border-slate-100 bg-slate-50/50">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-inner">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Developer Documentation
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            How to route leads using your webhooks
          </p>
        </div>
        <div className="ml-auto hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm" />
          <span className="text-xs font-semibold text-emerald-700">Live</span>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* How it works — 3 steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className="relative flex flex-col gap-4 p-6 bg-white border border-slate-200 shadow-sm rounded-xl"
            >
              {/* Step connector arrow — only between steps on sm+ */}
              {i < 2 && (
                <div className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center shadow-sm">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              )}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${s.color}`}
                >
                  <s.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-slate-400 ml-auto bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                  {s.step}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800 mb-1.5">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Fields + Code examples — 2 column on lg */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left — Request fields */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-800">
                Request Body Fields
              </h3>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
              {/* Table header — hidden on mobile */}
              <div className="hidden sm:grid grid-cols-[1fr_auto_2fr] gap-x-4 px-5 py-3 bg-slate-50/80 border-b border-slate-200">
                <span className="text-xs font-semibold text-slate-500">
                  Field
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Type
                </span>
                <span className="text-xs font-semibold text-slate-500">
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
                      {f.required && (
                        <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-1 py-0.3 rounded-md tracking-wider">
                          Required
                        </span>
                      )}
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg whitespace-nowrap">
                        {f.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{f.desc}</p>
                  </div>
                  {/* Desktop layout */}
                  <div className="hidden sm:grid grid-cols-[1fr_auto_2fr] gap-x-4 items-start">
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-bold text-primary font-mono">
                        {f.name}
                      </code>
                      {f.required && (
                        <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-1 py-0.3 rounded-md tracking-wider">
                          Required
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg whitespace-nowrap self-start">
                      {f.type}
                    </span>
                    <span className="text-xs text-slate-500">{f.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Auth note */}
            <div className="flex items-start gap-3 p-5 bg-indigo-50/50 border border-indigo-100 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-1">
                  Authentication
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Every request must include the header{" "}
                  <code className="bg-white text-primary font-mono px-1.5 py-0.5 rounded-lg border border-primary/20">
                    X-Source-Secret: whsec_...
                  </code>{" "}
                  with the secret shown when you created or regenerated the
                  webhook.
                </p>
              </div>
            </div>

            {/* Payload Structure note */}
            <div className="flex items-start gap-3 p-5 bg-amber-50/50 border border-amber-100 rounded-xl">
              <Layers className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-1">
                  Payload Structure
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  All requests must be wrapped in a{" "}
                  <code className="bg-white text-secondary font-mono px-1.5 py-0.5 rounded-lg border border-secondary/20">
                    {'{ "leads": [...] }'}
                  </code>{" "}
                  object. You can send a single lead or up to hundreds of leads
                  at once. All rules apply per lead.
                </p>
              </div>
            </div>
          </div>

          {/* Right — Code examples */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-semibold text-slate-800">
                Code Examples
              </h3>
            </div>

            {/* Tab switcher */}
            <div className="flex p-1 bg-slate-100 rounded-lg border border-slate-200">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${
                    activeTab === t.id
                      ? "bg-white text-slate-800 shadow-sm ring-1 ring-slate-200/50"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
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
            <div className="flex items-start gap-3 p-5 bg-slate-50 border border-slate-200 rounded-xl shadow-sm">
              <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                <Check
                  className="w-3.5 h-3.5 text-emerald-600"
                  strokeWidth={3}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-1">
                  Success Response
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
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
