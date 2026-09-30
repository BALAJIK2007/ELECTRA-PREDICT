import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  TrendingUp, 
  BarChart2, 
  Lightbulb, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Activity, 
  Database,
  Sparkles,
  Tv,
  Fan,
  Wind
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      title: "Granular Appliance Forecaster",
      desc: "Forecast household power based on exact appliances used, quantities (e.g. 3 fans, LG TV, AC), operating hours, and rated brand specs.",
      icon: TrendingUp,
      color: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
    },
    {
      title: "Brand & Model Wattage Intel",
      desc: "Select real-world models from LG, Samsung, Havells, Crompton, and Sony with automated rated power auto-fill and efficiency benchmarking.",
      icon: Zap,
      color: "bg-blue-500/10 text-blue-400 border border-blue-500/20"
    },
    {
      title: "Consumption Analytics",
      desc: "Understand historical energy usage with interactive 24h simulated load profile curves, peak hours, and weekend breakdown charts.",
      icon: BarChart2,
      color: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
    },
    {
      title: "Energy Saving Recommendations",
      desc: "Receive tailored, brand-specific suggestions (e.g. BLDC fan upgrades saving 42+ kWh/mo, TV ambient light dimming, eco AC thermostats).",
      icon: Lightbulb,
      color: "bg-amber-500/10 text-amber-400 border border-amber-500/20"
    },
    {
      title: "Simulated 24-Hour Load Curve",
      desc: "Visualize hour-by-hour power distribution across all 24 hours to spot peak morning/afternoon usage windows and shift loads.",
      icon: Activity,
      color: "bg-purple-500/10 text-purple-400 border border-purple-500/20"
    },
    {
      title: "PDF Audit & Export",
      desc: "Generate professional downloadable executive reports summarizing appliance load breakdown and machine learning benchmarks.",
      icon: Sparkles,
      color: "bg-teal-500/10 text-teal-400 border border-teal-500/20"
    }
  ];

  const workflowSteps = [
    { name: "1. Select Appliances", desc: "Choose Fans, TVs, ACs, Fridges, etc." },
    { name: "2. Brand & Model", desc: "Select LG, Samsung, Havells with wattage" },
    { name: "3. Quantity & Hours", desc: "Enter counts (e.g. 3 fans) & daily duration" },
    { name: "4. Machine Learning", desc: "Gradient Boosting & Appliance Physics" },
    { name: "5. Demand Prediction", desc: "Forecast total daily & monthly kWh & cost" },
    { name: "6. Brand Insights", desc: "Actionable BLDC & eco-mode recommendations" }
  ];

  const techStack = [
    { name: "Python 3.12", role: "FastAPI Backend", color: "border-blue-500/30 bg-blue-950/40 text-blue-300" },
    { name: "React 18", role: "Vite + Tailwind CSS", color: "border-cyan-500/30 bg-cyan-950/40 text-cyan-300" },
    { name: "Scikit-Learn", role: "Gradient Boosting ML", color: "border-emerald-500/30 bg-emerald-950/40 text-emerald-300" },
    { name: "XGBoost", role: "Ensemble Trees", color: "border-amber-500/30 bg-amber-950/40 text-amber-300" },
    { name: "Recharts", role: "24h Load Visualizer", color: "border-purple-500/30 bg-purple-950/40 text-purple-300" },
    { name: "SQLite3", role: "Historical Database", color: "border-indigo-500/30 bg-indigo-950/40 text-indigo-300" }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden glass-card rounded-3xl p-8 sm:p-12 lg:p-16 border border-cyan-500/30 shadow-2xl bg-gradient-to-br from-[#0c1731] via-[#091024] to-[#070b16]">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold backdrop-blur-md shadow-sm shadow-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Smart Appliance Energy Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight font-heading">
              Predict Household Energy, <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">Appliance by Appliance.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
              AI-powered electricity consumption forecasting tailored to your exact appliances. Enter fans, TVs, ACs, and refrigerators by brand and model (e.g. LG, Samsung, Havells) to calculate precise energy demand and unlock smart cost savings.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/prediction"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 border border-cyan-400/40"
              >
                <span>Start Appliance Prediction</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/dashboard"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700 transition-all transform hover:-translate-y-0.5 shadow-sm"
              >
                <span>Explore Live Dashboard</span>
              </Link>
            </div>
          </div>

          {/* Hero Illustration Graphic */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="w-full max-w-md bg-[#090f1d]/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
              
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Active Appliance Matrix</span>
                </div>
                <span className="text-xs font-mono text-cyan-300 font-bold bg-cyan-950/80 px-2.5 py-1 rounded-md border border-cyan-500/40">
                  Granular ML Forecast
                </span>
              </div>

              {/* Graphic Chart Simulation */}
              <div className="my-5 space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-slate-400">Total Predicted Load</p>
                    <p className="text-3xl font-extrabold text-white font-heading">
                      9.94 <span className="text-sm font-normal text-cyan-400">kWh/day</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Estimated Monthly</p>
                    <p className="text-sm font-mono text-emerald-400 font-bold">298.2 kWh (~$44.73)</p>
                  </div>
                </div>

                {/* Appliance Chips preview */}
                <div className="space-y-2 pt-2">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="flex items-center space-x-2">
                      <Fan className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-slate-200">3x Havells Fan (BLDC 28W)</span>
                    </span>
                    <span className="font-mono text-cyan-400 font-bold">0.84 kWh</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="flex items-center space-x-2">
                      <Tv className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-slate-200">1x LG OLED 55" TV (105W)</span>
                    </span>
                    <span className="font-mono text-purple-400 font-bold">0.53 kWh</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="flex items-center space-x-2">
                      <Wind className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-slate-200">1x LG Dual Inverter AC (1050W)</span>
                    </span>
                    <span className="font-mono text-blue-400 font-bold">6.30 kWh</span>
                  </div>
                </div>

              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                  <span>Individual Brand Loads</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  <span>Real-Time Formula</span>
                </span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-heading">
            Comprehensive Appliance & Energy Intelligence
          </h2>
          <p className="text-sm text-slate-400">
            Powered by device-level power calculations, lag metrics, and ensemble machine learning algorithms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="glass-card glass-card-hover rounded-2xl p-6 border border-slate-800 shadow-md group space-y-3"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feat.color} transition-transform group-hover:scale-110`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white font-heading">
                  {feat.title}
                </h3>
                <p className="text-xs leading-relaxed text-slate-400">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="glass-card rounded-3xl p-8 border border-slate-800 space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-white font-heading">
            How The Appliance Forecasting Pipeline Works
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            From user input to actionable machine-learning prediction & brand recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {workflowSteps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center p-4 bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center mb-3 shadow-md shadow-cyan-500/20">
                {index + 1}
              </div>
              <h4 className="text-xs font-bold text-white">{step.name}</h4>
              <p className="text-[11px] text-slate-400 mt-1">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-white font-heading">
            Built With Modern AI Stack
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Production-grade open-source technology stack
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {techStack.map((tech, i) => (
            <div key={i} className={`p-4 rounded-xl border text-center ${tech.color} shadow-sm transition-transform hover:-translate-y-1`}>
              <div className="font-bold text-sm">{tech.name}</div>
              <div className="text-[11px] opacity-80 mt-1">{tech.role}</div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
