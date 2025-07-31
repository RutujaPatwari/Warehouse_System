from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

df = pd.read_csv('data.csv')

def calculate_days_remaining(row):
    if row['average_daily_sales'] == 0:
        return float('inf')
    return row['current_stock'] / row['average_daily_sales']

def calculate_reorder_quantity(row, planning_window=60):
    required_units = row['average_daily_sales'] * planning_window
    reorder_qty = max(row['min_reorder_qty'], required_units - (row['current_stock']))
    return int(reorder_qty)

@app.route('/products', methods=['GET'])
def get_products():
    df['days_remaining'] = df.apply(calculate_days_remaining, axis=1)
    df['needs_reorder'] = df['days_remaining'] < (df['lead_time'] + 5)
    df['reorder_qty'] = df.apply(calculate_reorder_quantity, axis=1)
    
    return jsonify(df.to_dict(orient='records'))

@app.route('/reorder-report', methods=['GET'])
def get_reorder_report():
    df['days_remaining'] = df.apply(calculate_days_remaining, axis=1)
    df['needs_reorder'] = df['days_remaining'] < (df['lead_time'] + 5)
    df['reorder_qty'] = df.apply(calculate_reorder_quantity, axis=1)
    
    reorder_items = df[df['needs_reorder']].copy()
    reorder_items['estimated_cost'] = reorder_items['reorder_qty'] * reorder_items['cost_per_unit']
    
    # Convert numpy types to Python native types
    report = {
        'items': [
            {
                'name': str(row['name']),
                'current_stock': int(row['current_stock']),
                'days_remaining': float(row['days_remaining']),
                'reorder_qty': int(row['reorder_qty']),
                'cost_per_unit': float(row['cost_per_unit']),
                'estimated_cost': float(row['estimated_cost']),
                'criticality': str(row['criticality'])
            }
            for _, row in reorder_items.iterrows()
        ],
        'total_cost': float(reorder_items['estimated_cost'].sum()),
        'total_items': int(len(reorder_items))
    }
    
    return jsonify(report)

@app.route('/simulate', methods=['POST'])
def simulate_spike():
    data = request.json
    product_id = data['product_id']
    spike_factor = data.get('spike_factor', 3)
    duration = data.get('duration', 7)
    
    temp_df = df.copy()
    product_idx = temp_df['id'] == product_id
    temp_df.loc[product_idx, 'average_daily_sales'] *= spike_factor
    
    temp_df['days_remaining'] = temp_df.apply(calculate_days_remaining, axis=1)
    temp_df['needs_reorder'] = temp_df['days_remaining'] < (temp_df['lead_time'] + 5)
    temp_df['reorder_qty'] = temp_df.apply(calculate_reorder_quantity, axis=1)
    
    return jsonify(temp_df[product_idx].to_dict(orient='records')[0])

if __name__ == '__main__':
    app.run(debug=True)
