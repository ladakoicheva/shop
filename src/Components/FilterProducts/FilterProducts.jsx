import { useState, useEffect } from "react";
import { useFilterProducts } from "./filterProductsLogical";


export default function FilterProducts({ options, filterProducts }) {
  const {
    setSelectedCategory,
    setPrice,
    change,
    selectedCategory,
    price,
    searchValue
  } = useFilterProducts()


 

  useEffect(() => {
    filterProducts(searchValue, selectedCategory, price)
  }, [searchValue, selectedCategory, price])

  return (
    <>
      <h3>Select category</h3>
      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} name="category" >
        <option value="All" >All</option>
        {options}
      </select>
      <h3>Sort by price</h3>
      <select value={price} onChange={(e) => setPrice(e.target.value)}>
        <option value="normal" hidden>normal</option>
        <option value="min">Min price</option>
        <option value="max">Max price</option>
      </select>
      <input onChange={change} value={searchValue} type="text" placeholder="search by name..." />
    </>
  )
}
