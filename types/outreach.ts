export type OutreachChannel = 'email' | 'sms'
export type OutreachSenderType = 'lead' | 'ai' | 'system' | 'user'
export type OutreachDirection = 'inbound' | 'outbound'

export interface OutreachThread {
  id: string
  workspaceId: string
  leadId: string | null
  leadEmail: string | null
  leadPhone: string | null
  senderEmail: string | null
  senderPhone: string | null
  campaignId: string | null
  aiResponseEnabled: boolean
  isUnmatched: boolean
  createdAt: string
  updatedAt: string
}

export interface OutreachMessage {
  id: string
  outreachId: string
  subject: string | null
  body: string
  channel: OutreachChannel
  senderType: OutreachSenderType
  direction: OutreachDirection
  providerMessageId: string | null
  createdAt: string
}

export interface LostThread {
  id: string
  leadEmail: string | null
  leadPhone: string | null
  updatedAt: string
}

export interface SendReplyDto {
  channel: OutreachChannel
  body: string
}

export interface ToggleAiResponseDto {
  enabled: boolean
}
