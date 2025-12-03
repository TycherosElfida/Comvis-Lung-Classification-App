'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Loader2, X, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { predictLungPathology } from '@/app/actions/prediction'
import { usePredictionStore } from '@/store/predictionStore'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'

export function DemoUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [enableGradCAM, setEnableGradCAM] = useState(false)
  const [gradcamHeatmap, setGradcamHeatmap] = useState<string | null>(null)
  
  const { addToHistory, currentPrediction, setCurrentPrediction, history } = usePredictionStore()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setError(null)
    setGradcamHeatmap(null)
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // Start prediction
    setIsProcessing(true)
    
    const formData = new FormData()
    formData.append('file', selectedFile)
    
    const result = await predictLungPathology(formData, enableGradCAM)
    
    setIsProcessing(false)
    
    if (result.success && result.data) {
      const prediction = {
        predictions: result.data.predictions,
        inferenceTime: result.data.inferenceTime,
        imageUrl: objectUrl
      }
      
      const fullPrediction = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        ...prediction
      }
      
      // Store Grad-CAM heatmap if available
      if (result.data.gradcam) {
        setGradcamHeatmap(result.data.gradcam.heatmap_base64)
      }
      
      addToHistory(prediction)
      setCurrentPrediction(fullPrediction)
    } else {
      setError(result.error || 'Prediction failed')
    }
  }, [addToHistory, setCurrentPrediction, enableGradCAM])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },
    multiple: false,
    disabled: isProcessing
  })

  const clearSelection = () => {
    setFile(null)
    setPreview(null)
    setCurrentPrediction(null)
    setError(null)
    setGradcamHeatmap(null)
    if (preview) URL.revokeObjectURL(preview)
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Main Upload Area */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Grad-CAM Toggle */}
        <div className="flex items-center justify-between glass-panel p-4 rounded-xl">
          <div className="flex items-center gap-3">
            {enableGradCAM ? (
              <Eye className="w-5 h-5 text-blue-400" />
            ) : (
              <EyeOff className="w-5 h-5 text-gray-400" />
            )}
            <div>
              <p className="font-medium text-white">Explainable AI (Grad-CAM)</p>
              <p className="text-sm text-gray-400">Show heatmap of model attention regions</p>
            </div>
          </div>
          <Button
            onClick={() => setEnableGradCAM(!enableGradCAM)}
            variant={enableGradCAM ? "default" : "outline"}
            className={enableGradCAM ? "bg-blue-600" : ""}
          >
            {enableGradCAM ? 'Enabled' : 'Disabled'}
          </Button>
        </div>

        {/* Upload/Preview Card */}
        <Card
          {...getRootProps()}
          className={`relative aspect-[4/3] border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden ${
            isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 bg-slate-800/50 hover:border-gray-600'
          } ${isProcessing ? 'cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          
          {!preview ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <motion.div
                animate={{ scale: isDragActive ? 1.1 : 1 }}
                className="p-4 rounded-full bg-blue-500/10 mb-4"
              >
                <Upload className="w-8 h-8 text-blue-400" />
              </motion.div>
              <p className="text-lg font-medium text-white">Drag & drop chest X-ray here</p>
              <p className="text-sm text-gray-500 mt-2">or click to browse (JPG, PNG, max 10MB)</p>
            </div>
          ) : (
            <div className="relative w-full h-full">
              {/* Image Preview / Grad-CAM Heatmap */}
              {gradcamHeatmap && enableGradCAM ? (
                <Image
                  src={gradcamHeatmap}
                  alt="Grad-CAM heatmap"
                  fill
                  className="object-contain"
                />
              ) : preview && (
                <Image
                  src={preview}
                  alt="X-ray preview"
                  fill
                  className="object-contain"
                />
              )}

              {/* Loading Overlay */}
              <AnimatePresence>
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10"
                  >
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                    <p className="text-blue-400 font-medium animate-pulse">
                      {enableGradCAM ? 'Generating Grad-CAM...' : 'Analyzing X-ray...'}
                    </p>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent animate-scan" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Clear Button */}
              {!isProcessing && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    clearSelection()
                  }}
                  variant="destructive"
                  size="icon"
                  className="absolute top-4 right-4 z-20 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
              
              {/* Grad-CAM Badge */}
              {gradcamHeatmap && enableGradCAM && !isProcessing && (
                <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Grad-CAM Active
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-400 font-medium">{error}</p>
          </motion.div>
        )}

        {/* Results Display */}
        {currentPrediction && !isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                Analysis Complete
              </h3>
              <span className="text-sm text-gray-400">
                {currentPrediction.inferenceTime.toFixed(0)}ms
              </span>
            </div>

            <div className="space-y-3">
              {currentPrediction.predictions.length > 0 ? (
                currentPrediction.predictions.map((pred, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-white">{pred.label}</p>
                      <p className="text-sm text-gray-400">Severity: {pred.severity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-400">{pred.confidence_pct}%</p>
                      <p className="text-xs text-gray-500">Confidence</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>No significant pathologies detected</p>
                  <p className="text-sm mt-2">Lungs appear normal</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* History Sidebar */}
      <div className="glass-card p-6 rounded-2xl h-fit max-h-[600px] overflow-y-auto custom-scrollbar">
        <h3 className="text-xl font-bold mb-6">Recent Scans</h3>
        
        <div className="space-y-4">
          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-8 text-sm">No scans yet</p>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
              >
                <div className="flex gap-3">
                  {item.imageUrl && (
                    <div className="w-16 h-16 rounded-lg bg-slate-800 overflow-hidden relative flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt="Scan thumbnail"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-white truncate">
                        Scan #{item.id.slice(-6)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.predictions.slice(0, 2).map((p, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        >
                          {p.label}
                        </span>
                      ))}
                      {item.predictions.length > 2 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-500/20 text-gray-400">
                          +{item.predictions.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
