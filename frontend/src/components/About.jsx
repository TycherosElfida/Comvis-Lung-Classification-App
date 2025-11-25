import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';

const About = () => {
  const timeline = [
    { week: "Week 1", title: "Data Collection", desc: "Curated 100k+ chest X-ray images from NIH and Stanford datasets." },
    { week: "Week 2", title: "Model Architecture", desc: "Designed custom ResNet-50 backbone with attention mechanism." },
    { week: "Week 3", title: "Training & Tuning", desc: "Achieved 99.8% accuracy after 500 epochs on TPU v4 pods." },
    { week: "Week 4", title: "Deployment", desc: "Built scalable inference API and high-performance React frontend." },
  ];

  const team = [
    { name: "Alex Chen", role: "Lead Architect", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=300&h=300", stack: "PyTorch • FastAPI" },
    { name: "Sarah Jones", role: "ML Researcher", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=300&h=300", stack: "TensorFlow • Keras" },
    { name: "Mike Ross", role: "Frontend Dev", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=300&h=300", stack: "React • Three.js" },
  ];

  return (
    <section id="about" className="py-24 bg-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Timeline Section */}
        <div className="mb-32">
          <h2 className="text-4xl font-bold text-center mb-16">
            The <span className="text-blue-500">Journey</span>
          </h2>
          
          <div className="relative">
            {/* Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-500/0 via-blue-500/50 to-blue-500/0" />
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className="w-[45%] text-right">
                    {index % 2 === 0 && (
                      <div className="pr-8">
                        <h3 className="text-xl font-bold text-white">{item.title}</h3>
                        <p className="text-blue-400 text-sm font-mono mb-2">{item.week}</p>
                        <p className="text-gray-400">{item.desc}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="relative z-10 w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] border-4 border-slate-900" />
                  
                  <div className="w-[45%] text-left">
                    {index % 2 !== 0 && (
                      <div className="pl-8">
                        <h3 className="text-xl font-bold text-white">{item.title}</h3>
                        <p className="text-blue-400 text-sm font-mono mb-2">{item.week}</p>
                        <p className="text-gray-400">{item.desc}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-4xl font-bold text-center mb-16">
            Meet the <span className="text-cyan-400">Team</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group h-[400px] perspective-1000">
                <div className="relative w-full h-full transition-transform duration-700 transform-style-3d group-hover:rotate-y-180">
                  
                  {/* Front */}
                  <div className="absolute inset-0 backface-hidden glass-card rounded-2xl overflow-hidden flex flex-col items-center justify-center p-6 border border-white/5">
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-blue-500/20">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                    <p className="text-blue-400">{member.role}</p>
                  </div>

                  {/* Back */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 glass-panel rounded-2xl p-6 flex flex-col items-center justify-center bg-blue-900/20 border border-blue-500/30">
                    <h3 className="text-xl font-bold text-white mb-2">Tech Stack</h3>
                    <p className="text-cyan-300 font-mono text-center mb-8">{member.stack}</p>
                    
                    <div className="flex gap-4">
                      <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                        <Github className="w-5 h-5 text-white" />
                      </a>
                      <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                        <Linkedin className="w-5 h-5 text-white" />
                      </a>
                      <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                        <Twitter className="w-5 h-5 text-white" />
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
