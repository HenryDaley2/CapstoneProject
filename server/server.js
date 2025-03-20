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

app.get("/products", async (req, res) => { // Query DB for all products and return them
  try {
    const client = await MongoClient.connect(url); // Connect to DB and find all products
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const products = await collection.find({}).toArray();
    res.json(products);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Error fetching products");
  }
});

app.get("/products/:id", async (req, res) => { // Query DB for a specific product and return it
  try {
    const { id } = req.params; 
    const client = await MongoClient.connect(url); // Connect to DB to find product
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const products = await collection.find({ id: Number(id) }).toArray();
    res.json(products);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send(`Error fetching product with id ${id}`);
  }
});

app.post("/register", async (req, res) => { // Allow users to create accounts and store info in users collection
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const client = await MongoClient.connect(url); // Connect to users collection
    const db = client.db(dbName);
    const usersCollection = db.collection("users"); 

    // Check if email is already registered
    const existingUser = await usersCollection.findOne({ email }); // Check if user already exists
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Insert user into database (NO HASHING)
    const newUser = { username, email, password }; // If user is new, add to collection
    await usersCollection.insertOne(newUser);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

app.post("/login", async (req, res) => { // Check for valid login
  try {
    const { email, password } = req.body;

    const client = await MongoClient.connect(url); // Connect to users collection
    const db = client.db(dbName);
    const usersCollection = db.collection("users");

    // Ensure email is lowercase & trimmed
    const user = await usersCollection.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) { // Check to see if user exists
      return res.status(400).json({ message: "User not found" });
    }

    // Check if passwords match (NO hashing)
    if (user.password !== password) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Return user data (excluding password)
    res.status(200).json({
      message: "Login successful",
      user: { email: user.email, username: user.username },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

app.post("/additem", async (req, res) => { // Allows user to add item to their cart and updates user's cart in carts collection
  try {
    const { user, id, item, type, price, quantity } = req.body;

    const client = await MongoClient.connect(url); // Connect to carts collection
    const db = client.db(dbName);
    const collection = db.collection("carts");

    const parsedUser = JSON.parse(user);

    const filter = {
      "user.email": parsedUser.email,
      "user.username": parsedUser.username,
    };

    const existingCart = await collection.findOne(filter); // Check to see if the user already has a cart

    if (existingCart) {
      const existingItem = existingCart.cart.find( // If cart exists, check if the item they are adding is already in their cart
        (cartItem) => cartItem.id == id
      );
      if (existingItem) { // If item already exists, update the quantity by adding to it
        await collection.updateOne(
          filter,
          { $inc: { "cart.$[elem].quantity": quantity } },
          { arrayFilters: [{ "elem.id": id }] }
        );
        return res
          .status(200)
          .json({ message: "Updated item quantity in cart" });
      } else {
        await collection.updateOne(filter, { // If item not in cart, add the item to cart with quantity
          $push: { cart: { id, item, type, price, quantity } },
        });
        return res.status(200).json({ message: "Added new item to cart" });
      }
    } else { // If cart does not exist for user, create it for them and add item to it
      await collection.insertOne({
        user: parsedUser,
        cart: [{ id, item, type, price, quantity }],
      });
      return res
        .status(200)
        .json({ message: "Created new cart for user and added item" });
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ message: "Error adding item to cart" });
  }
});

app.get("/cart/:user", async (req, res) => { // When user goes to view their cart, fetch it for them
  const { user } = req.params;
  try {
    const client = await MongoClient.connect(url); // Connect to carts collection
    const db = client.db(dbName);
    const collection = db.collection("carts");
    const cart = await collection
      .find({ "user.username": user.trim() }) // Find user's cart by their username, then return it
      .toArray();
    console.log(cart);
    res.json(cart);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ message: "Error adding item to cart" });
  }
});

app.post("/update-cart", async (req, res) => { // Update cart quantity display
  try {
    const { user, id, quantity } = req.body;

    const client = await MongoClient.connect(url); // Connect to carts collection
    const db = client.db(dbName);
    const collection = db.collection("carts");

    const parsedUser = JSON.parse(user);

    const filter = { "user.username": parsedUser.username }; // Return the quantity of each item in the user's cart
    const update = {
      $set: { "cart.$[elem].quantity": quantity },
    };

    const options = {
      arrayFilters: [{ "elem.id": id }],
    };

    const result = await collection.updateOne(filter, update, options);

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Updated quantity successfully" });
    } else {
      res.status(400).json({ message: "Failed to update quantity" });
    }
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    res.status(500).json({ message: "Error updating quantity" });
  }
});

app.post("/update-cart", async (req, res) => {
  try {
    const { user, id, quantity } = req.body;

    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection("carts");

    const parsedUser = JSON.parse(user);

    const filter = { "user.username": parsedUser.username, "cart.id": id };
    const update = {
      $set: { "cart.$.quantity": quantity }, // Dupe of route above? Not sure which to delete
    };

    const result = await collection.updateOne(filter, update);

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Quantity updated successfully" });
    } else {
      res.status(400).json({ message: "Failed to update quantity" });
    }
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    res.status(500).json({ message: "Error updating quantity" });
  }
});

app.delete("/remove-cart-item", async (req, res) => {
  try {
    const { user, id } = req.body;

    const client = await MongoClient.connect(url); // Connect to carts collection
    const db = client.db(dbName);
    const collection = db.collection("carts");

    const parsedUser = JSON.parse(user);

    const filter = { "user.username": parsedUser.username };
    const update = { $pull: { cart: { id: id } } }; // Removes selected item from cart

    const result = await collection.updateOne(filter, update);

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Item removed from cart" });
    } else {
      res.status(400).json({ message: "Failed to remove item" });
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ message: "Error removing item" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});