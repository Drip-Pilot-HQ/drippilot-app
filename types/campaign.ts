import { TemplateChannel } from './template';

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

/**
 * Template summary embedded by GET /campaigns/:id/steps so the workflow page
 * can render template name/channel without fetching each template separately.
 */
export interface CampaignStepTemplateSummary {
  id: string;
  name: string;
  templateChannel: TemplateChannel;
}

export interface CampaignStep {
  id: string;
  campaignId: string;
  stepNumber: number;
  stepType: CampaignStepType;
  templateId?: string;
  stepConfig?: ActionConfig | DelayConfig;
  template?: CampaignStepTemplateSummary | null;
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
  assignedUserIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AssignCampaignDto {
  userIds: string[];
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
  viewMode?: 'team' | 'personal';
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

export enum ExecutionLogStatus {
  SUCCESS = 'success',
  SKIPPED = 'skipped',
  FAILED = 'failed',
}

export interface GetExecutionLogsDto {
  page?: number;
  limit?: number;
}

export interface ExecutionLog {
  id: string;
  leadId: string;
  leadName?: string;
  stepId?: string;
  stepNumber: number;
  status: ExecutionLogStatus;
  logMessage?: string;
  executedAt: string;
}

export interface PaginatedExecutionLogsResponse {
  data: ExecutionLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
