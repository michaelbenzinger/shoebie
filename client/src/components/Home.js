import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateProducts } from '../actions/productActions';
import Feature from './Feature';
import '../styles/Home.css';
import heroBkg from '../media/joshua-rondeau-t0WYycxK--s-unsplash.jpg';
import { myProducts } from '../products';

function Home(props) {
  const [products, setProducts] = useState(myProducts);
  const [fetching, setFetching] = useState(false);

  const saleProducts = products
    .filter(item => item.productInfo.salePrice)
    .sort((first, second) => {
      const firstPercentOff =
        1 - first.productInfo.salePrice / first.productInfo.price;
      const secondPercentOff =
        1 - second.productInfo.salePrice / second.productInfo.price;
      return firstPercentOff < secondPercentOff ? 1 : -1;
    });
  const runningProducts = products.filter(
    item => item.productInfo.category === 'Running'
  );
  const expensiveProducts = products.sort((first, second) => {
    const firstPrice = first.productInfo.salePrice || first.productInfo.price;
    const secondPrice =
      second.productInfo.salePrice || second.productInfo.price;
    return firstPrice < secondPrice ? 1 : -1;
  });

  if (products.find(product => !product.urls) && !fetching) {
    setFetching(true);
    getPhotos();
  }

  function getPhotos() {
    console.log('Querying API');
    products.forEach(product => {
      axios.get(`/api/products/${product.id}`).then(res => {
        let json = res.data;
        let newProducts = products.map(p => {
          if (p.id === json.id) {
            p.urls = json.urls;
            p.user = json.user.name;
            p.userLink = json.user.links.html;
          }
          return p;
        });
        props.updateProducts(newProducts);
        setProducts(newProducts);
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
      <Feature title="Hottest Deals" products={saleProducts} size={3} />
      <Feature title="Running Favorites" products={runningProducts} size={3} />
      <Feature
        title="For the Big Spender"
        products={expensiveProducts}
        size={3}
      />
    </div>
  );
}

export default connect(null, { updateProducts })(Home);
