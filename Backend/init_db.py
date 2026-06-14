import json
import sqlite3
import os

def init_db():
    base_dir = os.path.dirname(__file__)
    json_path = os.path.join(base_dir, 'data', 'freight_dataset.json')
    db_path = os.path.join(base_dir, 'database.db')

    # Connect to SQLite (this creates the file if it doesn't exist)
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Create table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS shipments (
            id TEXT PRIMARY KEY,
            cargo_type TEXT,
            destination TEXT,
            delay_time_hours REAL,
            urgency_level TEXT,
            dependency_type TEXT,
            downstream_impact TEXT
        )
    ''')

    # Create risk_reports table for caching
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS risk_reports (
            shipment_id TEXT PRIMARY KEY,
            report_json TEXT,
            FOREIGN KEY (shipment_id) REFERENCES shipments(id)
        )
    ''')

    # Load JSON data
    with open(json_path, 'r') as f:
        data = json.load(f)

    # Insert data
    for item in data:
        cursor.execute('''
            INSERT OR IGNORE INTO shipments 
            (id, cargo_type, destination, delay_time_hours, urgency_level, dependency_type, downstream_impact)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            item['id'],
            item['cargo_type'],
            item['destination'],
            item['delay_time_hours'],
            item['urgency_level'],
            item['dependency_type'],
            item.get('downstream_impact', '')
        ))

    conn.commit()
    conn.close()
    print(f"Database successfully initialized at {db_path} with {len(data)} records.")

if __name__ == '__main__':
    init_db()
