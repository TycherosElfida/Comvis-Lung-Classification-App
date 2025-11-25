import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Settings, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useInference } from '../hooks/useInference';
import InferenceCanvas from './InferenceCanvas';

const Demo = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showConfidence, setShowConfidence] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [history, setHistory] = useState([]);
  
  const { predict, loading, result, error } = useInference();

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('lung_ai_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const onDrop = useCallback(async (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // Auto-predict on drop
    const res = await predict(selectedFile);
    
    if (res) {
      // Save to history
      const newEntry = {
        id: Date.now(),
        preview: objectUrl, // Note: In real app, persist image to server or base64
        predictions: res.predictions,
        timestamp: new Date().toISOString()
      };
      // For demo, we can't persist blob URLs across refresh effectively without base64, 
      // but let's just keep it in state for now or use base64 if needed.
      // For this demo, we'll skip complex persistence of the image data itself to localStorage to avoid quota limits.
      // We'll just update the in-memory history.
      const newHistory = [newEntry, ...history].slice(0, 10);
      setHistory(newHistory);
      // localStorage.setItem('lung_ai_history', JSON.stringify(newHistory)); 
    }
  }, [predict, history]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false
  });

  const clearSelection = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
  };

  return (
    <section id="demo" className="py-24 min-h-screen bg-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Live Analysis</h2>
          <p className="text-gray-400">Upload a chest X-ray to detect anomalies in real-time.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Interaction Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Upload/Canvas Area */}
            <div 
              {...getRootProps()} 
              className={`relative aspect-[4/3] rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden group ${
                isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              <input {...getInputProps()} />
              
              {!preview ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <div className={`p-4 rounded-full bg-slate-800 mb-4 transition-transform ${isDragActive ? 'scale-110' : ''}`}>
                    <Upload className="w-8 h-8 text-blue-400" />
                  </div>
                  <p className="text-lg font-medium">Drag & drop X-ray here</p>
                  <p className="text-sm text-gray-500 mt-2">or click to browse</p>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  {loading && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm">
                      <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                      <p className="text-blue-400 font-medium animate-pulse">Analyzing Scan...</p>
                      {/* Skeleton Scan Effect */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent animate-[scan_2s_ease-in-out_infinite]" />
                    </div>
                  )}
                  
                  {/* Result Canvas */}
                  {!loading && result && (
                    <InferenceCanvas 
                      imageSrc={preview} 
                      predictions={result.predictions}
                      showConfidence={showConfidence}
                      showLabels={showLabels}
                    />
                  )}

                  {/* Just Image if no result yet (shouldn't happen with auto-predict but good fallback) */}
                  {!loading && !result && (
                    <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                  )}

                  {/* Clear Button */}
                  <button 
                    onClick={clearSelection}
                    className="absolute top-4 right-4 z-30 p-2 bg-slate-900/80 hover:bg-red-500/80 text-white rounded-full backdrop-blur-md transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Controls */}
            {result && (
              <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-300">
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">View Options</span>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={showConfidence} 
                      onChange={(e) => setShowConfidence(e.target.checked)}
                      className="rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-300">Show Confidence</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={showLabels} 
                      onChange={(e) => setShowLabels(e.target.checked)}
                      className="rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-300">Show Labels</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / History */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl h-full max-h-[600px] overflow-y-auto custom-scrollbar">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-400" />
                Recent Analysis
              </h3>
              
              <div className="space-y-4">
                {history.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No recent scans</p>
                ) : (
                  history.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 rounded-lg bg-slate-800 overflow-hidden">
                          {/* Note: Blob URLs might expire, in real app use base64 or server URL */}
                          <img src={item.preview} alt="Thumbnail" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-medium text-white truncate">
                              Scan #{item.id.toString().slice(-4)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(item.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.predictions.map((p, i) => (
                              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                {p.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Demo;
