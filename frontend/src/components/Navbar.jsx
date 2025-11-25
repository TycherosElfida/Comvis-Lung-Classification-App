import React, { useState, useEffect } from 'react';
import { Activity, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-slate-900/70 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/20 rounded-lg backdrop-blur-sm border border-blue-500/30">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              LungAI
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#" className="hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Home</a>
              <a href="#features" className="hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Technology</a>
              <a href="#demo" className="hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Live Demo</a>
              <a href="#about" className="hover:text-blue-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">About</a>
            </div>
          </div>

          <div className="hidden md:block">
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]">
              Get Started
            </button>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white p-2">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden glass-panel border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/5">Home</a>
            <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/5">Technology</a>
            <a href="#demo" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/5">Live Demo</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
