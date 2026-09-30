const API_BASE = import.meta.env.VITE_API_URL || '';

export async function fetchDashboard() {
  const res = await fetch(`${API_BASE}/api/dashboard`);
  if (!res.ok) throw new Error('Failed to fetch dashboard summary');
  return res.json();
}

export async function makePrediction(data) {
  const res = await fetch(`${API_BASE}/api/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to generate prediction');
  }
  return res.json();
}

export async function uploadDataset(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Upload failed');
  }
  return res.json();
}

export async function trainModels() {
  const res = await fetch(`${API_BASE}/api/train`, { method: 'POST' });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Training failed');
  }
  return res.json();
}

export async function fetchModelMetrics() {
  const res = await fetch(`${API_BASE}/api/model-metrics`);
  if (!res.ok) throw new Error('Failed to fetch model metrics');
  return res.json();
}

export async function fetchHistory(search = '', page = 1, limit = 15) {
  const params = new URLSearchParams({ search, page, limit });
  const res = await fetch(`${API_BASE}/api/history?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch prediction history');
  return res.json();
}

export async function fetchAnalytics() {
  const res = await fetch(`${API_BASE}/api/analytics`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export async function fetchInsights() {
  const res = await fetch(`${API_BASE}/api/insights`);
  if (!res.ok) throw new Error('Failed to fetch energy insights');
  return res.json();
}

export async function loadDemoData() {
  const res = await fetch(`${API_BASE}/api/demo/load`, { method: 'POST' });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to load demo data');
  }
  return res.json();
}

export async function fetchSettings() {
  const res = await fetch(`${API_BASE}/api/settings`);
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
}

export async function updateSettings(data) {
  const res = await fetch(`${API_BASE}/api/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
}

export function getExportReportUrl() {
  return `${API_BASE}/api/export/report`;
}

export function getExportHistoryCsvUrl() {
  return `${API_BASE}/api/export/history-csv`;
}
