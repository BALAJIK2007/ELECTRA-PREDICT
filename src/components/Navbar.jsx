import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Download, RefreshCw, Menu, X, Layers, Sparkles } from 'lucide-react';
import { loadDemoData, getExportReportUrl } from '../services/api';

export default function Navbar({ onDemoLoaded, toggleSidebar }) {
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [demoMessage, setDemoMessage] = useState(null);

  const handleLoadDemo = async () => {
    try {
      setLoadingDemo(true);
      const res = await loadDemoData();
      setDemoMessage('Demo dataset loaded successfully!');
      if (onDemoLoaded) onDemoLoaded();
      setTimeout(() => setDemoMessage(null), 3000);
    } catch (err) {
      alert(`Demo load failed: ${err.message}`);
    } finally {
      setLoadingDemo(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#090f1d]/85 backdrop-blur-xl border-b border-blue-500/20 shadow-lg shadow-black/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-800/80 border border-slate-700/50 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5 text-cyan-400" />
          </button>
          
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform border border-cyan-400/30">
              <Zap className="w-5 h-5 fill-current text-white animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent font-heading">
                ElectraPredict
              </span>
              <span className="ml-1.5 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                AI PRO
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center space-x-3">
          {demoMessage && (
            <span className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/80 px-3 py-1.5 rounded-full border border-emerald-500/50 shadow-sm shadow-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{demoMessage}</span>
            </span>
          )}

          <button
            onClick={handleLoadDemo}
            disabled={loadingDemo}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/50 hover:bg-cyan-900/60 rounded-xl border border-cyan-500/30 transition-all active:scale-95 disabled:opacity-50 hover:border-cyan-400/60 shadow-sm shadow-cyan-500/10"
            title="Populate dataset with 2,400 synthetic hourly records instantly"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingDemo ? 'animate-spin text-cyan-400' : 'text-cyan-400'}`} />
            <span>{loadingDemo ? 'Loading...' : 'Load Demo Data'}</span>
          </button>

          <a
            href={getExportReportUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-95 border border-cyan-400/30"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export PDF Report</span>
            <span className="sm:hidden">PDF</span>
          </a>
        </div>

      </div>
    </header>
  );
}
