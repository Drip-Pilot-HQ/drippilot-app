export enum LeadStatus {
  HOT = "hot",
  WARM = "warm",
  COLD = "cold",
  CONVERTED = "converted",
  UNSUBSCRIBED = "unsubscribed",
}

export interface EnrolledCampaignSummary {
  id: string;
  name: string;
  campaignStatus: "active" | "paused" | "draft";
}

export interface Lead {
  id: string;
  workspaceId: string;
  assignedUserId?: string | null;
  email?: string;
  phone?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  tags: string[];
  leadStatus: LeadStatus;
  enrolledCampaigns?: EnrolledCampaignSummary[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadDto {
  email?: string;
  phone?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  tags?: string[];
  leadStatus?: LeadStatus;
}

export interface UpdateLeadDto {
  email?: string;
  phone?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  tags?: string[];
}

export interface UpdateLeadStatusDto {
  leadStatus: LeadStatus;
}

export interface SearchLeadsDto {
  search?: string;
  status?: LeadStatus[];
  tags?: string[];
  sortBy?: "createdAt" | "updatedAt" | "name";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  includeCampaigns?: boolean;
  assignedUserId?: string;
  viewMode?: "team" | "personal";
}

export interface AssignLeadDto {
  assignedUserId: string | null;
}

export interface BulkAssignLeadsDto {
  leadIds: string[];
  assignedUserId: string | null;
}

export interface PaginatedLeadsResponse {
  data: Lead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
