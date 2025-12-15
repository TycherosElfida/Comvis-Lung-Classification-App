'use client'

import Link from 'next/link'
import { History as HistoryIcon, ArrowLeft, User, Clock, CheckCircle2, XCircle, FileImage } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCaseStore } from '@/store/caseStore'
import { cn } from '@/lib/utils'

export default function HistoryPage() {
  const { cases } = useCaseStore()
  
  const verifiedCases = cases.filter(c => c.status === 'verified')
  const rejectedCases = cases.filter(c => c.status === 'rejected')
  const completedCases = [...verifiedCases, ...rejectedCases].sort(
    (a, b) => new Date(b.verifiedAt || 0).getTime() - new Date(a.verifiedAt || 0).getTime()
  )

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center text-gray-400 hover:text-white mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Worklist
        </Link>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <HistoryIcon className="w-8 h-8 text-blue-400" />
          Case History
        </h1>
        <p className="text-gray-400 mt-1">Previously reviewed and verified cases</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="glass-card p-4 border-green-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{verifiedCases.length}</p>
              <p className="text-xs text-gray-400">Verified</p>
            </div>
          </div>
        </Card>
        <Card className="glass-card p-4 border-red-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{rejectedCases.length}</p>
              <p className="text-xs text-gray-400">Rejected</p>
            </div>
          </div>
        </Card>
      </div>

      {/* History List */}
      <Card className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h2 className="font-semibold text-white">Completed Cases</h2>
        </div>
        
        {completedCases.length === 0 ? (
          <div className="p-12 text-center">
            <HistoryIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">No completed cases yet</p>
            <p className="text-sm text-gray-500">Cases will appear here after verification</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {completedCases.map((caseItem) => (
              <div key={caseItem.id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0 relative">
                    {caseItem.imageUrl ? (
                      <img 
                        src={caseItem.imageUrl} 
                        alt="X-ray thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FileImage className="w-5 h-5 text-gray-600 absolute inset-0 m-auto" />
                    )}
                  </div>

                  {/* Patient Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-white">{caseItem.patientName}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-sm text-gray-400">MRN: {caseItem.mrn}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Reviewed: {caseItem.verifiedAt ? new Date(caseItem.verifiedAt).toLocaleString() : 'N/A'}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <span className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    caseItem.status === 'verified' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  )}>
                    {caseItem.status === 'verified' ? 'Verified' : 'Rejected'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
