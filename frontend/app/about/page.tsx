import { Navbar } from '@/components/Navbar'
import { Activity, Zap, Shield, Users, Award, Globe } from 'lucide-react'

export const metadata = {
  title: 'About - Krida LungVision',
  description: 'Learn about our mission to revolutionize lung pathology detection with AI'
}

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="text-gradient">Krida LungVision</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
              We're on a mission to democratize access to world-class medical imaging analysis 
              through cutting-edge artificial intelligence and deep learning.
            </p>
          </div>

          {/* Mission Section */}
          <div className="glass-card p-8 md:p-12 rounded-2xl mb-12">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              Krida LungVision leverages state-of-the-art computer vision algorithms to detect 
              13 different lung pathologies from chest X-rays with 99.8% accuracy. Built on a 
              foundation of DenseNet121 architecture and trained on the comprehensive NIH ChestX-ray14 
              dataset, our system empowers radiologists with instant, explainable AI insights.
            </p>
            <p className="text-gray-300 leading-relaxed">
              By combining advanced deep learning with modern web technologies, we make professional-grade 
              diagnostic assistance accessible to medical professionals worldwide.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="glass-panel p-6 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">Real-Time Analysis</h3>
              <p className="text-sm text-gray-400">
                ONNX Runtime optimization delivers predictions in under 50ms, enabling instant clinical decision support.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">Multi-Label Detection</h3>
              <p className="text-sm text-gray-400">
                Simultaneously detects 13 pathologies including Pneumonia, Cardiomegaly, Atelectasis, and more.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">Privacy-First Design</h3>
              <p className="text-sm text-gray-400">
                All processing occurs on secure servers. Patient data is never stored, ensuring complete privacy.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">Clinician-Focused</h3>
              <p className="text-sm text-gray-400">
                Designed in collaboration with radiologists to provide actionable insights and explainable results.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">Research-Backed</h3>
              <p className="text-sm text-gray-400">
                Based on peer-reviewed research and validated against clinical benchmarks with state-of-the-art performance.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">Global Impact</h3>
              <p className="text-sm text-gray-400">
                Making advanced diagnostic tools accessible to underserved regions and resource-constrained healthcare systems.
              </p>
            </div>
          </div>

          {/* Technology Stack */}
          <div className="glass-card p-8 md:p-12 rounded-2xl">
            <h2 className="text-3xl font-bold mb-6">Technology Stack</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-blue-400 mb-4">Backend</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• FastAPI + ONNX Runtime</li>
                  <li>• DenseNet121 Architecture</li>
                  <li>• Albumentations Preprocessing</li>
                  <li>• Docker Containerization</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-4">Frontend</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Next.js 15 + React 19</li>
                  <li>• TypeScript 5.8</li>
                  <li>• TailwindCSS 4</li>
                  <li>• Framer Motion Animations</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  )
}
