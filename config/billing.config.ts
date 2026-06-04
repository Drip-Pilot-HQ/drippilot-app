export const PLAN_IDS = {
  STARTER: 'starter',
  PRO: 'pro',
  TEAMS: 'teams',
  ENTERPRISE: 'enterprise',
} as const;

export type PlanId = (typeof PLAN_IDS)[keyof typeof PLAN_IDS];

export const BILLING_INTERVALS = {
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
} as const;

export type BillingInterval = (typeof BILLING_INTERVALS)[keyof typeof BILLING_INTERVALS];

export const ADDON_TYPES = {
  SEAT: 'seat',
  PHONE_ALIAS: 'phone_alias',
  EMAIL_ALIAS: 'email_alias',
  KNOWLEDGE_BASE: 'knowledge_base',
  CREDITS: 'credits',
} as const;

export type AddonType = (typeof ADDON_TYPES)[keyof typeof ADDON_TYPES];
export type QuantityAddonType = Exclude<AddonType, 'credits'>;

export type CreditsBundle = 2500 | 5000 | 10000 | 25000 | 50000;
export const VALID_CREDITS_BUNDLES: CreditsBundle[] = [2500, 5000, 10000, 25000, 50000];

export interface CreditsBundleDisplayConfig {
  bundle: CreditsBundle;
  monthlyCredits: number;
  yearlyCredits: number;
  monthlyPrice: number;
  yearlyPrice: number;
}

export const CREDITS_BUNDLE_DISPLAY_CONFIGS: Record<CreditsBundle, CreditsBundleDisplayConfig> = {
  2500:  { bundle: 2500,  monthlyCredits: 2500,   yearlyCredits: 30000,  monthlyPrice: 150,  yearlyPrice: 1800  },
  5000:  { bundle: 5000,  monthlyCredits: 5000,   yearlyCredits: 60000,  monthlyPrice: 300,  yearlyPrice: 3600  },
  10000: { bundle: 10000, monthlyCredits: 10000,  yearlyCredits: 120000, monthlyPrice: 600,  yearlyPrice: 7200  },
  25000: { bundle: 25000, monthlyCredits: 25000,  yearlyCredits: 300000, monthlyPrice: 1375, yearlyPrice: 16500 },
  50000: { bundle: 50000, monthlyCredits: 50000,  yearlyCredits: 600000, monthlyPrice: 2500, yearlyPrice: 30000 },
};

export const PLAN_TIER: Record<PlanId, number> = {
  starter: 1,
  pro: 2,
  teams: 3,
  enterprise: 4,
};

export interface PlanDisplayConfig {
  id: PlanId;
  displayName: string;
  tagline: string;
  monthlyPrice: number;    // USD/month when billed monthly (0 if custom pricing)
  yearlyPrice: number;     // USD/month equivalent when billed annually (0 if custom pricing)
  yearlyTotal: number;     // USD total billed annually (0 if custom pricing)
  limits: {
    messageCredits: number | null;   // null = unlimited
    phoneNumbers: number | null;
    teamMembers: number | null;
    emailAliases: number | null;
    kbDocs: number | null;
    whitelabelEnabled: boolean;
  };
  popular?: boolean;
  customPricing?: boolean;
}

export const PLAN_CONFIGS: Record<PlanId, PlanDisplayConfig> = {
  starter: {
    id: 'starter',
    displayName: 'Starter',
    tagline: 'Perfect for solo outreach',
    monthlyPrice: 49,
    yearlyPrice: 49,
    yearlyTotal: 588,
    limits: {
      messageCredits: 800,
      phoneNumbers: 1,
      teamMembers: 1,
      emailAliases: 1,
      kbDocs: 10,
      whitelabelEnabled: false,
    },
  },
  pro: {
    id: 'pro',
    displayName: 'Pro',
    tagline: 'Scale your outreach',
    monthlyPrice: 129,
    yearlyPrice: 129,
    yearlyTotal: 1548,
    limits: {
      messageCredits: 2400,
      phoneNumbers: 2,
      teamMembers: 2,
      emailAliases: 2,
      kbDocs: 20,
      whitelabelEnabled: false,
    },
    popular: true,
  },
  teams: {
    id: 'teams',
    displayName: 'Teams',
    tagline: 'Built for growing teams',
    monthlyPrice: 269,
    yearlyPrice: 269,
    yearlyTotal: 3228,
    limits: {
      messageCredits: 5500,
      phoneNumbers: 4,
      teamMembers: 4,
      emailAliases: 4,
      kbDocs: 40,
      whitelabelEnabled: false,
    },
  },
  enterprise: {
    id: 'enterprise',
    displayName: 'Enterprise',
    tagline: 'Unlimited scale, custom everything',
    monthlyPrice: 0,
    yearlyPrice: 0,
    yearlyTotal: 0,
    customPricing: true,
    limits: {
      messageCredits: null,
      phoneNumbers: null,
      teamMembers: null,
      emailAliases: null,
      kbDocs: null,
      whitelabelEnabled: true,
    },
  },
};

export const PLAN_ORDER: PlanId[] = ['starter', 'pro', 'teams', 'enterprise'];

export interface AddonPriceTier {
  upTo: number | null;
  monthlyPrice: number;
  yearlyPrice: number;
}

export interface AddonDisplayConfig {
  type: AddonType;
  displayName: string;
  description: string;
  unitLabel: string;
  monthlyPrice: number;
  yearlyPrice: number;
  unitsPerQuantity: number;
  tiers?: AddonPriceTier[];
}

