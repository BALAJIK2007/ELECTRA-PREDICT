import os
import math
import random
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_electricity_dataset(num_days=100, output_path="data/sample_electricity_data.csv"):
    """
    Generates synthetic hourly electricity consumption data with realistic patterns:
    - Diurnal (daily) patterns: Morning and evening peaks, low night usage.
    - Day of week differences: Weekends have higher daytime usage.
    - Temperature sensitivity: Increased HVAC usage during hot (>25°C) and cold (<15°C) weather.
    - Household occupancy variations.
    - Random environmental noise.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    start_date = datetime(2026, 1, 1, 0, 0, 0)
    records = []
    
    # Base temperature seasonality over 100+ days (starting in Jan winter to spring/summer)
    base_temp_trend = [18.0 + 8.0 * math.sin(2 * math.pi * i / (num_days * 24)) for i in range(num_days * 24)]
    
    current_time = start_date
    np.random.seed(42)
    random.seed(42)
    
    for i in range(num_days * 24):
        hour = current_time.hour
        day_of_week = current_time.weekday() # 0 = Monday, 6 = Sunday
        is_weekend = 1 if day_of_week in [5, 6] else 0
        
        # Diurnal temp variation: peak around 14:00, lowest at 05:00
        daily_temp_cycle = 4.0 * math.sin(math.pi * (hour - 5) / 12)
        temperature = round(base_temp_trend[i] + daily_temp_cycle + np.random.normal(0, 1.2), 1)
        humidity = round(max(30.0, min(95.0, 65.0 - daily_temp_cycle * 2.5 + np.random.normal(0, 3.0))), 1)
        
        # Occupants variation
        if 0 <= hour <= 6:
            occupants = 4
        elif 8 <= hour <= 17 and not is_weekend:
            occupants = random.choice([1, 2, 2])
        else:
            occupants = random.choice([3, 4, 4])
            
        # Base consumption profile
        if 0 <= hour <= 5:
            base_kwh = 0.4 + 0.1 * np.random.rand() # Night base load (fridge, standby)
        elif 6 <= hour <= 9:
            base_kwh = 1.6 + 0.5 * np.random.rand() # Morning peak (shower, breakfast, kettle)
        elif 10 <= hour <= 16:
            base_kwh = 1.1 + 0.4 * (1.3 if is_weekend else 0.8) # Daytime
        elif 17 <= hour <= 21:
            base_kwh = 2.4 + 0.7 * np.random.rand() # Evening peak (cooking, lighting, TV, AC)
        else:
            base_kwh = 0.9 + 0.3 * np.random.rand()
            
        # Temperature effect (HVAC usage)
        temp_effect = 0.0
        if temperature > 25.0:
            temp_effect = (temperature - 25.0) * 0.12 # Air conditioning
        elif temperature < 16.0:
            temp_effect = (16.0 - temperature) * 0.08 # Heating
            
        # Occupant factor
        occupant_effect = occupants * 0.15
        
        # Total consumption
        total_kwh = base_kwh + temp_effect + occupant_effect + np.random.normal(0, 0.15)
        total_kwh = max(0.2, round(total_kwh, 2)) # Ensure positive value
        
        records.append({
            "date": current_time.strftime("%Y-%m-%d"),
            "time": current_time.strftime("%H:%M"),
            "consumption_kwh": total_kwh,
            "temperature": temperature,
            "humidity": humidity,
            "occupants": occupants
        })
        
        current_time += timedelta(hours=1)
        
    df = pd.DataFrame(records)
    df.to_csv(output_path, index=False)
    print(f"Successfully generated {len(df)} records in {output_path}")
    return df

if __name__ == "__main__":
    generate_electricity_dataset()
