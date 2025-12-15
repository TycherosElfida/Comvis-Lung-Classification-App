'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Upload, 
  History, 
  Settings,
  Activity,
  Stethoscope
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: ReactNode
}

const navItems = [
  {
    label: 'Worklist',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Active cases'
  },
  {
    label: 'New Scan',
    href: '/dashboard/upload',
    icon: Upload,
    description: 'Upload X-ray'
  },
  {
    label: 'History',
    href: '/dashboard/history',
    icon: History,
    description: 'Past cases'
  },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-72 glass-panel border-r border-white/10 flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">Krida LungVision</h1>
              <p className="text-xs text-gray-400">Medical AI Platform</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-transform group-hover:scale-110",
                  isActive && "text-blue-400"
                )} />
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* System Status */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <Link 
            href="/" 
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-white">System Status</span>
            </div>
            <div className="space-y-1 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>AI Engine</span>
                <span className="text-green-400">Online</span>
              </div>
              <div className="flex justify-between">
                <span>Model</span>
                <span>DenseNet121</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
