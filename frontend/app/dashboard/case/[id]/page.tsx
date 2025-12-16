'use client'

import { useState, useEffect, use, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  User, 
  Clock, 
  Eye,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  SplitSquareHorizontal,
  Keyboard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCaseStore, Case, Prediction } from '@/store/caseStore'
import { cn } from '@/lib/utils'

// Urgency badge component
function UrgencyBadge({ urgency }: { urgency: string }) {
  const config = {
    critical: {
      icon: AlertTriangle,
      label: 'Critical',
      className: 'bg-red-500/20 text-red-400 border-red-500/30'
    },
    moderate: {
      icon: AlertCircle,
      label: 'Moderate', 
      className: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    },
    routine: {
      icon: CheckCircle2,
      label: 'Routine',
      className: 'bg-green-500/20 text-green-400 border-green-500/30'
    }
  }

  const { icon: Icon, label, className } = config[urgency as keyof typeof config] || config.routine

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border",
      className
    )}>
      <Icon className="w-4 h-4" />
      {label}
    </span>
  )
}

// Finding card component
function FindingCard({ 
  prediction, 
  isSelected,
  onSelect 
}: { 
  prediction: Prediction
  isSelected: boolean
  onSelect: () => void 
}) {
  const severityColors = {
    high: 'border-red-500/30 bg-red-500/10',
    medium: 'border-orange-500/30 bg-orange-500/10',
    low: 'border-yellow-500/30 bg-yellow-500/10'
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={cn(
        "p-4 rounded-xl border cursor-pointer transition-all",
        isSelected 
          ? "border-blue-500 bg-blue-500/20 ring-2 ring-blue-500/50" 
          : severityColors[prediction.severity as keyof typeof severityColors] || "border-white/10 bg-white/5"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-white">{prediction.label}</span>
        <span className={cn(
          "text-xs px-2 py-0.5 rounded",
          prediction.urgency_tier === 'critical' ? 'bg-red-500/20 text-red-400' :
          prediction.urgency_tier === 'moderate' ? 'bg-orange-500/20 text-orange-400' :
          'bg-green-500/20 text-green-400'
        )}>
          {prediction.urgency_tier}
        </span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-blue-400">{prediction.confidence_pct}%</span>
        <span className="text-sm text-gray-400 mb-1">confidence</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${prediction.confidence_pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            prediction.confidence_pct >= 75 ? "bg-red-500" :
            prediction.confidence_pct >= 50 ? "bg-orange-500" :
            "bg-yellow-500"
          )}
        />
      </div>
    </motion.div>
  )
}

interface CaseViewerPageProps {
  params: Promise<{ id: string }>
}

export default function CaseViewerPage({ params }: CaseViewerPageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { getCaseById, updateCaseStatus, setHeatmap } = useCaseStore()
  
  const [caseData, setCaseData] = useState<Case | null>(null)
  const [selectedFinding, setSelectedFinding] = useState<string | null>(null)
  const [isGeneratingHeatmap, setIsGeneratingHeatmap] = useState(false)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [notes, setNotes] = useState('')

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      
      if (e.key === 'v' || e.key === 'V') {
        handleVerify()
      } else if (e.key === 'r' || e.key === 'R') {
        handleReject()
      } else if (e.key === 'c' || e.key === 'C') {
        if (caseData?.heatmapUrl) {
          setCompareMode(!compareMode)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [caseData, compareMode])

  useEffect(() => {
    const foundCase = getCaseById(resolvedParams.id)
    if (foundCase) {
      setCaseData(foundCase)
      setNotes(foundCase.notes)
      // Auto-select first finding
      if (foundCase.predictions.length > 0 && !selectedFinding) {
        setSelectedFinding(foundCase.predictions[0].label)
      }
    }
  }, [resolvedParams.id, getCaseById, selectedFinding])

  const handleGenerateHeatmap = async () => {
    if (!caseData || !caseData.imageFile) return

    setIsGeneratingHeatmap(true)

    try {
      const formData = new FormData()
      formData.append('file', caseData.imageFile)
      if (selectedFinding) {
        formData.append('target_class', selectedFinding)
      }

      const response = await fetch('http://localhost:8000/api/gradcam', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to generate heatmap')
      }

      const data = await response.json()
      
      if (data.gradcam?.heatmap_base64) {
        setHeatmap(caseData.id, data.gradcam.heatmap_base64)
        setCaseData(prev => prev ? { ...prev, heatmapUrl: data.gradcam.heatmap_base64 } : null)
        setShowHeatmap(true)
        toast.success('Heatmap generated', {
          description: `Visualizing attention for ${selectedFinding}`,
        })
      }
    } catch (err) {
      console.error('Heatmap generation failed:', err)
      toast.error('Heatmap generation failed', {
        description: 'Please try again',
      })
    } finally {
      setIsGeneratingHeatmap(false)
    }
  }

  const handleVerify = () => {
    if (caseData) {
      updateCaseStatus(caseData.id, 'verified')
      toast.success('Case verified', {
        description: `${caseData.patientName} • AI diagnosis confirmed`,
      })
      router.push('/dashboard')
    }
  }

  const handleReject = () => {
    if (caseData) {
      updateCaseStatus(caseData.id, 'rejected')
      toast('Case rejected', {
        description: `${caseData.patientName} • Sent for manual review`,
      })
      router.push('/dashboard')
    }
  }

  if (!caseData) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Case not found</p>
      </div>
    )
  }

  return (
    <div className="p-8 h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{caseData.patientName}</h1>
              <UrgencyBadge urgency={caseData.urgencyTier} />
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                MRN: {caseData.mrn}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(caseData.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            onClick={handleReject}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Reject
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={handleVerify}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Verify AI Diagnosis
          </Button>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
        {/* Left Panel - Image Viewer */}
        <Card className="glass-card p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">
              {compareMode ? 'Compare View' : showHeatmap && caseData.heatmapUrl ? 'XAI Heatmap View' : 'Original X-Ray'}
            </h2>
            <div className="flex gap-2">
              {caseData.heatmapUrl && (
                <>
                  <Button
                    variant={compareMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setCompareMode(!compareMode)
                      if (!compareMode) setShowHeatmap(false)
                    }}
                    className={compareMode ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    <SplitSquareHorizontal className="w-4 h-4 mr-2" />
                    Compare
                  </Button>
                  {!compareMode && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowHeatmap(!showHeatmap)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {showHeatmap ? 'Original' : 'Heatmap'}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
          
          <div className="flex-1 relative bg-slate-900 rounded-xl overflow-hidden">
            {/* Compare Mode with Slider */}
            {compareMode && caseData.heatmapUrl && caseData.imageUrl ? (
              <div className="absolute inset-0">
                {/* Original Image (full) */}
                <Image
                  src={caseData.imageUrl}
                  alt="Original X-Ray"
                  fill
                  className="object-contain"
                />
                
                {/* Heatmap Image (clipped) */}
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <Image
                    src={caseData.heatmapUrl}
                    alt="Grad-CAM Heatmap"
                    fill
                    className="object-contain"
                    style={{ 
                      width: `${100 / (sliderPosition / 100)}%`,
                      maxWidth: 'none'
                    }}
                  />
                </div>
                
                {/* Slider Handle */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
                  style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                  onMouseDown={(e) => {
                    const container = e.currentTarget.parentElement
                    if (!container) return
                    
                    const handleMouseMove = (moveEvent: MouseEvent) => {
                      const rect = container.getBoundingClientRect()
                      const pos = ((moveEvent.clientX - rect.left) / rect.width) * 100
                      setSliderPosition(Math.max(0, Math.min(100, pos)))
                    }
                    
                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove)
                      document.removeEventListener('mouseup', handleMouseUp)
                    }
                    
                    document.addEventListener('mousemove', handleMouseMove)
                    document.addEventListener('mouseup', handleMouseUp)
                  }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <div className="flex gap-0.5">
                      <div className="w-0.5 h-4 bg-gray-400 rounded" />
                      <div className="w-0.5 h-4 bg-gray-400 rounded" />
                    </div>
                  </div>
                </div>
                
                {/* Labels */}
                <div className="absolute bottom-4 left-4 px-2 py-1 rounded bg-black/60 text-xs text-white">
                  Heatmap
                </div>
                <div className="absolute bottom-4 right-4 px-2 py-1 rounded bg-black/60 text-xs text-white">
                  Original
                </div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {showHeatmap && caseData.heatmapUrl ? (
                  <motion.div
                    key="heatmap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={caseData.heatmapUrl}
                      alt="Grad-CAM Heatmap"
                      fill
                      className="object-contain"
                    />
                  </motion.div>
                ) : caseData.imageUrl ? (
                  <motion.div
                    key="original"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={caseData.imageUrl}
                      alt="Original X-Ray"
                      fill
                      className="object-contain"
                    />
                  </motion.div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500">No image available</p>
                  </div>
                )}
              </AnimatePresence>
            )}

            {/* Heatmap Generation Loading Overlay */}
            {isGeneratingHeatmap && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
                <p className="text-blue-400 font-medium">Generating XAI Heatmap...</p>
                <p className="text-sm text-gray-400">Analyzing: {selectedFinding}</p>
              </div>
            )}
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 font-mono">V</kbd>
              Verify
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 font-mono">R</kbd>
              Reject
            </span>
            {caseData.heatmapUrl && (
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 font-mono">C</kbd>
                Compare
              </span>
            )}
          </div>
        </Card>

        {/* Right Panel - Findings */}
        <div className="flex flex-col gap-4 overflow-hidden">
          {/* Findings List */}
          <Card className="glass-card p-4 flex-1 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">AI Findings</h2>
              <span className="text-sm text-gray-400">
                Inference: {caseData.inferenceTimeMs.toFixed(0)}ms
              </span>
            </div>

            {caseData.predictions.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                <p className="text-white font-medium">No Significant Findings</p>
                <p className="text-sm text-gray-400">X-ray appears normal</p>
              </div>
            ) : (
              <div className="space-y-3">
                {caseData.predictions.map((pred) => (
                  <FindingCard
                    key={pred.label}
                    prediction={pred}
                    isSelected={selectedFinding === pred.label}
                    onSelect={() => setSelectedFinding(pred.label)}
                  />
                ))}
              </div>
            )}
          </Card>

          {/* XAI Generation */}
          <Card className="glass-card p-4">
            <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              Explainable AI (Grad-CAM)
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Generate a heatmap to visualize where the AI focused its attention for the selected finding.
            </p>
            <Button
              onClick={handleGenerateHeatmap}
              disabled={isGeneratingHeatmap || !selectedFinding || !caseData.imageFile}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isGeneratingHeatmap ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Generate Heatmap for "{selectedFinding}"
                </>
              )}
            </Button>
            {!caseData.imageFile && (
              <p className="text-xs text-yellow-400 mt-2">
                Note: Heatmap generation requires the original image file.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
