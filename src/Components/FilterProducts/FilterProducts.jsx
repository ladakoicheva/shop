import { useEffect, useMemo } from "react";
import { useFilterProducts } from "./filterProductsLogical";
import { useStoreContext } from "../../store/store";
import styles from './FilterProducts.module.css';

export default function FilterProducts({ filterProducts }) {
  const {
    setSelectedCategory,
    setPrice,
    change,
    selectedCategory,
    price,
    searchValue
  } = useFilterProducts()

  const store = useStoreContext();
  const products = store.products

  const options = useMemo(() => {
    if (!products) return [];
    const categoriesSet = new Set(products.map((el) => el.category));
    const optionsArr = Array.from(categoriesSet).map((el) => <option key={el} value={el}>{el}</option>)
    return optionsArr
  }, [products])

  useEffect(() => {
    filterProducts(searchValue, selectedCategory, price)
  }, [searchValue, selectedCategory, price])

  return (

    <div className={styles.filterProducts} >

      <div>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} name="category" >
          <option value="All" >All</option>
          {options}
        </select>

        <select value={price} onChange={(e) => setPrice(e.target.value)}>
          <option value="normal" hidden>normal</option>
          <option value="min">Min price</option>
          <option value="max">Max price</option>
        </select>
      </div>
      <div>
     
        <input onChange={change} value={searchValue} type="search" placeholder= " search by name..." />
      </div>
    </div>
  )
}
