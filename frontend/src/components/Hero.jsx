import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Activity } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              AI-Powered Diagnostics v2.0
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Vision for a <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Safer Tomorrow
              </span>
            </h1>

            <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
              Advanced computer vision algorithms detecting lung anomalies with 99.8% accuracy. 
              Empowering radiologists with real-time, explainable AI insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group relative px-8 py-4 bg-blue-600 rounded-full text-white font-semibold shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:shadow-[0_0_60px_rgba(37,99,235,0.5)] transition-all overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="flex items-center gap-2">
                  Try Demo Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <button className="px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-gray-300 font-medium">
                View Research
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5">
              <div>
                <h3 className="text-2xl font-bold text-white">99.8%</h3>
                <p className="text-sm text-gray-500">Accuracy Rate</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">&lt;50ms</h3>
                <p className="text-sm text-gray-500">Inference Time</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">10k+</h3>
                <p className="text-sm text-gray-500">Scans Processed</p>
              </div>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 glass-card rounded-2xl p-4 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
              
              {/* Simulated Scanning UI */}
              <div className="relative aspect-square bg-slate-800 rounded-xl overflow-hidden group">
                {/* Placeholder for 3D/Video - Using a gradient for now */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-50 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90" />
                
                {/* Scanning Line Animation */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-500/0 to-blue-500/20 border-b border-blue-400/50 animate-[scan_3s_ease-in-out_infinite]" />

                {/* Floating UI Elements */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-6 left-6 right-6 p-4 glass-panel rounded-xl border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">Analysis Complete</span>
                    <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">CONFIRMED</span>
                  </div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[98%]" />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-gray-400">
                    <span>Nodule Detected</span>
                    <span>0.98 Confidence</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Decorative Elements behind */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/30 rounded-full blur-2xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/30 rounded-full blur-2xl -z-10" />
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
