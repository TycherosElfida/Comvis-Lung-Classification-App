import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/ThemeProvider'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Krida LungVision - AI-Powered Lung Pathology Detection',
  description: 'Deep learning approach for multi-label lung pathology classification using DenseNet121 with Explainable AI (Grad-CAM) visualization.',
  keywords: ['lung pathology', 'medical AI', 'chest X-ray', 'computer vision', 'deep learning', 'Grad-CAM'],
  authors: [{ name: 'Krida LungVision Team' }],
  openGraph: {
    title: 'Krida LungVision - AI-Powered Lung Pathology Detection',
    description: 'Detect 13 lung pathologies with DenseNet121 and Explainable AI',
    type: 'website'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased min-h-screen bg-gradient-to-b from-background to-background/95`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster 
            position="bottom-right"
            toastOptions={{
              className: 'dark:bg-slate-900/90 dark:border-white/10 dark:text-white bg-white/90 border-black/10 text-slate-900 backdrop-blur-xl',
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
