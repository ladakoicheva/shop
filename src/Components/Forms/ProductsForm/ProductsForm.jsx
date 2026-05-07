import styles from './ProductsForm.module.css';
import { useFormik } from 'formik';
import IOSSwitch from '../../Switch';
import { schema } from '../schemas/productsValidationSchema';
import { useNavigate } from 'react-router-dom';
import { useStoreContext } from '../../../store/store';
import { useEffect } from 'react';




export default function ProductsForm() {

 
  const store = useStoreContext();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: store.editCurrentProduct ? store.productToEdit.name:'',
      category: store.editCurrentProduct ? store.productToEdit.category : '',
      price: store.editCurrentProduct ? store.productToEdit.price : '',
      currency: store.editCurrentProduct ? store.productToEdit.currency : 'UAH',
      inStock: store.editCurrentProduct ? store.productToEdit.inStock : false,
      rating: store.editCurrentProduct ? store.productToEdit.rating : 1,
      img: store.editCurrentProduct ? store.productToEdit.img : ""
    },
    validationSchema: schema,
    onSubmit: (values) => {
      store.editCurrentProduct ? store.editProductData({ ...values, id: store.productToEdit.id }):create(values)
    },


  });
  const create = async (product) => {
    store.openLoading()
    const isInProducts = store.products.some((el) => el.name === product.name);
    if (isInProducts) {
      //сделать увед пользователю
      console.log('product exists');
      store.closeLoading()
      return
    }

    const isResponse = await store.addNewProduct(product)

    if (isResponse) {
      setTimeout(store.closeLoading, 3000)

      formik.resetForm();
      navigate('/')

    }


  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    console.log(e)
    if (file) {
      reader.onload = (e) => {
        const link = e.target.result;
        formik.setFieldValue('img', link)
      }
      reader.readAsDataURL(file)
    }


  }
  return (
    <>

      <form className={styles.productForm} onSubmit={formik.handleSubmit}>
        {store.editCurrentProduct && <span onClick={()=>store.setEditCurrentProduct(false) } className={styles.close}>×</span>}
        <h1>{store.editCurrentProduct?'Edit Product' :'Add Product'} </h1>
        <hr style={{ width: '100%' }} />
        <input onChange={handleFileChange} type="file" id='img' />
        <label htmlFor="name">Product name</label>
        <input onChange={formik.handleChange} value={formik.values.name} id='name' type="text" placeholder='product`s name' />

        {formik.touched.name && formik.errors.name ? (
          <div>{formik.errors.name}</div>
        ) : null}

        <label htmlFor="category" >Category</label>
        <input onChange={formik.handleChange} value={formik.values.category} id='category' placeholder='product`s category' type="text" />

        {formik.touched.category && formik.errors.category ? (
          <div>{formik.errors.category}</div>
        ) : null}
        <label htmlFor="price">Price</label>
        <input onChange={formik.handleChange} value={formik.values.price} min="0" max="1000000" step="0.01" id='price' placeholder='product`s price' type="number" />

        {formik.touched.price && formik.errors.price ? (
          <div>{formik.errors.price}</div>
        ) : null}

        <select onChange={formik.handleChange} id="currency" value={formik.values.currency}>
          <option value="UAH">UAH</option>
          <option value="USD">USD</option>
        </select>

        <label htmlFor="inStock">in Stock</label>
        <IOSSwitch onChange={formik.handleChange} checked={formik.values.inStock} id='inStock' />

        <label htmlFor="rating">Rating (1-5)</label>
        <input onChange={formik.handleChange} value={formik.values.rating} min="1" max="5" step="0.5" id='rating' type="range" />

        <div>{formik.values.rating}</div>

        {formik.touched.rating && formik.errors.rating ? (
          <div>{formik.errors.rating}</div>
        ) : null}

        <button type='submit'> Save</button>

      </form>
    </>
  )

}


// Когда создаем продукт, продукт не может иметь одинаковое имя  