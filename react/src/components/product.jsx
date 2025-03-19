import React from "react";

const Product = (props) => {
  return (
    <div className="product-card">
      <h3>{props.data.item}</h3>
      <p> {props.data.type}</p>
      <p>Price: ${props.data.price.toFixed(2)}</p>
    </div>
  );
};

export default Product;
