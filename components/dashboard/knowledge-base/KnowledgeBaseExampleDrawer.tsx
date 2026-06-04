"use client";

import { X, Sparkles } from "lucide-react";

interface Example {
  category: string;
  categoryColor: string;
  title: string;
  content: string;
}

const EXAMPLES: Example[] = [
  {
    category: "Business Info",
    categoryColor: "bg-blue-50 text-blue-600",
    title: "About Our Business",
    content: `We are [Company Name], a real estate investment firm based in [City, State]. We specialize in helping homeowners sell their properties quickly and hassle-free, with no repairs, showings, or agent commissions required.

Our team has over [X] years of experience in the market. We close deals in as little as 7–14 days and handle all the paperwork. We pay fair market value and cover all closing costs.

Business hours: Monday–Friday, 9am–6pm [Timezone]. We also respond to inquiries on weekends.

Website: [yourwebsite.com] | Phone: [555-000-0000]`,
  },
  {
    category: "Pricing",
    categoryColor: "bg-emerald-50 text-emerald-600",
    title: "Our Offer Process & Pricing",
    content: `We make cash offers based on the property's current condition, location, and comparable sales in the area. Our offers are typically 70–85% of the after-repair value (ARV), minus estimated repair costs.

There are no agent commissions, no closing cost fees, and no repair requirements. We buy properties as-is.

Once a seller reaches out, we schedule a quick walkthrough (in-person or virtual), then provide a no-obligation written offer within 24–48 hours. Sellers have no pressure to accept.

We can close in as few as 7 days or on a timeline that works for the seller.`,
  },
  {
    category: "Appointments",
    categoryColor: "bg-violet-50 text-violet-600",
    title: "Booking & Availability",
    content: `To schedule a property walkthrough or consultation, leads can:
- Call or text [555-000-0000] during business hours
- Reply to any message and request a callback

Available slots: Monday–Saturday, 9am–5pm [Timezone]. We offer in-person walkthroughs and virtual video calls via Zoom or Google Meet.

Walkthroughs typically take 20–30 minutes. After the visit, we send a written offer within 24 hours.

To cancel or reschedule, please give at least 4 hours notice. We are very flexible and happy to accommodate.`,
  },
  {
    category: "AI Rules",
    categoryColor: "bg-orange-50 text-orange-600",
    title: "Communication Guidelines for AI",
    content: `Tone: Be friendly, professional, and empathetic. Never be pushy or aggressive. Leads are often in difficult situations (foreclosure, divorce, inherited property) — respond with compassion.

Always:
- Acknowledge the lead's situation before pitching
- Offer value upfront (free offer, no obligation)
- Use plain language — avoid jargon
- Ask open-ended questions to understand their timeline and needs

Never:
- Make guarantees about offer amounts before seeing the property
- Share specific offer numbers before a walkthrough
- Pressure leads to respond quickly

If a lead asks about offer price: "I'd love to give you a number — the best way is a quick 20-minute walkthrough so I can give you a fair, accurate offer. Would that work for you?"

Escalate to a human agent if: lead expresses legal concerns, distress, or requests to speak with someone directly.`,
  },
  {
    category: "FAQs",
    categoryColor: "bg-cyan-50 text-cyan-600",
    title: "Frequently Asked Questions",
    content: `Q: Do I need to make repairs before selling?
A: No. We buy properties in any condition — as-is. You don't need to fix anything.

Q: How fast can you close?
A: We can close in as little as 7 days, or on whatever timeline works best for you.

Q: Are there any fees or commissions?
A: None. We cover all closing costs and there are no agent commissions. The offer we make is what you receive.

Q: Is the offer binding?
A: Our initial offer is non-binding. You're never obligated to accept. We only proceed when you're fully comfortable.

Q: What types of properties do you buy?
A: We buy single-family homes, multi-family properties, condos, land, and commercial properties in [target markets].`,
  },
  {
    category: "B2B / Services",
    categoryColor: "bg-indigo-50 text-indigo-600",
    title: "Company Overview",
    content: `We are [Company Name], a [type of business — e.g. marketing agency, consulting firm, software company, staffing agency] based in [City, State / Remote].

We help [target customer — e.g. small business owners, B2B companies, startups] with [core service or outcome — e.g. generating more leads, automating their operations, hiring top talent, growing revenue].

Our team has [X] years of experience working with clients across [industries or regions]. We typically work with businesses doing [revenue range or size — optional].

We offer [free consultation / free demo / free audit / no-commitment quote] to get started — no pressure, no long-term contracts required.

Business hours: Monday–Friday, [9am–6pm Timezone].
Website: [yourwebsite.com] | Phone: [555-000-0000] | Email: [hello@yourcompany.com]`,
  },
  {
    category: "B2B / Services",
    categoryColor: "bg-indigo-50 text-indigo-600",
    title: "AI Communication Rules",
    content: `Tone: Be professional, friendly, and helpful. Never be pushy or use high-pressure tactics. Leads are busy professionals — keep messages concise and value-focused.

Always:
- Lead with the benefit or outcome, not the feature
- Ask questions to understand the lead's goals and timeline
- Offer a low-commitment next step (call, demo, free audit)
- Use plain, conversational language — no jargon

Never:
- Promise specific results before understanding their situation
- Send follow-up messages that feel copy-paste or robotic
- Pressure a lead to make a quick decision

If a lead asks about pricing: "Pricing depends on your specific needs — happy to give you a clear number on a quick call. Want to find 15 minutes this week?"

Escalate to a human team member if: lead is ready to buy, expresses frustration, or requests to speak with someone directly.`,
  },
  {
    category: "B2B / Services",
    categoryColor: "bg-indigo-50 text-indigo-600",
    title: "Common Client Questions",
    content: `Q: How does the process work?
A: It starts with a quick [call / demo / consultation] where we learn about your goals. From there we put together a custom [proposal / plan / quote] and walk you through exactly how we can help.

Q: How long does it take to see results?
A: Most clients see [early results / first outcomes] within [X weeks / X days]. Full results depend on your goals and starting point — we'll set clear expectations upfront.

Q: What does it cost?
A: Pricing varies based on scope and needs. We offer options starting at [$X / month] — no hidden fees. We'll give you a clear quote after a short discovery conversation.

Q: Is there a contract?
A: We offer [month-to-month / flexible] agreements. We believe in earning your business every month, not locking you in.

Q: What makes you different?
A: [Your honest differentiator — e.g. "We specialize in your industry," "You'll always work directly with a senior team member," "We guarantee X or we'll work for free until we hit it."]`,
  },
];

interface KnowledgeBaseExampleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (template: { title: string; content: string }) => void;
}

export function KnowledgeBaseExampleDrawer({
  isOpen,
  onClose,
  onUseTemplate,
}: KnowledgeBaseExampleDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                Example Templates
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Click Use Template to load into editor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Examples list */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {EXAMPLES.map((example) => (
            <div
              key={example.title}
              className="group border border-slate-200 rounded-2xl p-4 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${example.categoryColor}`}
                  >
                    {example.category}
                  </span>
                  <h3 className="text-sm font-black text-slate-900">
                    {example.title}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    onUseTemplate({
                      title: example.title,
                      content: example.content,
                    });
                    onClose();
                  }}
                  className="shrink-0 text-[11px] font-black px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors whitespace-nowrap"
                >
                  Use Template
                </button>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3 border-l-2 border-slate-100 pl-3 italic">
                {example.content}
              </p>
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <div className="px-6 py-4 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 font-medium text-center">
            Templates are starting points — customize them with your actual
            business details before saving.
          </p>
        </div>
      </div>
    </>
  );
}
