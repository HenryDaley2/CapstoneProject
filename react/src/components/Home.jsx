import React from "react";
import {useState, useEffect} from "react";
import Product from "./Product";

const Home = (props) => {
  const [searchString, setSearchString] = useState("");
  console.log("after", props.filterProducts);

  useEffect(() => {
    const re = new RegExp(searchString, "i");
    let matchingProducts = props.data.filter((product) =>
      re.test(product.item)
    );
    props.setFilterProducts(matchingProducts);
  }, [searchString]);

  const handleChange = (e) => {
    setSearchString(e.target.value);
    console.log(searchString);
  };


  if (props.data.length == 0) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="home-container">
      <h1>Product List</h1>
      {/* Right Section - Search Bar */}
      <input
        type="text"
        placeholder="Search..."
        className="search-bar"
        onInput={handleChange}
      />
      <i className="search-button">🔍</i>

      <div className="product-list">
        {props.filterProducts.map((Item) => (
          <Product key={Item.id} data={Item} />
        ))}
      </div>
    </div>
  );
};

export default Home;
