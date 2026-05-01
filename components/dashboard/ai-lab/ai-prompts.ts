export const INDUSTRY_PROMPTS = [
  {
    title: "Generic Master Prompt",
    prompt:
      'Generate a [LENGTH]-day lead nurture campaign for a [INDUSTRY] business. Use [CHANNEL: SMS only / Email only / SMS + Email]. Include [# SMS] SMS messages and [# EMAILS] emails exactly. Emails should fall around [LIST EMAIL DAYS —e.g. days 1, 7, 14, 28] —SMS fills the remaining touchpoints. Leads are [LEAD SOURCE/TYPE —e.g. internet leads, open house leads, cold list]. Build the campaign around [CAMPAIGN FOCUS —e.g. their home search, their coverage needs, their project]. Tone should be warm, conversational, and relationship-focused —never pushy. Each message should end with a soft question. All SMS must be 320 characters or fewer (2 Twilio segments max). Mix in some SMS messages that are 160 characters or fewer for variety. SMS signature: "-[Sender Name], [Company]". Use {{ lead.firstName }} for the lead\'s name. Sender is [Sender Name] with [Company Name]. Optionally, title each step like "Day 1 -SMS 1", "Day 3 -Email 1" —or use any naming convention that works for your workflow.',
  },
  {
    title: "Real Estate — Buyer Lead",
    prompt:
      'Generate a 30-day lead nurture campaign for a real estate business. Use SMS + Email. Include 12 SMS messages and 4 emails exactly. Emails should fall around days 1, 7, 14, and 28 —SMS fills the remaining touchpoints. Leads are buyer leads from Realtor.com who inquired about a specific property; build the campaign around their home search in general. Tone should be warm, conversational, and relationship-focused —never pushy. Each message should end with a soft question. All SMS must be 320 characters or fewer (2 Twilio segments max). Mix in some SMS messages that are 160 characters or fewer for variety. SMS signature: "-[Agent Name], KW". Use {{ lead.firstName }} for the lead\'s name. Sender is [Agent Name] with Keller Williams. Optionally, title each step like "Day 1 -SMS 1", "Day 3 -Email 1" —or use any naming convention that works for your workflow.',
  },
  {
    title: "Real Estate — Seller Lead",
    prompt:
      'Generate a 30-day lead nurture campaign for a real estate business. Use SMS + Email. Include 12 SMS messages and 4 emails exactly. Emails should fall around days 1, 7, 14, and 28 —SMS fills the remaining touchpoints. Leads are homeowners who requested a home value estimate or showed interest in selling. Build the campaign around understanding their timeline, what their home may be worth, and what the selling process looks like. Tone should be warm, consultative, and low-pressure. Each message should end with a soft question. All SMS must be 320 characters or fewer (2 Twilio segments max). Mix in some SMS messages that are 160 characters or fewer for variety. SMS signature: "-[Agent Name], KW". Use {{ lead.firstName }} for the lead\'s name. Sender is [Agent Name] with Keller Williams. Optionally, title each step like "Day 1 -SMS 1", "Day 3 -Email 1" —or use any naming convention that works for your workflow.',
  },
  {
    title: "Mortgage / Lending",
    prompt:
      'Generate a 30-day lead nurture campaign for a mortgage lending business. Use SMS + Email. Include 12 SMS messages and 4 emails exactly. Emails should fall around days 1, 7, 14, and 28 —SMS fills the remaining touchpoints. Leads are prospective borrowers who inquired about a home loan, refinance, or pre-approval. Build the campaign around their financing journey —rates, pre-approval benefits, and getting them to a conversation. Tone should be warm, helpful, and educational —never salesy. Each message should end with a soft question. All SMS must be 320 characters or fewer (2 Twilio segments max). Mix in some SMS messages that are 160 characters or fewer for variety. SMS signature: "-[Loan Officer Name], [Company]". Use {{ lead.firstName }} for the lead\'s name. Sender is [Loan Officer Name] with [Company Name]. Optionally, title each step like "Day 1 -SMS 1", "Day 3 -Email 1" —or use any naming convention that works for your workflow.',
  },
  {
    title: "Automotive",
    prompt:
      'Generate a 30-day lead nurture campaign for an automotive dealership. Use SMS + Email. Include 12 SMS messages and 4 emails exactly. Emails should fall around days 1, 7, 14, and 28 —SMS fills the remaining touchpoints. Leads are shoppers who inquired about a specific vehicle online; build the campaign around their vehicle search and buying timeline in general. Tone should be friendly, low-pressure, and helpful —never pushy. Each message should end with a soft question. All SMS must be 320 characters or fewer (2 Twilio segments max). Mix in some SMS messages that are 160 characters or fewer for variety. SMS signature: "-[Rep Name], [Dealership]". Use {{ lead.firstName }} for the lead\'s name. Sender is [Rep Name] with [Dealership Name]. Optionally, title each step like "Day 1 -SMS 1", "Day 3 -Email 1" —or use any naming convention that works for your workflow.',
  },
  {
    title: "Insurance",
    prompt:
      'Generate a 30-day lead nurture campaign for an insurance agency. Use SMS + Email. Include 12 SMS messages and 4 emails exactly. Emails should fall around days 1, 7, 14, and 28 —SMS fills the remaining touchpoints. Leads are prospects who requested a quote for [auto / home / life / health] insurance. Build the campaign around their coverage needs, the value of having the right protection, and getting them to a quick call. Tone should be warm, trustworthy, and helpful —never high-pressure. Each message should end with a soft question. All SMS must be 320 characters or fewer (2 Twilio segments max). Mix in some SMS messages that are 160 characters or fewer for variety. SMS signature: "-[Agent Name], [Agency]". Use {{ lead.firstName }} for the lead\'s name. Sender is [Agent Name] with [Agency Name]. Optionally, title each step like "Day 1 -SMS 1", "Day 3 -Email 1" —or use any naming convention that works for your workflow.',
  },
  {
    title: "General Trades (Home Services)",
    prompt:
      'Generate a 30-day lead nurture campaign for a home services / trades business. Use SMS + Email. Include 12 SMS messages and 4 emails exactly. Emails should fall around days 1, 7, 14, and 28 —SMS fills the remaining touchpoints. Leads are homeowners who requested a quote or showed interest in [plumbing / HVAC / roofing / electrical / general contracting]. Build the campaign around their project needs, the value of working with a trusted local pro, and getting them to book an estimate. Tone should be friendly, straightforward, and helpful —never pushy. Each message should end with a soft question. All SMS must be 320 characters or fewer (2 Twilio segments max). Mix in some SMS messages that are 160 characters or fewer for variety. SMS signature: "-[Rep Name], [Company]". Use {{ lead.firstName }} for the lead\'s name. Sender is [Rep Name] with [Company Name]. Optionally, title each step like "Day 1 -SMS 1", "Day 3 -Email 1" —or use any naming convention that works for your workflow.',
  },
];
