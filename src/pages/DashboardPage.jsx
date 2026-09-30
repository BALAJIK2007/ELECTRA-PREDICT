import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  Activity, 
  Clock, 
  BarChart3, 
  ArrowUpRight,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import KpiCard from '../components/KpiCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchDashboard } from '../services/api';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetchDashboard();
      setData(res);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <LoadingSpinner label="Loading energy dashboard..." />;

  if (error) {
    return (
      <div className="p-6 bg-rose-950/50 text-rose-300 rounded-2xl border border-rose-500/40 space-y-2">
        <AlertCircle className="w-6 h-6 text-rose-400" />
        <h3 className="font-bold text-sm">Failed to load dashboard metrics</h3>
        <p className="text-xs text-rose-300/80">{error}</p>
        <button onClick={loadData} className="mt-3 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-md">
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading">
              Energy Analytics & Telemetry Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">
            Real-time consumption telemetry, actual vs predicted load profiles, and automated peak detection.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Predictor Active</span>
          </span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Today's Usage"
          value={data?.today_consumption}
          unit="kWh"
          subtitle="Recent logged 24h"
          icon={Zap}
          color="blue"
        />
        <KpiCard
          title="Avg Daily Baseline"
          value={data?.avg_daily_consumption}
          unit="kWh"
          subtitle="Historical average"
          icon={Activity}
          color="purple"
        />
        <KpiCard
          title="Predicted Tomorrow"
          value={data?.predicted_tomorrow}
          unit="kWh"
          subtitle="ML Model Forecast"
          icon={TrendingUp}
          color="green"
        />
        <KpiCard
          title="Monthly Total"
          value={data?.monthly_consumption}
          unit="kWh"
          subtitle="Trailing 30 days"
          icon={Calendar}
          color="amber"
        />
        <KpiCard
          title="Model Accuracy"
          value={`${data?.prediction_accuracy}%`}
          unit=""
          subtitle="R² Test Metric"
          icon={CheckCircle2}
          color="green"
        />
      </div>

      {/* Main Interactive Line Chart: Actual vs Predicted */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2 font-heading tracking-wide uppercase">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Historical Electricity Demand (Actual vs Predicted)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Chronological test validation comparing actual power consumption with machine learning predictions.
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-semibold">
            <span className="flex items-center space-x-1.5 text-cyan-400">
              <span className="w-3 h-1 bg-cyan-400 inline-block rounded" />
              <span>Actual (kWh)</span>
            </span>
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <span className="w-3 h-1 bg-emerald-400 border-t border-dashed inline-block" />
              <span>Predicted (kWh)</span>
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.historical_chart || []} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} unit=" kWh" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#090f1d', borderRadius: '12px', color: '#fff', fontSize: '12px', border: '1px solid rgba(6, 182, 212, 0.4)' }}
                formatter={(val) => [`${val} kWh`, '']}
              />
              <Line type="monotone" dataKey="actual" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 3, fill: '#06b6d4' }} activeDot={{ r: 5 }} name="Actual kWh" connectNulls />
              <Line type="monotone" dataKey="predicted" stroke="#10b981" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 3, fill: '#10b981' }} name="Predicted kWh" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Grid Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Consumption Bar Chart */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center space-x-2 font-heading tracking-wide uppercase">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>Weekly Consumption Profile</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Average daily electricity consumption broken down by day of the week.
            </p>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.weekly_chart || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090f1d', borderRadius: '12px', color: '#fff', fontSize: '12px', border: '1px solid rgba(139, 92, 246, 0.4)' }}
                  formatter={(val) => [`${val} kWh/day`, 'Avg Usage']}
                />
                <Bar dataKey="consumption" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Peak Consumption Area Chart */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center space-x-2 font-heading tracking-wide uppercase">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Hourly Load Curve (00:00 – 23:00)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Diurnal electricity demand curve identifying peak demand hours.
            </p>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.hourly_chart || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} interval={3} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090f1d', borderRadius: '12px', color: '#fff', fontSize: '12px', border: '1px solid rgba(16, 185, 129, 0.4)' }}
                  formatter={(val) => [`${val} kWh/hr`, 'Avg hourly load']}
                />
                <Area type="monotone" dataKey="consumption" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#areaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
