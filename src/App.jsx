import './App.css'
import { BrowserRouter, Routes, Route} from "react-router-dom";
import AddProducts from './Pages/AddProdcuts';
import Products from './Pages/ProductPage/Products';
import СurrentProductPage from './Pages/СurrentProductPage.jsx'
import Header from './Components/Header/Header';
import { StoreContext, useStore } from './store/store';

function App() {
  // Сделать голосовые сообщение, распознавание голоса и голосовой ввод.
  const store = useStore()
  return (
    <BrowserRouter >
      <StoreContext.Provider value={store} >
        <Header />
        <Routes>
          <Route path='/' element={<AddProducts />} />
          <Route path='products'>
            <Route  index element={<Products />} />
            <Route path=':id' element={<СurrentProductPage/>} />
          </Route>
         
          
        </Routes>
      </StoreContext.Provider>
    </BrowserRouter>
  )
}

export default App
