import type { PlanId, BillingInterval, AddonType, AccountStatus } from '@/config/billing.config';

export interface SubscriptionStatus {
  id: string;
  workspaceId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  planId: PlanId;
  accountStatus: AccountStatus;
  billingInterval: BillingInterval | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export interface SubscriptionCheckoutResponse {
  checkoutUrl: string;
}

export interface BillingPortalResponse {
  portalUrl: string;
}

export interface Addon {
  id: string;
  workspaceId: string;
  addonType: AddonType;
  stripeSubscriptionItemId: string;
  stripePriceId: string;
  quantity: number;
}

export interface EffectiveLimits {
  maxSeats: number | null;
  maxPhoneAliases: number | null;
  maxEmailAliases: number | null;
  maxKnowledgeBases: number | null;
  maxMessageCredits: number | null;
  whitelabelEnabled: boolean;
}

export interface CreditBalance {
  balance: number | null;
  unlimited: boolean;
}

export interface CreditLedgerEntry {
  id: string;
  workspaceId: string;
  delta: number;
  balanceAfter: number;
  reason: string;
  idempotencyKey: string;
  referenceId: string | null;
  createdAt: string;
}

export interface CreditHistory {
  entries: CreditLedgerEntry[];
  total: number;
}

export interface OverageStatus {
  enabled: boolean;
  pendingCredits: number;
  pendingUsd: string;
  settlementInProgress: boolean;
  globalThresholdUsd: number;
}

export interface CreateSubscriptionDto {
  planId: PlanId;
  interval: BillingInterval;
}

export interface ChangePlanDto {
  newPlanId: PlanId;
  interval: BillingInterval;
}

export interface AddAddonDto {
  addonType: AddonType;
  quantity: number;
}

export interface RemoveAddonDto {
  addonType: AddonType;
  quantity: number;
}
