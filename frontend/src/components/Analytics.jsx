import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { name: 'Normal', value: 450, color: '#10b981' }, // Emerald 500
  { name: 'Nodule', value: 300, color: '#3b82f6' }, // Blue 500
  { name: 'Infiltration', value: 200, color: '#f59e0b' }, // Amber 500
  { name: 'Effusion', value: 150, color: '#ef4444' }, // Red 500
];

const Analytics = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <section id="analytics" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Data-Driven <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Insights
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Our model is trained on a diverse dataset of over 100,000 annotated chest X-rays. 
              Explore the distribution of classes to understand the model's capabilities.
            </p>
            
            <div className="space-y-4">
              {data.map((item, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    activeIndex === index 
                      ? 'bg-white/10 border-blue-500/50 translate-x-2' 
                      : 'bg-white/5 border-white/5'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-white">{item.name}</span>
                    <span className="text-gray-400">{item.value} cases</span>
                  </div>
                  <div className="mt-2 w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-500"
                      style={{ 
                        width: `${(item.value / 1100) * 100}%`,
                        backgroundColor: item.color 
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-[400px] w-full glass-card rounded-2xl p-8 relative"
          >
            <h3 className="text-xl font-semibold mb-4 text-center">Dataset Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      stroke={activeIndex === index ? '#fff' : 'none'}
                      strokeWidth={2}
                      className="transition-all duration-300 outline-none"
                      style={{
                        filter: activeIndex === index ? 'drop-shadow(0 0 10px rgba(255,255,255,0.3))' : 'none',
                        opacity: activeIndex !== null && activeIndex !== index ? 0.6 : 1,
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-4">
              <span className="block text-3xl font-bold text-white">1.1k</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Total Samples</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Analytics;
