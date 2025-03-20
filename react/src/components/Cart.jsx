import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import DisplayCartItems from "./DisplayCartItems";
const Cart = (props) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
      async function getCart() {
        // let url = `${import.meta.env.VITE_PRODUCTS_API_URL}/cart/${localStorage.getItem("user")}`;
        try {
          let user = JSON.parse(localStorage.getItem("user"));
          console.log("user ", user)
          let url = `http://localhost:3000/cart/${user.username}`;
          console.log("url: ", url)
          const fetchCart = await fetch(url).then((res) => res.json());
          console.log(fetchCart);
          setCartItems(fetchCart[0].cart);
        } catch (error) {
          console.error("Error fetching product", error.message);
        }
      }
      getCart();
    }, []);

    if (cartItems.length == 0) {
        return <h1>Loading...</h1>
    }

    let total = 0;
    cartItems?.map((item) => (
        total += item.price * item.quantity
    ))

    return (
      <div className="product-page">
          {cartItems?.map((Item) => (
            <DisplayCartItems key={Item.id} data={Item} />
          ))}
        <button>Checkout</button> {/* Add delete cart functionality and log order */}
        <footer>Grand Total: ${total.toFixed(2)}</footer>
        </div>
    )};

export default Cart;