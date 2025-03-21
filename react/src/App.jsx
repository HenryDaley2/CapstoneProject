import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Navbar from "./components/Navbar";
import "./App.css";
import Products from "./assets/Products.json";
import React, { useState, useEffect } from "react";
import ProductDisplay from "./components/ProductDisplay";
import CreateAccount from "./components/CreateAccount";
import Login from "./components/Login";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    async function getCart() {
      // let url = `${import.meta.env.VITE_PRODUCTS_API_URL}/cart/${localStorage.getItem("user")}`;
      let user = JSON.parse(localStorage.getItem("user"));
        try {
          let user = JSON.parse(localStorage.getItem("user"));
          console.log("user ", user);
          let url = `http://localhost:3000/cart/${user.username}`; // Fetch the cart of the logged in user, assuming there is one
          console.log("url: ", url);
          const fetchCart = await fetch(url).then((res) => res.json());
          console.log(fetchCart);
          setCartItems(fetchCart[0].cart);
        } catch (error) {
          console.error("Error fetching product", error.message);
        }
    }
    getCart();
  }, []);

  const [data, setData] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_PRODUCTS_API_URL); // Fetch all products for display
        if (!response.ok) {
          throw new Error("Data could not be fetched!");
        }
        const json_response = await response.json();
        setData(json_response); // assign JSON response to the data variable.
        setFilterProducts(json_response);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Router>
      <Navbar data={data} numberOfItemsInCart={cartItems.length} />
      <Routes>
        {/* Create pages for each individual product for display */}
        <Route
          path=":id"
          element={
            <ProductDisplay
              data={data}
              cartItems={cartItems}
              setCartItems={setCartItems}
            />
          }
        />
        {/* Home Page */}
        <Route
          path="/"
          element={
            <Home
              data={data}
              filterProducts={filterProducts}
              setFilterProducts={setFilterProducts}
            />
          }
        />
        {/* About Page */}
        <Route path="/about" element={<About />} />
        {/* Create Account Page */}
        <Route path="/create-account" element={<CreateAccount />} />
        {/* Login Page */}
        <Route path="/login" element={<Login />} />
        {/* User Cart Page */}
        <Route
          path="/cart"
          element={<Cart cartItems={cartItems} setCartItems={setCartItems} />}
        />
        <Route path="/checkout" element={<Checkout setCartItems={setCartItems} />} />
      </Routes>
    </Router>
  );
};

export default App;
