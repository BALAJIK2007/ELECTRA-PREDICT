import sqlite3
import os
import pandas as pd
import numpy as np
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "electrapredict.db")

def get_connection():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # electricity_records table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS electricity_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        consumption_kwh REAL NOT NULL,
        temperature REAL,
        humidity REAL,
        occupants INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # predictions table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        prediction_date TEXT NOT NULL,
        predicted_consumption REAL NOT NULL,
        actual_consumption REAL,
        model_name TEXT NOT NULL,
        status TEXT,
        estimated_range_low REAL,
        estimated_range_high REAL,
        confidence TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # model_metrics table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS model_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        model_name TEXT NOT NULL,
        mae REAL NOT NULL,
        rmse REAL NOT NULL,
        r2 REAL NOT NULL,
        mape REAL,
        training_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    
    # settings table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
    )
    """)
    
    # Insert default settings if not exists
    defaults = {
        "unit": "kWh",
        "currency": "$",
        "mode": "household",
        "theme": "light",
        "default_horizon": "1-day",
        "notifications": "enabled"
    }
    for k, v in defaults.items():
        cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)", (k, v))
        
    conn.commit()
    conn.close()

def load_records_dataframe():
    conn = get_connection()
    df = pd.read_sql_query("SELECT date, time, consumption_kwh, temperature, humidity, occupants FROM electricity_records ORDER BY date ASC, time ASC", conn)
    conn.close()
    return df

def clear_records():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM electricity_records")
    conn.commit()
    conn.close()

def insert_records_from_df(df: pd.DataFrame):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Format and validate
    df = df.copy()
    if 'date' not in df.columns or 'time' not in df.columns or 'consumption_kwh' not in df.columns:
        conn.close()
        raise ValueError("DataFrame missing required columns: date, time, consumption_kwh")
        
    if 'temperature' not in df.columns:
        df['temperature'] = 22.0
    if 'humidity' not in df.columns:
        df['humidity'] = 60.0
    if 'occupants' not in df.columns:
        df['occupants'] = 3
        
    records = []
    for _, row in df.iterrows():
        records.append((
            str(row['date']),
            str(row['time']),
            float(row['consumption_kwh']),
            float(row['temperature']) if pd.notnull(row['temperature']) else 22.0,
            float(row['humidity']) if pd.notnull(row['humidity']) else 60.0,
            int(row['occupants']) if pd.notnull(row['occupants']) else 3
        ))
        
    cursor.executemany("""
    INSERT INTO electricity_records (date, time, consumption_kwh, temperature, humidity, occupants)
    VALUES (?, ?, ?, ?, ?, ?)
    """, records)
    
    conn.commit()
    conn.close()
    return len(records)
