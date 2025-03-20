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

  // ✅ Update quantity in both state & database
  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return; // Prevents negative quantity

    try {
      const response = await fetch("http://localhost:3000/update-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: localStorage.getItem("user"),
          id: id,
          quantity: newQuantity,
        }),
      });

      if (response.ok) {
        // ✅ Update the cart state without reloading
        props.setCartItems((prevCart) =>
          prevCart.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        console.error("Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  // ✅ Remove item from both state & database
  const removeItem = async (id) => {
    try {
      const response = await fetch("http://localhost:3000/remove-cart-item", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: localStorage.getItem("user"),
          id: id,
        }),
      });

      if (response.ok) {
        // ✅ Remove the item from local state instantly
        props.setCartItems((prevCart) =>
          prevCart.filter((item) => item.id !== id)
        );
      } else {
        console.error("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
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
