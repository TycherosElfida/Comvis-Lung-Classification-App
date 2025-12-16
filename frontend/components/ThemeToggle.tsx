'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className={cn("w-9 h-9", className)}>
        <div className="w-4 h-4" />
      </Button>
    )
  }

  const cycleTheme = () => {
    if (theme === 'dark') {
      setTheme('light')
    } else if (theme === 'light') {
      setTheme('system')
    } else {
      setTheme('dark')
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className={cn(
        "w-9 h-9 relative overflow-hidden",
        className
      )}
      title={`Current: ${theme} (click to change)`}
    >
      <motion.div
        key={resolvedTheme}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {theme === 'system' ? (
          <Monitor className="w-4 h-4" />
        ) : resolvedTheme === 'dark' ? (
          <Moon className="w-4 h-4" />
        ) : (
          <Sun className="w-4 h-4" />
        )}
      </motion.div>
    </Button>
  )
}

// Mini toggle for dashboard sidebar
export function ThemeToggleMini() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5">
      <button
        onClick={() => setTheme('light')}
        className={cn(
          "p-1.5 rounded-md transition-colors",
          resolvedTheme === 'light' && theme !== 'system' 
            ? "bg-white/20 text-white" 
            : "text-gray-400 hover:text-white"
        )}
        title="Light mode"
      >
        <Sun className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={cn(
          "p-1.5 rounded-md transition-colors",
          resolvedTheme === 'dark' && theme !== 'system'
            ? "bg-white/20 text-white" 
            : "text-gray-400 hover:text-white"
        )}
        title="Dark mode"
      >
        <Moon className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={cn(
          "p-1.5 rounded-md transition-colors",
          theme === 'system'
            ? "bg-white/20 text-white" 
            : "text-gray-400 hover:text-white"
        )}
        title="System preference"
      >
        <Monitor className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
