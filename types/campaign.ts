export enum CampaignStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  DRAFT = 'draft',
}

export enum CampaignStepType {
  ACTION = 'action',
  DELAY = 'delay',
}

export interface ActionConfig {
  sendAt?: string;
  timezone?: string;
}

export interface DelayConfig {
  days: number;
}

export interface CampaignStep {
  id: string;
  campaignId: string;
  stepNumber: number;
  stepType: CampaignStepType;
  templateId?: string;
  stepConfig?: ActionConfig | DelayConfig;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignStepDto {
  stepType: CampaignStepType;
  templateId?: string;
  stepConfig?: ActionConfig | DelayConfig;
}

export interface UpdateCampaignStepDto {
  stepType?: CampaignStepType;
  templateId?: string;
  stepConfig?: ActionConfig | DelayConfig;
}

export interface Campaign {
  id: string;
  workspaceId: string;
  name: string;
  status: CampaignStatus;
  description?: string;
  emailBased: boolean;
  smsBased: boolean;
  emailAliasId?: string;
  phoneAliasId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignDto {
  name: string;
  description?: string;
  emailBased?: boolean;
  smsBased?: boolean;
  emailAliasId?: string;
  phoneAliasId?: string;
}

export interface UpdateCampaignDto {
  name?: string;
  description?: string;
  emailBased?: boolean;
  smsBased?: boolean;
  emailAliasId?: string;
  phoneAliasId?: string;
}

export interface UpdateCampaignStatusDto {
  status: CampaignStatus;
}

export interface SearchCampaignsDto {
  search?: string;
  status?: CampaignStatus[];
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export enum EnrollmentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  FAILED = 'failed',
}

export enum EnrollmentScope {
  SELECTION = 'selection',
  ALL = 'all',
}

export interface EnrolledLead {
  id: string;
  leadId: string;
  name: string;
  email: string;
  status: EnrollmentStatus;
  enrolledAt: string;
}

export interface EnrollLeadsDto {
  leadIds?: string[];
  scope?: EnrollmentScope;
}

export interface DeEnrollLeadsDto {
  leadIds: string[];
}

export interface GetEnrolledLeadsDto {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedEnrolledLeadsResponse {
  data: EnrolledLead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
