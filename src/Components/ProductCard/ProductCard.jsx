import React from 'react'
import style from './ProductCard.module.css'
import { getUANtoUSD } from '../../utils/convector'
import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {


  return (
    <article className={style.productCard} >
      <Link to ={`${product.id}`}>
        <h3>{product.name}</h3>
        <img src={product.img || '/No-Image.svg.png'} alt="" />
      </Link>

      <section className={style.info}>
        <div>price:{product.currency == 'UAH' ? getUANtoUSD(product.price) : product.price}USD</div>
        <div>category:{product.category}</div>

      </section>







    </article>
  )
}
