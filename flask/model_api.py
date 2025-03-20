from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import pymongo
import pandas as pd
import pickle

app = Flask(__name__)
CORS(app, origins="http://localhost:5173")

with open('trained_model.pkl', 'rb') as file: # Load model from pickle file
    model_data = pickle.load(file)

client = pymongo.MongoClient("mongodb://localhost:27017") # Connect to MongoDB 
db = client["purePicks"]
col = db["products"]
products = []

for item in col.find(): # Convert DB info to Pandas DataFrame
    products.append(item)

df = pd.DataFrame(products)
df = df.drop(columns=['_id']) # Drop unnecessary info, then sort ID's
df = df.sort_values(by='id')

neighbors_model = model_data["model"] # Initialize model and preprocessing variables
le_type = model_data["le_type"]
scaler = model_data["scaler"]

df["type_encoded"] = le_type.transform(df["type"]) # Encode DataFrame so model can interpret it
df['price_scaled'] = scaler.fit_transform(df[['price']])
X = df[['type_encoded', 'price_scaled']]
print(df.head(10))
# distances, indices = neighbors_model.kneighbors(X[df['id'] == 2], n_neighbors = 5)

# nearest_neighbors = df.iloc[indices.flatten()[1:]]

@app.before_request # Handle CORS 
def before_request():
    if request.method == "OPTIONS":
        response = jsonify({})
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        return response

@app.route('/') # Just a test route
def home():
    return "Hello World!"

@app.route('/model/', methods=["POST", "OPTIONS"]) # Allow React app to make calls to model
def model():
    data = request.get_json()
    id = data["id"] # Extract product ID from request
    print(id)

    distances, indices = neighbors_model.kneighbors(X[df['id'] == int(id)], n_neighbors = 5) # Run model, return indices and find respective products. n is adjustable to find more products
    nearest_neighbors = df.iloc[indices.flatten()[1:]]
    nn_list = []
    for value in nearest_neighbors["id"].values:
        nn_list.append({"id": int(value)}) # Append found IDs to a list and parse into JSON
    print(data)
    print(nn_list)

    return jsonify(nn_list) # Return IDs

if __name__ == "__main__":
    app.run(debug = True, port=5001)