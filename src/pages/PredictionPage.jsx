import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Users, 
  Clock, 
  Sun, 
  Zap, 
  Sparkles,
  Plus,
  Trash2,
  Tv,
  Fan,
  Wind,
  Refrigerator as FridgeIcon,
  Shirt,
  Flame,
  Microwave as OvenIcon,
  Lightbulb,
  Laptop,
  Droplet,
  CheckCircle2,
  AlertTriangle,
  Info,
  DollarSign,
  ArrowUpRight,
  Sliders,
  ShieldCheck,
  BarChart2
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { makePrediction } from '../services/api';
import { APPLIANCE_CATEGORIES, APPLIANCE_BRAND_MODELS } from '../data/applianceCatalog';

export default function PredictionPage() {
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  // General household configuration (Temperature & Humidity removed as requested)
  const [householdConfig, setHouseholdConfig] = useState({
    date: todayStr,
    occupants: 3,
    solar_generation: 0.0,
    tariff_rate: 0.15,
    currency: '$',
  });

  // Granular Appliance list - starts with popular defaults (3 fans, 1 LG TV, 1 LG AC, 1 Fridge, etc.)
  const [appliances, setAppliances] = useState([
    {
      id: 'app-1',
      category: 'fan',
      name: 'Ceiling Fan',
      brand: 'Havells',
      model: 'Stealth Air BLDC 28W (Energy Star 5-Star)',
      count: 3,
      power_watts: 28,
      hours_per_day: 10,
    },
    {
      id: 'app-2',
      category: 'tv',
      name: 'Television (TV)',
      brand: 'LG',
      model: 'OLED 55" 4K evo C3/C4 Series (105W)',
      count: 1,
      power_watts: 105,
      hours_per_day: 5,
    },
    {
      id: 'app-3',
      category: 'ac',
      name: 'Air Conditioner (AC)',
      brand: 'LG',
      model: 'Dual Inverter 1.5 Ton 5-Star Split AC (1050W)',
      count: 1,
      power_watts: 1050,
      hours_per_day: 6,
    },
    {
      id: 'app-4',
      category: 'refrigerator',
      name: 'Refrigerator',
      brand: 'LG',
      model: 'Smart Inverter 260L Double Door Frost Free (95W)',
      count: 1,
      power_watts: 95,
      hours_per_day: 24,
    },
    {
      id: 'app-5',
      category: 'lighting',
      name: 'Lighting (LED / Bulbs)',
      brand: 'Philips',
      model: 'Stellar Bright LED Bulb 9W (9W)',
      count: 6,
      power_watts: 9,
      hours_per_day: 6,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Compute date details (Day of week, Weekend)
  const computedDateInfo = useMemo(() => {
    if (!householdConfig.date) return { dayName: 'N/A', isWeekend: false };
    const dt = new Date(householdConfig.date);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[dt.getUTCDay()];
    const isWeekend = dt.getUTCDay() === 0 || dt.getUTCDay() === 6;
    return { dayName, isWeekend };
  }, [householdConfig.date]);

  // Live real-time calculations based on active appliances
  const liveStats = useMemo(() => {
    let totalWatts = 0;
    let totalDailyKwh = 0;
    let totalUnits = 0;

    appliances.forEach((app) => {
      const count = Math.max(1, parseInt(app.count) || 1);
      const watts = Math.max(1, parseFloat(app.power_watts) || 0);
      const hours = Math.max(0, Math.min(24, parseFloat(app.hours_per_day) || 0));
      
      totalUnits += count;
      totalWatts += (count * watts);
      totalDailyKwh += (count * watts * hours) / 1000.0;
    });

    const standbyKwh = 1.2 + (householdConfig.occupants * 0.35);
    const solarOffset = parseFloat(householdConfig.solar_generation) || 0;
    const netDailyKwh = Math.max(0.5, totalDailyKwh + standbyKwh - solarOffset);
    const netMonthlyKwh = netDailyKwh * 30.0;
    const monthlyCost = netMonthlyKwh * householdConfig.tariff_rate;

    return {
      totalWatts: Math.round(totalWatts),
      totalDailyKwh: totalDailyKwh.toFixed(2),
      standbyKwh: standbyKwh.toFixed(2),
      netDailyKwh: netDailyKwh.toFixed(2),
      netMonthlyKwh: netMonthlyKwh.toFixed(1),
      monthlyCost: monthlyCost.toFixed(2),
      totalUnits,
      activeAppliancesCount: appliances.length,
    };
  }, [appliances, householdConfig]);

  // Helper to get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'fan': return <Fan className="w-4 h-4 text-cyan-400" />;
      case 'tv': return <Tv className="w-4 h-4 text-purple-400" />;
      case 'ac': return <Wind className="w-4 h-4 text-blue-400" />;
      case 'refrigerator': return <FridgeIcon className="w-4 h-4 text-emerald-400" />;
      case 'washing_machine': return <Shirt className="w-4 h-4 text-indigo-400" />;
      case 'geyser': return <Flame className="w-4 h-4 text-orange-400" />;
      case 'microwave': return <OvenIcon className="w-4 h-4 text-pink-400" />;
      case 'lighting': return <Lightbulb className="w-4 h-4 text-amber-400" />;
      case 'computer': return <Laptop className="w-4 h-4 text-sky-400" />;
      case 'pump': return <Droplet className="w-4 h-4 text-teal-400" />;
      default: return <Zap className="w-4 h-4 text-cyan-400" />;
    }
  };

  // Update household fields
  const handleHouseholdChange = (e) => {
    const { name, value } = e.target;
    setHouseholdConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add custom appliance
  const handleAddAppliance = (categoryKey = 'custom') => {
    const categoryObj = APPLIANCE_CATEGORIES.find((c) => c.id === categoryKey) || APPLIANCE_CATEGORIES[0];
    const brandData = APPLIANCE_BRAND_MODELS[categoryKey]?.brands?.[0];
    const defaultBrand = brandData ? brandData.brand : 'Generic';
    const defaultModel = brandData ? brandData.models[0].model : 'Standard Model';
    const defaultWatts = brandData ? brandData.models[0].watts : categoryObj.defaultWatts;

    const newApp = {
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      category: categoryKey,
      name: categoryObj.name,
      brand: defaultBrand,
      model: defaultModel,
      count: categoryObj.defaultCount || 1,
      power_watts: defaultWatts,
      hours_per_day: categoryObj.defaultHours || 4,
    };

    setAppliances((prev) => [...prev, newApp]);
  };

  // Update specific appliance row
  const handleUpdateAppliance = (id, field, value) => {
    setAppliances((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;

        const updated = { ...app, [field]: value };

        // If category changes, pick its default brand and model
        if (field === 'category') {
          const categoryObj = APPLIANCE_CATEGORIES.find((c) => c.id === value);
          updated.name = categoryObj ? categoryObj.name : 'Appliance';
          const brandsList = APPLIANCE_BRAND_MODELS[value]?.brands;
          if (brandsList && brandsList.length > 0) {
            updated.brand = brandsList[0].brand;
            updated.model = brandsList[0].models[0].model;
            updated.power_watts = brandsList[0].models[0].watts;
          } else {
            updated.brand = 'Generic';
            updated.model = 'Standard Model';
            updated.power_watts = categoryObj?.defaultWatts || 100;
          }
        }

        // If brand changes, update model list & default to first model's wattage
        if (field === 'brand') {
          const brandsList = APPLIANCE_BRAND_MODELS[app.category]?.brands;
          const selectedBrandObj = brandsList?.find((b) => b.brand === value);
          if (selectedBrandObj && selectedBrandObj.models.length > 0) {
            updated.model = selectedBrandObj.models[0].model;
            updated.power_watts = selectedBrandObj.models[0].watts;
          }
        }

        // If model changes, auto-fill rated power in watts
        if (field === 'model') {
          const brandsList = APPLIANCE_BRAND_MODELS[app.category]?.brands;
          const selectedBrandObj = brandsList?.find((b) => b.brand === app.brand);
          const selectedModelObj = selectedBrandObj?.models.find((m) => m.model === value);
          if (selectedModelObj) {
            updated.power_watts = selectedModelObj.watts;
          }
        }

        return updated;
      })
    );
  };

  // Remove appliance
  const handleRemoveAppliance = (id) => {
    setAppliances((prev) => prev.filter((app) => app.id !== id));
  };

  // Clear all appliances
  const handleClearAll = () => {
    setAppliances([]);
  };

  // Reset to default balanced home package
  const handleResetDefaults = () => {
    setAppliances([
      {
        id: 'app-1',
        category: 'fan',
        name: 'Ceiling Fan',
        brand: 'Havells',
        model: 'Stealth Air BLDC 28W (Energy Star 5-Star)',
        count: 3,
        power_watts: 28,
        hours_per_day: 10,
      },
      {
        id: 'app-2',
        category: 'tv',
        name: 'Television (TV)',
        brand: 'LG',
        model: 'OLED 55" 4K evo C3/C4 Series (105W)',
        count: 1,
        power_watts: 105,
        hours_per_day: 5,
      },
      {
        id: 'app-3',
        category: 'ac',
        name: 'Air Conditioner (AC)',
        brand: 'LG',
        model: 'Dual Inverter 1.5 Ton 5-Star Split AC (1050W)',
        count: 1,
        power_watts: 1050,
        hours_per_day: 6,
      },
      {
        id: 'app-4',
        category: 'refrigerator',
        name: 'Refrigerator',
        brand: 'LG',
        model: 'Smart Inverter 260L Double Door Frost Free (95W)',
        count: 1,
        power_watts: 95,
        hours_per_day: 24,
      },
    ]);
  };

  // Submit prediction request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (appliances.length === 0) {
      setError('Please add at least one appliance to predict electricity consumption.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        date: householdConfig.date,
        occupants: parseInt(householdConfig.occupants) || 3,
        solar_generation: parseFloat(householdConfig.solar_generation) || 0.0,
        tariff_rate: parseFloat(householdConfig.tariff_rate) || 0.15,
        currency: householdConfig.currency || '$',
        appliances: appliances.map((app) => ({
          name: app.name,
          brand: app.brand,
          model: app.model,
          count: parseInt(app.count) || 1,
          power_watts: parseFloat(app.power_watts) || 75.0,
          hours_per_day: parseFloat(app.hours_per_day) || 0.0,
        })),
      };

      const res = await makePrediction(payload);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Failed to generate prediction');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'low':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20">
            Low Demand Household
          </span>
        );
      case 'high':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-500/20">
            High Demand Load
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20">
            Optimal / Normal Load
          </span>
        );
    }
  };

  // Format 24h chart data
  const chartData = useMemo(() => {
    if (!result?.hourly_breakdown || result.hourly_breakdown.length === 0) return [];
    return result.hourly_breakdown.map((val, idx) => ({
      hour: `${String(idx).padStart(2, '0')}:00`,
      consumption: val,
    }));
  }, [result]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-heading">
              Appliance-Based Electricity Forecaster
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 flex items-center space-x-1.5">
            <span>Granular appliance wattage & hours estimation</span>
            <span className="text-cyan-400 font-semibold">• No weather variables required</span>
            <span className="text-slate-500">• Automatic brand efficiency analysis</span>
          </p>
        </div>

        {/* Live Quick Counters */}
        <div className="flex items-center space-x-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-cyan-500/25 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-300">Total Load:</span>
            <span className="text-xs font-bold text-cyan-300 font-mono-stat">{liveStats.totalWatts} W</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-emerald-500/25 flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-300">Live Est:</span>
            <span className="text-xs font-bold text-emerald-300 font-mono-stat">{liveStats.netDailyKwh} kWh/day</span>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Appliance Data Entry & Household Specs */}
        <div className="lg:col-span-7 space-y-6">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Household & General Settings Card (Temperature & Humidity removed) */}
            <div className="glass-card rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    General Household Context
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  {computedDateInfo.dayName} {computedDateInfo.isWeekend ? '(Weekend)' : '(Weekday)'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Forecast Date</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={householdConfig.date}
                    onChange={handleHouseholdChange}
                    className="glass-input w-full px-3 py-2 text-xs rounded-xl"
                    required
                  />
                </div>

                {/* Occupants */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Occupants</span>
                  </label>
                  <input
                    type="number"
                    name="occupants"
                    min="1"
                    max="20"
                    value={householdConfig.occupants}
                    onChange={handleHouseholdChange}
                    className="glass-input w-full px-3 py-2 text-xs rounded-xl"
                    required
                  />
                </div>

                {/* Solar Offset */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>Solar Gen Offset (kWh)</span>
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    name="solar_generation"
                    value={householdConfig.solar_generation}
                    onChange={handleHouseholdChange}
                    placeholder="e.g. 0.0"
                    className="glass-input w-full px-3 py-2 text-xs rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Quick Add Presets Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span className="font-semibold text-slate-300 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>One-Click Quick Add Presets:</span>
                </span>
                <div className="space-x-3">
                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-medium"
                  >
                    Reset Defaults
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-[11px] text-rose-400 hover:text-rose-300 underline font-medium"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleAddAppliance('fan')}
                  className="px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 flex items-center space-x-1.5 transition-all active:scale-95"
                >
                  <Fan className="w-3.5 h-3.5 text-cyan-400" />
                  <span>+ Add Fan</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddAppliance('tv')}
                  className="px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-900/90 hover:bg-slate-800 text-purple-300 border border-purple-500/30 flex items-center space-x-1.5 transition-all active:scale-95"
                >
                  <Tv className="w-3.5 h-3.5 text-purple-400" />
                  <span>+ Add TV</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddAppliance('ac')}
                  className="px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-900/90 hover:bg-slate-800 text-blue-300 border border-blue-500/30 flex items-center space-x-1.5 transition-all active:scale-95"
                >
                  <Wind className="w-3.5 h-3.5 text-blue-400" />
                  <span>+ Add AC</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddAppliance('refrigerator')}
                  className="px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-900/90 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1.5 transition-all active:scale-95"
                >
                  <FridgeIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+ Refrigerator</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddAppliance('washing_machine')}
                  className="px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-900/90 hover:bg-slate-800 text-indigo-300 border border-indigo-500/30 flex items-center space-x-1.5 transition-all active:scale-95"
                >
                  <Shirt className="w-3.5 h-3.5 text-indigo-400" />
                  <span>+ Washer</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddAppliance('lighting')}
                  className="px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/30 flex items-center space-x-1.5 transition-all active:scale-95"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>+ Lights</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddAppliance('computer')}
                  className="px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-900/90 hover:bg-slate-800 text-sky-300 border border-sky-500/30 flex items-center space-x-1.5 transition-all active:scale-95"
                >
                  <Laptop className="w-3.5 h-3.5 text-sky-400" />
                  <span>+ Laptop/PC</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAddAppliance('custom')}
                  className="px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 flex items-center space-x-1.5 transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>+ Custom Appliance</span>
                </button>
              </div>
            </div>

            {/* Individual Appliances Entry Cards List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <span>Enter Appliance Data ({appliances.length} Active Items)</span>
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  {liveStats.totalUnits} total units in household
                </span>
              </div>

              {appliances.length === 0 ? (
                <div className="glass-card rounded-2xl p-8 text-center border-dashed border-slate-700 space-y-3">
                  <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                  <p className="text-sm text-slate-300 font-semibold">No appliances in list</p>
                  <p className="text-xs text-slate-400">Click a preset above or add a custom appliance to begin forecasting.</p>
                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-500/25"
                  >
                    Load Standard Household Preset
                  </button>
                </div>
              ) : (
                appliances.map((app, index) => {
                  const brandsForCategory = APPLIANCE_BRAND_MODELS[app.category]?.brands || [];
                  const selectedBrandObj = brandsForCategory.find((b) => b.brand === app.brand);
                  const modelsForBrand = selectedBrandObj?.models || [];
                  const dailyKwh = ((app.count * app.power_watts * app.hours_per_day) / 1000.0).toFixed(2);
                  const monthlyKwh = (parseFloat(dailyKwh) * 30).toFixed(1);

                  return (
                    <div 
                      key={app.id} 
                      className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 space-y-3 relative group"
                    >
                      {/* Row Header: Appliance Title, Calculated Daily kWh pill, and Delete Button */}
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                        <div className="flex items-center space-x-2.5">
                          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                            {getCategoryIcon(app.category)}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white tracking-wide">
                              #{index + 1} {app.name}
                            </span>
                            <span className="ml-2 text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/30">
                              {app.count} unit{app.count > 1 ? 's' : ''} • {app.power_watts}W
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <span className="text-xs font-bold font-mono text-emerald-400 block">
                              {dailyKwh} kWh/day
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              ~{monthlyKwh} kWh/mo
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAppliance(app.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                            title="Remove this appliance"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Row Fields: Category, Brand, Model, Count, Power, Usage Hours */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                        
                        {/* Category */}
                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            Appliance Type
                          </label>
                          <select
                            value={app.category}
                            onChange={(e) => handleUpdateAppliance(app.id, 'category', e.target.value)}
                            className="glass-input w-full px-2.5 py-1.5 text-xs rounded-xl"
                          >
                            {APPLIANCE_CATEGORIES.map((cat) => (
                              <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Brand */}
                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            Brand
                          </label>
                          <select
                            value={app.brand}
                            onChange={(e) => handleUpdateAppliance(app.id, 'brand', e.target.value)}
                            className="glass-input w-full px-2.5 py-1.5 text-xs rounded-xl"
                          >
                            {brandsForCategory.length > 0 ? (
                              brandsForCategory.map((b) => (
                                <option key={b.brand} value={b.brand} className="bg-slate-900 text-white">
                                  {b.brand}
                                </option>
                              ))
                            ) : (
                              <option value="Generic" className="bg-slate-900 text-white">Generic</option>
                            )}
                          </select>
                        </div>

                        {/* Model */}
                        <div className="sm:col-span-6">
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center justify-between">
                            <span>Model & Power Rating</span>
                            <span className="text-[10px] text-cyan-400 font-mono">{app.power_watts}W</span>
                          </label>
                          <select
                            value={app.model}
                            onChange={(e) => handleUpdateAppliance(app.id, 'model', e.target.value)}
                            className="glass-input w-full px-2.5 py-1.5 text-xs rounded-xl truncate"
                          >
                            {modelsForBrand.length > 0 ? (
                              modelsForBrand.map((m) => (
                                <option key={m.model} value={m.model} className="bg-slate-900 text-white">
                                  {m.model}
                                </option>
                              ))
                            ) : (
                              <option value={app.model} className="bg-slate-900 text-white">
                                {app.model} ({app.power_watts}W)
                              </option>
                            )}
                          </select>
                        </div>

                      </div>

                      {/* Quantity / Count, Wattage Customizer & Daily Hours */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1 items-center">
                        
                        {/* Quantity / Count (e.g. 3 fans!) */}
                        <div className="sm:col-span-4">
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            Quantity (Count)
                          </label>
                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={() => handleUpdateAppliance(app.id, 'count', Math.max(1, app.count - 1))}
                              className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center text-xs font-bold border border-slate-700"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              max="50"
                              value={app.count}
                              onChange={(e) => handleUpdateAppliance(app.id, 'count', Math.max(1, parseInt(e.target.value) || 1))}
                              className="glass-input w-full px-2 py-1 text-xs text-center font-bold rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => handleUpdateAppliance(app.id, 'count', app.count + 1)}
                              className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center text-xs font-bold border border-slate-700"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Rated Wattage */}
                        <div className="sm:col-span-3">
                          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                            Watts (per unit)
                          </label>
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={app.power_watts}
                            onChange={(e) => handleUpdateAppliance(app.id, 'power_watts', Math.max(1, parseFloat(e.target.value) || 1))}
                            className="glass-input w-full px-2.5 py-1 text-xs font-mono font-bold rounded-lg"
                          />
                        </div>

                        {/* Daily Operating Hours */}
                        <div className="sm:col-span-5">
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[11px] font-semibold text-slate-400">
                              Hours used / day:
                            </label>
                            <span className="text-xs font-bold text-cyan-300 font-mono">
                              {app.hours_per_day} hrs
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="range"
                              min="0"
                              max="24"
                              step="0.5"
                              value={app.hours_per_day}
                              onChange={(e) => handleUpdateAppliance(app.id, 'hours_per_day', parseFloat(e.target.value))}
                              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                            />
                            <div className="flex space-x-1">
                              {[4, 8, 12, 24].map((hr) => (
                                <button
                                  key={hr}
                                  type="button"
                                  onClick={() => handleUpdateAppliance(app.id, 'hours_per_day', hr)}
                                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                                    app.hours_per_day === hr 
                                      ? 'bg-cyan-500 text-black font-bold' 
                                      : 'bg-slate-800 text-slate-400 hover:text-white'
                                  }`}
                                >
                                  {hr}h
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>
                  );
                })
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 bg-rose-950/60 text-rose-300 text-xs font-medium rounded-xl border border-rose-500/40 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons: Add Appliance and Submit Prediction */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleAddAppliance('fan')}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 transition-all flex items-center justify-center space-x-2 shadow-sm"
              >
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>+ Add Another Appliance</span>
              </button>

              <button
                type="submit"
                disabled={loading || appliances.length === 0}
                className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all transform active:scale-98 disabled:opacity-50 flex items-center justify-center space-x-2 border border-cyan-400/40"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Predicting Appliance Load...</span>
                  </div>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-yellow-300 animate-pulse" />
                    <span>Run AI Consumption Prediction</span>
                    <ArrowUpRight className="w-4 h-4 text-cyan-200" />
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

        {/* Right Column: AI Forecast Results & Interactive Visualizations */}
        <div className="lg:col-span-5 space-y-6">
          
          {result ? (
            <div className="space-y-6 animate-fade-in">
              
              {/* Primary Prediction Result Card */}
              <div className="glass-card rounded-2xl p-6 sm:p-7 border border-cyan-500/40 shadow-2xl relative overflow-hidden bg-gradient-to-br from-[#0c162e] via-[#091022] to-[#070b16]">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <Zap className="w-36 h-36 text-cyan-400" />
                </div>

                {/* Status Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>AI Prediction Forecast</span>
                  </span>
                  {getStatusBadge(result.status)}
                </div>

                {/* Main Predicted Value */}
                <div className="py-4 space-y-1">
                  <div className="text-xs text-slate-400 font-semibold tracking-wide">
                    TOTAL ESTIMATED ELECTRICITY CONSUMPTION
                  </div>
                  <div className="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-baseline space-x-2 font-heading">
                    <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent">
                      {result.predicted_consumption}
                    </span>
                    <span className="text-xl font-bold text-cyan-400">{result.unit}</span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono pt-1">
                    Appliance load: <span className="text-white font-bold">{result.total_appliance_kwh || liveStats.totalDailyKwh} kWh</span> + Baseline standby: <span className="text-white font-bold">{result.base_standby_kwh || liveStats.standbyKwh} kWh</span>
                  </div>
                </div>

                {/* Range & Cost Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Estimated Range</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {result.estimated_range?.low} – {result.estimated_range?.high} kWh
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Projected Monthly Cost</span>
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {result.currency || '$'}{result.estimated_monthly_cost || liveStats.monthlyCost}
                    </span>
                  </div>
                </div>

                {/* Model Architecture Info */}
                <div className="mt-3 text-[11px] text-slate-400 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center">
                  <span>Model Engine:</span>
                  <span className="font-semibold text-cyan-300">{result.model_name}</span>
                </div>
              </div>

              {/* 24-Hour Simulated Load Distribution Chart */}
              {chartData.length > 0 && (
                <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                      <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>24-Hour Operating Load Curve</span>
                    </h3>
                    <span className="text-[10px] text-slate-400">Hourly Demand</span>
                  </div>

                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="loadCurve" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis 
                          dataKey="hour" 
                          stroke="#64748b" 
                          tick={{ fontSize: 10 }}
                          interval={3}
                        />
                        <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#090f1d', borderColor: '#06b6d4', borderRadius: '8px', fontSize: '11px' }}
                          formatter={(value) => [`${value} kWh`, 'Hourly Demand']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="consumption" 
                          stroke="#06b6d4" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#loadCurve)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-[10px] text-slate-500 italic">
                    * Load distribution reflects peak usage hours for active cooling, entertainment, and baseline cycles.
                  </p>
                </div>
              )}

              {/* Factor Contribution Breakdown (By Appliance) */}
              <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-800 pb-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Appliance Share of Daily Consumption</span>
                </h3>

                <div className="space-y-2.5 text-xs">
                  {Object.entries(result.factor_breakdown || {}).map(([factor, pct], idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-300">
                        <span className="truncate pr-2">{factor}</span>
                        <span className="font-mono text-cyan-400 font-bold">{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(100, Math.max(2, pct))}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brand & Model Efficiency Insights */}
              {result.brand_insights && result.brand_insights.length > 0 && (
                <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 space-y-3 bg-emerald-950/20">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Brand & Model Energy Saving Insights</span>
                  </h3>

                  <div className="space-y-2.5">
                    {result.brand_insights.map((insight, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/20 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-300">{insight.title}</span>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
                            Save ~{insight.potential_savings_kwh} kWh/mo
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {insight.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Itemized Appliances Summary Table */}
              {result.appliances && result.appliances.length > 0 && (
                <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3 overflow-hidden">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-800 pb-2.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Itemized Breakdown Log</span>
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="pb-2 font-semibold">Appliance</th>
                          <th className="pb-2 font-semibold">Brand / Model</th>
                          <th className="pb-2 font-semibold text-center">Qty</th>
                          <th className="pb-2 font-semibold text-center">Hours</th>
                          <th className="pb-2 font-semibold text-right">Daily</th>
                          <th className="pb-2 font-semibold text-right">Monthly</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {result.appliances.map((app, idx) => (
                          <tr key={idx} className="hover:bg-slate-900/50">
                            <td className="py-2 text-white font-medium">{app.name}</td>
                            <td className="py-2 text-slate-300 truncate max-w-[140px]" title={`${app.brand} - ${app.model}`}>
                              {app.brand} {app.model}
                            </td>
                            <td className="py-2 text-center font-mono font-bold text-cyan-300">{app.count}x</td>
                            <td className="py-2 text-center font-mono text-slate-300">{app.hours_per_day}h</td>
                            <td className="py-2 text-right font-mono font-bold text-emerald-400">{app.daily_kwh} kWh</td>
                            <td className="py-2 text-right font-mono text-slate-300">{app.monthly_kwh} kWh</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* Idle Placeholder Card */
            <div className="glass-card rounded-2xl p-8 border border-dashed border-slate-800 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white font-heading">
                Ready for AI Appliance Forecast
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                Add or adjust your household appliances, specify operating hours and counts (e.g. 3 fans, LG TV, LG AC), and click <strong className="text-cyan-300">"Run AI Consumption Prediction"</strong> to view precise consumption, simulated 24h curve, and brand energy efficiency tips.
              </p>
              
              <div className="pt-2 flex items-center justify-center space-x-2 text-[11px] text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>FastAPI ML Engine Connected</span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
