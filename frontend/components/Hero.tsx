"use client";

import { motion } from "framer-motion";
import { ArrowRight, Activity, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10">
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
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              AI-Powered Diagnostics v2.0
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Vision for a <br />
              <span className="text-gradient">Safer Tomorrow</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
              Advanced computer vision algorithms detecting 13 lung pathologies.
              Empowering radiologists with real-time, explainable AI insights.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="group relative px-8 py-6 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-semibold shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:shadow-[0_0_60px_rgba(37,99,235,0.5)] transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="flex items-center gap-2">
                    Launch Dashboard{" "}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>

              <Link href="/research">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 rounded-full border-white/10 hover:bg-white/5 transition-colors text-gray-300 font-medium"
                >
                  View Research
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5">
              <div>
                <h3 className="text-2xl font-bold text-white">70.36%</h3>
                <p className="text-sm text-gray-500">AUC Score</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">&lt;50ms</h3>
                <p className="text-sm text-gray-500">Inference Time</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">13</h3>
                <p className="text-sm text-gray-500">Pathologies</p>
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
              <div className="relative aspect-square bg-slate-800/50 rounded-xl overflow-hidden group">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90" />
                </div>

                {/* Scanning Line Animation */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-500/0 to-blue-500/20 border-b border-blue-400/50 animate-scan" />

                {/* Floating UI Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute bottom-6 left-6 right-6 p-4 glass-panel rounded-xl border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">
                      Analysis Complete
                    </span>
                    <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">
                      CONFIRMED
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[98%]" />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-gray-400">
                    <span>Pathology Detected</span>
                    <span>0.98 Confidence</span>
                  </div>
                </motion.div>

                {/* Feature Icons */}
                <div className="absolute top-6 left-6 space-y-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                    className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center"
                  >
                    <Activity className="w-5 h-5 text-blue-400" />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center"
                  >
                    <Zap className="w-5 h-5 text-cyan-400" />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="w-10 h-10 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center"
                  >
                    <Shield className="w-5 h-5 text-green-400" />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/30 rounded-full blur-2xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/30 rounded-full blur-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
