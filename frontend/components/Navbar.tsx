'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Activity, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/research', label: 'Research' },
  { href: '/about', label: 'About' },
]

export function Navbar() {
  const pathname = usePathname()

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
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || 
                (link.href !== '/' && pathname.startsWith(link.href))
              
              return (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" 
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-2">
            <ThemeToggle className="text-gray-300 hover:text-white" />
            <Link href="/research" className="hidden sm:block">
              <Button 
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Paper
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-lg hover:shadow-blue-500/50 transition-all"
              >
                Launch App
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
