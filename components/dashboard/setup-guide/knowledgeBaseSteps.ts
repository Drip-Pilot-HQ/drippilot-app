import type { GuideStep } from "./guideSteps";

export const KB_GUIDE_STEPS: GuideStep[] = [
  {
    id: 1,
    emoji: "📚",
    title: "Create a Knowledge Document",
    description:
      "A knowledge document teaches the AI about your business. Write anything — what you do, what you sell, your pricing, your policies. Even a single paragraph gives the AI something to work with.",
    linkLabel: "Go to Knowledge Base",
    linkHref: "/dashboard/knowledge-base",
    color: "secondary",
    subSteps: [
      { text: 'Open "Knowledge Base" in the sidebar.' },
      {
        text: "Click New Document and give it a clear title.",
        note: 'e.g. "Company Overview"',
      },
      {
        text: "Write what your business does — services, products, pricing, anything relevant.",
      },
      { text: "Save — the AI starts learning from it immediately." },
    ],
    tip: "Even a few sentences is enough to start. You can always expand it later.",
  },
  {
    id: 2,
    emoji: "📋",
    title: "Add More Documents by Topic",
    description:
      "Break your knowledge into focused documents — one per topic keeps things organised and makes the AI noticeably more accurate. No formatting required, just write naturally.",
    linkLabel: "Go to Knowledge Base",
    linkHref: "/dashboard/knowledge-base",
    color: "primary",
    subSteps: [
      { text: "Create a separate document for each topic you want covered." },
      {
        text: 'Good examples: "Pricing", "FAQs", "Refund Policy", "How It Works".',
        note: "Write naturally — no special format needed",
      },
      { text: "More detail means sharper, more accurate AI responses." },
      {
        text: "No business info at all? No problem — the AI still responds professionally and helpfully.",
      },
    ],
    tip: "More context = better responses. But even with nothing, the AI stays professional.",
  },
  {
    id: 3,
    emoji: "🤖",
    title: "Test the AI with Drip Pilot",
    description:
      "Drip Pilot lets you have a real conversation with your AI before it talks to any leads. Ask it questions a lead might ask and see the response quality live.",
    linkLabel: "Open Drip Pilot",
    linkHref: "/dashboard/knowledge-base",
    color: "accent",
    subSteps: [
      {
        text: "Look for the chat bubble in the bottom-right corner of any page.",
      },
      { text: "Click it to open Drip Pilot and start a test conversation." },
      {
        text: 'Ask real questions a lead might send — "What do you offer?", "How much does it cost?"',
      },
      {
        text: "Not satisfied with a response? Add more detail to your documents, then test again.",
      },
    ],
    tip: "Iterate on your docs until responses feel natural. It only takes a few minutes.",
  },
  {
    id: 4,
    emoji: "⚡",
    title: "AI Auto-Reply Works Out of the Box",
    description:
      "When a lead replies to your campaign, the AI automatically responds on your behalf using your knowledge base. You stay in full control — take over any conversation whenever you want.",
    linkLabel: "Go to Messages",
    linkHref: "/dashboard/messages",
    color: "secondary",
    subSteps: [
      {
        text: "AI auto-reply is active by default the moment a lead replies — no extra setup needed.",
      },
      { text: 'Head to "Messages" to see all your live lead conversations.' },
      {
        text: "Each conversation has an AI Toggle in the message header.",
        note: "Click it to switch to manual reply",
      },
      {
        text: "You can take over any conversation at any time — just start typing and send.",
      },
    ],
    tip: "The AI assists — you're always in control of when to step in.",
  },
];
