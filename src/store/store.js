import { createContext, useContext, useEffect, useState } from "react";
import { getAllProduct } from "../../back/apiProducts";
import { createProduct } from "../../back/apiProducts";
import { logIn, registration } from "../../back/api";
import { TYPE_MODAL } from "../Components/Forms/typeModeHelper";
import { autorisation } from '../../back/api'
import { removeProduct } from "../../back/apiProducts";
import { editProduct } from "../../back/apiProducts";


export const StoreContext = createContext({
  products: [],
  addNewProduct: () => { },
  onRegistration: () => { },
  onLogin: () => { },
  setUser: () => { },
  modalOpen: false,
  setModalOpen: () => { },
  authMode: "",
  setAuthMode: () => { },
})


export const useStore = () => {


  const [products, setProducts] = useState([])
  const [user, setUser] = useState(null)
  const [modalOpen, setModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState(TYPE_MODAL.SING_UP);
  const [basket, setBasket] = useState(JSON.parse(localStorage.getItem('basket')) || {}); // {} 
  const [loading, setLoading] = useState(false);
  const [editCurrentProduct, setEditCurrentProduct] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null)
  const isAdmin = user?.data.type === 'admin' ? true : false;



  const editProductData = async (product) => {
    const res = await editProduct(product);
    console.log(res)
    if (res.ok) {
      const copy = [...products]
      const index = copy.findIndex((el) => el.id == res.data.id);
      copy[index] = res.data;
      console.log(res.data.id)

      setProducts(copy)
      setEditCurrentProduct(false)
    }

  }
  const authorize = async (token) => {
    const user = await autorisation(token);
    if (user.ok) setUser(user);
  }

  const addToBasket = (product) => {
    const copy = { ...basket }
    if (copy[product.name]) {
      copy[product.name].count++;
    } else {
      copy[product.name] = { product: product, count: 1 }
    }
    //! error sheme
    setBasket(copy)
  }

  const deleteFromBasket = (product) => {
    const copy = { ...basket }
    copy[product.name].count--
    if (copy[product.name].count === 0) delete copy[product.name];

    setBasket(copy)
  }

  useEffect(() => {
    const getProducts = async () => {
      const productData = await getAllProduct();
      if (productData.ok) {
        setProducts(productData.data);
      }
    }
    getProducts();
    authorize(localStorage.getItem('token'))
  }, [])

  useEffect(() => {
    localStorage.setItem('basket', JSON.stringify(basket))
  }, [basket])

  const addNewProduct = async (product) => {
    const response = await createProduct(product);
    if (response.ok) {
      setProducts([...products, response.data])

    }
    return response.ok
  }

  const deleteProduct = async (id) => {
    const res = await removeProduct(id);
    if (res.ok) {
      const filtered = products.filter((el) => el.id !== id);
      setProducts(filtered);
    }

  }

  const onLogin = async (email, password) => {
    const userData = await logIn(email, password);
    if (userData.ok) {
      setUser(userData);
      localStorage.setItem('token', userData.data.token);

    }
    return { ok: userData.ok, text: userData?.text || '' }

  }

  const logOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  }

  const onRegistration = async (email, password) => {

    const userData = await registration(email, password);

    if (userData.ok) {
      setUser(userData)
      localStorage.setItem('token', userData.data.token)
    }
    return { ok: userData.ok, text: userData?.text || '' }
  }

  const openLoading = () => {
    setLoading(true);
  }
  const closeLoading = () => {
    setLoading(false);
  }

  return {
    user,
    products,
    addNewProduct,
    onRegistration,
    onLogin,
    setUser,
    modalOpen,
    setModalOpen,
    authMode,
    setAuthMode,
    logOut,
    isAdmin,
    addToBasket,
    deleteFromBasket,
    basket,
    deleteProduct,
    loading,
    openLoading,
    closeLoading,
    editCurrentProduct,
    setEditCurrentProduct,
    editProductData,
    productToEdit,
    setProductToEdit
  }
}

export const useStoreContext = () => useContext(StoreContext);

//1 create Context 
// 2 connect context with your project 
// 3 get Data