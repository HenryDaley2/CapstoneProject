from flask import Flask, jsonify, request
import pymongo
import pandas as pd
import pickle

app = Flask(__name__)

with open('trained_model.pkl', 'rb') as file:
    model_data = pickle.load(file)

client = pymongo.MongoClient("mongodb://localhost:27017")
db = client["purePicks"]
col = db["products"]
products = []

for item in col.find():
    products.append(item)

df = pd.DataFrame(products)
df = df.drop(columns=['_id'])
df = df.sort_values(by='id')

neighbors_model = model_data["model"]
le_type = model_data["le_type"]
scaler = model_data["scaler"]

df["type_encoded"] = le_type.transform(df["type"])
df['price_scaled'] = scaler.fit_transform(df[['price']])
X = df[['type_encoded', 'price_scaled']]

# distances, indices = neighbors_model.kneighbors(X[df['id'] == 2], n_neighbors = 5)

# nearest_neighbors = df.iloc[indices.flatten()[1:]]


@app.route('/model', methods=["POST"])
def model_api():
    data = request.get_json()
    print("test: ", data)
    return data