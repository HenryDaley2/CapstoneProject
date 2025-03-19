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

const App = () => {
    const [data, setData] = useState([]);
    const [filterProducts, setFilterProducts] = useState([]);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(import.meta.env.VITE_PRODUCTS_API_URL);
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
      <Navbar data={data} />
      <Routes>
        <Route path=":id" element={<ProductDisplay />} />
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
        <Route path="/about" element={<About />} />
        <Route path="/createaccount" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
