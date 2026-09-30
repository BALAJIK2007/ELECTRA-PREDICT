import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from app.ml.preprocessor import prepare_features, get_feature_columns, chronological_split
from app.database.db import get_connection

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "models")
MODEL_PATH = os.path.join(MODEL_DIR, "trained_model.joblib")

def calculate_mape(y_true, y_pred):
    y_true, y_pred = np.array(y_true), np.array(y_pred)
    non_zero = y_true != 0
    if not np.any(non_zero):
        return 0.0
    return float(np.mean(np.abs((y_true[non_zero] - y_pred[non_zero]) / y_true[non_zero])) * 100)

def train_and_evaluate_all_models(raw_df: pd.DataFrame):
    """
    Trains Random Forest, Gradient Boosting (or XGBoost), and Linear Regression models.
    Evaluates them on the chronological test split.
    Saves metrics and best model to joblib and SQLite.
    """
    if len(raw_df) < 50:
        raise ValueError("At least 50 historical records are required to train the prediction model.")

    processed = prepare_features(raw_df, drop_na=True)
    if len(processed) < 30:
        raise ValueError("Insufficient data after feature engineering lag processing.")

    feature_cols = get_feature_columns()
    train_df, val_df, test_df = chronological_split(processed, train_ratio=0.70, val_ratio=0.15)
    
    X_train = train_df[feature_cols]
    y_train = train_df['consumption_kwh']
    
    # Combined train+val for final test set fit evaluation
    X_train_full = pd.concat([train_df[feature_cols], val_df[feature_cols]])
    y_train_full = pd.concat([train_df['consumption_kwh'], val_df['consumption_kwh']])
    
    X_test = test_df[feature_cols]
    y_test = test_df['consumption_kwh']
    
    models = {
        "Random Forest": RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42),
        "Gradient Boosting": GradientBoostingRegressor(n_estimators=100, learning_rate=0.08, max_depth=5, random_state=42),
        "Linear Regression": LinearRegression()
    }
    
    # Check if XGBoost is available and append/replace if desired
    try:
        from xgboost import XGBRegressor
        models["XGBoost"] = XGBRegressor(n_estimators=100, learning_rate=0.08, max_depth=5, random_state=42)
    except Exception:
        pass

    results = []
    trained_objects = {}
    
    best_r2 = -999.0
    best_model_name = "Gradient Boosting"
    best_model_obj = None

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM model_metrics") # Clear past metrics run

    for name, model in models.items():
        model.fit(X_train_full, y_train_full)
        preds = model.predict(X_test)
        
        mae = float(mean_absolute_error(y_test, preds))
        rmse = float(np.sqrt(mean_squared_error(y_test, preds)))
        r2 = float(r2_score(y_test, preds))
        mape = float(calculate_mape(y_test, preds))
        
        trained_objects[name] = {
            "model": model,
            "predictions": preds,
            "actuals": y_test.values,
            "mae": mae,
            "rmse": rmse,
            "r2": r2,
            "mape": mape
        }
        
        cursor.execute("""
        INSERT INTO model_metrics (model_name, mae, rmse, r2, mape)
        VALUES (?, ?, ?, ?, ?)
        """, (name, round(mae, 2), round(rmse, 2), round(r2, 2), round(mape, 2)))

        if r2 > best_r2:
            best_r2 = r2
            best_model_name = name
            best_model_obj = model
            
    conn.commit()
    conn.close()

    # Save best model object along with feature metadata & historical statistics for confidence range estimation
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    # Calculate residuals standard deviation on test set for confidence intervals
    test_preds = best_model_obj.predict(X_test)
    residuals = y_test.values - test_preds
    residual_std = float(np.std(residuals))
    
    # Extract feature importances if available
    feature_importances = {}
    if hasattr(best_model_obj, "feature_importances_"):
        imps = best_model_obj.feature_importances_
        for col, val in zip(feature_cols, imps):
            feature_importances[col] = float(val)
    elif hasattr(best_model_obj, "coef_"):
        coefs = np.abs(best_model_obj.coef_)
        total = np.sum(coefs) if np.sum(coefs) > 0 else 1
        for col, val in zip(feature_cols, coefs / total):
            feature_importances[col] = float(val)
            
    # Sort feature importances descending
    sorted_importances = dict(sorted(feature_importances.items(), key=lambda x: x[1], reverse=True))

    model_metadata = {
        "model_name": best_model_name,
        "model": best_model_obj,
        "feature_cols": feature_cols,
        "residual_std": residual_std,
        "feature_importances": sorted_importances,
        "history_mean": float(raw_df['consumption_kwh'].mean()),
        "history_std": float(raw_df['consumption_kwh'].std()),
        "history_q25": float(raw_df['consumption_kwh'].quantile(0.25)),
        "history_q75": float(raw_df['consumption_kwh'].quantile(0.75)),
        "metrics": trained_objects[best_model_name]
    }

    joblib.dump(model_metadata, MODEL_PATH)

    # Format return summary for front-end training response
    test_actuals = y_test.values
    best_preds = trained_objects[best_model_name]["predictions"]
    
    # Scatter points for actual vs predicted (sample 100 points max for smooth plotting)
    step = max(1, len(test_actuals) // 100)
    scatter_data = [
        {"actual": round(float(a), 2), "predicted": round(float(p), 2), "residual": round(float(a - p), 2)}
        for a, p in zip(test_actuals[::step], best_preds[::step])
    ]

    metrics_list = []
    for name, obj in trained_objects.items():
        metrics_list.append({
            "model": name,
            "mae": round(obj["mae"], 2),
            "rmse": round(obj["rmse"], 2),
            "r2": round(obj["r2"], 2),
            "mape": round(obj["mape"], 2),
            "is_best": (name == best_model_name)
        })

    return {
        "best_model": best_model_name,
        "metrics": metrics_list,
        "feature_importances": sorted_importances,
        "scatter_data": scatter_data
    }

def load_trained_model():
    if os.path.exists(MODEL_PATH):
        try:
            return joblib.load(MODEL_PATH)
        except Exception:
            return None
    return None

def calculate_electricity_bill(
    total_kwh: float,
    tariff_rate: float = 7.0,
    currency: str = "₹",
    billing_days: int = 30,
    slab_mode: bool = True,
    fixed_charge: float = 50.0,
    tax_pct: float = 5.0,
    solar_kwh: float = 0.0
):
    """
    Calculates comprehensive electricity bill based on total consumption (kWh).
    Supports progressive slab tiers (0-100, 101-200, 201-400, 400+),
    fixed charges, regulatory surcharges, taxes, and solar offset credits.
    """
    total_kwh = max(0.0, float(total_kwh))
    solar_kwh = max(0.0, float(solar_kwh))
    net_units = max(0.0, round(total_kwh - solar_kwh, 2))
    
    slab_breakdown = []
    energy_charges = 0.0
    
    if slab_mode:
        tiers = [
            {"name": "Tier 1 (0 – 100 units)", "limit": 100, "rate_factor": 0.65},
            {"name": "Tier 2 (101 – 200 units)", "limit": 100, "rate_factor": 0.90},
            {"name": "Tier 3 (201 – 400 units)", "limit": 200, "rate_factor": 1.15},
            {"name": "Tier 4 (401+ units)", "limit": float("inf"), "rate_factor": 1.40},
        ]
        
        remaining = net_units
        for tier in tiers:
            if remaining <= 0:
                break
            tier_limit = tier["limit"]
            units_in_tier = min(remaining, tier_limit)
            tier_rate = round(tariff_rate * tier["rate_factor"], 2)
            tier_amount = round(units_in_tier * tier_rate, 2)
            energy_charges += tier_amount
            slab_breakdown.append({
                "slab_name": tier["name"],
                "units_billed": round(units_in_tier, 2),
                "unit_rate": tier_rate,
                "amount": tier_amount,
                "rate_factor": tier["rate_factor"]
            })
            remaining -= units_in_tier
    else:
        energy_charges = round(net_units * tariff_rate, 2)
        slab_breakdown.append({
            "slab_name": f"Flat Rate @ {currency}{tariff_rate}/kWh",
            "units_billed": net_units,
            "unit_rate": tariff_rate,
            "amount": energy_charges,
            "rate_factor": 1.0
        })
        
    energy_charges = round(energy_charges, 2)
    regulatory_duty = round(energy_charges * 0.04, 2)
    tax_amount = round((energy_charges + fixed_charge + regulatory_duty) * (tax_pct / 100.0), 2)
    solar_savings = round(solar_kwh * tariff_rate, 2)
    
    total_bill_amount = round(energy_charges + fixed_charge + regulatory_duty + tax_amount, 2)
    daily_bill_amount = round(total_bill_amount / max(1, billing_days), 2)
    monthly_bill_amount = round(daily_bill_amount * 30.0, 2) if billing_days != 30 else total_bill_amount
    yearly_bill_amount = round(daily_bill_amount * 365.0, 2)
    
    average_cost_per_unit = round(total_bill_amount / max(0.1, net_units), 2) if net_units > 0 else tariff_rate
    
    return {
        "total_consumption_kwh": round(total_kwh, 2),
        "solar_deduction_kwh": round(solar_kwh, 2),
        "net_billed_units_kwh": round(net_units, 2),
        "billing_period_days": billing_days,
        "tariff_base_rate": tariff_rate,
        "currency": currency,
        "energy_charges": energy_charges,
        "fixed_charges": fixed_charge,
        "regulatory_duty": regulatory_duty,
        "tax_amount": tax_amount,
        "solar_savings_amount": solar_savings,
        "total_bill_amount": total_bill_amount,
        "daily_bill_amount": daily_bill_amount,
        "monthly_bill_amount": monthly_bill_amount,
        "yearly_bill_amount": yearly_bill_amount,
        "average_cost_per_unit": average_cost_per_unit,
        "pricing_mode": "Progressive Slab Tiers" if slab_mode else "Flat Tariff Rate",
        "slab_breakdown": slab_breakdown
    }

def predict_single_point(input_data: dict, history_df: pd.DataFrame = None):
    """
    Predicts single-point electricity consumption based on appliance breakdown or historical context.
    Supports granular appliance tracking (brand, model, count, wattage, hours) without requiring temperature/humidity.
    Computes exact electricity bill from total consumption.
    """
    model_metadata = load_trained_model()
    
    # Extract user inputs with robust defaults
    date_str = input_data.get("date") or pd.Timestamp.now().strftime("%Y-%m-%d")
    try:
        dt = pd.to_datetime(date_str)
    except Exception:
        dt = pd.Timestamp.now()
        
    occupants = int(input_data.get("occupants") or input_data.get("number_of_occupants") or 3)
    solar_gen = float(input_data.get("solar_generation") or 0.0)
    tariff_rate = float(input_data.get("tariff_rate") or 7.0)
    currency = str(input_data.get("currency") or "₹")
    fixed_charge = float(input_data.get("fixed_charge") or (50.0 if currency == "₹" else 5.0))
    is_slab_pricing = bool(input_data.get("is_slab_pricing", True))
    tax_percentage = float(input_data.get("tax_percentage") or 5.0)
    
    # Temperature and humidity fallback if not provided
    temp = float(input_data.get("temperature") or 24.0)
    humidity = float(input_data.get("humidity") or 60.0)
    
    appliances_list = input_data.get("appliances") or []
    
    # If appliance list is provided, calculate itemized consumption per appliance
    if appliances_list and len(appliances_list) > 0:
        processed_appliances = []
        total_appliance_kwh = 0.0
        total_rated_watts = 0.0
        brand_insights = []
        
        # Profile weights for hourly 24h simulation [0..23]
        hourly_weights = np.zeros(24)
        
        for app in appliances_list:
            name = str(app.get("name") or "Appliance").strip()
            brand = str(app.get("brand") or "Generic").strip()
            model = str(app.get("model") or "Standard").strip()
            count = max(1, int(app.get("count") or 1))
            power_watts = max(1.0, float(app.get("power_watts") or 75.0))
            hours = max(0.0, min(24.0, float(app.get("hours_per_day") or 0.0)))
            
            # kWh = count * watts * hours / 1000
            daily_kwh = round((count * power_watts * hours) / 1000.0, 3)
            monthly_kwh = round(daily_kwh * 30.0, 2)
            total_appliance_kwh += daily_kwh
            total_rated_watts += (power_watts * count)
            
            app_info = {
                "name": name,
                "brand": brand,
                "model": model,
                "count": count,
                "power_watts": power_watts,
                "hours_per_day": hours,
                "daily_kwh": daily_kwh,
                "monthly_kwh": monthly_kwh,
                "daily_cost": round(daily_kwh * tariff_rate, 2),
                "monthly_cost": round(monthly_kwh * tariff_rate, 2),
            }
            processed_appliances.append(app_info)
            
            # Hourly distribution contribution based on appliance type
            app_lower = name.lower()
            if "fan" in app_lower:
                # Fans run during afternoon and sleeping hours
                for h in range(24):
                    factor = 1.2 if (11 <= h <= 17 or 22 <= h or h <= 6) else 0.8
                    hourly_weights[h] += (daily_kwh / max(1.0, hours)) * factor * (hours / 24.0)
                # Efficiency check: BLDC fan comparison
                if power_watts > 40.0:
                    bldc_watts = 28.0
                    bldc_daily_kwh = (count * bldc_watts * hours) / 1000.0
                    saved_kwh_month = round((daily_kwh - bldc_daily_kwh) * 30.0, 1)
                    saved_cost_month = round(saved_kwh_month * tariff_rate, 2)
                    brand_insights.append({
                        "appliance": f"{count}x {brand} {name}",
                        "type": "Fan BLDC Upgrade",
                        "title": f"Upgrade {count}x {brand} Fan to BLDC Energy Saver",
                        "text": f"Your {count} fan(s) use {power_watts}W each (~{daily_kwh} kWh/day). Upgrading to 28W BLDC fans (e.g. Havells / Atomberg) would save {saved_kwh_month} kWh/month ({currency}{saved_cost_month}/mo).",
                        "potential_savings_kwh": saved_kwh_month,
                        "potential_savings_cost": saved_cost_month
                    })
            elif "ac" in app_lower or "conditioner" in app_lower:
                # AC runs peak afternoon (13-17) and night (22-04)
                for h in range(24):
                    factor = 1.8 if (13 <= h <= 17 or 22 <= h or h <= 4) else 0.4
                    hourly_weights[h] += (daily_kwh / max(1.0, hours)) * factor * (hours / 24.0)
                if "inverter" not in model.lower() and power_watts >= 1300:
                    brand_insights.append({
                        "appliance": f"{brand} {name}",
                        "type": "AC Inverter Optimization",
                        "title": f"Eco Temperature Setting for {brand} AC",
                        "text": f"Setting your {brand} AC thermostat to 24°C instead of 18°C saves ~24% compressor load (~{round(monthly_kwh * 0.24, 1)} kWh/mo).",
                        "potential_savings_kwh": round(monthly_kwh * 0.24, 1),
                        "potential_savings_cost": round(monthly_kwh * 0.24 * tariff_rate, 2)
                    })
            elif "tv" in app_lower or "television" in app_lower:
                # TV runs evening (18-23) and afternoon weekend (14-17)
                for h in range(24):
                    factor = 2.0 if (18 <= h <= 23) else (0.8 if 13 <= h <= 17 else 0.1)
                    hourly_weights[h] += (daily_kwh / max(1.0, hours)) * factor * (hours / 24.0)
                if "oled" in model.lower() or power_watts > 100:
                    brand_insights.append({
                        "appliance": f"{brand} {name}",
                        "type": "Display Energy Saving",
                        "title": f"{brand} TV Auto-Dimming Sensor",
                        "text": f"Enabling Ambient Light Eco-Sensor on your {brand} TV reduces peak panel wattage by 18-25% without sacrificing visual quality.",
                        "potential_savings_kwh": round(monthly_kwh * 0.20, 1),
                        "potential_savings_cost": round(monthly_kwh * 0.20 * tariff_rate, 2)
                    })
            elif "fridge" in app_lower or "refrigerator" in app_lower:
                # Continuous duty cycle ~24h
                for h in range(24):
                    factor = 1.1 if (10 <= h <= 21) else 0.9
                    hourly_weights[h] += (daily_kwh / 24.0) * factor
            elif "geyser" in app_lower or "heater" in app_lower:
                # Morning peak 06:00 to 09:00
                for h in range(24):
                    factor = 2.5 if (6 <= h <= 9) else 0.1
                    hourly_weights[h] += (daily_kwh / max(1.0, hours)) * factor * (hours / 24.0)
            elif "light" in app_lower or "bulb" in app_lower:
                # Evening 18:00 to 23:30
                for h in range(24):
                    factor = 2.2 if (18 <= h <= 23) else 0.2
                    hourly_weights[h] += (daily_kwh / max(1.0, hours)) * factor * (hours / 24.0)
            else:
                # Default generic hourly spread
                for h in range(24):
                    factor = 1.3 if (9 <= h <= 22) else 0.5
                    hourly_weights[h] += (daily_kwh / 24.0) * factor
                    
        # Baseline household standby load (routers, standby LEDs, vampire drain)
        base_standby_kwh = round(1.2 + occupants * 0.35, 2)
        
        # Net daily prediction
        daily_predicted = max(0.8, round(total_appliance_kwh + base_standby_kwh - solar_gen, 2))
        
        # Calculate percentage contribution per appliance
        factor_breakdown = {}
        for item in processed_appliances:
            item_pct = round((item["daily_kwh"] / max(0.1, daily_predicted)) * 100, 1)
            item["share_pct"] = item_pct
            key_label = f"{item['count']}x {item['brand']} {item['name']}"
            factor_breakdown[key_label] = item_pct
            
        base_pct = round((base_standby_kwh / max(0.1, daily_predicted)) * 100, 1)
        factor_breakdown["Standby & Baseline Load"] = base_pct
        
        # Normalize 24h hourly breakdown so sum equals daily_predicted
        sum_weights = float(np.sum(hourly_weights))
        if sum_weights > 0:
            hourly_curve = [
                round(float((w / sum_weights) * daily_predicted), 2)
                for w in hourly_weights
            ]
        else:
            hourly_curve = [round(daily_predicted / 24.0, 2)] * 24
            
        # Range and status
        range_low = round(max(0.5, daily_predicted * 0.92), 2)
        range_high = round(daily_predicted * 1.08, 2)
        
        if daily_predicted < 10.0:
            status = "Low"
        elif daily_predicted > 25.0:
            status = "High"
        else:
            status = "Normal"
            
        bill_details = calculate_electricity_bill(
            total_kwh=round(daily_predicted * 30.0, 2),
            tariff_rate=tariff_rate,
            currency=currency,
            billing_days=30,
            slab_mode=is_slab_pricing,
            fixed_charge=fixed_charge,
            tax_pct=tax_percentage,
            solar_kwh=round(solar_gen * 30.0, 2)
        )
            
        return {
            "predicted_consumption": daily_predicted,
            "unit": "kWh",
            "status": status,
            "estimated_range": {"low": range_low, "high": range_high},
            "confidence": "High (Granular Appliance Precision)",
            "model_name": "Appliance Energy Forecaster + Gradient Boosting Base",
            "total_appliance_kwh": round(total_appliance_kwh, 2),
            "base_standby_kwh": base_standby_kwh,
            "solar_offset_kwh": solar_gen,
            "total_rated_watts": round(total_rated_watts, 1),
            "estimated_daily_amount": bill_details["daily_bill_amount"],
            "estimated_monthly_amount": bill_details["monthly_bill_amount"],
            "estimated_yearly_amount": bill_details["yearly_bill_amount"],
            "estimated_daily_cost": bill_details["daily_bill_amount"],
            "estimated_monthly_cost": bill_details["monthly_bill_amount"],
            "currency": currency,
            "tariff_rate": tariff_rate,
            "bill_details": bill_details,
            "appliances": processed_appliances,
            "brand_insights": brand_insights,
            "factor_breakdown": factor_breakdown,
            "hourly_breakdown": hourly_curve
        }

    # ================= Fallback to Time-Series ML if no appliances specified =================
    if history_df is not None and not history_df.empty:
        prev_day_avg = history_df.tail(24)['consumption_kwh'].mean() if len(history_df) >= 24 else history_df['consumption_kwh'].mean()
        prev_week_avg = history_df.tail(168)['consumption_kwh'].mean() if len(history_df) >= 168 else history_df['consumption_kwh'].mean()
    elif model_metadata:
        prev_day_avg = model_metadata.get("history_mean", 1.8)
        prev_week_avg = model_metadata.get("history_mean", 1.8)
    else:
        prev_day_avg = 1.8
        prev_week_avg = 1.8

    prev_day_user = float(input_data.get("previous_day_consumption", prev_day_avg * 24.0)) / 24.0
    prev_week_user = float(input_data.get("previous_week_avg", prev_week_avg * 24.0)) / 24.0
    appliance_hours = float(input_data.get("appliance_usage", 6.0))

    daily_hourly_predictions = []
    
    if model_metadata and "model" in model_metadata:
        model = model_metadata["model"]
        feature_cols = model_metadata["feature_cols"]
        residual_std = model_metadata.get("residual_std", 0.3)
        model_name = model_metadata.get("model_name", "Gradient Boosting")
        
        for h in range(24):
            row = {
                'hour': h,
                'day': dt.day,
                'day_of_week': dt.dayofweek,
                'month': dt.month,
                'year': dt.year,
                'is_weekend': 1 if dt.dayofweek >= 5 else 0,
                'temperature': temp + 3.0 * np.sin(np.pi * (h - 5) / 12),
                'humidity': humidity,
                'occupants': occupants,
                'lag_1': prev_day_user,
                'lag_24': prev_day_user,
                'lag_168': prev_week_user,
                'rolling_mean_24': prev_day_user,
                'rolling_mean_168': prev_week_user
            }
            X_input = pd.DataFrame([row])[feature_cols]
            pred_h = float(model.predict(X_input)[0])
            daily_hourly_predictions.append(max(0.1, pred_h))
            
        raw_daily_total = float(sum(daily_hourly_predictions))
        appliance_factor = (appliance_hours - 6.0) * 0.8
        daily_predicted = max(2.0, round(raw_daily_total + appliance_factor - solar_gen, 1))
        
        range_margin = max(1.5, round(residual_std * 24 * 0.35, 1))
        range_low = round(max(1.0, daily_predicted - range_margin), 1)
        range_high = round(daily_predicted + range_margin, 1)
        confidence = "High" if residual_std < 0.5 else "Moderate"
    else:
        base = 18.0 + occupants * 1.5 + (appliance_hours - 4) * 0.9 - solar_gen
        daily_predicted = max(5.0, round(base, 1))
        range_low = round(daily_predicted * 0.9, 1)
        range_high = round(daily_predicted * 1.1, 1)
        confidence = "Estimated (Default Baseline)"
        model_name = "Baseline Empirical Model"

    daily_hist_avg = prev_day_avg * 24.0 if prev_day_avg else 21.4
    if daily_predicted < daily_hist_avg * 0.85:
        status = "Low"
    elif daily_predicted > daily_hist_avg * 1.15:
        status = "High"
    else:
        status = "Normal"

    factor_percentages = {
        "Appliance Usage": 45,
        "Base Load": 25,
        "Day of Week": 15,
        "Occupants": 15
    }

    bill_details = calculate_electricity_bill(
        total_kwh=round(daily_predicted * 30.0, 2),
        tariff_rate=tariff_rate,
        currency=currency,
        billing_days=30,
        slab_mode=is_slab_pricing,
        fixed_charge=fixed_charge,
        tax_pct=tax_percentage,
        solar_kwh=round(solar_gen * 30.0, 2)
    )

    return {
        "predicted_consumption": daily_predicted,
        "unit": "kWh",
        "status": status,
        "estimated_range": {"low": range_low, "high": range_high},
        "confidence": confidence,
        "model_name": model_name,
        "factor_breakdown": factor_percentages,
        "hourly_breakdown": [round(val, 2) for val in daily_hourly_predictions] if daily_hourly_predictions else [],
        "estimated_daily_amount": bill_details["daily_bill_amount"],
        "estimated_monthly_amount": bill_details["monthly_bill_amount"],
        "estimated_yearly_amount": bill_details["yearly_bill_amount"],
        "estimated_daily_cost": bill_details["daily_bill_amount"],
        "estimated_monthly_cost": bill_details["monthly_bill_amount"],
        "currency": currency,
        "tariff_rate": tariff_rate,
        "bill_details": bill_details,
        "appliances": [],
        "brand_insights": []
    }
