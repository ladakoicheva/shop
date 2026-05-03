import { createContext, useContext, useEffect, useState } from "react";
import { getAllProduct } from "../../back/apiProducts";
import { createProduct } from "../../back/apiProducts";
import { logIn, registration } from "../../back/api";
import { TYPE_MODAL } from "../Components/Forms/typeModeHelper";

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

  useEffect(() => {
    const getProducts = async () => {
      const productData = await getAllProduct();
      if (productData.ok) {
        setProducts(productData.data);
      }
    }
    getProducts();
  }, [])


  const addNewProduct = async (product) => {
    const response = await createProduct(product);
    if (response.ok) {
      setProducts([ ...products,response.data])

    }
    return response.ok
  }


  const onLogin = async (email, password) => {

    const userData = await logIn(email, password);
    console.log(userData)
    if (userData.ok) {
      setUser(userData);
      localStorage.setItem('token', userData.data.token);

    }
    return { ok: userData.ok, text: userData?.text || '' }

  }
  const onRegistration = async (email, password) => {

    const userData = await registration(email, password);
    console.log(userData)

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
  }
}

export const useStoreContext = () => useContext(StoreContext);

//1 create Context 
// 2 connect context with your project 
// 3 get Data