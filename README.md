# ElectraPredict AI — Smart Electricity Consumption Prediction & Analytics System

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Scikit-Learn](https://img.shields.io/badge/ML-Scikit--Learn_|_XGBoost-F7931E?style=flat&logo=scikit-learn)](https://scikit-learn.org/)
[![SQLite](https://img.shields.io/badge/Database-SQLite3-003B57?style=flat&logo=sqlite)](https://www.sqlite.org/)

**ElectraPredict AI** is a modern, full-stack, machine-learning-powered web application that forecasts future electricity consumption based on historical consumption patterns, temporal lag metrics, outdoor temperature, humidity, and household occupancy variables.

Designed as a **college AI immersion project**, it demonstrates production-grade time-series machine learning methodology, chronological train/validation/test splitting (preventing data leakage), interactive dashboards, prediction explainability, residual analysis, and automated PDF report generation.

---

## 1. Key Features

- **Interactive Dashboard**: Real-time KPIs for Today's usage, Daily averages, Predicted tomorrow kWh, Monthly totals, and Model R² Accuracy %.
- **Interactive Consumption Charts**:
  - Historical Actual vs Predicted demand line curves.
  - Weekly consumption bar chart (Mon – Sun).
  - Hourly load profile curve (00:00 – 23:00) identifying peak usage windows.
- **Single-Point Prediction Engine**: Enter date, temperature, humidity, previous day usage, previous week average, occupants, appliance hours, and solar offset to receive instant AI forecasts, estimated confidence intervals, and status badges (Low / Normal / High Demand).
- **Prediction Factor Explanation**: Visual feature attribution breakdown answering *"Why is the prediction this value?"*.
- **CSV Data Upload & Preprocessing**: Upload raw meter logs with automatic column detection, missing value handling, duplicate record removal, date range detection, and sample preview.
- **ML Model Training & Evaluation**: Train and compare **Random Forest**, **Gradient Boosting**, **XGBoost**, and **Linear Regression** on chronological test splits. View MAE, RMSE, R², MAPE, actual vs predicted scatter plots, and feature importances.
- **Advanced Analytics & Insights**: Automated peak hour detection and AI data-driven recommendations (load shifting, solar generation potential, weekend pattern shift).
- **Prediction History Audit Log**: Searchable, filterable history table with pagination and CSV export.
- **Downloadable PDF Report**: Generate downloadable executive summary PDF reports for college presentation.
- **Instant Demo Mode**: One-click "Load Demo Data" populates SQLite with 2,400 synthetic hourly records and automatically trains model pipeline.

---

## 2. Recommended Technology Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS, CSS3 Glassmorphism
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend & Machine Learning
- **Framework**: Python 3.12 + FastAPI + Uvicorn
- **ML Libraries**: Scikit-Learn, XGBoost, Pandas, NumPy, Joblib
- **Database**: SQLite3
- **PDF Export**: ReportLab

---

## 3. Project Structure

```text
electrapredict/
│
├── frontend/                  # React + Vite Frontend
│   ├── src/
│   │   ├── components/        # Navbar, Sidebar, KpiCard, LoadingSpinner
│   │   ├── pages/             # Landing, Dashboard, Prediction, Upload, Model, Analytics, History, HowItWorks, Settings
│   │   ├── services/          # API Client (api.js)
│   │   ├── App.jsx            # React Router setup
│   │   ├── index.css          # Tailwind CSS & global styles
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                   # Python FastAPI Backend
│   ├── app/
│   │   ├── database/          # SQLite database connection & helpers (db.py)
│   │   ├── ml/                # Feature preprocessor & model training pipeline (preprocessor.py, models.py)
│   │   ├── routes/            # REST API endpoints (api.py)
│   │   ├── services/          # Analytics aggregator & PDF report engine (analytics_service.py)
│   │   └── main.py            # FastAPI main server entrypoint
│   ├── train.py               # Standalone CLI model training pipeline
│   └── requirements.txt
│
├── data/
│   ├── sample_electricity_data.csv   # 2,400 synthetic hourly meter records
│   └── generate_sample_data.py       # Realistic dataset generator script
│
├── models/
│   └── trained_model.joblib          # Trained ML model metadata & weights
│
├── README.md
└── .gitignore
```

---

## 4. Installation & Quick Start

### Prerequisites
- **Python**: 3.9+ installed
- **Node.js**: 18+ installed

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Run CLI model training pipeline (seeds SQLite DB and trains initial models)
python train.py

# Start FastAPI Uvicorn Server
uvicorn app.main:app --reload --port 8000
```
Backend API will be live at: `http://127.0.0.1:8000` (Swagger docs at `http://127.0.0.1:8000/docs`).

### Step 2: Frontend Setup

```bash
# Open new terminal and navigate to frontend directory
cd frontend

# Install packages
npm install

# Start Vite Dev Server
npm run dev
```
Frontend Web Application will be live at: `http://localhost:5173`.

---

## 5. Dataset Format

Uploaded CSV files should follow the structure below:

```csv
date,time,consumption_kwh,temperature,humidity,occupants
2026-01-01,00:00,0.82,24.5,72,4
2026-01-01,01:00,0.76,24.1,74,4
2026-01-01,02:00,0.71,23.8,75,4
```

---

## 6. Machine Learning Methodology

### Chronological Train / Validation / Test Split
Electricity load data is sequential. Random shuffling would introduce **data leakage** (using future metrics to predict past points). ElectraPredict AI enforces strict chronological splitting:
- **Training Set (70%)**: Older historical data
- **Validation Set (15%)**: Hyperparameter tuning window
- **Test Set (15%)**: Most recent unseen data (used for reported evaluation metrics)

### Feature Engineering
From timestamps and historical targets, the preprocessor constructs:
- **Temporal**: `hour`, `day`, `day_of_week`, `month`, `year`, `is_weekend`
- **Lag Features**: `lag_1` (1h prior), `lag_24` (24h prior), `lag_168` (1-week prior)
- **Rolling Averages**: `rolling_mean_24` (24h moving average), `rolling_mean_168` (7-day moving average)
- **Exogenous Variables**: `temperature`, `humidity`, `occupants`

---

## 7. Evaluation Metrics Summary

Evaluated on held-out chronological test set:

| Model Architecture | MAE (kWh) | RMSE (kWh) | R² Score | MAPE (%) | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Gradient Boosting** | **0.18** | **0.23** | **0.92** | **9.49%** | **Selected** |
| **Random Forest** | 0.18 | 0.24 | 0.92 | 9.76% | Evaluated |
| **XGBoost** | 0.19 | 0.24 | 0.92 | 9.87% | Evaluated |
| **Linear Regression** | 0.22 | 0.27 | 0.89 | 11.42% | Baseline |

---

## 8. College Project Report Abstract

> **Abstract**: Electricity demand forecasting plays a critical role in modern smart grids, home energy management systems (HEMS), and sustainable utility planning. Traditional monitoring tools provide retrospective billing records without predictive insights. This project presents **ElectraPredict AI**, an end-to-end energy management web application that utilizes ensemble machine learning algorithms (Random Forest and Gradient Boosting) to forecast electricity consumption. Incorporating chronological lag features and environmental indicators, the system achieves an R² accuracy of over 92% on chronological test evaluations. The platform features interactive load curves, prediction explainability, peak demand detection, and automated PDF report generation suitable for academic demonstration.

---

## 9. Future Improvements

- IoT smart meter real-time MQTT data streaming integration.
- Automated weather API integration (e.g. OpenWeatherMap) for 7-day temperature forecasts.
- Deep Learning time-series models (LSTM / Temporal Fusion Transformer).
- Reinforcement learning appliance load scheduling optimization.
