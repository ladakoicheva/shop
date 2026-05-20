import React, { useEffect } from 'react'
import style from './ProductCard.module.css'
import { getUANtoUSD } from '../../utils/convector'
import { Link } from 'react-router-dom'
import { useStoreContext } from '../../store/store'



export default function ProductCard({ product }) {

  const { addToBasket, deleteFromBasket, basket, isAdmin, editCurrentProduct,
    setEditCurrentProduct, setProductToEdit, deleteProduct } = useStoreContext();


  const isInBasket = basket[product.id]


  return (
    <>

      <article className={style.productCard} >
        <Link to={`product/${product.id}`}>
          <div className={style.img}>
            <img src={product.img || '/No-Image.svg.png'} alt="" />
            <span style={{ color: `${product.inStock ? 'green' : 'red'}` }}>{product.inStock ? '◉ in Stock' : '◉ out of Stock'}</span>
          </div>
          <div className={style.product}> <h3>{product.name}</h3> <div className={style.rating}>  <img src="/star.png" alt="" /> <h3>{product.rating}</h3></div></div>


        </Link>
        
        <section className={style.info}>
          <div className={style.category}>category:{product.category}</div>
          <div className={style.buyInfo}>
            <h2>{product.currency == 'UAH' ? getUANtoUSD(product.price) : product.price} USD</h2>
            <div className={style.basketBtns} >
              <button onClick={() => addToBasket(product)} >+</button>
              {basket[product.id]?.count}
              {isInBasket && <button onClick={() => deleteFromBasket(product)}>-</button>}
            </div>


          </div>

        </section>
        <span className={style.deleteBtn} onClick={() => deleteProduct(product.id)}>×</span>
        <div className={style.editBtn}><img src="/edit.png"  onClick={() => {
          setEditCurrentProduct(true)
          setProductToEdit(product)
        }
        } />
        </div>
      </article>

    </>
  )
}
