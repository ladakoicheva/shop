import { useParams } from "react-router-dom"
import { getOneProduct } from "../../back/apiProducts";
import { useEffect } from "react";
import { useState } from "react";
import { useStoreContext } from "../store/store";

export default function СurrentProductPage() {
  const [currentProduct, setCurrentProduct] = useState(null);
  const {id} = useParams();

  useEffect(() => {
    
    async function getCurrentProduct(id) {
      
      const res = await getOneProduct(id);
     
      if (res.ok) {
        setCurrentProduct(res.data)
      } else {
        //перенаправлять на 404
        console.log(res.data)
      }



     
    }
    getCurrentProduct(id)
    console.log(currentProduct)
  },[id,currentProduct])

  return (
    <div>{currentProduct && <div>{currentProduct.id }</div>}</div>
  )
}

