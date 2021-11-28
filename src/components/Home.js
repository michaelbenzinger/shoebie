import { UNSPLASH_ACCESS_KEY } from '../config';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Feature from './Feature';
import '../styles/Home.css';
import heroBkg from '../media/sladjana-karvounis-SNGIg6dinW4-unsplash.jpg';
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
      fetch(
        `https://api.unsplash.com/photos/${product.id}/?client_id=${UNSPLASH_ACCESS_KEY}`
      )
        .then(res => res.json())
        .then(json => {
          setProducts(
            products.map(product => {
              if (product.id === json.id) {
                product.urls = json.urls;
                product.user = json.user.name;
                product.userLink = json.user.links.html;
              }
              return product;
            })
          );
        });
    });
  }

  return (
    <div className="home-component">
      <div style={{ backgroundImage: `url(${heroBkg}` }} className="home__hero">
        <div className="home__hero-content">
          <h1 className="home__hero-title">You snooze, you lose</h1>
          <Link to="/products">
            <button className="home__hero-button button-red">
              Browse our shoes
            </button>
          </Link>
        </div>
      </div>
      <Feature products={saleProducts} size={2} />
    </div>
  );
}

export default Home;
