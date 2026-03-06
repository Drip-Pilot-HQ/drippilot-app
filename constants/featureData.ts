import { BellRing, Bot, Flame, Webhook, Workflow } from "lucide-react";

export const FEATURES = [
  {
    icon: Workflow,
    accent: "primary" as const,
    label: "Workflow Builder",
    title: "Build sequences visually that convert",
    description:
      "Design linear, multi-channel campaigns with an intuitive builder. Add templates with send intervals, timezone, delays, and craft sequences that nurture leads at every stage automatically.",
    stats: [
      { value: "3.2×", label: "Higher open rates" },
      { value: "68%", label: "Less manual work" },
    ],
  },
  {
    icon: Webhook,
    accent: "secondary" as const,
    label: "Smart Lead Routing",
    title: "Route leads to campaigns via webhook",
    description:
      "Import leads from any CRM using webhooks with intelligent rule-based routing. Automate routing based on tags, status, and multi-condition logic — no manual sorting required.",
    stats: [
      { value: "2×", label: "Routing rules" },
      { value: "<5s", label: "Routing latency" },
    ],
  },
  {
    icon: Bot,
    accent: "accent" as const,
    label: "AI Follow-Up",
    title: "Automated AI follow-up that sounds human",
    description:
      "Let AI respond with personalized follow-ups based on knowledge base documents, lead's activity, and behavior signals. Stay top of mind without writing a single message yourself.",
    stats: [
      { value: "5×", label: "More replies" },
      { value: "94%", label: "Human-like score" },
    ],
  },
  {
    icon: Flame,
    accent: "emerald" as const,
    label: "Lead Detection",
    title: "Know if a lead is hot, warm, or cold",
    description:
      "DripPilot's scoring engine analyzes open rates, click patterns, and reply behavior to classify each lead automatically. Prioritize the right people at exactly the right time.",
    stats: [
      { value: "98%", label: "Detection accuracy" },
      { value: "2.4×", label: "More closed deals" },
    ],
  },
  {
    icon: BellRing,
    accent: "primary" as const,
    label: "Real-Time Alerts",
    title: "Instant push & email when a lead responds",
    description:
      "Get notified the moment a lead opens, clicks, or replies. Multi-device alerts across iOS, Android, and desktop — so you can strike while the iron is hot.",
    stats: [
      { value: "<5s", label: "Alert latency" },
      { value: "4×", label: "Faster response time" },
    ],
  },
];

export const ACCENT_STYLES = {
  primary: {
    icon: "text-primary",
    bg: "bg-primary/10",
    activeBorder: "border-primary/25",
    activeBg: "bg-primary/[0.03]",
    dot: "bg-primary",
    line: "bg-primary",
    stat: "text-primary",
  },
  secondary: {
    icon: "text-secondary",
    bg: "bg-secondary/10",
    activeBorder: "border-secondary/25",
    activeBg: "bg-secondary/[0.03]",
    dot: "bg-secondary",
    line: "bg-secondary",
    stat: "text-secondary",
  },
  accent: {
    icon: "text-accent",
    bg: "bg-accent/10",
    activeBorder: "border-accent/25",
    activeBg: "bg-accent/[0.03]",
    dot: "bg-accent",
    line: "bg-accent",
    stat: "text-accent",
  },
  emerald: {
    icon: "text-emerald-500",
    bg: "bg-emerald-500/10",
    activeBorder: "border-emerald-500/25",
    activeBg: "bg-emerald-500/[0.03]",
    dot: "bg-emerald-500",
    line: "bg-emerald-500",
    stat: "text-emerald-500",
  },
};
