'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Download, 
  BookOpen, 
  Brain, 
  Target, 
  BarChart3,
  Layers,
  Microscope,
  CheckCircle2,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Navbar } from '@/components/Navbar'

export default function ResearchPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            Research Paper
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Krida LungVision: AI-Powered <br />
            <span className="text-gradient">Chest X-Ray Analysis</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Deep Learning approach for multi-label lung pathology classification 
            using DenseNet121 with Explainable AI (Grad-CAM) visualization
          </p>
          
          {/* Download Button */}
          <div className="mt-8">
            <a href="/Laporan Akhir_KELOMPOK 1.pdf" download>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 rounded-full px-8">
                <Download className="w-5 h-5 mr-2" />
                Download Full Paper (PDF)
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Key Sections */}
        <div className="space-y-8">
          
          {/* Abstract */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Abstract</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Chest X-ray interpretation is a critical but time-consuming task in medical diagnosis. 
                This research presents <strong className="text-white">Krida LungVision</strong>, an AI-powered system 
                that leverages deep learning to automatically classify 13 different lung pathologies from chest X-ray images. 
                The system utilizes a fine-tuned <strong className="text-white">DenseNet121</strong> architecture trained on 
                the NIH ChestX-ray14 dataset, achieving high accuracy in multi-label classification. 
                To enhance clinical trust and interpretability, we integrate <strong className="text-white">Grad-CAM 
                (Gradient-weighted Class Activation Mapping)</strong> for explainable AI visualization, 
                allowing radiologists to understand which regions of the image influenced the model's predictions.
              </p>
            </Card>
          </motion.div>

          {/* System Architecture Diagram */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">System Architecture</h2>
              </div>
              
              {/* Architecture Flow Diagram */}
              <div className="relative">
                {/* Flow Steps */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Step 1: Input */}
                  <div className="glass-panel p-4 rounded-xl text-center relative">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-400 font-bold">1</span>
                    </div>
                    <h4 className="font-semibold text-white text-sm mb-1">Input</h4>
                    <p className="text-xs text-gray-400">Chest X-Ray Image (JPG/PNG)</p>
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-gray-500">→</div>
                  </div>

                  {/* Step 2: Preprocessing */}
                  <div className="glass-panel p-4 rounded-xl text-center relative">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-3">
                      <span className="text-cyan-400 font-bold">2</span>
                    </div>
                    <h4 className="font-semibold text-white text-sm mb-1">Preprocessing</h4>
                    <p className="text-xs text-gray-400">Resize, Normalize, Augment</p>
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-gray-500">→</div>
                  </div>

                  {/* Step 3: DenseNet121 */}
                  <div className="glass-panel p-4 rounded-xl text-center relative border border-blue-500/30 bg-blue-500/5">
                    <div className="w-12 h-12 rounded-full bg-blue-500/30 border border-blue-500/50 flex items-center justify-center mx-auto mb-3">
                      <Brain className="w-5 h-5 text-blue-400" />
                    </div>
                    <h4 className="font-semibold text-white text-sm mb-1">DenseNet121</h4>
                    <p className="text-xs text-gray-400">ONNX Runtime Inference</p>
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-gray-500">→</div>
                  </div>

                  {/* Step 4: Predictions */}
                  <div className="glass-panel p-4 rounded-xl text-center relative">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-400 font-bold">4</span>
                    </div>
                    <h4 className="font-semibold text-white text-sm mb-1">Predictions</h4>
                    <p className="text-xs text-gray-400">13 Pathology Scores</p>
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-gray-500">→</div>
                  </div>

                  {/* Step 5: XAI */}
                  <div className="glass-panel p-4 rounded-xl text-center relative border border-orange-500/30 bg-orange-500/5">
                    <div className="w-12 h-12 rounded-full bg-orange-500/30 border border-orange-500/50 flex items-center justify-center mx-auto mb-3">
                      <Target className="w-5 h-5 text-orange-400" />
                    </div>
                    <h4 className="font-semibold text-white text-sm mb-1">Grad-CAM</h4>
                    <p className="text-xs text-gray-400">Explainable Heatmap</p>
                  </div>
                </div>

                {/* Tech Labels */}
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
                    FastAPI Backend
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
                    Next.js Frontend
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
                    PyTorch + ONNX
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
                    Real-time Processing
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Methodology */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Methodology</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Brain className="w-4 h-4 text-blue-400" />
                    Model Architecture
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span>DenseNet121 pretrained on ImageNet</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span>Modified classifier head for 13-class multi-label output</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span>Sigmoid activation for independent probability scoring</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Microscope className="w-4 h-4 text-cyan-400" />
                    Data Processing
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span>NIH ChestX-ray14 dataset (112,120 images)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span>224×224 pixel resize with ImageNet normalization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span>Albumentations for data augmentation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Pathologies Detected */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">13 Pathologies Detected</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { name: 'Atelectasis', tier: 'routine' },
                  { name: 'Cardiomegaly', tier: 'routine' },
                  { name: 'Consolidation', tier: 'moderate' },
                  { name: 'Edema', tier: 'critical' },
                  { name: 'Effusion', tier: 'moderate' },
                  { name: 'Emphysema', tier: 'routine' },
                  { name: 'Fibrosis', tier: 'routine' },
                  { name: 'Infiltration', tier: 'moderate' },
                  { name: 'Mass', tier: 'critical' },
                  { name: 'Nodule', tier: 'routine' },
                  { name: 'Pleural Thickening', tier: 'routine' },
                  { name: 'Pneumonia', tier: 'moderate' },
                  { name: 'Pneumothorax', tier: 'critical' },
                ].map((pathology) => (
                  <div 
                    key={pathology.name}
                    className={`px-3 py-2 rounded-lg text-sm font-medium text-center border ${
                      pathology.tier === 'critical' 
                        ? 'bg-red-500/10 border-red-500/30 text-red-400'
                        : pathology.tier === 'moderate'
                        ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                        : 'bg-green-500/10 border-green-500/30 text-green-400'
                    }`}
                  >
                    {pathology.name}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4 text-center">
                Colors indicate clinical urgency: 
                <span className="text-red-400"> Critical</span>, 
                <span className="text-orange-400"> Moderate</span>, 
                <span className="text-green-400"> Routine</span>
              </p>
            </Card>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Training Results</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <p className="text-3xl font-bold text-blue-400">0.6794</p>
                  <p className="text-sm text-gray-400">Best AUC Score</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <p className="text-3xl font-bold text-cyan-400">16</p>
                  <p className="text-sm text-gray-400">Epochs Trained</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <p className="text-3xl font-bold text-green-400">13</p>
                  <p className="text-sm text-gray-400">Pathologies</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/5">
                  <p className="text-3xl font-bold text-purple-400">&lt;50ms</p>
                  <p className="text-sm text-gray-400">Inference Time</p>
                </div>
              </div>

              {/* Training Progress Chart */}
              <div className="space-y-4">
                <h3 className="font-semibold text-white">Training Progress</h3>
                <div className="rounded-xl overflow-hidden border border-white/10 bg-white p-2">
                  <img 
                    src="/output.png" 
                    alt="Training Loss and AUC Score Progress"
                    className="w-full h-auto"
                  />
                </div>
                <p className="text-sm text-gray-400 text-center">
                  Left: Training & Validation Loss convergence over 16 epochs. 
                  Right: Validation AUC Score improvement with early stopping at patience=3.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* XAI Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass-card p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Explainable AI (Grad-CAM)</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                To enhance clinical trust, our system implements <strong className="text-white">Gradient-weighted 
                Class Activation Mapping (Grad-CAM)</strong>. This technique generates visual heatmaps 
                highlighting the regions of the X-ray image that most influenced the model's predictions. 
                This allows radiologists to verify that the AI is focusing on clinically relevant areas, 
                improving transparency and enabling human-AI collaboration in diagnosis.
              </p>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-gray-400">
                  <strong className="text-white">How it works:</strong> Grad-CAM computes gradients flowing back 
                  to the final convolutional layer (DenseBlock4), producing a localization map that 
                  highlights important regions for the predicted class.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center py-8"
          >
            <p className="text-gray-400 mb-4">Ready to see the system in action?</p>
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 rounded-full px-8">
                Launch Dashboard
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
