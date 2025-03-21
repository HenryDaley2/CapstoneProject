import { useState } from "react";
import {Link, useNavigate } from "react-router-dom";

const Checkout = (props) => {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    email: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleCheckout = async (e) => {
   e.preventDefault();

   // 1. Submit checkout data (optional logic for orders can go here)

   // 2. Clear the cart
   try {
     const response = await fetch("http://localhost:3000/clear-cart", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ user: localStorage.getItem("user") }),
     });
     props.setCartItems([])

     if (!response.ok) {
       console.error("Failed to clear cart.");
     }
   } catch (error) {
     console.error("Error clearing cart:", error);
   }

   alert("Thank you for your order!");
   // 3. Redirect back to home
   navigate("/");
 };


  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form className="checkout-form" onSubmit={handleCheckout}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          required
          value={formData.fullName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          required
          value={formData.address}
          onChange={handleChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          required
          value={formData.city}
          onChange={handleChange}
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          required
          value={formData.state}
          onChange={handleChange}
        />
        <input
          type="text"
          name="zip"
          placeholder="Zip Code"
          required
          value={formData.zip}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
        />
        <button type="submit" className="checkout-complete-btn">
          Complete Checkout
        </button>
      </form>
    </div>
  );
};

export default Checkout;
