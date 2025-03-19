import {useParams} from "react-router-dom";
import { useState, useEffect } from "react";

const ProductDisplay =(props) =>{
    const [product, setProduct] = useState([])
    const {id} = useParams()
    useEffect(()=>{
        async function getProduct(){
            console.log("id is:", id)
            let url = `${import.meta.env.VITE_PRODUCTS_API_URL}/${id}`;
            console.log("url is:", url)
            try{
                const fetchProduct = await fetch(url).then((res)=> res.json())
                console.log(fetchProduct)
                setProduct(fetchProduct)

            } catch( error){
                console.error("Erroe fetching prduct", error.message)
            }
        }
        getProduct()
    },[]) 

    if (!product) {
        return <h1>Loading...</h1>
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
            <button className="add-to-cart">Add to Cart</button>
          </div>
        </div>
      </div>
    );
}

export default ProductDisplay