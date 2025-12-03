import { Navbar } from '@/components/Navbar'
import { DemoUpload } from '@/components/DemoUpload'

export const metadata = {
  title: 'Live Demo - Krida LungVision',
  description: 'Upload chest X-rays for instant AI-powered pathology detection'
}

export default function DemoPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Live Lung <span className="text-gradient">Analysis</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Upload a chest X-ray to detect anomalies in real-time. Our AI analyzes 13 different pathologies with state-of-the-art accuracy.
            </p>
          </div>

          {/* Demo Component */}
          <DemoUpload />

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="glass-panel p-6 rounded-xl">
              <h3 className="font-semibold text-white mb-2">Instant Results</h3>
              <p className="text-sm text-gray-400">Get analysis in under 50ms with our optimized ONNX Runtime inference</p>
            </div>
            <div className="glass-panel p-6 rounded-xl">
              <h3 className="font-semibold text-white mb-2">13 Pathologies</h3>
              <p className="text-sm text-gray-400">Detects Pneumonia, Cardiomegaly, Atelectasis, and 10 more conditions</p>
            </div>
            <div className="glass-panel p-6 rounded-xl">
              <h3 className="font-semibold text-white mb-2">Privacy First</h3>
              <p className="text-sm text-gray-400">All processing happens locally. Your images are never stored</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
