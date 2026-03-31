import type { FAQArticle } from "@/types/support";

export const FAQ_ARTICLES: FAQArticle[] = [
  {
    id: "gs-1",
    category: "Getting Started",
    question: "How do I set up my first campaign?",
    answer:
      "Go to Campaigns → New Campaign. Choose a template or start from scratch, add your leads, configure the sequence steps, and activate. The setup guide at /dashboard/setup-guide walks you through every step.",
  },
  {
    id: "gs-2",
    category: "Getting Started",
    question: "How do I connect my email account?",
    answer:
      "Navigate to Integrations and select your email provider (Gmail, Outlook, SMTP). Follow the OAuth flow or enter your SMTP credentials. Once connected, your campaigns will send from that address.",
  },
  {
    id: "gs-3",
    category: "Getting Started",
    question: "What is the Knowledge Base used for?",
    answer:
      "The Knowledge Base stores information about your product, company, and FAQs that the AI uses to personalise outreach messages and answer lead questions automatically.",
  },
  {
    id: "c-1",
    category: "Campaigns",
    question: "Why are my campaign emails not sending?",
    answer:
      "Check that your email integration is connected under Integrations. Also verify the campaign is activated and the leads have valid email addresses. Review the Messages tab for any bounce or error notifications.",
  },
  {
    id: "c-2",
    category: "Campaigns",
    question: "Can I pause a campaign mid-way?",
    answer:
      "Yes. Open the campaign, click the three-dot menu, and select Pause. Leads already in a sequence step will not receive the next message until you resume.",
  },
  {
    id: "c-3",
    category: "Campaigns",
    question: "How does AI personalisation work in campaigns?",
    answer:
      "The AI draws from your Knowledge Base and the lead's profile data to craft personalised messages. You can control tone and style in the campaign settings.",
  },
  {
    id: "l-1",
    category: "Leads",
    question: "How do I import leads in bulk?",
    answer:
      "On the Leads page click Import, then upload a CSV file with columns for name, email, company, and any custom fields. Map the columns to our fields in the import wizard.",
  },
  {
    id: "l-2",
    category: "Leads",
    question: "Can I filter leads by campaign or status?",
    answer:
      "Yes. Use the filter bar on the Leads page to filter by status (active, replied, bounced), campaign, source, or any custom field.",
  },
  {
    id: "b-1",
    category: "Billing",
    question: "How do I upgrade my plan?",
    answer:
      "Go to Billings in the sidebar. You'll see available plans with feature comparisons. Click Upgrade and complete the payment flow. Changes take effect immediately.",
  },
  {
    id: "b-2",
    category: "Billing",
    question: "Can I cancel my subscription at any time?",
    answer:
      "Yes. Go to Billings → Manage Subscription → Cancel. Your plan remains active until the end of the current billing period.",
  },
  {
    id: "i-1",
    category: "Integrations",
    question: "Which CRMs does Drip Pilot integrate with?",
    answer:
      "We currently support HubSpot, Salesforce, and Pipedrive via native integrations. You can also connect any CRM via Zapier or our webhook integration.",
  },
  {
    id: "i-2",
    category: "Integrations",
    question: "How do I set up a webhook?",
    answer:
      "Go to Integrations → Webhooks → New Webhook. Enter the destination URL and select the events to subscribe to (e.g. lead replied, campaign completed). We'll send a POST request with the event payload.",
  },
  {
    id: "a-1",
    category: "Account",
    question: "How do I invite team members?",
    answer:
      "Go to Members → Invite Member. Enter their email and select their role (Admin or Member). They'll receive an email invite to join your workspace.",
  },
  {
    id: "a-2",
    category: "Account",
    question: "How do I switch between workspaces?",
    answer:
      "Click the workspace switcher at the top of the sidebar. You can create new workspaces or switch between existing ones you have access to.",
  },
];
