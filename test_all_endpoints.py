import urllib.request
import json

def test_api():
    base = "http://127.0.0.1:8000/api"
    print("Testing API endpoints...")
    
    # 1. Dashboard
    res = urllib.request.urlopen(f"{base}/dashboard")
    dash = json.loads(res.read().decode())
    print("[OK] GET /api/dashboard:", dash.keys())
    
    # 2. Predict
    data = json.dumps({
        "date": "2026-10-01",
        "temperature": 26.0,
        "humidity": 60.0,
        "previous_day_consumption": 45.0,
        "previous_week_avg": 48.0,
        "occupants": 3,
        "appliance_usage": 6.5,
        "solar_generation": 2.0
    }).encode()
    req = urllib.request.Request(f"{base}/predict", data=data, headers={'Content-Type': 'application/json'})
    pred = json.loads(urllib.request.urlopen(req).read().decode())
    print("[OK] POST /api/predict:", pred["predicted_consumption"], pred["unit"], "Status:", pred["status"])
    
    # 3. Model Metrics
    res = urllib.request.urlopen(f"{base}/model-metrics")
    metrics = json.loads(res.read().decode())
    print("[OK] GET /api/model-metrics: Best =", metrics["best_model"])
    
    # 4. History
    res = urllib.request.urlopen(f"{base}/history")
    hist = json.loads(res.read().decode())
    print("[OK] GET /api/history: Total records =", hist["total"])
    
    # 5. Analytics
    res = urllib.request.urlopen(f"{base}/analytics")
    anal = json.loads(res.read().decode())
    print("[OK] GET /api/analytics: Peak hour =", anal["peak_hour"])
    
    # 6. Insights
    res = urllib.request.urlopen(f"{base}/insights")
    ins = json.loads(res.read().decode())
    print("[OK] GET /api/insights: Generated", len(ins), "smart insights")
    
    # 7. PDF Export
    res = urllib.request.urlopen(f"{base}/export/report")
    pdf_content = res.read()
    print("[OK] GET /api/export/report: Received PDF bytes =", len(pdf_content))
    
    # 8. CSV Export
    res = urllib.request.urlopen(f"{base}/export/history-csv")
    csv_content = res.read().decode()
    print("[OK] GET /api/export/history-csv: CSV lines =", len(csv_content.splitlines()))

    print("\nAll API Endpoints Tested & Working Perfectly!")

if __name__ == "__main__":
    test_api()
