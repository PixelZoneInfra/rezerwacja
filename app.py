from flask import Flask, request, jsonify, render_template
import sqlite3
from datetime import datetime

app = Flask(__name__)

DB_NAME = "orders.db"

# Tworzenie bazy danych przy starcie (jeśli nie istnieje)
def init_db():
    with sqlite3.connect(DB_NAME) as conn:
        c = conn.cursor()
        c.execute("""
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                desk INTEGER,
                items TEXT,
                timestamp TEXT
            )
        """)
        conn.commit()

init_db()

@app.route("/")
def index():
    return "<h1>Serwer działa. Odwiedź <a href='/panel'>Panel</a></h1>"

@app.route("/panel")
def panel():
    return render_template("panel.html")

@app.route("/api/orders", methods=["GET"])
def get_orders():
    with sqlite3.connect(DB_NAME) as conn:
        c = conn.cursor()
        c.execute("SELECT * FROM orders ORDER BY timestamp ASC")
        orders = [{
            "id": row[0],
            "desk": row[1],
            "items": row[2],
            "timestamp": row[3]
        } for row in c.fetchall()]
        return jsonify(orders)

@app.route("/api/order", methods=["POST"])
def create_order():
    data = request.get_json()
    desk = data.get("desk")
    items = data.get("items")
    timestamp = datetime.utcnow().isoformat()
    with sqlite3.connect(DB_NAME) as conn:
        c = conn.cursor()
        c.execute("INSERT INTO orders (desk, items, timestamp) VALUES (?, ?, ?)",
                  (desk, items, timestamp))
        conn.commit()
        return jsonify({"message": "Order created"}), 201

@app.route("/api/order/<int:order_id>", methods=["DELETE"])
def delete_order(order_id):
    with sqlite3.connect(DB_NAME) as conn:
        c = conn.cursor()
        c.execute("DELETE FROM orders WHERE id = ?", (order_id,))
        conn.commit()
        return jsonify({"message": "Order deleted"}), 200

if __name__ == "__main__":
    app.run(debug=True)
