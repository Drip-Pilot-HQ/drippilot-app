export const YEARLY_DISCOUNT = 20;

export const PRICING_PLANS = [
  {
    name: "Starter",
    price: 49,
    description: "Perfect for individuals who are getting started.",
    features: [
      "800 Shared Credits",
      "10 Knowledge Base Docs",
      "1 Email Alias",
      "1 SMS Number",
      "5 Webhook Trigger",
    ],
    buttonText: "Start Now",
    buttonVariant: "secondary" as const,
    accent: "secondary",
    badge: "Getting Started",
  },
  {
    name: "Pro",
    price: 129,
    description:
      "Unleash the full power of AI-driven outreach for small teams.",
    features: [
      "2,400 Shared Credits",
      "20 Knowledge Base Docs",
      "2 Email Alias",
      "2 SMS Number",
      "10 Webhook Trigger",
    ],
    buttonText: "Upgrade to Pro",
    buttonVariant: "accent" as const,
    accent: "accent",
    badge: "Growth Engine",
  },
  {
    name: "Teams",
    price: 269,
    description: "Collaborative Intelligence for scaling sales organizations.",
    features: [
      "4,800 Shared Credits",
      "30 Knowledge Base Docs",
      "4 Email Alias",
      "4 SMS Number",
      "Unlimited Webhook Triggers",
    ],
    buttonText: "Launch Team",
    buttonVariant: "primary" as const,
    accent: "primary",
    badge: "Most Popular",
    recommended: true,
  },
  {
    name: "Enterprise",
    price: 0,
    description: "Bespoke infrastructure for global enterprise demands.",
    features: [
      "Custom Shared Credits",
      "Custom Knowledge Base Docs",
      "Unlimited Email Aliases",
      "Custom SMS Numbers",
      "Unlimited Webhook Triggers",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "dark" as const,
    accent: "slate",
    badge: "Custom Solutions",
  },
];

export const COMPARISON_FEATURES = [
  {
    category: "Automation",
    features: [
      {
        name: "Linear Sequences",
        starter: true,
        pro: true,
        teams: true,
        enterprise: true,
      },
      {
        name: "Smart Leads Routing",
        starter: true,
        pro: true,
        teams: true,
        enterprise: true,
      },
      {
        name: "Instant Alerts",
        starter: true,
        pro: true,
        teams: true,
        enterprise: true,
      },
    ],
  },
  {
    category: "AI Capabilities",
    features: [
      {
        name: "AI Intelligent Replies",
        starter: true,
        pro: true,
        teams: true,
        enterprise: true,
      },
      {
        name: "AI Leads Intent Detection",
        starter: true,
        pro: true,
        teams: true,
        enterprise: true,
      },
    ],
  },
  {
    category: "Credits & Limits",
    features: [
      {
        name: "Shared Credits (Messages & AI)",
        starter: "800",
        pro: "2,400",
        teams: "4,800",
        enterprise: true,
      },
      {
        name: "Knowledge Base Docs for AI",
        starter: 10,
        pro: 20,
        teams: 30,
        enterprise: true,
      },
      {
        name: "Email Aliases",
        starter: 1,
        pro: 2,
        teams: 4,
        enterprise: "Unlimited",
      },
      {
        name: "SMS Numbers",
        starter: 1,
        pro: 2,
        teams: 4,
        enterprise: true,
      },
      {
        name: "Webhook Triggers",
        starter: 5,
        pro: 10,
        teams: "Unlimited",
        enterprise: "Unlimited",
      },
    ],
  },
  {
    category: "Customization",
    features: [
      {
        name: "Custom Feature Development",
        starter: null,
        pro: null,
        teams: null,
        enterprise: true,
      },
      {
        name: "Whitelabel Platform",
        starter: null,
        pro: null,
        teams: "On Demand",
        enterprise: true,
      },
    ],
  },
  {
    category: "Support",
    features: [
      {
        name: "Email Support",
        starter: "48h Response",
        pro: "24h Response",
        teams: "Priority",
        enterprise: "Instant",
      },
      {
        name: "Strategy Consultations",
        starter: null,
        pro: null,
        teams: "Quarterly",
        enterprise: "Monthly",
      },
    ],
  },
];

export const ADDONS = [
  {
    name: "Additional Seats",
    price: 45,
    unit: "seat/mo",
    description:
      "Expand your team collaboration and manage more campaigns together with additional seats.",
    icon: "users",
  },
  {
    name: "Numbers & Email Assets",
    price: 2,
    unit: "no/mo",
    description:
      "Get dedicated local US number for your SMS outreach campaigns and email assets.",
    icon: "phone",
  },
  {
    name: "Knowledge Base Docs",
    price: 1,
    unit: "10 doc/mo",
    description:
      "Train your Drip AI on more documents and complex knowledge sets regarding your business.",
    icon: "database",
  },
];

export const CREDIT_GUIDE = [
  {
    type: "SMS Messaging",
    description: "Standard outgoing SMS (per 160 characters)",
    cost: "1 Credit",
    icon: "message",
  },
  {
    type: "AI Intelligent Replies",
    description: "Automated AI response based on Knowledge Base",
    cost: "1 Credit",
    icon: "bot",
  },
  {
    type: "Email Outreach",
    description: "Standard outgoing email campaign message",
    cost: "0.2 Credits",
    icon: "mail",
  },
];
