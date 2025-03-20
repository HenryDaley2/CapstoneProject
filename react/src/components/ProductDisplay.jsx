import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Product from "./Product";

const ProductDisplay = (props) => {
  const [product, setProduct] = useState([]);
  const [recProductsIds, setRecProductsIds] = useState([]);
  const [recProducts, setRecProducts] = useState([]);
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
          body: JSON.stringify({
            id: id,
          }),
        }).then((res) => res.json());
        console.log(response);
        setRecProductsIds(response);
        console.log("ids", recProductsIds);
      } catch (error) {
        console.error("Error fetching product", error.message);
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
        console.log("matches", recProducts)
      }
    }
    getRecProducts();
  }, [recProductsIds]);

  const getUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem("user")
        return storedUser ? storedUser : null;
  }

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
          quantity: 1
        }),
      });

      const response = await payload.json();
      if (payload.ok) {
        console.log("Sucessfully updated cart")
      } else {
        console.log("Couldn't update cart");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  if (product.length == 0) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="product-page">
      {/* Product Image Section */}

      {/* Product Info Section */}
      <div className="product-details">
        <h1 className="product-title">{product[0]?.item}</h1>
        <p className="product-type">Category: {product[0]?.type}</p>
        <p className="product-price">Price: ${product[0]?.price.toFixed(2)}</p>

        {/* Call-to-Action Buttons */}
        <div className="product-actions">
          <button className="add-to-cart" onClick={handleSubmit}>Add to Cart</button>
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