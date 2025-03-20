import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const DisplayCartItems = (props) => {
  const total = (props.data.price * props.data.quantity).toFixed(2)
    return (
      <div className="cart-items">
        {" "}
        <h3>
          <a href={`${import.meta.env.VITE_STORE_URL}/${props.data.id}`}>
            {props.data.item}
          </a>
        </h3>
        <p> {props.data.type}</p>
        <p>{props.data.quantity}</p>
        <p>Price: ${props.data.price.toFixed(2)}</p>
        <p>Total: ${total}</p>
      </div>
    );
}

export default DisplayCartItems;