import {useParams} from "react-router-dom";
import { useState, useEffect } from "react";

const ProductDisplay =(props) =>{
    const [product, setProduct] = useState({})
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

    return(
        <div>
           <h1>{product.id}</h1> 
        </div>
    )

    


}

export default ProductDisplay