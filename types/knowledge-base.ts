export interface KbEntry {
  id: string;
  workspaceId: string;
  ownerUserId: string | null;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateKbEntryDto {
  title: string;
  content: string;
}

export interface UpdateKbEntryDto {
  title?: string;
  content?: string;
}

export interface SaveKbEntryResponse {
  id: string;
  title: string;
  content: string;
  wordCount: number;
}
