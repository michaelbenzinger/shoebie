import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

import Nav from './components/Nav';
import Home from './components/Home';
import Cart from './components/Cart';
import All from './components/All';
import Product from './components/Product';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <BrowserRouter>
          <Nav />
          <Routes>
            <Route index element={<Home />} />
            <Route path="/products" element={<All />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<Product />} />
          </Routes>
        </BrowserRouter>
      </div>
    </Provider>
  );
}

export default App;
