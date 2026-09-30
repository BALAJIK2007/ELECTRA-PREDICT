import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { fetchHistory, getExportHistoryCsvUrl } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const limit = 10;

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await fetchHistory(search, page, limit);
      setHistoryData(res.data || []);
      setTotal(res.total || 0);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [page, search]);

  const totalPages = Math.ceil(total / limit) || 1;

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'low': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300';
      case 'high': return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
            <History className="w-6 h-6 text-blue-600" />
            <span>Prediction History Log</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete audit trail of past electricity consumption forecasts and model evaluations.
          </p>
        </div>

        <a
          href={getExportHistoryCsvUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Log</span>
        </a>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center space-x-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search history by date, status, or model name..."
          className="w-full bg-transparent text-xs font-medium text-slate-900 dark:text-white outline-none placeholder-slate-400"
        />
      </div>

      {loading ? (
        <LoadingSpinner label="Loading prediction history log..." />
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 text-xs font-medium rounded-xl border border-red-200">
          {error}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 text-right">Predicted (kWh)</th>
                  <th className="p-3.5 text-right">Actual (kWh)</th>
                  <th className="p-3.5 text-right">Difference (kWh)</th>
                  <th className="p-3.5 text-center">Demand Status</th>
                  <th className="p-3.5">Model Used</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                {historyData.length > 0 ? (
                  historyData.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-mono text-slate-900 dark:text-slate-100 font-bold">{row.date}</td>
                      <td className="p-3.5 text-right font-mono text-blue-600 dark:text-blue-400 font-bold">{row.predicted}</td>
                      <td className="p-3.5 text-right font-mono">{row.actual ?? '-'}</td>
                      <td className="p-3.5 text-right font-mono text-slate-500">{row.difference ?? '-'}</td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${getStatusStyle(row.status)}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500 dark:text-slate-400">{row.model}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400 text-xs">
                      No prediction records match your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Showing page {page} of {totalPages} ({total} total predictions)</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
