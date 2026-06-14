import sqlite3
import os
import pickle
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder

class DelayPredictor:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.le_cargo = LabelEncoder()
        self.le_dest = LabelEncoder()
        self.le_urgency = LabelEncoder()
        self.is_trained = False
        self.model_path = os.path.join(os.path.dirname(__file__), '..', 'delay_model.pkl')

    def load_data_from_db(self):
        db_path = os.path.join(os.path.dirname(__file__), '..', 'database.db')
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        rows = conn.execute('SELECT cargo_type, destination, urgency_level, delay_time_hours FROM shipments').fetchall()
        conn.close()
        return [dict(r) for r in rows]

    def train(self):
        data = self.load_data_from_db()
        if not data:
            print("No data available to train the ML model.")
            return

        cargo_types = [d['cargo_type'] for d in data]
        destinations = [d['destination'] for d in data]
        urgencies = [d['urgency_level'] for d in data]
        y = [d['delay_time_hours'] for d in data]

        # Fit Label Encoders
        self.le_cargo.fit(cargo_types)
        self.le_dest.fit(destinations)
        self.le_urgency.fit(urgencies)

        # Transform features
        X_cargo = self.le_cargo.transform(cargo_types)
        X_dest = self.le_dest.transform(destinations)
        X_urgency = self.le_urgency.transform(urgencies)

        X = np.column_stack((X_cargo, X_dest, X_urgency))

        # Train model
        self.model.fit(X, y)
        self.is_trained = True
        
        # Save model
        with open(self.model_path, 'wb') as f:
            pickle.dump({
                'model': self.model,
                'le_cargo': self.le_cargo,
                'le_dest': self.le_dest,
                'le_urgency': self.le_urgency
            }, f)
        print("ML Model trained and saved successfully.")

    def load_model(self):
        if os.path.exists(self.model_path):
            with open(self.model_path, 'rb') as f:
                saved = pickle.load(f)
                self.model = saved['model']
                self.le_cargo = saved['le_cargo']
                self.le_dest = saved['le_dest']
                self.le_urgency = saved['le_urgency']
                self.is_trained = True
        else:
            self.train()

    def predict_delay(self, cargo_type: str, destination: str, urgency_level: str) -> float:
        if not self.is_trained:
            self.load_model()
            
        try:
            # Handle unseen labels gracefully by assigning to a known label or 0
            c = self.le_cargo.transform([cargo_type])[0] if cargo_type in self.le_cargo.classes_ else 0
            d = self.le_dest.transform([destination])[0] if destination in self.le_dest.classes_ else 0
            u = self.le_urgency.transform([urgency_level])[0] if urgency_level in self.le_urgency.classes_ else 0
            
            X = np.array([[c, d, u]])
            pred = self.model.predict(X)[0]
            return round(pred, 1)
        except Exception as e:
            print(f"Prediction error: {e}")
            return 0.0

if __name__ == "__main__":
    predictor = DelayPredictor()
    predictor.train()
