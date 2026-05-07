import products from './products.json'

const getLS = () => {
  const d = localStorage.getItem('products');
  if (d) {
    return JSON.parse(d)
  }
  if(!d)saveLS(products)
  return products
}
const saveLS = (data) => localStorage.setItem('products', JSON.stringify(data));

const getId = () => Date.now() + 'token' + Math.random()

export const createProduct = async (data) => {
  const products = getLS();
  const product = { ...data, id: getId() }
  products.push(product);
  saveLS(products)
  return { ok: true, data: product }
}
export const removeProduct = async (id) => {
  const products = getLS();
  const filteredProducts = products.filter((el) => el.id !== id)
  saveLS(filteredProducts)
  return { ok: true, data: null }
}
export const editProduct = async (product) => {
  const products = getLS();
  const index = products.findIndex((el) => el.id == product.id)
  products[index] = product
  saveLS(products)
  return { ok: true, data: product }
}
export const getOneProduct = async (id) => {
  const products = getLS();
  const product = products.find((el) => el.id == id)
  if (product) return { ok: true, data: product }
  return { ok: false, data: 'no found' }
}
export const getAllProduct = async () => {
  const products = getLS()
  return { ok: true, data: products }
}





const p = {
  "id": 1,
  "name": "Wireless Headphones", // input text
  "category": "Electronics", // input text
  "price": 59.99, // input number
  "currency": "USD", // select
  "inStock": true,// ios switch
  "rating": 4.5// input range
}