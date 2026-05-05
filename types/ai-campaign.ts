export enum CampaignChannel {
  EMAIL = 'email',
  SMS = 'sms',
  BOTH = 'both',
}

export enum AiCampaignJobStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export interface AiCampaignGenerateDto {
  name: string;
  description?: string;
  templateFolderId?: string;
  campaignChannel: CampaignChannel;
  emailAliasId?: string;
  phoneAliasId?: string;
  sendWindowStart?: string;
  sendWindowEnd?: string;
  timezone?: string;
  useCase: string;
}

export interface AiCampaignResultDto {
  campaignId: string;
  stepCount: number;
  templatesCreated: number;
}

export interface AiCampaignJobResponseDto {
  jobId: string;
  status: AiCampaignJobStatus;
  result?: AiCampaignResultDto;
  error?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}
