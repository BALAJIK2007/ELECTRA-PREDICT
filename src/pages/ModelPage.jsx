import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  BarChart2, 
  ScatterChart as ScatterIcon, 
  RefreshCw,
  Sparkles,
  Layers,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar 
} from 'recharts';
import { fetchModelMetrics, trainModels } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ModelPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [training, setTraining] = useState(false);
  const [trainingSteps, setTrainingSteps] = useState([]);
  const [error, setError] = useState(null);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const res = await fetchModelMetrics();
      setData(res);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const handleTrain = async () => {
    try {
      setTraining(true);
      setError(null);
      
      // Simulate live training progress checklist steps for user UX
      setTrainingSteps([
        { label: 'Loading dataset from SQLite...', done: false },
        { label: 'Cleaning missing values & outliers...', done: false },
        { label: 'Generating chronological lag & rolling features...', done: false },
        { label: 'Training Random Forest Regressor...', done: false },
        { label: 'Training Gradient Boosting & XGBoost...', done: false },
        { label: 'Evaluating performance on chronological test set...', done: false },
      ]);

      for (let i = 0; i < 6; i++) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setTrainingSteps((prev) => 
          prev.map((step, idx) => (idx <= i ? { ...step, done: true } : step))
        );
      }

      const res = await trainModels();
      setData({
        best_model: res.best_model,
        metrics: res.metrics,
        feature_importances: res.feature_importances,
        scatter_data: res.scatter_data,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setTraining(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading model evaluation metrics..." />;

  // Prepare feature importance data array for Recharts
  const featureImpArray = Object.entries(data?.feature_importances || {}).map(([feature, value]) => ({
    feature: feature.replace('_', ' '),
    importance: roundVal(value * 100, 1),
  })).sort((a, b) => b.importance - a.importance);

  function roundVal(num, decimals) {
    return Number(Math.round(num + 'e' + decimals) + 'e-' + decimals);
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Page Title & Train Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
            <Cpu className="w-6 h-6 text-blue-600" />
            <span>Machine Learning Models & Evaluation</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Compare model performance metrics evaluated on chronological test splits.
          </p>
        </div>

        <button
          onClick={handleTrain}
          disabled={training}
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${training ? 'animate-spin' : ''}`} />
          <span>{training ? 'Training Pipeline Running...' : 'Train Models'}</span>
        </button>
      </div>

      {/* Progress Checklist during Training */}
      {training && (
        <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-3 animate-fade-in">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Model Re-Training Execution Pipeline</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium pt-2">
            {trainingSteps.map((step, idx) => (
              <div key={idx} className="flex items-center space-x-2.5">
                {step.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-600 border-t-blue-400 animate-spin shrink-0" />
                )}
                <span className={step.done ? 'text-white' : 'text-slate-400'}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-xs font-medium rounded-xl border border-red-200 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Model Performance Comparison Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <span>Model Performance Comparison (Chronological Test Set)</span>
          </h2>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-200">
            Selected Best Model: {data?.best_model}
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Model Architecture</th>
                <th className="p-3.5 text-right">MAE (kWh)</th>
                <th className="p-3.5 text-right">RMSE (kWh)</th>
                <th className="p-3.5 text-right">R² Score</th>
                <th className="p-3.5 text-right">MAPE (%)</th>
                <th className="p-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
              {(data?.metrics || []).map((m, idx) => (
                <tr key={idx} className={m.is_best ? 'bg-blue-50/70 dark:bg-blue-950/40 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'}>
                  <td className="p-3.5 flex items-center space-x-2">
                    {m.is_best && <Award className="w-4 h-4 text-emerald-500" />}
                    <span>{m.model}</span>
                  </td>
                  <td className="p-3.5 text-right font-mono">{m.mae}</td>
                  <td className="p-3.5 text-right font-mono">{m.rmse}</td>
                  <td className="p-3.5 text-right font-mono text-blue-600 dark:text-blue-400 font-bold">{m.r2}</td>
                  <td className="p-3.5 text-right font-mono">{m.mape}%</td>
                  <td className="p-3.5 text-center">
                    {m.is_best ? (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500 text-white shadow-sm">
                        Selected
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        Evaluated
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Evaluation Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Actual vs Predicted Scatter Plot */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <ScatterIcon className="w-5 h-5 text-emerald-600" />
              <span>Actual vs Predicted Scatter Plot</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Points closer to diagonal line indicates higher predictive accuracy.
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" dataKey="predicted" name="Predicted" unit=" kWh" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis type="number" dataKey="actual" name="Actual" unit=" kWh" tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                />
                <Scatter name="Test Points" data={data?.scatter_data || []} fill="#2563eb" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feature Importance Bar Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-purple-600" />
              <span>Feature Importance Breakdown</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Contribution of engineered temporal and environmental features to model decisions.
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={featureImpArray.slice(0, 7)} margin={{ top: 0, right: 20, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} unit="%" />
                <YAxis type="category" dataKey="feature" tick={{ fontSize: 10, fill: '#64748b' }} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                  formatter={(val) => [`${val}%`, 'Importance']}
                />
                <Bar dataKey="importance" fill="#10b981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
