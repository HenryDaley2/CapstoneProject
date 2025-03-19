import express from "express";
import { promises as fs } from "fs";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const url = process.env.MONGO_DB_URL;
const dbName = process.env.MONGO_DB;
const collectionName = process.env.MONGO_DB_COLLECTION;

const app = express();
app.use(cors()); // Enable CORS for all routes
const PORT = 3000;

app.use(express.json());

app.get("/products", async (req, res) => {
  try {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const products = await collection.find({}).toArray();
    res.json(products);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Error fetching products");
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const products = await collection.find({ id: id }).toArray();
    res.json(products);
  } catch (err) {
    console.error("Error:", err);
    res
      .status(500)
      .send(`Error fetching product with id ${id}`);
  }
});
