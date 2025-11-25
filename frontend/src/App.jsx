import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustedBy from './components/TrustedBy';
import Analytics from './components/Analytics';
import Demo from './components/Demo';
import About from './components/About';

function App() {
  return (
    <div className="bg-slate-900 min-h-screen text-white selection:bg-blue-500/30">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Analytics />
      <Demo />
      <About />
    </div>
  );
}

export default App;
