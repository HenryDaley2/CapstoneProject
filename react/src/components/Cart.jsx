import DisplayCartItems from "./DisplayCartItems";
import { Link } from "react-router-dom";

const Cart = (props) => {
  if (props.cartItems.length === 0) { // Check to see if carItems are properly loaded. If not, display a loading placeholder for user
    return <h1>Loading...</h1>;
  }

  let total = props.cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity, // Calculate total price of items in cart
    0
  );

  // Helper function to update backend & state
  const updateCart = async (url, method, body, updateState) => {
    try {
      const response = await fetch(url, { // Fetch cart data 
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        updateState(); // Call the function to update state if successful
      } else {
        console.error("Failed to update cart");
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  // Update quantity function
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    updateCart( // Submit POST request to server to modify user item quantity in DB
      "http://localhost:3000/update-cart",
      "POST",
      { user: localStorage.getItem("user"), id, quantity: newQuantity },
      () =>
        props.setCartItems((prevCart) =>
          prevCart.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        )
    );
  };

  // Remove item function
  const removeItem = (id) => { // Submit DELETE request to server to remove the clicked item
    updateCart(
      "http://localhost:3000/remove-cart-item",
      "DELETE",
      { user: localStorage.getItem("user"), id },
      () =>
        props.setCartItems((prevCart) =>
          prevCart.filter((item) => item.id !== id)
        )
    );
  };

  return (
    <div className="cart-container">
      {props.cartItems?.map((item) => (
        <div key={item.id} className="cart-item-box">
          <DisplayCartItems data={item} />

          {/* Quantity Controls */}
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

          {/* Remove Button */}
          <button className="remove-btn" onClick={() => removeItem(item.id)}>
            Remove
          </button>
        </div>
      ))}

      {/* Checkout Button NO FUNCTIONALITY */}
      <Link to="/checkout" className="create-account-btn">
        Checkout
      </Link>

      {/* Display Grand Total */}
      <footer>Grand Total: ${total.toFixed(2)}</footer>
    </div>
  );
};

export default Cart;
