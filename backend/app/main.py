import os
import sys

# Ensure project root is in python path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.database.db import init_db, load_records_dataframe
from app.routes.api import router as api_router
from data.generate_sample_data import generate_electricity_dataset

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Database & Load Seed Data if database is empty
    init_db()
    df = load_records_dataframe()
    if df.empty:
        print("Database empty. Generating initial synthetic demo dataset...")
        try:
            sample_df = generate_electricity_dataset(num_days=100)
            from app.database.db import insert_records_from_df
            from app.ml.models import train_and_evaluate_all_models
            insert_records_from_df(sample_df)
            train_and_evaluate_all_models(sample_df)
            print("Initial dataset and models initialized successfully.")
        except Exception as e:
            print(f"Startup initialization notice: {e}")
    yield
    # Shutdown logic if needed

app = FastAPI(
    title="ElectraPredict AI — Smart Electricity Consumption Prediction & Analytics System",
    description="AI-powered electricity consumption forecasting backend API using FastAPI and Scikit-learn / XGBoost.",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for React frontend (Vite default port 5173 / 3000 / localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

@app.get("/")
def root():
    return {
        "title": "ElectraPredict AI API Server",
        "status": "online",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
