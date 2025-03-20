import { useParams } from "react-router-dom";
import DisplayCartItems from "./DisplayCartItems";
const Cart = (props) => {
    

   

    if (props.cartItems.length == 0) {
        return <h1>Loading...</h1>
    }

    let total = 0;
    props.cartItems?.map((item) => (
        total += item.price * item.quantity
    ))

    return (
      <div className="product-page">
          {props.cartItems?.map((Item) => (
            <DisplayCartItems key={Item.id} data={Item} />
          ))}
        <button>Checkout</button> {/* Add delete cart functionality and log order */}
        <footer>Grand Total: ${total.toFixed(2)}</footer>
        </div>
    )};

export default Cart;