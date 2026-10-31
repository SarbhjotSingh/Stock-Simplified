"""
Stock Simplified - Python Backend Engine
Handles user profiles, onboarding poll responses, paper trading wallet balances,
and historical / live simulated candlestick generation for Forex and Stocks.
"""

import json
import math
import random
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# In-Memory Database (with Supabase schema compatibility)
USERS_DB = {}
ONBOARDING_POLLS = []
WALLET_BALANCES = {}
ACTIVE_POSITIONS = {}
TRADE_HISTORIES = {}

INITIAL_BALANCE = 100000.0  # $100,000 USD virtual paper trading capital

ASSET_CONFIGS = {
    "EUR/USD": {"type": "forex", "basePrice": 1.0850, "pipSize": 0.0001, "volatility": 0.0008},
    "GBP/USD": {"type": "forex", "basePrice": 1.2940, "pipSize": 0.0001, "volatility": 0.0012},
    "USD/JPY": {"type": "forex", "basePrice": 154.20, "pipSize": 0.01, "volatility": 0.15},
    "AUD/USD": {"type": "forex", "basePrice": 0.6550, "pipSize": 0.0001, "volatility": 0.0009},
    "USD/CAD": {"type": "forex", "basePrice": 1.3910, "pipSize": 0.0001, "volatility": 0.0010},
    "GBP/JPY": {"type": "forex", "basePrice": 199.50, "pipSize": 0.01, "volatility": 0.22},
    "AAPL": {"type": "stock", "basePrice": 224.50, "pipSize": 0.01, "volatility": 1.20},
    "NVDA": {"type": "stock", "basePrice": 138.80, "pipSize": 0.01, "volatility": 1.80},
    "TSLA": {"type": "stock", "basePrice": 252.10, "pipSize": 0.01, "volatility": 2.50},
    "MSFT": {"type": "stock", "basePrice": 428.30, "pipSize": 0.01, "volatility": 1.40},
    "AMZN": {"type": "stock", "basePrice": 186.70, "pipSize": 0.01, "volatility": 1.10},
    "RELIANCE": {"type": "stock", "basePrice": 2740.0, "pipSize": 0.05, "volatility": 15.0},
    "TCS": {"type": "stock", "basePrice": 3950.0, "pipSize": 0.05, "volatility": 20.0},
}


def generate_candles(symbol: str, count: int = 100, interval_seconds: int = 60):
    """
    Generate realistic multi-period OHLCV candlestick data with trend cycles and wick noise.
    """
    cfg = ASSET_CONFIGS.get(symbol, ASSET_CONFIGS["EUR/USD"])
    current_price = cfg["basePrice"]
    vol = cfg["volatility"]
    now = int(time.time())
    candles = []

    # Start from past to present
    start_time = now - (count * interval_seconds)

    for i in range(count):
        candle_time = start_time + (i * interval_seconds)
        # Random walk with mean reversion
        drift = (cfg["basePrice"] - current_price) * 0.02
        noise = (random.random() - 0.5) * vol * 2
        close_price = round(current_price + drift + noise, 5)

        high_noise = abs(random.random() * vol)
        low_noise = abs(random.random() * vol)

        candle_high = round(max(current_price, close_price) + high_noise, 5)
        candle_low = round(min(current_price, close_price) - low_noise, 5)
        volume = int(random.randint(500, 5000) * (1 + abs(noise) / vol))

        candles.append({
            "time": candle_time,
            "open": current_price,
            "high": candle_high,
            "low": candle_low,
            "close": close_price,
            "volume": volume
        })
        current_price = close_price

    return candles


class MarketServiceHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(204)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        if path == '/api/py/candles':
            symbol = query.get('symbol', ['EUR/USD'])[0]
            count = int(query.get('count', ['120'])[0])
            candles = generate_candles(symbol, count=count)
            self._set_headers(200)
            self.wfile.write(json.dumps({"symbol": symbol, "candles": candles}).encode('utf-8'))
        elif path == '/api/py/wallet':
            user_id = query.get('userId', ['guest_user'])[0]
            balance = WALLET_BALANCES.get(user_id, INITIAL_BALANCE)
            positions = ACTIVE_POSITIONS.get(user_id, [])
            history = TRADE_HISTORIES.get(user_id, [])
            self._set_headers(200)
            self.wfile.write(json.dumps({
                "userId": user_id,
                "balance": balance,
                "positions": positions,
                "history": history
            }).encode('utf-8'))
        elif path == '/api/py/health':
            self._set_headers(200)
            self.wfile.write(json.dumps({"status": "healthy", "service": "python-market-engine"}).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))

    def do_POST(self):
        parsed = urlparse(self.path)
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        payload = json.loads(post_data.decode('utf-8')) if post_data else {}

        if parsed.path == '/api/py/onboarding/poll':
            ONBOARDING_POLLS.append(payload)
            self._set_headers(200)
            self.wfile.write(json.dumps({
                "status": "success",
                "message": "Onboarding poll saved in Python backend engine",
                "data": payload
            }).encode('utf-8'))
        elif parsed.path == '/api/py/users/create':
            user_id = payload.get("id", f"user_{int(time.time())}")
            USERS_DB[user_id] = payload
            WALLET_BALANCES[user_id] = INITIAL_BALANCE
            self._set_headers(200)
            self.wfile.write(json.dumps({"status": "success", "user": USERS_DB[user_id]}).encode('utf-8'))
        elif parsed.path == '/api/py/admin/login':
            email = payload.get("email", "").strip().lower()
            pwd = payload.get("password", "")
            if email == "admin@stocksimplified.com" and pwd == "AdminPass123!":
                self._set_headers(200)
                self.wfile.write(json.dumps({
                    "status": "success",
                    "role": "admin",
                    "user": {"email": email, "role": "admin", "name": "Python Backend Master Admin"}
                }).encode('utf-8'))
            else:
                self._set_headers(401)
                self.wfile.write(json.dumps({"error": "Invalid admin credentials"}).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))


def run_service(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, MarketServiceHandler)
    print(f"Stock Simplified Python Backend running on port {port}...")
    httpd.serve_forever()


if __name__ == '__main__':
    run_service(8000)
