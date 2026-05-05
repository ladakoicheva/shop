import { createContext, useContext, useEffect, useState } from "react";
import { getAllProduct } from "../../back/apiProducts";
import { createProduct } from "../../back/apiProducts";
import { logIn, registration } from "../../back/api";
import { TYPE_MODAL } from "../Components/Forms/typeModeHelper";
import { autorisation } from '../../back/api'

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
  const [basket, setBasket] = useState(JSON.parse(localStorage.getItem('basket'))||{}); // {} 




  const isAdmin = user?.data.type === 'admin' ? true : false

  const authorize = async (token) => {
    const user = await autorisation(token);
    if (user.ok) setUser(user);
  }

  const addToBasket = (product) => {
    const copy = { ...basket }
    if (copy[product.name])  {
      copy[product.name].count++;
    } else {
      copy[product.name] ={product:product,count:1}
    }
    //! error sheme
    setBasket(copy)
  }

  const deleteFromBasket = (product) => {
    const copy = { ...basket }
    copy[product.name].count --
    if(copy[product.name].count === 0) delete copy[product.name];
    
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

  }
}

export const useStoreContext = () => useContext(StoreContext);

//1 create Context 
// 2 connect context with your project 
// 3 get Data