import React from "react";

const Product = (props) => {
  return (
    <a
      href={`${import.meta.env.VITE_STORE_URL}/${props.data.id}`}
      className="product-link"
    >
      <div className="product-card">
        <h3>{props.data.item}</h3>
        <p>{props.data.type}</p>
        <p>Price: ${props.data.price.toFixed(2)}</p>
      </div>
    </a>
  );
};

export default Product;
