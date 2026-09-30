import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import PredictionPage from './pages/PredictionPage';
import AnalyticsPage from './pages/AnalyticsPage';
import UploadPage from './pages/UploadPage';
import ModelPage from './pages/ModelPage';
import HistoryPage from './pages/HistoryPage';
import HowItWorksPage from './pages/HowItWorksPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const location = useLocation();

  const handleDemoLoaded = () => {
    // Refresh page components by bumping key
    setReloadKey((k) => k + 1);
  };

  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen cyber-bg electric-grid-pattern text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500 selection:text-black">
      {/* Decorative ambient glowing energy orbs in background */}
      <div className="fixed top-[-100px] left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-[-100px] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-100px] left-[-100px] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Top Navbar */}
      <Navbar 
        onDemoLoaded={handleDemoLoaded} 
        toggleSidebar={() => setSidebarOpen((prev) => !prev)} 
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6 relative z-10">
        
        {/* Sidebar Navigation */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0 md:ml-64 transition-all">
          <Routes key={reloadKey}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/prediction" element={<PredictionPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/model" element={<ModelPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>

      </div>

      {/* Footer */}
      <footer className="bg-[#090f1d]/90 backdrop-blur-md border-t border-slate-800/80 py-6 mt-auto text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="font-semibold text-slate-300">ElectraPredict AI</span>
            <span>— Smart Electricity Consumption & Appliance Forecaster</span>
          </div>
          <span className="text-slate-400 font-mono text-[11px]">FastAPI • React • Scikit-learn • XGBoost</span>
        </div>
      </footer>

    </div>
  );
}
