import { useEffect, useMemo, useState } from "react"
import { minSort,maxSort } from "../../utils/sort";
import ProductCard from "../../Components/ProductCard/ProductCard"
import styles from './Products.module.css'
import FilterProducts from "../../Components/FilterProducts/FilterProducts";
import { useStoreContext } from "../../store/store";




export default function Products() {
  const store = useStoreContext();
  const products = store.products 
  const [showProducts, setShowProducts] = useState(products)

  useEffect(() => {
    setShowProducts(products)
  }, [products])




  const options = useMemo(() => {
    if (!products) return [];
    const categoriesSet = new Set(products.map((el) => el.category));
    const optionsArr = Array.from(categoriesSet).map((el) => <option key={el} value={el}>{el}</option>)
    return optionsArr
  }, [products])



  const filterProducts = (text, category, price) => {
    if (!products) return [];
    const search = text.toLowerCase();

    const filtered = products.filter((el) => {
      const checkText = text == '' || el.name.toLowerCase().includes(search);
      const checkCategory = category == 'All' || el.category === category;

      return checkText && checkCategory
    })
    if (price !== 'normal') {
      const callback = price === 'min'? minSort : maxSort
      filtered.sort(callback)
    }
    setShowProducts(filtered);

  }



  return (
    <>

      {/*<h3>Select category</h3>
      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} name="category" >
        <option value="All" >All</option>
        {options}
      </select>
      <h3>Sort by price</h3>
      <select value={value} onChange={(e) => setValue(e.target.value)}>
        <option value="normal" hidden>normal</option>
        <option value="min">Min price</option>
        <option value="max">Max price</option>
      </select>
      <input onChange={change} value={searchValue }type="text" placeholder="search by name..." />*/}
      <FilterProducts options={options} filterProducts={filterProducts} />
      <ul className={styles.grid_template_columns}>
        {showProducts && showProducts.map((el) =>
          <li key={el.id}>
            <ProductCard key={el.id} product={el} />
          </li>
        )}
      </ul>
    </>

  )
}


// search by name 
// select price min max
// select categories