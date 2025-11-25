import React from 'react';
import { Building2, Globe, ShieldCheck, Award, Cpu } from 'lucide-react';

const TrustedBy = () => {
  const partners = [
    { name: "MedTech Global", icon: Globe },
    { name: "HealthGuard AI", icon: ShieldCheck },
    { name: "Future Diagnostics", icon: Cpu },
    { name: "Top Hospital Network", icon: Building2 },
    { name: "Innovation Award 2024", icon: Award },
  ];

  return (
    <section className="py-12 border-y border-white/5 bg-slate-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
          Trusted by Industry Leaders
        </p>
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          {partners.map((partner, index) => (
            <div key={index} className="flex items-center gap-2 group cursor-default">
              <partner.icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <span className="text-lg font-bold text-gray-400 group-hover:text-white transition-colors">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
