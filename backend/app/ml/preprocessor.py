import pandas as pd
import numpy as np

def prepare_features(df: pd.DataFrame, drop_na=True) -> pd.DataFrame:
    """
    Cleans data, creates chronological time features, lag features, and rolling metrics.
    Prevents data leakage by sorting by datetime.
    """
    data = df.copy()
    
    # Ensure correct datetime parsing
    if 'datetime' not in data.columns:
        data['datetime'] = pd.to_datetime(data['date'] + ' ' + data['time'])
    else:
        data['datetime'] = pd.to_datetime(data['datetime'])
        
    data = data.sort_values('datetime').reset_index(drop=True)
    
    # Extract temporal features
    data['hour'] = data['datetime'].dt.hour
    data['day'] = data['datetime'].dt.day
    data['day_of_week'] = data['datetime'].dt.dayofweek
    data['month'] = data['datetime'].dt.month
    data['year'] = data['datetime'].dt.year
    data['is_weekend'] = data['day_of_week'].apply(lambda x: 1 if x >= 5 else 0)
    
    # Exogenous features defaults
    if 'temperature' not in data.columns:
        data['temperature'] = 22.0
    if 'humidity' not in data.columns:
        data['humidity'] = 60.0
    if 'occupants' not in data.columns:
        data['occupants'] = 3
        
    # Chronological lag features based on historical target (consumption_kwh)
    target_col = 'consumption_kwh'
    data['lag_1'] = data[target_col].shift(1)
    data['lag_24'] = data[target_col].shift(24)
    data['lag_168'] = data[target_col].shift(168)
    
    # Rolling averages (using closed='left' to prevent including current value)
    data['rolling_mean_24'] = data[target_col].shift(1).rolling(window=24, min_periods=1).mean()
    data['rolling_mean_168'] = data[target_col].shift(1).rolling(window=168, min_periods=1).mean()
    
    # Fill initial missing lag values gracefully for early rows if drop_na=False
    if not drop_na:
        data['lag_1'] = data['lag_1'].bfill().ffill()
        data['lag_24'] = data['lag_24'].fillna(data['lag_1']).bfill().ffill()
        data['lag_168'] = data['lag_168'].fillna(data['lag_24']).bfill().ffill()
        data['rolling_mean_24'] = data['rolling_mean_24'].fillna(data[target_col]).bfill().ffill()
        data['rolling_mean_168'] = data['rolling_mean_168'].fillna(data['rolling_mean_24']).bfill().ffill()
    else:
        data = data.dropna().reset_index(drop=True)
        
    return data

def get_feature_columns():
    return [
        'hour', 'day', 'day_of_week', 'month', 'year', 'is_weekend',
        'temperature', 'humidity', 'occupants',
        'lag_1', 'lag_24', 'lag_168',
        'rolling_mean_24', 'rolling_mean_168'
    ]

def chronological_split(data: pd.DataFrame, train_ratio=0.70, val_ratio=0.15):
    """
    Strictly splits time-series data chronologically to prevent data leakage.
    Older -> Train
    Middle -> Validation
    Latest -> Test
    """
    n = len(data)
    train_end = int(n * train_ratio)
    val_end = int(n * (train_ratio + val_ratio))
    
    train_df = data.iloc[:train_end].copy()
    val_df = data.iloc[train_end:val_end].copy()
    test_df = data.iloc[val_end:].copy()
    
    return train_df, val_df, test_df
