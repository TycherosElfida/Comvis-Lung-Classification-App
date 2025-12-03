import { create } from 'zustand'

interface Prediction {
  id: string
  label: string
  score: number
  severity: 'high' | 'medium' | 'low'
  confidence_pct: number
}

interface PredictionHistory {
  id: string
  timestamp: Date
  predictions: Prediction[]
  imageUrl?: string
  inferenceTime: number
}

interface PredictionStore {
  history: PredictionHistory[]
  currentPrediction: PredictionHistory | null
  addToHistory: (prediction: Omit<PredictionHistory, 'id' | 'timestamp'>) => void
  clearHistory: () => void
  setCurrentPrediction: (prediction: PredictionHistory | null) => void
}

export const usePredictionStore = create<PredictionStore>((set) => ({
  history: [],
  currentPrediction: null,
  
  addToHistory: (prediction) => set((state) => ({
    history: [
      {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        ...prediction
      },
      ...state.history
    ].slice(0, 10) // Keep last 10 predictions
  })),
  
  clearHistory: () => set({ history: [] }),
  
  setCurrentPrediction: (prediction) => set({ currentPrediction: prediction })
}))
