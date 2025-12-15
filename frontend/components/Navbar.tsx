'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Krida <span className="text-blue-400">LungVision</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              href="/dashboard" 
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Dashboard
            </Link>
            <Link 
              href="/about" 
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              About
            </Link>
          </div>

          {/* CTA Button */}
          <Link href="/dashboard">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-lg hover:shadow-blue-500/50 transition-all"
            >
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
