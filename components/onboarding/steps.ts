import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  Workflow,
  MessageSquare,
  Users,
  Box,
  Code,
  BrainCircuit,
  Webhook,
  Bell,
  UserPlus,
  Wallet,
} from "lucide-react";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

export interface OnboardingStep {
  id: string;
  route: string;
  target: string | null;
  title: string;
  description: string;
  Icon: LucideIcon;
  tooltipPosition: TooltipPosition;
  spotlightPadding?: number;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "overview",
    route: "/dashboard",
    target: null,
    title: "Your Command Center",
    description:
      "This is your dashboard — track campaign analytics, KPIs, reply rates, and performance metrics all in one place.",
    Icon: LayoutGrid,
    tooltipPosition: "bottom",
  },
  {
    id: "campaigns",
    route: "/dashboard/campaigns",
    target: "new-campaign-btn",
    title: "Build Campaigns on Autopilot",
    description:
      "Create automated outreach sequences that run 24/7. Click 'New Campaign' to launch your first drip.",
    Icon: Workflow,
    tooltipPosition: "bottom",
    spotlightPadding: 8,
  },
  {
    id: "messages",
    route: "/dashboard/messages",
    target: "messages-panel",
    title: "Respond to Your Leads",
    description:
      "All lead conversations live here. Toggle AI Response to let the AI handle replies, AI lead status, or jump in manually.",
    Icon: MessageSquare,
    tooltipPosition: "bottom",
  },
  {
    id: "leads",
    route: "/dashboard/leads",
    target: null,
    title: "Your Lead Database",
    description:
      "Store, organize, and track every prospect. Import leads and assign them to campaigns in seconds.",
    Icon: Users,
    tooltipPosition: "bottom",
  },
  {
    id: "assets",
    route: "/dashboard/assets",
    target: null,
    title: "Manage Your Assets",
    description:
      "Add and manage the phone numbers and email addresses used for outreach across your campaigns.",
    Icon: Box,
    tooltipPosition: "bottom",
  },
  {
    id: "templates",
    route: "/dashboard/templates",
    target: null,
    title: "Reusable Message Templates",
    description:
      "Create templates for common outreach messages and plug them straight into any campaign.",
    Icon: Code,
    tooltipPosition: "bottom",
  },
  {
    id: "knowledge-base",
    route: "/dashboard/knowledge-base",
    target: null,
    title: "Train Your AI",
    description:
      "Add product info, FAQs, and docs here. The richer your knowledge base, the more accurately your AI represents your brand.",
    Icon: BrainCircuit,
    tooltipPosition: "bottom",
  },
  {
    id: "knowledge-base-chat",
    route: "/dashboard/knowledge-base",
    target: "dripbot-chat-btn",
    title: "Test Your AI with Drip Pilot",
    description:
      "Once your knowledge base is set up, click this button to chat with your AI and verify it's responding the way you want.",
    Icon: BrainCircuit,
    tooltipPosition: "top",
    spotlightPadding: 10,
  },
  {
    id: "integrations",
    route: "/dashboard/integrations",
    target: null,
    title: "Connect Your Stack",
    description:
      "Hook up webhooks and third-party tools to automate your workflow end-to-end.",
    Icon: Webhook,
    tooltipPosition: "bottom",
  },
  {
    id: "notifications",
    route: "/dashboard/notifications",
    target: null,
    title: "Stay in the Loop",
    description:
      "Configure alerts for new replies, campaign events, and team activity so nothing slips through.",
    Icon: Bell,
    tooltipPosition: "bottom",
  },
  {
    id: "members",
    route: "/dashboard/members",
    target: null,
    title: "Grow Your Team",
    description:
      "Invite teammates and collaborate on campaigns and leads with role-based permissions.",
    Icon: UserPlus,
    tooltipPosition: "bottom",
  },
  {
    id: "billings",
    route: "/dashboard/billings",
    target: null,
    title: "Manage Your Plan",
    description:
      "View and update your subscription, billing details, and usage limits all in one place.",
    Icon: Wallet,
    tooltipPosition: "bottom",
  },
];
