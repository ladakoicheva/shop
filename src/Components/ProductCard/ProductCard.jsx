import React, { useEffect } from 'react'
import style from './ProductCard.module.css'
import { getUANtoUSD } from '../../utils/convector'
import { Link } from 'react-router-dom'
import { useStoreContext } from '../../store/store'
import { useMemo } from 'react'

export default function ProductCard({ product }) {

  const { addToBasket, deleteFromBasket ,basket} = useStoreContext();

 const isInBasket = useMemo(() => {

   const isInBasket = basket.hasOwnProperty(product.name)
    return isInBasket
  }, [basket])

  return (
    <article className={style.productCard} >
      <Link to={`product/${product.id}`}>
        <h3>{product.name}</h3>
        <img src={product.img || '/No-Image.svg.png'} alt="" />
      </Link>

      <section className={style.info}>
        <div className={style.buyInfo}>
          <h2>{product.currency == 'UAH' ? getUANtoUSD(product.price) : product.price} USD</h2>
        </div>
        <div className={style.basketBtns}>
          <button onClick={() => addToBasket(product)} >+</button>
          {basket[product.name]?.count}
          {isInBasket && <button onClick={() => deleteFromBasket(product)}>-</button>}
        </div>
        <div style={{ color: `${product.inStock ? 'green' : 'red'}` }}>{product.inStock ? '◉ in Stock' : '◉ out of Stock'}</div>
        <div>category:{product.category}</div>

      </section>

    </article>
  )
}
