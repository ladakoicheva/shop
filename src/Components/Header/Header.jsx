import styles from './Header.module.css'
import { Link } from 'react-router-dom'
import { Autorisation } from '../Autorisation/Authorise/Autorisation'

export default function Header() {
  return (
    <header className={styles.header}>
      <nav >
        <Link to='/'>Add Product</Link>
        <Link to='/products'>Products</Link>
       

      </nav>
      <Autorisation />
    </header>
  )
}
