"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Zap,
  Shield,
  Award,
  Brain,
  Layers,
  Github,
  ExternalLink,
  GraduationCap,
  Code2,
} from "lucide-react";

// Team members data
const teamMembers = [
  {
    name: "Steven",
    studentId: "412022006",
  },
  {
    name: "Steven Felizio",
    studentId: "412023011",
  },
  {
    name: "Sanders Keane Dylan",
    studentId: "412023020",
  },
  {
    name: "Bintang Talenta Putra",
    studentId: "412023022",
  },
];

// Tech stack data
const techStack = {
  ai: [
    { name: "DenseNet121", desc: "CNN Architecture" },
    { name: "PyTorch", desc: "Deep Learning" },
    { name: "ONNX Runtime", desc: "Fast Inference" },
    { name: "Grad-CAM", desc: "Explainable AI" },
  ],
  backend: [
    { name: "FastAPI", desc: "REST API" },
    { name: "Python 3.13.10", desc: "Backend Logic" },
    { name: "Albumentations", desc: "Preprocessing" },
    { name: "Docker", desc: "Containerization" },
  ],
  frontend: [
    { name: "Next.js 16", desc: "React Framework" },
    { name: "TypeScript", desc: "Type Safety" },
    { name: "Tailwind CSS", desc: "Styling" },
    { name: "Framer Motion", desc: "Animations" },
  ],
};

// Features data
const features = [
  {
    icon: Activity,
    title: "Real-Time Analysis",
    description:
      "ONNX Runtime delivers predictions in under 50ms for instant clinical decision support.",
    color: "blue",
  },
  {
    icon: Zap,
    title: "Multi-Label Detection",
    description:
      "Simultaneously detects 13 lung pathologies including Pneumonia, Edema, and Pneumothorax.",
    color: "cyan",
  },
  {
    icon: Brain,
    title: "Explainable AI",
    description:
      "Grad-CAM heatmaps visualize model attention for transparent, trustworthy predictions.",
    color: "purple",
  },
  {
    icon: Shield,
    title: "Clinical Triage",
    description:
      "Automatic urgency classification prioritizes critical cases for faster treatment.",
    color: "green",
  },
  {
    icon: Layers,
    title: "Hospital Workflow",
    description:
      "Full worklist management with verification loop for radiologist sign-off.",
    color: "orange",
  },
  {
    icon: Award,
    title: "Research-Backed",
    description:
      "Trained on NIH ChestX-ray14 dataset with 112,120 labeled images.",
    color: "yellow",
  },
];

const colorClasses: Record<string, string> = {
  blue: "bg-blue-500/20 border-blue-500/30 text-blue-400",
  cyan: "bg-cyan-500/20 border-cyan-500/30 text-cyan-400",
  purple: "bg-purple-500/20 border-purple-500/30 text-purple-400",
  green: "bg-green-500/20 border-green-500/30 text-green-400",
  orange: "bg-orange-500/20 border-orange-500/30 text-orange-400",
  yellow: "bg-yellow-500/20 border-yellow-500/30 text-yellow-400",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              <GraduationCap className="w-4 h-4" />
              Computer Vision Final Project
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="text-gradient">Krida LungVision</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
              AI-powered chest X-ray analysis system for automated lung
              pathology detection, built as a Computer Vision course final
              project demonstrating deep learning and explainable AI techniques.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="glass-card p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-white">
                    Project Vision
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    <strong className="text-white">Krida LungVision</strong>{" "}
                    transforms chest X-ray analysis from a time-consuming manual
                    process into an AI-assisted workflow that prioritizes
                    critical cases and provides explainable insights.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    By leveraging DenseNet121 architecture trained on the NIH
                    ChestX-ray14 dataset, combined with Grad-CAM visualization,
                    we demonstrate how modern deep learning can augment clinical
                    decision-making while maintaining transparency.
                  </p>
                  <div className="flex gap-4">
                    <Link href="/dashboard">
                      <Button className="bg-blue-600 hover:bg-blue-700 rounded-full">
                        Try Dashboard
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <Link href="/research">
                      <Button variant="outline" className="rounded-full">
                        View Research
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-panel p-6 rounded-xl text-center">
                    <p className="text-3xl font-bold text-blue-400">70.36%</p>
                    <p className="text-sm text-gray-400">AUC Score</p>
                  </div>
                  <div className="glass-panel p-6 rounded-xl text-center">
                    <p className="text-3xl font-bold text-cyan-400">13</p>
                    <p className="text-sm text-gray-400">Pathologies</p>
                  </div>
                  <div className="glass-panel p-6 rounded-xl text-center">
                    <p className="text-3xl font-bold text-green-400">
                      &lt;50ms
                    </p>
                    <p className="text-sm text-gray-400">Inference</p>
                  </div>
                  <div className="glass-panel p-6 rounded-xl text-center">
                    <p className="text-3xl font-bold text-purple-400">XAI</p>
                    <p className="text-sm text-gray-400">Grad-CAM</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Key Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A comprehensive system combining state-of-the-art AI with clinical
              workflow integration
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-panel p-6 h-full hover:bg-white/5 transition-colors group">
                  <div
                    className={`w-12 h-12 rounded-lg border flex items-center justify-center mb-4 ${
                      colorClasses[feature.color]
                    } group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-white text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Technology Stack
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Built with modern, production-ready technologies
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* AI/ML */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Card className="glass-card p-6 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">AI / ML</h3>
                </div>
                <div className="space-y-3">
                  {techStack.ai.map((tech) => (
                    <div
                      key={tech.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                    >
                      <span className="font-medium text-white">
                        {tech.name}
                      </span>
                      <span className="text-xs text-gray-400">{tech.desc}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Backend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card p-6 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Backend</h3>
                </div>
                <div className="space-y-3">
                  {techStack.backend.map((tech) => (
                    <div
                      key={tech.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                    >
                      <span className="font-medium text-white">
                        {tech.name}
                      </span>
                      <span className="text-xs text-gray-400">{tech.desc}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Frontend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass-card p-6 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Frontend</h3>
                </div>
                <div className="space-y-3">
                  {techStack.frontend.map((tech) => (
                    <div
                      key={tech.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                    >
                      <span className="font-medium text-white">
                        {tech.name}
                      </span>
                      <span className="text-xs text-gray-400">{tech.desc}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white dark:text-white mb-4">
              Development Team
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Kelompok 1
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.studentId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card p-6 text-center h-full hover:bg-white/5 dark:hover:bg-white/5 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                    {member.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    {member.studentId}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* GitHub Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <a
              href="https://github.com/TycherosElfida/Comvis-Lung-Classification-App.git"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="rounded-full">
                <Github className="w-4 h-4 mr-2" />
                View on GitHub
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="glass-card p-8 md:p-12 text-center relative overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-cyan-500/10" />

              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to Explore?
                </h2>
                <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                  Experience the full hospital-grade diagnostic workflow with
                  AI-powered triage, explainable predictions, and radiologist
                  verification.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 rounded-full px-8"
                    >
                      Launch Dashboard
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/research">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full px-8"
                    >
                      Read Research Paper
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">Krida LungVision</span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/TycherosElfida/Comvis-Lung-Classification-App.git"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <p className="text-sm text-gray-400">
                Computer Vision Final Project © 2024
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
