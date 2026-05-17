export enum TemplateChannel {
  SMS = "sms",
  EMAIL = "email",
}

export interface TemplateFolder {
  id: string;
  workspaceId: string;
  name: string;
  assignedUserId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  workspaceId: string;
  folderId: string | null;
  name: string;
  subject?: string;
  content: string;
  templateChannel: TemplateChannel;
  assignedUserId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AssignTemplateFolderDto {
  assignedUserId: string | null;
}

export interface AssignTemplateDto {
  assignedUserId: string | null;
}

export interface CreateTemplateDto {
  name: string;
  subject?: string;
  content: string;
  templateChannel: TemplateChannel;
  folderId?: string;
}

export interface UpdateTemplateDto {
  name?: string;
  subject?: string;
  content?: string;
  templateChannel?: TemplateChannel;
  folderId?: string | null;
}

export interface SearchTemplatesDto {
  search?: string;
  channel?: TemplateChannel;
  folderId?: string;
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
