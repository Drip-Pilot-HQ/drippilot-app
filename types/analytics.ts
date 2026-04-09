export interface LeadStatusCounts {
  cold: number;
  warm: number;
  hot: number;
  converted: number;
  unsubscribed: number;
  total: number;
}

export interface MessageCounts {
  inbound: number;
  outbound: number;
  today: number;
}

export interface CampaignCounts {
  total: number;
  active: number;
}

export interface ConversionFunnel {
  totalLeads: number;
  respondingLeads: number;
  engagedLeads: number;
  qualifiedLeads: number;
  hotLeads: number;
}

export interface MessageBreakdown {
  totalInbound: number;
  engagedInbound: number;
  optOutInbound: number;
  optOutRate: number;
}

export interface IndustryComparison {
  responseRate: number;
  industryAverage: number;
  performanceMultiplier: number;
}

export interface FinancialMetrics {
  projectedClosings: number;
  projectedRevenue: number;
  avgRevenuePerClosing: number;
  totalCampaignCost: number;
  costPerLead: number;
  costPerQualifiedLead: number;
  costPerClosing: number;
  roi: number;
  roiMultiplier: number;
  projectedCloseRate: number;
  engagementRate: number;
  conversionRate: number;
  industryComparison: IndustryComparison;
}

export interface DashboardStats {
  leads: LeadStatusCounts;
  campaigns: CampaignCounts;
  messages: MessageCounts;
  responseRate: number;
  engagementRate: number;
  conversionRate: number;
  conversionFunnel: ConversionFunnel;
  messageBreakdown: MessageBreakdown;
  financialMetrics: FinancialMetrics;
}

export interface DailyActivityEntry {
  date: string;
  messageCount: number;
  inboundCount: number;
  outboundCount: number;
}

export type EngagementTrend = "increasing" | "decreasing" | "stable";

export interface ActivityTrends {
  messageGrowth: number;
  engagementTrend: EngagementTrend;
  peakActivityDay: string;
}

export interface ActivityInsights {
  dailyActivity: DailyActivityEntry[];
  trends: ActivityTrends;
}

export interface LifecycleTimingMetrics {
  avgFirstMessageSeconds: number | null;
  avgFirstReplySeconds: number | null;
  avgTimeToHotSeconds: number | null;
  avgTimeToConvertSeconds: number | null;
  avgFirstMessageFormatted: string | null;
  avgFirstReplyFormatted: string | null;
  avgTimeToHotFormatted: string | null;
  avgTimeToConvertFormatted: string | null;
}

export interface LifecycleTotals {
  totalLeads: number;
  leadsWithFirstMessage: number;
  leadsReplied: number;
  hotLeads: number;
  convertedLeads: number;
}

export interface LifecycleMetricsResult {
  period: string;
  metrics: LifecycleTimingMetrics;
  totals: LifecycleTotals;
}

export interface BenchmarkCurrent {
  responseRate: number;
  projectedCloseRate: number;
  costPerLead: number;
  costPerClosing: number;
}

export interface BenchmarkIndustry {
  responseRate: number;
  closeRate: number;
  costPerLead: number;
  costPerClosing: number;
}

export interface BenchmarkComparison {
  responseRateMultiplier: number;
  closeRateMultiplier: number;
}

export interface BenchmarksResult {
  current: BenchmarkCurrent;
  industry: BenchmarkIndustry;
  comparison: BenchmarkComparison;
}

export type DaysFilter = 7 | 30 | 60 | 90;

// ─── Analytics Config ──────────────────────────────────────────────────────

export interface ConfigFieldEntry {
  value: number;
  isCustom: boolean;
}

export interface AnalyticsConfig {
  leadCost: ConfigFieldEntry;
  avgDealValue: ConfigFieldEntry;
  commissionPercent: ConfigFieldEntry;
  hotCloseRate: ConfigFieldEntry;
  warmCloseRate: ConfigFieldEntry;
  monthlyPlatformCost: ConfigFieldEntry;
  campaignDurationMonths: ConfigFieldEntry;
  industryResponseRate: ConfigFieldEntry;
  industryCloseRate: ConfigFieldEntry;
  industryCostPerLead: ConfigFieldEntry;
  industryCostPerClosing: ConfigFieldEntry;
}

export interface UpsertAnalyticsConfigPayload {
  leadCost?: number;
  avgDealValue?: number;
  commissionPercent?: number;
  hotCloseRate?: number;
  warmCloseRate?: number;
  monthlyPlatformCost?: number;
  campaignDurationMonths?: number;
  industryResponseRate?: number;
  industryCloseRate?: number;
  industryCostPerLead?: number;
  industryCostPerClosing?: number;
}
