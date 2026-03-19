import type { GuideStep } from "./guideSteps";

const LEAD_PAYLOAD = `{
  "email": "jane@company.com",
  "phone": "+12125551234",
  "firstName": "Jane",
  "lastName": "Doe",
  "tags": ["hubspot", "inbound"],
  "leadStatus": "warm"
}`;

export const CRM_GUIDE_STEPS: GuideStep[] = [
  {
    id: 1,
    emoji: "🔗",
    title: "Create a Webhook Source in Drip Pilot",
    description:
      "A webhook source gives you a unique URL and secret key. Any external tool — HubSpot, Make.com, Zapier — sends leads to this URL and Drip Pilot receives them instantly.",
    linkLabel: "Go to Integrations",
    linkHref: "/dashboard/integrations",
    color: "primary",
    subSteps: [
      { text: 'Open "Integrations" in the sidebar.' },
      {
        text: 'Click "New Source" and give it a descriptive name.',
        note: 'e.g. "HubSpot CRM"',
      },
      { text: "Save — you immediately get a Webhook URL and a Secret Key." },
      {
        text: "Copy both and store them somewhere safe. The secret is shown only once.",
        note: "You can regenerate it later if needed",
      },
    ],
    tip: "Use a clear name per source so you can tell your traffic apart — e.g. 'HubSpot', 'Meta Ads', 'Website Form'.",
  },
  {
    id: 2,
    emoji: "⚙️",
    title: "Build Your Make.com Scenario",
    description:
      "Make.com (formerly Integromat) is a no-code automation tool that connects HubSpot to Drip Pilot in minutes. You can also use Zapier, n8n, or any tool that can send an HTTP request.",
    linkLabel: "Go to Integrations",
    linkHref: "/dashboard/integrations",
    color: "secondary",
    subSteps: [
      { text: "Log in to Make.com and click Create a new Scenario." },
      {
        text: "Add a trigger module: search for HubSpot and choose Watch Contacts (or Watch New Contacts).",
        note: "Fires whenever a new contact is created",
      },
      {
        text: 'Add a second module: search for "HTTP" and choose Make a Request.',
      },
      {
        text: "In the HTTP module set Method to POST and paste your Drip Pilot Webhook URL as the URL.",
      },
      {
        text: 'Under Headers add: Name = "X-Source-Secret", Value = your Secret Key.',
      },
      {
        text: 'Set Body type to "Raw" and Content type to "application/json".',
      },
    ],
    tip: "Make.com has a free tier — no credit card needed to get started.",
  },
  {
    id: 3,
    emoji: "🗂️",
    title: "Map Your HubSpot Fields to the Payload",
    description:
      "In the HTTP module body, write the JSON below and replace the static values with Make.com dynamic variables mapped from your HubSpot contact. Only email or phone is required — everything else is optional.",
    linkLabel: "Go to Integrations",
    linkHref: "/dashboard/integrations",
    color: "accent",
    codeExample: LEAD_PAYLOAD,
    subSteps: [
      {
        text: 'In Make.com, click inside the "Body" field and paste the JSON above.',
      },
      {
        text: "Replace each value with the matching HubSpot variable by clicking the field and selecting it.",
        note: "e.g. map email → Contact Email",
      },
      {
        text: 'Set "tags" to a static array like ["hubspot"] or map a HubSpot property dynamically.',
      },
      {
        text: 'Set "leadStatus" to "warm", "hot", or "cold" — or map it from HubSpot\'s lifecycle stage.',
        note: "hot | warm | cold | converted",
      },
    ],
    tip: "Tags are key — routing rules in the next step use them to auto-enroll leads into the right campaign.",
  },
  {
    id: 4,
    emoji: "🔀",
    title: "Set Up Routing Rules in Drip Pilot",
    description:
      "Routing rules automatically enroll incoming leads into campaigns the moment they arrive. No manual work needed — the right lead lands in the right campaign based on their tags and status.",
    linkLabel: "Go to Integrations",
    linkHref: "/dashboard/integrations",
    color: "primary",
    subSteps: [
      {
        text: 'In Integrations, click on your webhook source and open "Edit Rules".',
      },
      { text: 'Click "Add Rule" to create your first routing rule.' },
      {
        text: 'Set the condition: e.g. Tags contain "hubspot" AND Status is "warm".',
        note: "AND = all must match, OR = any one matches",
      },
      {
        text: "Set the action: select the campaign(s) to enroll matching leads into.",
      },
      {
        text: "Add more rules for different lead types — e.g. hot leads → high-priority campaign.",
      },
      {
        text: "Save rules. All future leads from this source are auto-routed.",
      },
    ],
    tip: "A lead matching multiple rules gets enrolled in all matching campaigns simultaneously.",
  },
  {
    id: 5,
    emoji: "✅",
    title: "Test the Full Flow",
    description:
      "Run a test in Make.com to confirm the entire pipeline — from HubSpot contact to Drip Pilot lead enrolled in a campaign — works end to end.",
    linkLabel: "Go to Leads",
    linkHref: "/dashboard/leads",
    color: "secondary",
    subSteps: [
      {
        text: 'In Make.com, click "Run Once" to trigger the scenario with a real or test contact.',
      },
      {
        text: 'Go to Drip Pilot → "Leads" and confirm the test lead appeared.',
      },
      {
        text: "Open the campaign you set in the routing rule and check the Leads Enrollment tab.",
        note: "The lead should already be enrolled",
      },
      {
        text: "Not showing up? Check the routing rule conditions match the tags and status you sent.",
      },
      {
        text: "Once confirmed, turn on your Make.com scenario and it runs automatically from now on.",
      },
    ],
    tip: "Drip Pilot responds with 202 Accepted immediately — processing is async, so give it a few seconds.",
  },
];
