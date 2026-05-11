import styles from './Header.module.css'
import { Link } from 'react-router-dom'
import { Autorisation } from '../Autorisation/Authorise/Autorisation'
import FilterProducts from '../FilterProducts/FilterProducts'
import { useStoreContext } from '../../store/store'

export default function Header() {


  const { isAdmin, basket } = useStoreContext();




  return (
    <header className={styles.header}>
      <nav className={styles.navContainer}>
     
        <div className={styles.mainNav}>
           {isAdmin && <Link to="/add">Add product</Link>}
          <Link to="/">Products</Link>
          <Link to ='setting'>Setting</Link>
        </div>

    
        <div className={styles.userActions}>
          <Autorisation />
          <div className={styles.basketWrapper}>
            <Link to ='/basket'><span className={styles.basketIcon}>🛒</span></Link>
            {Object.keys(basket).length> 0 && (
              <span className={styles.basketCount}>{Object.keys(basket).length}</span>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
