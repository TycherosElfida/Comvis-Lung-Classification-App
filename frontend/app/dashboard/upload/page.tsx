'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Loader2, 
  User, 
  FileImage,
  AlertCircle,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCaseStore } from '@/store/caseStore'

export default function UploadPage() {
  const router = useRouter()
  const { addCase } = useCaseStore()
  
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [patientName, setPatientName] = useState('')
  const [mrn, setMrn] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setError(null)
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },
    multiple: false,
    disabled: isProcessing
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file) {
      setError('Please upload an X-ray image')
      return
    }
    
    if (!patientName.trim()) {
      setError('Please enter patient name')
      return
    }
    
    if (!mrn.trim()) {
      setError('Please enter MRN')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Call backend API
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('http://localhost:8000/api/predict', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const data = await response.json()

      // Add case to store
      const caseId = addCase({
        patientName: patientName.trim(),
        mrn: mrn.trim(),
        imageUrl: preview,
        imageFile: file,
        predictions: data.predictions || [],
        urgencyTier: data.urgency_tier || 'routine',
        status: 'pending',
        heatmapUrl: null,
        inferenceTimeMs: data.inference_time_ms || 0
      })

      // Navigate to worklist
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process scan')
    } finally {
      setIsProcessing(false)
    }
  }

  const clearSelection = () => {
    setFile(null)
    if (preview) {
      URL.revokeObjectURL(preview)
      setPreview(null)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center text-gray-400 hover:text-white mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Worklist
        </Link>
        <h1 className="text-3xl font-bold text-white">New Scan Upload</h1>
        <p className="text-gray-400 mt-1">Upload a chest X-ray for AI-powered analysis</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Information */}
        <Card className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            Patient Information
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Patient Name *
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                placeholder="Enter patient name"
                disabled={isProcessing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Medical Record Number (MRN) *
              </label>
              <input
                type="text"
                value={mrn}
                onChange={(e) => setMrn(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                placeholder="e.g., MRN-12345"
                disabled={isProcessing}
              />
            </div>
          </div>
        </Card>

        {/* Image Upload */}
        <Card className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileImage className="w-5 h-5 text-blue-400" />
            Chest X-Ray Image
          </h2>

          <div
            {...getRootProps()}
            className={`relative aspect-[4/3] border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer overflow-hidden ${
              isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 bg-slate-800/50 hover:border-gray-600'
            } ${isProcessing ? 'cursor-not-allowed opacity-50' : ''}`}
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
                <Image
                  src={preview}
                  alt="X-ray preview"
                  fill
                  className="object-contain"
                />
                {!isProcessing && (
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      clearSelection()
                    }}
                    variant="destructive"
                    size="sm"
                    className="absolute top-4 right-4"
                  >
                    Remove
                  </Button>
                )}
              </div>
            )}

            {/* Processing Overlay */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10"
              >
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-blue-400 font-medium animate-pulse">
                  Analyzing X-ray...
                </p>
              </motion.div>
            )}
          </div>
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

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Link href="/dashboard">
            <Button type="button" variant="outline" disabled={isProcessing}>
              Cancel
            </Button>
          </Link>
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 px-8"
            disabled={isProcessing || !file}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Submit for Analysis
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
