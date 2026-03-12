export enum CampaignStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  DRAFT = 'draft',
}

export enum CampaignStepType {
  ACTION = 'action',
  DELAY = 'delay',
}

export interface CampaignStep {
  id: string;
  campaignId: string;
  stepNumber: number;
  stepType: CampaignStepType;
  templateId?: string;
  stepConfig?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
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
