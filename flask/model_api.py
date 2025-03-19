from flask import Flask, jsonify, request
import pymongo

app = Flask(__name__)
client = pymongo.MongoClient("mongodb://localhost:27017")
db = client["purePicks"]
col = db["products"]

@app.route('/model', methods=["POST"])
def model_api():
    data = request.get_json()
    print("test: ", data)
    return data