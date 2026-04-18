from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

client = MongoClient(os.getenv("MONGO_URI"))
db = client["mydb"]

@app.route("/")
def home():
    return "Python API is running..."

if __name__ == "__main__":
    app.run(debug=True, port=5000)