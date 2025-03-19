import React from "react";
import Product from "./Product";

const home = (props) => {
  return (
    <div className="home-container">
      <h1>Product List</h1>
      <div className="product-list">
        {props.data.map((Item) => (
          <Product key={Item.id} data={Item} />
        ))}
      </div>
    </div>
  );
};

export default home;
