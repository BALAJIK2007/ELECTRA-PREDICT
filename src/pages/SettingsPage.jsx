import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Moon, 
  Sun, 
  Bell, 
  Globe, 
  Home, 
  Sliders 
} from 'lucide-react';
import { fetchSettings, updateSettings } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    unit: 'kWh',
    currency: '$',
    mode: 'household',
    theme: 'light',
    default_horizon: '1-day',
    notifications: 'enabled',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetchSettings();
        if (res && Object.keys(res).length > 0) {
          setSettings((prev) => ({ ...prev, ...res }));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await updateSettings(settings);
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading settings preferences..." />;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
          <Settings className="w-6 h-6 text-blue-600" />
          <span>System Settings & Preferences</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure units, currency, household mode, and application behavior.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        
        {message && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs font-medium rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Unit */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-500" />
                <span>Electricity Measurement Unit</span>
              </label>
              <select
                name="unit"
                value={settings.unit}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="kWh">Kilowatt-hour (kWh)</option>
                <option value="MWh">Megawatt-hour (MWh)</option>
              </select>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-500" />
                <span>Currency Symbol</span>
              </label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="$">USD ($)</option>
                <option value="€">EUR (€)</option>
                <option value="£">GBP (£)</option>
                <option value="₹">INR (₹)</option>
              </select>
            </div>

            {/* Household / Business mode */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                <Home className="w-3.5 h-3.5 text-purple-500" />
                <span>Operational Profile Mode</span>
              </label>
              <select
                name="mode"
                value={settings.mode}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="household">Household Residential</option>
                <option value="business">Commercial Business</option>
                <option value="industrial">Industrial Facility</option>
              </select>
            </div>

            {/* Default Horizon */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-500" />
                <span>Default Prediction Horizon</span>
              </label>
              <select
                name="default_horizon"
                value={settings.default_horizon}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="1-day">1-Day Ahead Forecast</option>
                <option value="7-day">7-Day Weekly Forecast</option>
                <option value="30-day">30-Day Monthly Forecast</option>
              </select>
            </div>

            {/* Notifications */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                <Bell className="w-3.5 h-3.5 text-teal-500" />
                <span>Peak Load Notifications</span>
              </label>
              <select
                name="notifications"
                value={settings.notifications}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="enabled">Enabled (Peak Alert Highlights)</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>

            {/* Theme */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center space-x-1.5">
                <Sun className="w-3.5 h-3.5 text-orange-500" />
                <span>Dashboard Visual Theme</span>
              </label>
              <select
                name="theme"
                value={settings.theme}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="light">Light SaaS Modern</option>
                <option value="dark">Dark High-Contrast</option>
              </select>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Settings...' : 'Save Settings'}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
