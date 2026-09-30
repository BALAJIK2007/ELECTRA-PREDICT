import os
import sys

# Ensure root and backend in python path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)
sys.path.insert(0, os.path.join(BASE_DIR, "backend"))

from data.generate_sample_data import generate_electricity_dataset
from app.database.db import init_db, clear_records, insert_records_from_df
from app.ml.models import train_and_evaluate_all_models

def main():
    print("==================================================")
    print(" ElectraPredict AI - Model Training Pipeline")
    print("==================================================")
    init_db()
    
    csv_path = os.path.join(os.path.dirname(__file__), "..", "data", "sample_electricity_data.csv")
    if not os.path.exists(csv_path):
        print("Generating synthetic electricity dataset...")
        df = generate_electricity_dataset(num_days=100, output_path=csv_path)
    else:
        import pandas as pd
        print(f"Loading existing dataset from {csv_path}...")
        df = pd.read_csv(csv_path)
        
    print(f"Dataset shape: {df.shape}")
    print("Inserting dataset records into SQLite database...")
    clear_records()
    inserted = insert_records_from_df(df)
    print(f"Inserted {inserted} records into DB.")
    
    print("\nTraining and evaluating models using chronological train/validation/test split...")
    results = train_and_evaluate_all_models(df)
    
    print("\nTraining Summary:")
    print(f"Best Model Selected: {results['best_model']}")
    print("-" * 50)
    print(f"{'Model':<20} | {'MAE':<6} | {'RMSE':<6} | {'R²':<6} | {'MAPE (%)':<8}")
    print("-" * 50)
    for m in results['metrics']:
        print(f"{m['model']:<20} | {m['mae']:<6.2f} | {m['rmse']:<6.2f} | {m['r2']:<6.2f} | {m['mape']:<8.2f}")
    print("-" * 50)
    print("\nFeature Importances (Top Contributing Features):")
    for feat, val in list(results['feature_importances'].items())[:7]:
        print(f"  - {feat:<20}: {val*100:5.2f}%")
    print("\nModel saved successfully to models/trained_model.joblib!")

if __name__ == "__main__":
    main()
