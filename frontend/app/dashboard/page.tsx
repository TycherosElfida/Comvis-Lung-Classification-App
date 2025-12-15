'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  User,
  FileImage,
  ArrowRight,
  Plus,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCaseStore, Case } from '@/store/caseStore'
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
      icon: CheckCircle,
      label: 'Routine',
      className: 'bg-green-500/20 text-green-400 border-green-500/30'
    }
  }

  const { icon: Icon, label, className } = config[urgency as keyof typeof config] || config.routine

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
      className
    )}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  )
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const config = {
    pending: {
      label: 'Pending Review',
      className: 'bg-yellow-500/20 text-yellow-400'
    },
    in_review: {
      label: 'In Review',
      className: 'bg-blue-500/20 text-blue-400'
    },
    verified: {
      label: 'Verified',
      className: 'bg-green-500/20 text-green-400'
    },
    rejected: {
      label: 'Rejected',
      className: 'bg-red-500/20 text-red-400'
    }
  }

  const { label, className } = config[status as keyof typeof config] || config.pending

  return (
    <span className={cn(
      "px-2 py-0.5 rounded text-xs font-medium",
      className
    )}>
      {label}
    </span>
  )
}

export default function WorklistPage() {
  const { cases, getCasesByStatus } = useCaseStore()
  const pendingCases = getCasesByStatus('pending')
  const inReviewCases = getCasesByStatus('in_review')

  // Stats
  const criticalCount = cases.filter(c => c.urgencyTier === 'critical' && c.status === 'pending').length
  const moderateCount = cases.filter(c => c.urgencyTier === 'moderate' && c.status === 'pending').length
  const routineCount = cases.filter(c => c.urgencyTier === 'routine' && c.status === 'pending').length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Radiology Worklist</h1>
          <p className="text-gray-400 mt-1">AI-triaged chest X-ray cases awaiting review</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Link href="/dashboard/upload">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Scan
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="glass-card p-4 border-red-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{criticalCount}</p>
              <p className="text-xs text-gray-400">Critical</p>
            </div>
          </div>
        </Card>
        <Card className="glass-card p-4 border-orange-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{moderateCount}</p>
              <p className="text-xs text-gray-400">Moderate</p>
            </div>
          </div>
        </Card>
        <Card className="glass-card p-4 border-green-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{routineCount}</p>
              <p className="text-xs text-gray-400">Routine</p>
            </div>
          </div>
        </Card>
        <Card className="glass-card p-4 border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <FileImage className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{cases.length}</p>
              <p className="text-xs text-gray-400">Total Cases</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Cases Table */}
      <Card className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h2 className="font-semibold text-white">Pending Cases</h2>
          <p className="text-sm text-gray-400">Sorted by urgency (Critical first)</p>
        </div>
        
        {pendingCases.length === 0 ? (
          <div className="p-12 text-center">
            <FileImage className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">No pending cases</p>
            <p className="text-sm text-gray-500 mb-4">Upload a new scan to get started</p>
            <Link href="/dashboard/upload">
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Upload Scan
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            <AnimatePresence>
              {pendingCases.map((caseItem, index) => (
                <motion.div
                  key={caseItem.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0 relative">
                      {caseItem.imageUrl ? (
                        <img 
                          src={caseItem.imageUrl} 
                          alt="X-ray thumbnail"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileImage className="w-6 h-6 text-gray-600 absolute inset-0 m-auto" />
                      )}
                    </div>

                    {/* Patient Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-white">{caseItem.patientName}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-sm text-gray-400">MRN: {caseItem.mrn}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(caseItem.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Predictions Summary */}
                    <div className="flex-shrink-0 text-right">
                      {caseItem.predictions.length > 0 ? (
                        <>
                          <p className="text-sm font-medium text-white">
                            {caseItem.predictions[0].label}
                          </p>
                          <p className="text-xs text-gray-400">
                            {caseItem.predictions[0].confidence_pct}% confidence
                            {caseItem.predictions.length > 1 && ` • +${caseItem.predictions.length - 1} more`}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-400">No findings</p>
                      )}
                    </div>

                    {/* Urgency & Status */}
                    <div className="flex-shrink-0 flex items-center gap-3">
                      <UrgencyBadge urgency={caseItem.urgencyTier} />
                      <StatusBadge status={caseItem.status} />
                    </div>

                    {/* Action */}
                    <Link href={`/dashboard/case/${caseItem.id}`}>
                      <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                        Review
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </Card>
    </div>
  )
}
