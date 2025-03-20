import { useParams } from "react-router-dom";
import DisplayCartItems from "./DisplayCartItems";
import { useState } from "react";

const Cart = (props) => {
  if (props.cartItems.length === 0) {
    return <h1>Loading...</h1>;
  }

  let total = 0;
  props.cartItems?.forEach((item) => {
    total += item.price * item.quantity;
  });

  // ✅ Update quantity of an item
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return; // Prevents negative quantity

    const updatedCart = props.cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );

    props.setCartItems(updatedCart);
  };

  // ✅ Remove item from cart
  const removeItem = (id) => {
    const updatedCart = props.cartItems.filter((item) => item.id !== id);
    props.setCartItems(updatedCart);
  };

  return (
    <div className="cart-container">
      {props.cartItems?.map((item) => (
        <div key={item.id} className="cart-item-box">
          <DisplayCartItems data={item} />

          {/* ✅ Quantity Controls */}
          <div className="quantity-controls">
            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
              -
            </button>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                updateQuantity(item.id, parseInt(e.target.value))
              }
              min="1"
            />
            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
              +
            </button>
          </div>

          {/* ✅ Remove Button */}
          <button className="remove-btn" onClick={() => removeItem(item.id)}>
            Remove
          </button>
        </div>
      ))}

      {/* ✅ Checkout Button */}
      <button className="checkout-btn">Checkout</button>

      {/* ✅ Display Grand Total */}
      <footer>Grand Total: ${total.toFixed(2)}</footer>
    </div>
  );
};

export default Cart;
