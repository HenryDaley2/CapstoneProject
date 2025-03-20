import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Product from "./Product";
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

    return (
      <div className="product-page">

          {cartItems?.map((Item) => (
            <Product key={Item.id} data={Item} />
          ))}
        </div>
    )};

export default Cart;