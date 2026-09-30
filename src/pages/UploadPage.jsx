import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  RefreshCw,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { uploadDataset } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSummary, setUploadSummary] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.toLowerCase().endswith('.csv')) {
        setError('Please select a valid CSV file.');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError(null);
      setUploadSummary(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      setUploading(true);
      setError(null);
      const res = await uploadDataset(selectedFile);
      setUploadSummary(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
          <UploadCloud className="w-6 h-6 text-blue-600" />
          <span>CSV Historical Data Upload</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Upload historical electricity consumption records to retrain and personalize your AI forecast model.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Upload Dropzone */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Select Dataset File
            </h2>

            <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-8 text-center bg-slate-50/50 dark:bg-slate-800/50 transition-colors group cursor-pointer">
              <input 
                type="file" 
                accept=".csv"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {selectedFile ? selectedFile.name : 'Click or Drag & Drop CSV dataset here'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Maximum file size: 10MB (.csv format)
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs font-medium rounded-xl border border-red-200 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {uploading ? (
                <span>Validating & Importing Dataset...</span>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  <span>Upload & Retrain Models</span>
                </>
              )}
            </button>
          </div>

          {/* Example Format Help Box */}
          <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>Expected CSV Column Structure</span>
            </div>
            <p className="text-xs text-slate-300">
              CSV files should include headers: <code className="text-blue-300 font-mono">date</code>, <code className="text-blue-300 font-mono">time</code>, <code className="text-blue-300 font-mono">consumption_kwh</code>, <code className="text-slate-400 font-mono">temperature</code>, <code className="text-slate-400 font-mono">humidity</code>, <code className="text-slate-400 font-mono">occupants</code>.
            </p>
            <pre className="text-[11px] font-mono bg-slate-950 p-3 rounded-xl border border-slate-800 text-emerald-300 overflow-x-auto">
{`date,time,consumption_kwh,temperature,humidity,occupants
2026-01-01,00:00,0.82,24.5,72,4
2026-01-01,01:00,0.76,24.1,74,4
2026-01-01,02:00,0.71,23.8,75,4`}
            </pre>
          </div>
        </div>

        {/* Validation Summary Report */}
        <div className="lg:col-span-6">
          {uploadSummary ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 animate-fade-in">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>CSV Validated & Imported Successfully!</span>
              </div>

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Rows Imported</div>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-1">{uploadSummary.rows_imported?.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Missing Values Handled</div>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-1">{uploadSummary.missing_values_detected}</div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Duplicates Cleaned</div>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-1">{uploadSummary.duplicate_rows_detected}</div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-semibold">Active Model</div>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">{uploadSummary.best_model_trained}</div>
                </div>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-blue-950/50 p-3 rounded-xl border border-blue-200 dark:border-blue-900">
                <span className="font-semibold text-blue-900 dark:text-blue-200">Date Coverage Range: </span>
                <span>{uploadSummary.date_range}</span>
              </div>

              {/* Sample Data Table */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  First 10 Imported Rows Preview
                </h3>
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                      <tr>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Time</th>
                        <th className="p-2.5">kWh</th>
                        <th className="p-2.5">Temp (°C)</th>
                        <th className="p-2.5">Humidity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                      {(uploadSummary.sample_rows || []).map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="p-2.5">{row.date}</td>
                          <td className="p-2.5">{row.time}</td>
                          <td className="p-2.5 font-bold text-blue-600">{row.consumption_kwh}</td>
                          <td className="p-2.5">{row.temperature}</td>
                          <td className="p-2.5">{row.humidity}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-100 dark:bg-slate-900/60 rounded-2xl p-8 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3">
              <Database className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                No CSV File Processed Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Upload a custom CSV file on the left or click "Load Demo Data" in the top bar to inspect automatic validation and preprocessing.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
