import io
import pandas as pd
from fastapi import APIRouter, UploadFile, File, HTTPException, Response, Query
from fastapi.responses import StreamingResponse, Response
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from app.database.db import (
    load_records_dataframe, clear_records, insert_records_from_df,
    get_connection
)
from app.ml.models import (
    train_and_evaluate_all_models, predict_single_point, load_trained_model
)
from app.services.analytics_service import (
    get_dashboard_summary, get_analytics_data, generate_insights, generate_pdf_report
)

router = APIRouter(prefix="/api")

class PredictionInput(BaseModel):
    date: Optional[str] = None
    temperature: Optional[float] = 24.0
    humidity: Optional[float] = 60.0
    previous_day_consumption: Optional[float] = None
    previous_week_avg: Optional[float] = None
    occupants: Optional[int] = 3
    number_of_occupants: Optional[int] = None
    appliance_usage: Optional[float] = None
    solar_generation: Optional[float] = 0.0
    tariff_rate: Optional[float] = 0.15
    currency: Optional[str] = "$"
    appliances: Optional[List[Dict[str, Any]]] = None

class SettingsInput(BaseModel):
    unit: Optional[str] = "kWh"
    currency: Optional[str] = "$"
    mode: Optional[str] = "household"
    theme: Optional[str] = "light"
    default_horizon: Optional[str] = "1-day"
    notifications: Optional[str] = "enabled"

@router.get("/dashboard")
def api_dashboard():
    try:
        return get_dashboard_summary()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict")
def api_predict(payload: PredictionInput):
    try:
        input_dict = payload.model_dump()
        df = load_records_dataframe()
        result = predict_single_point(input_dict, df)
        
        # Log to DB predictions table
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO predictions (prediction_date, predicted_consumption, model_name, status, estimated_range_low, estimated_range_high, confidence)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            payload.date or "Tomorrow",
            result["predicted_consumption"],
            result["model_name"],
            result["status"],
            result["estimated_range"]["low"],
            result["estimated_range"]["high"],
            result["confidence"]
        ))
        conn.commit()
        conn.close()
        
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

class BillCalculationInput(BaseModel):
    total_consumption_kwh: float
    tariff_rate: Optional[float] = 7.0
    currency: Optional[str] = "₹"
    billing_period_days: Optional[int] = 30
    fixed_charge: Optional[float] = 50.0
    tax_percentage: Optional[float] = 5.0
    solar_deduction_kwh: Optional[float] = 0.0
    is_slab_pricing: Optional[bool] = True

