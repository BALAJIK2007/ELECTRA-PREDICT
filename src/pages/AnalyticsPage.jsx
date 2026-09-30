import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Clock, 
  Calendar, 
  TrendingUp, 
  Lightbulb, 
  Zap, 
  Sun, 
  AlertTriangle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import KpiCard from '../components/KpiCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchAnalytics, fetchInsights } from '../services/api';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [resAnal, resIns] = await Promise.all([
        fetchAnalytics(),
        fetchInsights()
      ]);
      setAnalytics(resAnal);
      setInsights(resIns);
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

  if (loading) return <LoadingSpinner label="Calculating advanced energy analytics..." />;

  const getInsightIcon = (type) => {
    switch (type) {
      case 'peak': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'solar': return <Sun className="w-5 h-5 text-emerald-500" />;
      case 'forecast': return <TrendingUp className="w-5 h-5 text-blue-500" />;
      default: return <Lightbulb className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <span>Advanced Energy Analytics & AI Insights</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Deep dive into load curves, peak demand intervals, and automated energy-saving recommendations.
        </p>
      </div>

      {/* Dynamic Peak KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Peak Demand Hour"
          value={analytics?.peak_hour}
          unit=""
          subtitle="Highest hourly load window"
          icon={Clock}
          color="amber"
        />
        <KpiCard
          title="Peak Consumption Record"
          value={analytics?.peak_consumption}
          unit="kWh"
          subtitle="Single hourly maximum"
          icon={Zap}
          color="purple"
        />
        <KpiCard
          title="Highest Demand Day"
          value={analytics?.peak_day}
          unit=""
          subtitle="Day of week peak average"
          icon={Calendar}
          color="blue"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Hourly Peak Load Curve */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Consumption by Hour (Peak Detection)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Average hourly electricity load profile across 24-hour cycle.
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.hourly_data || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} interval={3} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} unit=" kWh" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Area type="monotone" dataKey="avg_kwh" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#areaBlue)" name="Avg Load (kWh)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Day of Week Comparison */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span>Consumption by Day of Week</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparing average total daily electricity load across Monday – Sunday.
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.daily_data || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} unit=" kWh" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="avg_daily_kwh" fill="#10b981" radius={[6, 6, 0, 0]} name="Daily Total (kWh)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* AI Energy-Saving Suggestions Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            AI Data-Driven Energy Saving Insights
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((ins) => (
            <div 
              key={ins.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3 flex items-start space-x-4"
            >
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                {getInsightIcon(ins.type)}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {ins.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {ins.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
