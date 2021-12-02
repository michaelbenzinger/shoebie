import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Feature from './Feature';
import '../styles/Home.css';
import heroBkg from '../media/joshua-rondeau-t0WYycxK--s-unsplash.jpg';
import { myProducts } from '../products';

function Home() {
  const [products, setProducts] = useState(myProducts);
  const [fetching, setFetching] = useState(false);
  const saleProducts = products.filter(item => item.productInfo.salePrice);

  if (products.find(product => !product.urls) && !fetching) {
    setFetching(true);
    getPhotos();
  }

  function getPhotos() {
    console.log('Querying API');
    products.forEach(product => {
      axios.get(`/api/products/${product.id}`).then(res => {
        let json = res.data;
        setProducts(
          products.map(p => {
            if (p.id === json.id) {
              p.urls = json.urls;
              p.user = json.user.name;
              p.userLink = json.user.links.html;
            }
            return p;
          })
        );
      });
    });
  }

  return (
    <div className="home-component">
      <div style={{ backgroundImage: `url(${heroBkg}` }} className="home__hero">
        <div className="home__hero-content">
          <h1 className="home__hero-title">Get your kicks.</h1>
          <Link to="/products">
            <button className="home__hero-button button-red">
              Browse products
            </button>
          </Link>
        </div>
      </div>
      <Feature products={saleProducts} size={2} />
    </div>
  );
}

export default Home;
