import React from 'react';
import { 
  HelpCircle, 
  Database, 
  Sparkles, 
  Cpu, 
  CheckCircle2, 
  TrendingUp, 
  Lightbulb, 
  ShieldCheck,
  Layers,
  ArrowDown
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    { num: 1, title: "Collect Electricity Data", desc: "Ingest historical hourly meter logs containing date, time, kWh, outdoor temperature, humidity, and household occupants." },
    { num: 2, title: "Clean & Validate Data", desc: "Handle missing values, strip duplicate records, convert timestamps, and detect sensor statistical outliers." },
    { num: 3, title: "Extract Time & Usage Patterns", desc: "Derive temporal components: hour of day, day of week, month, year, and binary weekend flags." },
    { num: 4, title: "Create Historical Lag Features", desc: "Build chronological lag indicators: 1-hour prior (lag_1), 24-hour prior (lag_24), 1-week prior (lag_168), and 24h rolling averages." },
    { num: 5, title: "Train Machine-Learning Models", desc: "Fit multiple candidate regressors: Random Forest, Gradient Boosting, XGBoost, and Linear Regression." },
    { num: 6, title: "Evaluate Held-Out Chronological Test Data", desc: "Evaluate models strictly on future unseen test data without random shuffling to eliminate data leakage." },
    { num: 7, title: "Select Optimal Model", desc: "Compare MAE, RMSE, R², and MAPE performance to automatically select the champion model." },
    { num: 8, title: "Predict Future Electricity Consumption", desc: "Forecast hourly and daily future demand based on user-entered environmental and historical lag states." },
    { num: 9, title: "Visualize Consumption & Range", desc: "Render interactive charts, estimated confidence intervals, and status badges (Low, Normal, High)." },
    { num: 10, title: "Generate Data-Driven Insights", desc: "Extract peak demand windows, solar offset potential, and actionable energy-saving recommendations." }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
          <HelpCircle className="w-6 h-6 text-blue-600" />
          <span>How Our AI Prediction Works</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Comprehensive technical architecture overview & methodology guide for college immersion presentation.
        </p>
      </div>

      {/* Abstract & Problem Statement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center space-x-1.5">
            <Layers className="w-4 h-4" />
            <span>Problem Statement</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Traditional electricity monitoring tools primarily log historical usage after consumption has occurred. Without predictive analytics, consumers and grid operators cannot proactively manage peak load spikes or shift non-essential appliance usage to reduce costs.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Proposed Solution</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            ElectraPredict AI implements machine-learning time-series regression to accurately forecast future electricity demand. By combining temporal features, temperature/humidity factors, and historical usage lags, the platform generates reliable forecasts and automated energy-saving guidance.
          </p>
        </div>
      </div>

      {/* 10 Step Process Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-purple-600" />
          <span>10-Step AI Execution Methodology</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((step) => (
            <div key={step.num} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-start space-x-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                {step.num}
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Time Series Methodology & Anti-Leakage Principles */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Strict Time-Series Validation (No Data Leakage)</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Unlike standard machine learning models that randomly shuffle dataset rows, electricity consumption data follows strict chronological dependencies. ElectraPredict AI enforces chronological train/validation/test splitting:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-center text-xs">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="font-bold text-blue-300">Older Data (70%)</div>
            <div className="text-[11px] text-slate-400 mt-1">Training Set</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="font-bold text-purple-300">Middle Data (15%)</div>
            <div className="text-[11px] text-slate-400 mt-1">Validation Set</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <div className="font-bold text-emerald-300">Most Recent Data (15%)</div>
            <div className="text-[11px] text-slate-400 mt-1">Held-Out Test Set</div>
          </div>
        </div>
      </div>

    </div>
  );
}