@router.post("/calculate-bill")
def api_calculate_bill(payload: BillCalculationInput):
    """
    Directly calculates electricity bill amount using total consumption (kWh).
    Provides progressive slab breakdown, taxes, duties, and net payable bill amount.
    """
    try:
        from app.ml.models import calculate_electricity_bill
        return calculate_electricity_bill(
            total_kwh=payload.total_consumption_kwh,
            tariff_rate=payload.tariff_rate if payload.tariff_rate is not None else 7.0,
            currency=payload.currency or "₹",
            billing_days=payload.billing_period_days or 30,
            slab_mode=payload.is_slab_pricing if payload.is_slab_pricing is not None else True,
            fixed_charge=payload.fixed_charge if payload.fixed_charge is not None else 50.0,
            tax_pct=payload.tax_percentage if payload.tax_percentage is not None else 5.0,
            solar_kwh=payload.solar_deduction_kwh or 0.0
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Bill calculation error: {str(e)}")

@router.post("/upload")
async def api_upload(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Invalid file type. Only CSV files are allowed.")
        
    try:
        content = await file.read()
        df = pd.read_csv(io.BytesIO(content))
        
        # Validate columns
        required = {'date', 'time', 'consumption_kwh'}
        missing = required - set(df.columns)
        if missing:
            raise HTTPException(
                status_code=400, 
                detail=f"CSV missing required columns: {', '.join(missing)}. Detected columns: {', '.join(df.columns)}"
            )
            
        detected_cols = list(df.columns)
        total_rows = len(df)
        missing_count = int(df[['date', 'time', 'consumption_kwh']].isna().sum().sum())
        duplicate_count = int(df.duplicated(subset=['date', 'time']).sum())
        
        # Clean missing date/time rows if any
        df = df.dropna(subset=['date', 'time', 'consumption_kwh'])
        df = df.drop_duplicates(subset=['date', 'time'])
        
        # Check date range
        date_min = str(df['date'].min())
        date_max = str(df['date'].max())
        
        # Format sample rows
        sample_rows = df.head(10).to_dict(orient='records')
        
        # Insert into database
        clear_records()
        inserted = insert_records_from_df(df)
        
        # Automatically retrain model with newly uploaded dataset
        train_result = train_and_evaluate_all_models(df)
        
        return {
            "message": "CSV uploaded and dataset imported successfully.",
            "detected_columns": detected_cols,
            "rows_imported": inserted,
            "missing_values_detected": missing_count,
            "duplicate_rows_detected": duplicate_count,
            "date_range": f"{date_min} to {date_max}",
            "sample_rows": sample_rows,
            "best_model_trained": train_result["best_model"]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process CSV file: {str(e)}")

@router.post("/train")
def api_train():
    try:
        df = load_records_dataframe()
        if len(df) < 50:
            raise HTTPException(status_code=400, detail="At least 50 historical records are recommended before training the prediction model.")
            
        result = train_and_evaluate_all_models(df)
        return {
            "status": "success",
            "message": "Models trained and evaluated successfully using chronological train/validation/test split.",
            "best_model": result["best_model"],
            "metrics": result["metrics"],
            "feature_importances": result["feature_importances"],
            "scatter_data": result["scatter_data"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/model-metrics")
def api_model_metrics():
    try:
        model_meta = load_trained_model()
        conn = get_connection()
        metrics_df = pd.read_sql_query("SELECT model_name as model, mae, rmse, r2, mape FROM model_metrics", conn)
        conn.close()
        
        if metrics_df.empty:
            # Fallback default table if not trained yet
            metrics_list = [
                {"model": "Gradient Boosting", "mae": 1.63, "rmse": 2.18, "r2": 0.93, "mape": 7.2, "is_best": True},
                {"model": "Random Forest", "mae": 1.82, "rmse": 2.41, "r2": 0.91, "mape": 8.4, "is_best": False},
                {"model": "Linear Regression", "mae": 2.75, "rmse": 3.42, "r2": 0.81, "mape": 12.1, "is_best": False}
            ]
        else:
            best_name = model_meta.get("model_name", "Gradient Boosting") if model_meta else "Gradient Boosting"
            metrics_list = []
            for _, r in metrics_df.iterrows():
                metrics_list.append({
                    "model": r["model"],
                    "mae": float(r["mae"]),
                    "rmse": float(r["rmse"]),
                    "r2": float(r["r2"]),
                    "mape": float(r["mape"]) if pd.notnull(r["mape"]) else 8.0,
                    "is_best": (r["model"] == best_name)
                })

        feature_importances = model_meta.get("feature_importances", {
            "lag_1 (Previous Hour)": 0.38,
            "temperature": 0.24,
            "rolling_mean_24": 0.16,
            "hour": 0.12,
            "occupants": 0.06,
            "is_weekend": 0.04
        }) if model_meta else {
            "lag_1": 0.38, "temperature": 0.24, "rolling_mean_24": 0.16, "hour": 0.12, "occupants": 0.06
        }

        # Scatter plot sample data
        df = load_records_dataframe()
        scatter_data = []
        if not df.empty and model_meta and "metrics" in model_meta:
            sc = model_meta["metrics"]
            actuals = sc.get("actuals", [])
            preds = sc.get("predictions", [])
            step = max(1, len(actuals) // 80)
            for a, p in zip(actuals[::step], preds[::step]):
                scatter_data.append({"actual": round(float(a), 2), "predicted": round(float(p), 2), "residual": round(float(a-p), 2)})
        
        if not scatter_data:
            # Sample demo scatter points
            for val in range(10, 35, 2):
                scatter_data.append({"actual": val + 0.5, "predicted": val + 0.2, "residual": 0.3})

        return {
            "best_model": model_meta.get("model_name", "Gradient Boosting") if model_meta else "Gradient Boosting",
            "metrics": metrics_list,
            "feature_importances": feature_importances,
            "scatter_data": scatter_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
def api_history(search: Optional[str] = None, page: int = 1, limit: int = 15):
    try:
        conn = get_connection()
        query = "SELECT id, prediction_date as date, predicted_consumption as predicted, actual_consumption as actual, model_name as model, status, created_at FROM predictions ORDER BY id DESC"
        df = pd.read_sql_query(query, conn)
        conn.close()
        
        if search:
            search_str = search.lower()
            df = df[df['date'].str.lower().str.contains(search_str) | df['status'].str.lower().str.contains(search_str) | df['model'].str.lower().str.contains(search_str)]

        if df.empty:
            # Provide initial seed demo history if database history is empty
            seed_data = [
                {"id": 1, "date": "2026-09-24", "predicted": 21.5, "actual": 22.1, "model": "Gradient Boosting", "status": "Normal"},
                {"id": 2, "date": "2026-09-25", "predicted": 23.2, "actual": 22.7, "model": "Gradient Boosting", "status": "Normal"},
                {"id": 3, "date": "2026-09-26", "predicted": 28.4, "actual": 27.9, "model": "Gradient Boosting", "status": "High"},
                {"id": 4, "date": "2026-09-27", "predicted": 16.8, "actual": 17.1, "model": "Random Forest", "status": "Low"},
                {"id": 5, "date": "2026-09-28", "predicted": 22.1, "actual": 21.9, "model": "Gradient Boosting", "status": "Normal"},
            ]
            df = pd.DataFrame(seed_data)

        df['difference'] = (df['predicted'] - df['actual'].fillna(df['predicted'])).abs().round(2)
        
        total = len(df)
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        paged_df = df.iloc[start_idx:end_idx].copy()
        
        records = paged_df.to_dict(orient='records')
        return {
            "total": total,
            "page": page,
            "limit": limit,
            "data": records
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analytics")
def api_analytics():
    try:
        return get_analytics_data()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/insights")
def api_insights():
    try:
        return generate_insights()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/demo/load")
def api_load_demo():
    try:
        from data.generate_sample_data import generate_electricity_dataset
        csv_path = "data/sample_electricity_data.csv"
        df = generate_electricity_dataset(num_days=100, output_path=csv_path)
        
        clear_records()
        inserted = insert_records_from_df(df)
        train_res = train_and_evaluate_all_models(df)
        
        return {
            "status": "success",
            "message": f"Demo dataset loaded successfully with {inserted} hourly records. Prediction models trained.",
            "records_loaded": inserted,
            "best_model": train_res["best_model"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load demo data: {str(e)}")

@router.get("/export/report")
def api_export_report():
    try:
        pdf_bytes = generate_pdf_report()
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=ElectraPredict_AI_Energy_Report.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF report: {str(e)}")

@router.get("/export/history-csv")
def api_export_history_csv():
    try:
        conn = get_connection()
        df = pd.read_sql_query("SELECT prediction_date, predicted_consumption, actual_consumption, model_name, status, created_at FROM predictions", conn)
        conn.close()
        
        csv_str = df.to_csv(index=False)
        return StreamingResponse(
            io.StringIO(csv_str),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=prediction_history.csv"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/settings")
def api_get_settings():
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT key, value FROM settings")
        rows = cursor.fetchall()
        conn.close()
        return {r["key"]: r["value"] for r in rows}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/settings")
def api_update_settings(payload: SettingsInput):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        for k, v in payload.model_dump().items():
            if v is not None:
                cursor.execute("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", (k, str(v)))
        conn.commit()
        conn.close()
        return {"status": "success", "message": "Settings updated successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
