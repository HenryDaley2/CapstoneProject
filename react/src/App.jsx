import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Navbar from "./components/Navbar";
import "./App.css";
import Products from "./assets/Products.json";
import React, { useState, useEffect } from "react";
import ProductDisplay from "./components/ProductDisplay";

const App = () => {

    const handleDelete = async (sockId) => {
      try {
        // Make an API request to delete the sock with the given sockId
        const response = await fetch(
          `${import.meta.env.VITE_PRODUCTS_API_URL}/${sockId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Sock could not be deleted!");
        }
        // Update the state or fetch the updated data from the server
        const updatedData = data.filter((sock) => sock._id !== sockId); // Remove the deleted sock from the data array
        setData(updatedData); // Update the state with the updated data
      } catch (error) {
        console.error("Error deleting sock:", error);
      }
    };

    const [data, setData] = useState([]);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(import.meta.env.VITE_PRODUCTS_API_URL);
          if (!response.ok) {
            throw new Error("Data could not be fetched!");
          }
          const json_response = await response.json();
          setData(json_response); // assign JSON response to the data variable.
        } catch (error) {
          console.error("Error fetching socks:", error);
        }
      };

      fetchData();
    }, []);

    {
      // Change from static sock_data to data coming from sock API
      data.map((products) => (
        <Products key={products._id} data={products} /> // Change id to _id. _id is the key in the API response
      ));
    }
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path=":id" element ={<ProductDisplay/>} />
        <Route path="/" element={<Home data={Products} />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default App;
