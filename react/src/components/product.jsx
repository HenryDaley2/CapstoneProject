import React from "react";

const Product = (props) => {
  return (
    <div className="product-card">
      <h3>
        <a href={`${import.meta.env.VITE_STORE_URL}/${props.data.id}`}>
          {props.data.item}
        </a>
      </h3>
      <p> {props.data.type}</p>
      <p>Price: ${props.data.price.toFixed(2)}</p>
    </div>
  );
};

export default Product;
