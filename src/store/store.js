import { createContext, useContext, useEffect, useState } from "react";
import { getAllProduct } from "../../back/apiProducts";
import { createProduct } from "../../back/apiProducts";
import { TYPE_MODAL } from "../Components/Forms/typeModeHelper";
import { removeProduct } from "../../back/apiProducts";
import { editProduct } from "../../back/apiProducts";
import { onRegistartionApi, onLoginApi } from "../firebase/auth";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { APP_AUTH } from "../firebase";



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





  const editProductData = async (product) => {
    const res = await editProduct(product);
    const id = product.id;
    if (res.ok) {
      const copy = [...products]
      const basketCopy = {...basket};
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
    copy[id].count --
    if (copy[id].count === 0) delete copy[id];

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
    const userData = await onLoginApi(email, password);
    if (userData.ok) {
      setUser(userData.data);
    }
    return { ok: userData.ok, message:userData.message ,code:userData.code}

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