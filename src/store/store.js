import { createContext, useContext, useEffect, useState } from "react";
import { getAllProducts } from "../firebase/db/products";
import { createProduct } from "../../back/apiProducts";
import { TYPE_MODAL } from "../Components/Forms/typeModeHelper";
import { editProduct } from "../../back/apiProducts";
import { onRegistartionApi, onLoginApi } from "../firebase/auth";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { APP_AUTH } from "../firebase";
import { getSettings } from '../firebase/db/settings';
import { removeProduct } from "../firebase/db/products";


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
  const isAdmin = user?.data?.type === 'admin' ? true : false;


  const addNewProduct = (product) => {
    setProducts([...products, product])
  }


  const editProductData = async (product) => {
    const res = await editProduct(product);
    const id = product.id;
    if (res.ok) {
      const copy = [...products]
      const basketCopy = { ...basket };
      const index = copy.findIndex((el) => el.id == res.data.id);

      copy[index] = res.data;
      basketCopy[id].product = product

      setProducts(copy)
      setBasket(basketCopy)
      setEditCurrentProduct(false)
    }

  }

  const addToBasket = (product) => {

    const copy = { ...basket }
    const id = product.id
    if (copy[id]) {
      copy[id].count++;
      console.log(copy[id].product.count)
    } else {
      copy[id] = { product: product, count: 1 }
    }
    //! error sheme
    setBasket(copy)
  }

  const deleteFromBasket = (product) => {
    const copy = { ...basket }
    const id = product.id
    copy[id].count--
    if (copy[id].count === 0) delete copy[id];

    setBasket(copy)
  }

  useEffect(() => {

    const getProducts = async () => {
      openLoading();
      try {
        const productData = await getAllProducts()
        if (productData.ok) {
          setProducts(productData.products);
          closeLoading()
        }
      } catch (e) {
        console.log(e)
      } finally {
        closeLoading()
      }

    }
    getProducts();


    onAuthStateChanged(APP_AUTH, (user) => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
      }
    })
  }, [])

  useEffect(() => {
    localStorage.setItem('basket', JSON.stringify(basket))
  }, [basket])




  const deleteProduct = async (id) => {
    const res = await removeProduct(id);
    if (res.ok) {
      const filtered = products.filter((el) => el.id !== id);
      setProducts(filtered);
    }

  }

  const onLogin = async (email, password) => {
    const userData = await onLoginApi(email, password);
    if (userData.ok) {
      setUser(userData.data);
    }
    return { ok: userData.ok, message: userData.message, code: userData.code }

  }

  const logOut = async () => {
    try {
      const res = await signOut(APP_AUTH)
      if (res) console.log('sign out successfull');
    } catch (err) {
      console.log(err);
    }


  }

  const onRegistration = async (email, password) => {

    const userData = await onRegistartionApi(email, password);

    if (userData.ok) {
      setUser(userData.data)

      //показать уведомление
    }
    return { ok: userData.ok, message: userData.message, code: userData.code }
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
    loading,
    openLoading,
    closeLoading,
    editCurrentProduct,
    setEditCurrentProduct,
    editProductData,
    productToEdit,
    setProductToEdit,
    deleteProduct,
  }
}

export const useStoreContext = () => useContext(StoreContext);

//1 create Context 
// 2 connect context with your project 
// 3 get Data