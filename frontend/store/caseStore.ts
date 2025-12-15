import { create } from 'zustand'

export interface Prediction {
  label: string
  score: number
  severity: string
  urgency_tier: string
  confidence_pct: number
}

export interface Case {
  id: string
  patientName: string
  mrn: string
  imageUrl: string | null
  imageFile?: File  // Store file for gradcam generation
  predictions: Prediction[]
  urgencyTier: 'critical' | 'moderate' | 'routine'
  status: 'pending' | 'in_review' | 'verified' | 'rejected'
  heatmapUrl: string | null
  inferenceTimeMs: number
  createdAt: Date
  verifiedAt: Date | null
  notes: string
}

interface CaseStore {
  cases: Case[]
  currentCaseId: string | null
  
  // Actions
  addCase: (caseData: Omit<Case, 'id' | 'createdAt' | 'verifiedAt' | 'notes'>) => string
  updateCaseStatus: (id: string, status: Case['status']) => void
  setHeatmap: (id: string, heatmapUrl: string) => void
  setCurrentCase: (id: string | null) => void
  getCaseById: (id: string) => Case | undefined
  getCasesByStatus: (status: Case['status']) => Case[]
  addNotes: (id: string, notes: string) => void
  clearAllCases: () => void
}

// Priority order for sorting (lower = more urgent)
const URGENCY_PRIORITY: Record<string, number> = {
  critical: 0,
  moderate: 1,
  routine: 2
}

export const useCaseStore = create<CaseStore>((set, get) => ({
  cases: [],
  currentCaseId: null,

  addCase: (caseData) => {
    const id = crypto.randomUUID()
    const newCase: Case = {
      ...caseData,
      id,
      createdAt: new Date(),
      verifiedAt: null,
      notes: ''
    }
    
    set((state) => ({
      cases: [...state.cases, newCase].sort(
        (a, b) => URGENCY_PRIORITY[a.urgencyTier] - URGENCY_PRIORITY[b.urgencyTier]
      )
    }))
    
    return id
  },

  updateCaseStatus: (id, status) => {
    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              verifiedAt: status === 'verified' || status === 'rejected' ? new Date() : c.verifiedAt
            }
          : c
      )
    }))
  },

  setHeatmap: (id, heatmapUrl) => {
    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === id ? { ...c, heatmapUrl } : c
      )
    }))
  },

  setCurrentCase: (id) => {
    set({ currentCaseId: id })
  },

  getCaseById: (id) => {
    return get().cases.find((c) => c.id === id)
  },

  getCasesByStatus: (status) => {
    return get().cases.filter((c) => c.status === status)
  },

  addNotes: (id, notes) => {
    set((state) => ({
      cases: state.cases.map((c) =>
        c.id === id ? { ...c, notes } : c
      )
    }))
  },

  clearAllCases: () => {
    set({ cases: [], currentCaseId: null })
  }
}))
