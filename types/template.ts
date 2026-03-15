export enum TemplateChannel {
  SMS = "sms",
  EMAIL = "email",
}

export interface Template {
  id: string;
  workspaceId: string;
  name: string;
  subject?: string;
  content: string;
  templateChannel: TemplateChannel;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateDto {
  name: string;
  subject?: string;
  content: string;
  templateChannel: TemplateChannel;
}

export interface UpdateTemplateDto {
  name?: string;
  subject?: string;
  content?: string;
  templateChannel?: TemplateChannel;
}

export interface SearchTemplatesDto {
  search?: string;
  channel?: TemplateChannel;
  sortBy?: "createdAt" | "updatedAt" | "name";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface PaginatedTemplatesResponse {
  data: Template[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
