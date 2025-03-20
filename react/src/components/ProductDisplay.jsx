import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Product from "./Product";

const ProductDisplay = (props) => {
  const [product, setProduct] = useState([]);
  const [recProductsIds, setRecProductsIds] = useState([]);
  const [recProducts, setRecProducts] = useState([]);
  const [quantity, setQuantity] = useState(1); // ✅ Track quantity
  const { id } = useParams();

  useEffect(() => {
    async function getProduct() {
      console.log("id is:", id);
      let url = `${import.meta.env.VITE_PRODUCTS_API_URL}/${id}`;
      console.log("url is:", url);
      try {
        const fetchProduct = await fetch(url).then((res) => res.json());
        console.log(fetchProduct);
        setProduct(fetchProduct);
      } catch (error) {
        console.error("Error fetching product", error.message);
      }
    }
    getProduct();
  }, []);

  useEffect(() => {
    async function getRecProductsIds() {
      let url = `http://localhost:5001/model`;
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id }),
        }).then((res) => res.json());
        setRecProductsIds(response);
      } catch (error) {
        console.error("Error fetching recommended products", error.message);
      }
    }
    getRecProductsIds();
  }, []);

  useEffect(() => {
    async function getRecProducts() {
      if (recProductsIds.length > 0) {
        let matchedProducts = recProductsIds
          .map((rec) => props.data.find((product) => product.id == rec.id))
          .filter((product) => product);
        setRecProducts(matchedProducts);
      }
    }
    getRecProducts();
  }, [recProductsIds]);

  const getUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? storedUser : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let user = getUserFromLocalStorage();
    try {
      const payload = await fetch("http://localhost:3000/additem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: user,
          id: product[0].id,
          item: product[0].item,
          type: product[0].type,
          price: product[0].price,
          quantity: quantity, // ✅ Updated to use the selected quantity
        }),
      });

      const response = await payload.json();
      if (payload.ok) {
        console.log("Successfully updated cart");
      } else {
        console.log("Couldn't update cart");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  if (product.length === 0) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="product-page">
      <div className="product-details">
        <h1 className="product-title">{product[0]?.item}</h1>
        <p className="product-type">Category: {product[0]?.type}</p>
        <p className="product-price">Price: ${product[0]?.price.toFixed(2)}</p>

        {/* Quantity Selector */}
        <div className="quantity-selector">
          <button
            className="quantity-button"
            onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
          >
            -
          </button>
          <input
            type="number"
            className="quantity-input"
            value={quantity}
            onChange={(e) => {
              let val = parseInt(e.target.value, 10);
              setQuantity(val >= 1 ? val : 1);
            }}
            min="1"
          />
          <button
            className="quantity-button"
            onClick={() => setQuantity((prev) => prev + 1)}
          >
            +
          </button>
        </div>

        {/* Call-to-Action Buttons */}
        <div className="product-actions">
          <button className="add-to-cart" onClick={handleSubmit}>
            Add to Cart
          </button>
        </div>
      </div>

      <div className="product-list">
        {recProducts.map((Item) => (
          <Product key={Item.id} data={Item} />
        ))}
      </div>
    </div>
  );
};

export default ProductDisplay;
