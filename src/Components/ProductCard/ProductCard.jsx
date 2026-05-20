import React, { useEffect } from 'react'
import style from './ProductCard.module.css'
import { getUANtoUSD } from '../../utils/convector'
import { Link } from 'react-router-dom'
import { useStoreContext } from '../../store/store'



export default function ProductCard({ product }) {

  const { addToBasket, deleteFromBasket, basket, isAdmin, editCurrentProduct,
    setEditCurrentProduct, setProductToEdit,deleteProduct } = useStoreContext();

  //  const isInBasket = useMemo(() => {

  //    const isInBasket = basket.hasOwnProperty(product.name)
  //     return isInBasket
  //  }, [basket])
  const isInBasket = basket[product.id]
  

  return (
    <>
      <article className={style.productCard} >
        <Link to={`product/${product.id}`}>
          <h3>{product.name}</h3>
          <img src={product.img || '/No-Image.svg.png'} alt="" />
        </Link>

        <section className={style.info}>
          <div className={style.buyInfo}>
            <h2>{product.currency == 'UAH' ? getUANtoUSD(product.price) : product.price} USD</h2>
            <div className={style.basketBtns}>
              <button onClick={() => addToBasket(product)} >+</button>
              {basket[product.id]?.count}
              {isInBasket && <button onClick={() => deleteFromBasket(product)}>-</button>}
            </div>


          </div>
          <section className={style.additionalInfo}>
            <div style={{ color: `${product.inStock ? 'green' : 'red'}` }}>{product.inStock ? '◉ in Stock' : '◉ out of Stock'}</div>
            <div>category:{product.category}</div>
          </section>
          
        </section>
        <div className={style.btns}><button onClick={() => deleteProduct(product.id)}>delete</button> <button onClick={() => {
          setEditCurrentProduct(true)
          setProductToEdit(product)
        } 
     }>Edit</button></div>

      </article>
     
    </>
  )
}
