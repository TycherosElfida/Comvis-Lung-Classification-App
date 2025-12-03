import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Krida LungVision - AI-Powered Lung Pathology Detection',
  description: 'Advanced computer vision algorithms detecting 13 lung pathologies with 99.8% accuracy. Empowering radiologists with real-time, explainable AI insights.',
  keywords: ['lung pathology', 'medical AI', 'chest X-ray', 'computer vision', 'deep learning'],
  authors: [{ name: 'Krida LungVision Team' }],
  openGraph: {
    title: 'Krida LungVision - AI-Powered Lung Pathology Detection',
    description: 'Detect 13 lung pathologies with state-of-the-art AI',
    type: 'website'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased min-h-screen bg-gradient-to-b from-background to-background/95`}>
        {children}
      </body>
    </html>
  )
}
