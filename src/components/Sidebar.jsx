import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  BarChart3, 
  UploadCloud, 
  Cpu, 
  History, 
  HelpCircle, 
  Settings, 
  Home,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const navItems = [
    { name: 'Landing Page', path: '/', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Predictions', path: '/prediction', icon: TrendingUp },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Upload Data', path: '/upload', icon: UploadCloud },
    { name: 'Model Training', path: '/model', icon: Cpu },
    { name: 'Prediction History', path: '/history', icon: History },
    { name: 'How Our AI Works', path: '/how-it-works', icon: HelpCircle },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-[#090f1d]/90 backdrop-blur-xl border-r border-blue-500/20 shadow-xl transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between overflow-y-auto`}
      >
        <div className="px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-black text-cyan-400 uppercase tracking-widest flex items-center justify-between">
            <span>Navigation Menu</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/25 font-bold border border-cyan-400/40'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white hover:border-slate-700/60 border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyan-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-90 text-cyan-200" />}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer Project Badge */}
        <div className="p-4 m-3 bg-gradient-to-br from-[#0c162e] to-[#081024] text-white rounded-2xl shadow-xl border border-cyan-500/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl -z-0"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Smart Appliance AI</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Granular appliance load forecasting & brand energy optimization.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
