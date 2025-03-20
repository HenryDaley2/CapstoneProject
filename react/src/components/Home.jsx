import React, { useState, useEffect } from "react";
import Product from "./Product";

const Home = (props) => {
  const [searchString, setSearchString] = useState("");
  const [selectedType, setSelectedType] = useState("All"); // ✅ Track selected filter type

  useEffect(() => {
    console.log(
      "Available product types:",
      props.data.map((p) => `"${p.type}"`)
    ); // ✅ Logs all types

    const re = new RegExp(searchString, "i");

    // ✅ Normalize type formatting to ensure proper matching
    const normalizeType = (type) => type.toLowerCase().trim();

    let matchingProducts = props.data.filter(
      (product) =>
        re.test(product.item) &&
        (selectedType === "All" ||
          normalizeType(product.type) === normalizeType(selectedType))
    );

    console.log(`Filtering by: "${selectedType}"`);
    console.log("Matching products:", matchingProducts);

    props.setFilterProducts(matchingProducts);
  }, [searchString, selectedType, props.data]);

  const handleChange = (e) => {
    setSearchString(e.target.value);
  };

  // ✅ Ensure type is correctly formatted
  const filterByType = (type) => {
    console.log("Filtering by type:", type);
    setSelectedType(type);
  };

  if (props.data.length === 0) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="home-container">
      <h1>Product List</h1>

      {/* ✅ Filter Buttons */}
      <div className="filter-buttons">
        <button onClick={() => filterByType("All")}>All</button>
        <button onClick={() => filterByType("fruit")}>Fruits</button>
        <button onClick={() => filterByType("vegetable")}>Vegetables</button>
        <button onClick={() => filterByType("dairy")}>Dairy</button>
        <button onClick={() => filterByType("meat")}>Meats</button>
        <button onClick={() => filterByType("seafood")}>Seafood</button>
        <button onClick={() => filterByType("bread")}>Bread</button>
      </div>

      {/* ✅ Search Bar */}
      <input
        type="text"
        placeholder="Search..."
        className="search-bar"
        onInput={handleChange}
      />
      <i className="search-button">🔍</i>

      {/* ✅ Display Products */}
      <div className="product-list">
        {props.filterProducts.map((Item) => (
          <Product key={Item.id} data={Item} />
        ))}
      </div>
    </div>
  );
};

export default Home;
