export type StepColor = "primary" | "secondary" | "accent";

export interface SubStep {
  text: string;
  note?: string;
}

export interface GuideStep {
  id: number;
  emoji: string;
  title: string;
  description: string;
  linkLabel: string;
  linkHref: string;
  color: StepColor;
  subSteps: SubStep[];
  tip: string;
  showPlaceholders?: boolean;
  codeExample?: string;
}

export const GUIDE_STEPS: GuideStep[] = [
  {
    id: 1,
    emoji: "📬",
    title: "Create Your Alias",
    description:
      'An alias is the email address or phone number your campaign sends from. It\'s your "from" identity — you need at least one before running a campaign.',
    linkLabel: "Go to Assets",
    linkHref: "/dashboard/assets",
    color: "primary",
    subSteps: [
      { text: 'Navigate to "Assets" in the sidebar.' },
      {
        text: "Click Add Alias and choose Email Alias to send emails.",
        note: "e.g. hello@dripilot.com",
      },
      {
        text: "Or choose Phone Alias for SMS / calls.",
        note: "e.g. +1 555 000 0000",
      },
      { text: "You can create both if you plan to use both channels." },
    ],
    tip: "You need at least one alias before you can launch a campaign.",
  },
  {
    id: 2,
    emoji: "✍️",
    title: "Write Message Templates",
    description:
      "Templates are the actual messages your campaign sends. Write them once and reuse them across steps. Drop in placeholders and each message gets personalised automatically.",
    linkLabel: "Go to Templates",
    linkHref: "/dashboard/templates",
    color: "secondary",
    showPlaceholders: true,
    subSteps: [
      { text: 'Open "Templates" and click New Template.' },
      {
        text: "Write your message and insert placeholders where you want personal details.",
      },
      {
        text: "Create multiple templates — one per campaign step works great.",
      },
    ],
    tip: "Short, personal messages get the best replies.",
  },
  {
    id: 3,
    emoji: "🚀",
    title: "Create a Campaign",
    description:
      "A campaign is your automated outreach sequence. Choose a channel, connect your alias, and name it.",
    linkLabel: "Go to Campaigns",
    linkHref: "/dashboard/campaigns",
    color: "accent",
    subSteps: [
      { text: 'Head to "Campaigns" and click New Campaign.' },
      { text: "Choose your campaign type: Email, Phone/SMS, or Both." },
      { text: "Select the alias(es) you created in Step 1." },
      { text: "Give it a name and save to open the step builder." },
    ],
    tip: "Start with a single channel to keep things simple.",
  },
  {
    id: 4,
    emoji: "🔧",
    title: "Build Your Campaign Steps",
    description:
      "Steps define what happens and when. Alternate between Action Steps (send a message) and Delay Steps (wait before the next one). Save all steps when done.",
    linkLabel: "Open Campaigns",
    linkHref: "/dashboard/campaigns",
    color: "primary",
    subSteps: [
      {
        text: "Add an Action Step — pick a template. Optionally set a timezone and send time.",
        note: "Great for targeting specific regions",
      },
      {
        text: "Add a Delay Step — how long to wait before the next message.",
        note: "e.g. 2 days",
      },
      {
        text: "Add another Action Step with a different template for the follow-up.",
      },
      {
        text: "Repeat the pattern as many times as you like, then save all steps.",
      },
    ],
    tip: "3–5 steps is a sweet spot. Don't overwhelm your leads!",
  },
  {
    id: 5,
    emoji: "🎯",
    title: "Enroll Your Leads",
    description:
      "Add the people you want to reach. Open your campaign, go to the Leads Enrollment tab, and add leads — you're live.",
    linkLabel: "Go to Leads",
    linkHref: "/dashboard/leads",
    color: "secondary",
    subSteps: [
      { text: "Open your campaign and click the Leads Enrollment tab." },
      {
        text: 'Click "Add Leads" — a panel opens to search and select specific leads.',
      },
      {
        text: 'Or click "Enroll All Workspace Leads" to add everyone at once.',
      },
      { text: "Click Enroll — your campaign starts running automatically." },
    ],
    tip: "Make sure leads have a contact detail that matches your campaign channel.",
  },
];