export const ADDON_CONFIGS: Record<QuantityAddonType, AddonDisplayConfig> = {
  seat: {
    type: 'seat',
    displayName: 'Additional Seat',
    description: 'Add more team members to your workspace',
    unitLabel: 'per seat',
    monthlyPrice: 20,
    yearlyPrice: 20,
    unitsPerQuantity: 1,
    tiers: [
      { upTo: 10,   monthlyPrice: 20, yearlyPrice: 20 },
      { upTo: null, monthlyPrice: 15, yearlyPrice: 15 },
    ],
  },
  phone_alias: {
    type: 'phone_alias',
    displayName: 'Additional Phone Number',
    description: 'Add dedicated phone numbers for outreach',
    unitLabel: 'per number',
    monthlyPrice: 2,
    yearlyPrice: 2,
    unitsPerQuantity: 1,
  },
  email_alias: {
    type: 'email_alias',
    displayName: 'Additional Email Alias',
    description: 'Add more sender email addresses',
    unitLabel: 'per alias',
    monthlyPrice: 2,
    yearlyPrice: 2,
    unitsPerQuantity: 1,
  },
  knowledge_base: {
    type: 'knowledge_base',
    displayName: 'Knowledge Base Expansion',
    description: 'Add 10 more knowledge base documents',
    unitLabel: 'per 10 docs',
    monthlyPrice: 2,
    yearlyPrice: 2,
    unitsPerQuantity: 10,
  },
};

export type AccountStatus =
  | 'active'
  | 'past_due'
  | 'canceled_pending'
  | 'suspended_dunning'
  | 'terminated'
  | 'restricted_overage'
  | 'pending';

export const ACCOUNT_STATUS_CONFIG: Record<
  AccountStatus,
  { label: string; color: string; bgColor: string }
> = {
  active:             { label: 'Active',     color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  past_due:           { label: 'Past Due',   color: 'text-amber-600',   bgColor: 'bg-amber-50'   },
  canceled_pending:   { label: 'Canceling',  color: 'text-orange-600',  bgColor: 'bg-orange-50'  },
  suspended_dunning:  { label: 'Suspended',  color: 'text-red-600',     bgColor: 'bg-red-50'     },
  terminated:         { label: 'Terminated', color: 'text-red-700',     bgColor: 'bg-red-50'     },
  restricted_overage: { label: 'Restricted', color: 'text-red-600',     bgColor: 'bg-red-50'     },
  pending:            { label: 'Pending',    color: 'text-slate-600',   bgColor: 'bg-slate-100'  },
};

export function getPlanConfig(planId: string): PlanDisplayConfig | null {
  return PLAN_CONFIGS[planId as PlanId] ?? null;
}

export function getPlanTier(planId: string): number {
  return PLAN_TIER[planId as PlanId] ?? 0;
}

export function getPlanPrice(planId: PlanId, interval: BillingInterval): number {
  const config = PLAN_CONFIGS[planId];
  if (interval === 'yearly') {
    return config.yearlyPrice > 0 ? config.yearlyPrice : config.monthlyPrice;
  }
  return config.monthlyPrice;
}

/**
 * Compute the total monthly cost for `qty` units of an addon,
 * respecting volume tiers if defined.
 */
export function getAddonTieredCost(
  type: QuantityAddonType,
  interval: BillingInterval,
  qty: number,
): number {
  const config = ADDON_CONFIGS[type];
  if (!config.tiers || qty === 0) {
    const unitPrice = interval === 'yearly' ? config.yearlyPrice : config.monthlyPrice;
    return unitPrice * qty;
  }

  let remaining = qty;
  let total = 0;
  let tierStart = 1;

  for (const tier of config.tiers) {
    if (remaining <= 0) break;
    const tierCapacity = tier.upTo !== null ? tier.upTo - tierStart + 1 : Infinity;
    const unitsInTier = Math.min(remaining, tierCapacity);
    const unitPrice = interval === 'yearly' ? tier.yearlyPrice : tier.monthlyPrice;
    total += unitsInTier * unitPrice;
    remaining -= unitsInTier;
    tierStart = tier.upTo !== null ? tier.upTo + 1 : tierStart;
  }

  return total;
}

/**
 * Returns a human-readable breakdown of tiered pricing for display.
 * e.g. ["10 × $49 = $490", "1 × $45 = $45"]
 */
export function getAddonTierBreakdown(
  type: QuantityAddonType,
  interval: BillingInterval,
  qty: number,
): string[] {
  const config = ADDON_CONFIGS[type];
  if (!config.tiers || qty === 0) return [];

  const lines: string[] = [];
  let remaining = qty;
  let tierStart = 1;

  for (const tier of config.tiers) {
    if (remaining <= 0) break;
    const tierCapacity = tier.upTo !== null ? tier.upTo - tierStart + 1 : Infinity;
    const unitsInTier = Math.min(remaining, tierCapacity);
    const unitPrice = interval === 'yearly' ? tier.yearlyPrice : tier.monthlyPrice;
    const cost = unitsInTier * unitPrice;
    lines.push(`${unitsInTier} × $${unitPrice} = $${cost.toFixed(0)}`);
    remaining -= unitsInTier;
    tierStart = tier.upTo !== null ? tier.upTo + 1 : tierStart;
  }

  return lines;
}
