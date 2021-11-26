import { UNSPLASH_ACCESS_KEY } from '../config';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setProduct } from '../actions/productActions';
import { formatUSD } from './Cart';

import { myProducts } from '../products';
import '../styles/All.css';

export const imageSizes = ['raw', 'full', 'regular', 'small', 'thumb'];
export const imageSize = imageSizes[2];

function All(props) {
  const [products, setProducts] = useState(myProducts);

  useEffect(() => {
    if (products.find(product => !product.urls)) {
      getPhotos();
    }
  });

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
              }
              return product;
            })
          );
        });
    });
  }

  return (
    <div className="all-component">
      <div className="contained">
        <h1>All Products</h1>
        <div className="products-grid">
          {products.map(product => (
            <Link
              key={product.id}
              onClick={() => {
                props.setProduct(product);
              }}
              to={`/product/${product.id}`}
            >
              <div className="product-card">
                <div className="product-card__img-container">
                  {product.urls ? (
                    <img
                      className="product-card__img"
                      alt={product.productInfo.name}
                      src={product.urls[imageSize]}
                    />
                  ) : (
                    <div className="product-card__placeholder" />
                  )}
                </div>
                <div className="product-card__info-container">
                  <h3 className="product-card__name">
                    {product.productInfo.name}
                  </h3>
                  <p className="product-card__category">
                    {product.productInfo.brand} – {product.productInfo.category}
                  </p>
                  <p className="product-card__price">
                    {formatUSD(product.productInfo.price, 0)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default connect(null, { setProduct })(All);
