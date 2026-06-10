import { create } from 'zustand'
import { LeadStatus } from '@/types/lead'

// Kept in a module-level store, not component state: selecting a thread navigates
// between the messages route segments and remounts MessagesClient, which would
// otherwise reset the active tab/search/status filter on every thread open.
export type MessagesTab = 'all' | 'lost'
export type StatusFilter = LeadStatus | 'all'

interface MessagesFilterState {
  activeTab: MessagesTab
  searchQuery: string
  statusFilter: StatusFilter
  setActiveTab: (tab: MessagesTab) => void
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: StatusFilter) => void
}

export const useMessagesFilterStore = create<MessagesFilterState>((set) => ({
  activeTab: 'all',
  searchQuery: '',
  statusFilter: 'all',
  setActiveTab: (activeTab) => set({ activeTab }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
}))
