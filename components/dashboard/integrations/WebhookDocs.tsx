"use client";

import { useState } from "react";
import {
  BookOpen,
  Copy,
  Check,
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
    step: 1,
    title: "Create a webhook",
    desc: 'Give it a name (e.g. "Meta Ads") and optional routing rules. You get a unique URL and a secret key.',
  },
  {
    icon: ShieldCheck,
    color: "bg-emerald-50 text-emerald-600",
    step: 2,
    title: "Send your leads",
    desc: "Your tool (or CRM) sends each lead to that URL as a POST request, with the secret key to prove it's you.",
  },
  {
    icon: Rocket,
    color: "bg-secondary/10 text-secondary",
    step: 3,
    title: "We route them",
    desc: "Drip Pilot saves the lead and, if it matches your rules, enrolls them into the right campaign automatically.",
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
    <div className="group overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
          <span className="ml-1.5 font-mono text-xs text-slate-400">
            {lang}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-white"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-4">
        <pre className="whitespace-pre font-mono text-xs sm:text-sm leading-relaxed text-slate-200">
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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5 sm:px-8">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            How to send leads
          </h2>
          <p className="text-sm text-slate-500">
            A quick guide for connecting any tool to your webhooks
          </p>
        </div>
      </div>

      <div className="space-y-10 p-5 sm:p-8">
        {/* How it works — plain-language overview */}
        <section className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {STEPS.map((s) => (
              <div
                key={s.step}
                className="rounded-xl border border-slate-200 p-5"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.color}`}
                  >
                    <s.icon className="h-4.5 w-4.5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Step {s.step}
                  </span>
                </div>
                <h3 className="mb-1 text-sm font-semibold text-slate-900">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Technical reference — fields + code */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left — Request fields */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-900">
                What to send
              </h3>
              <span className="text-xs text-slate-400">
                fields for each lead
              </span>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              {/* Table header — hidden on mobile */}
              <div className="hidden grid-cols-[1fr_auto_1.6fr] gap-x-4 border-b border-slate-100 bg-slate-50/60 px-4 py-2.5 sm:grid">
                <span className="text-xs font-medium text-slate-500">
                  Field
                </span>
                <span className="text-xs font-medium text-slate-500">Type</span>
                <span className="text-xs font-medium text-slate-500">
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
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <code className="font-mono text-xs font-semibold text-primary">
                        {f.name}
                      </code>
                      {f.required ? (
                        <span className="text-[10px] font-medium text-rose-500">
                          required
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          optional
                        </span>
                      )}
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
                        {f.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{f.desc}</p>
                  </div>
                  {/* Desktop layout */}
                  <div className="hidden grid-cols-[1fr_auto_1.6fr] items-start gap-x-4 sm:grid">
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-xs font-semibold text-primary">
                        {f.name}
                      </code>
                      {f.required && (
                        <span className="text-[10px] font-medium text-rose-500">
                          required
                        </span>
                      )}
                    </div>
                    <span className="self-start whitespace-nowrap rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
                      {f.type}
                    </span>
                    <span className="text-xs leading-relaxed text-slate-500">
                      {f.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Code examples */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-900">Examples</h3>
              <span className="text-xs text-slate-400">copy &amp; paste</span>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    activeTab === t.id
                      ? "bg-white text-slate-900 shadow-sm"
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
          </div>
        </div>

        {/* Good to know — unified reference notes */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-900">Good to know</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-slate-900">
                  Authentication
                </p>
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                Send the header{" "}
                <code className="rounded border border-slate-200 bg-white px-1 py-0.5 font-mono text-[11px] text-primary">
                  X-Source-Secret
                </code>{" "}
                with the secret shown when you create or regenerate the webhook.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Layers className="h-4 w-4 text-secondary" />
                <p className="text-sm font-medium text-slate-900">
                  Payload shape
                </p>
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                Wrap leads in a{" "}
                <code className="rounded border border-slate-200 bg-white px-1 py-0.5 font-mono text-[11px] text-secondary">
                  {'{ "leads": [...] }'}
                </code>{" "}
                object — send one or hundreds at once. Rules apply per lead.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" strokeWidth={3} />
                <p className="text-sm font-medium text-slate-900">Response</p>
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                A success returns{" "}
                <code className="rounded border border-slate-200 bg-white px-1 py-0.5 font-mono text-[11px] text-slate-600">
                  202 Accepted
                </code>
                . Leads are processed and enrolled in the background.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
