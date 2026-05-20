
import { doc, getDocs, setDoc, collection, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

import { APP_DB, APP_STORAGE } from "../index";


export const addProduct = async (product, file, uid) => {
  try {
    const id = uuidv4()
    const responsrFile = await addImgToFirebase(file, id, uid)
    if(!responsrFile.ok) return { ok : false, data : 'Error load'}
    const docLink = doc(APP_DB, 'user', uid, 'products', id)
    const data = {...product, id, img : responsrFile.data}
    await setDoc(docLink, data)
    return { ok: true, data: data }


  } catch (e) {
    console.log(e)
    return { ok: false, data: null }
  }

}
// export const addProduct = async (id, data) => {
//   try {
//     const docLink = doc(APP_DB, 'products', id)
//     const res = await setDoc(docLink, data)
//     console.log(res)
//     return { ok: true, data: data }


//   } catch (e) {
//     console.log(e)
//     return { ok: false, data: null }
//   }

// }


export const addImgToFirebase = async (file, id, uid) => {
  try {
    const link = ref(APP_STORAGE, `${uid}/${id}.jpg`);
    const snapShot = await uploadBytes(link, file)
    const url = await getDownloadURL(snapShot.ref)
    return { ok: true, data: url }
  } catch (error) {
    return { ok: false, data: null }
  }

}


export const getAllProducts = async () => {
  try {
    const colRef = collection(APP_DB, "products");
    const docSnap = await getDocs(colRef);
    console.log(docSnap.docs)
    docSnap.docs.forEach(doc => console.log(doc.data()));
    const productsList = docSnap.docs.map(doc => ({
      ...doc.data()
    }));
    return { ok: true, products: productsList }
  } catch (e) {
    console.log(e);
  }



}


export const removeProduct = async (id) => {
  try {
    const docRef = doc(APP_DB, "products", id);
    await deleteDoc(docRef);
    return { ok: true, text:'deleted successfully' }
  } catch (e) {
    return {ok:false,error:e}
  }
 
}
