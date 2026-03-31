export interface FAQArticle {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
}

export type FAQCategory =
  | "Getting Started"
  | "Campaigns"
  | "Leads"
  | "Billing"
  | "Integrations"
  | "Account";
