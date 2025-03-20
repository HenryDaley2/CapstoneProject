import express from "express";
import { promises as fs } from "fs";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const url = process.env.MONGO_DB_URL;
const dbName = process.env.MONGO_DB;
const collectionName = process.env.MONGO_DB_COLLECTION;
const usersCollection = process.env.MONGO_DB_USERS_COLLECTION;

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
    const products = await collection.find({ id: Number(id) }).toArray();
    res.json(products);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send(`Error fetching product with id ${id}`);
  }
});

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const usersCollection = db.collection("users"); // ✅ Using "users" collection

    // Check if email is already registered
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Insert user into database (NO HASHING)
    const newUser = { username, email, password };
    await usersCollection.insertOne(newUser);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const usersCollection = db.collection("users");

    // Ensure email is lowercase & trimmed
    const user = await usersCollection.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if passwords match (NO hashing)
    if (user.password !== password) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Return user data (excluding password)
    res
      .status(200)
      .json({
        message: "Login successful",
        user: { email: user.email, username: user.username },
      });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

app.post("/additem", async (req, res) => {
  try {
    const { user, id, item, type, price, quantity } = req.body;

    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection("carts");

    const parsedUser = JSON.parse(user);

    const filter = {
        "user.email": parsedUser.email,
        "user.username":parsedUser.username
    };

    const existingCart = await collection.findOne(filter);

    if (existingCart) {
        const existingItem = existingCart.cart.find((cartItem) => cartItem.id == id);
        if (existingItem){
            await collection.updateOne(filter, {$inc: {"cart.$[elem].quantity": quantity}},
                {arrayFilters: [{"elem.id": id}]}
            );
            return res.status(200).json({message: "Updated item quantity in cart"})
        }
        else{
            await collection.updateOne(filter, {$push: {cart: {id, item, type, price, quantity}}});
            return res.status(200).json({message:"Added new item to cart"})
        }
    }
    else{
        await collection.insertOne({
            user: parsedUser,
            cart: [{id, item, type, price, quantity}]
        });
        return res.status(200).json({message: "Created new cart for user and added item"})
    }   

    // const payload = {
    //   $setOnInsert: {
    //     user: JSON.parse(user),
    //     "cart.id": id,
    //     "cart.item": item,
    //     "cart.type": type,
    //     "cart.price": price,
    //   },
    //   $inc: { "cart.quantity": quantity },
    // };

    // const options = {
    //     arrayFilters: [{"elem.id": id}],
    //     upsert: true};

    // const result = await collection.updateOne(filter, payload, options)

    // if (result.upsertedCount > 0){
    //     res.status(200).json({ message: "Added new user to carts. Successfully added new item to cart." });
    // }
    // else if (result.modifiedCount > 0){
    //     res.status(200).json({message: "Updated item count"});
    // }
    // else {
    //     res.status(200).json({message: "No changes made."})
    // };

  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ message: "Error adding item to cart" });
  }
});

app.get("/cart/:user", async (req, res) => {
    const {user} = req.params;
  try {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection("carts");
    const cart = await collection.find({ "user.username": user.trim() }).toArray();
    console.log(cart)
    res.json(cart);
    
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ message: "Error adding item to cart" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
