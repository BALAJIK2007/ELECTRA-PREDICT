import React from 'react';

export default function KpiCard({ title, value, unit, subtitle, icon: Icon, color = 'blue' }) {
  const colorMap = {
    blue: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 shadow-sm shadow-cyan-500/10',
    green: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-sm shadow-emerald-500/10',
    purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30 shadow-sm shadow-purple-500/10',
    amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-sm shadow-amber-500/10',
  };

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 shadow-md group space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${colorMap[color] || colorMap.blue} transition-transform group-hover:scale-110`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline space-x-1.5 pt-1">
        <span className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading">
          {value !== undefined && value !== null ? value : '--'}
        </span>
        {unit && (
          <span className="text-xs font-semibold text-cyan-400 font-mono">
            {unit}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-[11px] font-medium text-slate-400 flex items-center space-x-1">
          <span>{subtitle}</span>
        </p>
      )}
    </div>
  );
}
