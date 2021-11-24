import { UNSPLASH_ACCESS_KEY } from '../config';
import { useState, useEffect } from 'react';

import '../styles/All.css';
import { myProducts } from '../products';

function All() {
  const [products, setProducts] = useState(myProducts);

  useEffect(() => {
    if (products.find(product => !product.src)) {
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
                product.src = json.urls.regular;
              }
              return product;
            })
          );
        });
    });

    // Promise.all(
    //   myProducts.map(product => {
    //     return new Promise((resolve, reject) => {
    //       fetch(
    //         `https://api.unsplash.com/photos/${product.id}/?client_id=${UNSPLASH_ACCESS_KEY}`
    //       )
    //         .then(res => res.json())
    //         .then(json =>
    //           resolve({ productInfo: product.productInfo, json: json })
    //         );
    //     });
    //   })
    // ).then(values => {
    //   setProducts(
    //     values.map(product => {
    //       return {
    //         productInfo: product.productInfo,
    //         id: product.json.id,
    //         src: product.json.urls.regular,
    //       };
    //     })
    //   );
    // });
  }

  return (
    <div className="all-component">
      <div className="contained">
        <h1>All Products</h1>
        <div className="products-grid">
          {products.map(product => (
            <div className="product-card" key={product.id}>
              <div className="img-container">
                {product.src ? (
                  <img alt={product.productInfo.name} src={product.src} />
                ) : (
                  <div className="product-card__placeholder" />
                )}
              </div>
              <h3 className="product-card__name">{product.productInfo.name}</h3>
              <p className="product-card__category">
                {product.productInfo.brand} – {product.productInfo.category}
              </p>
              <p className="product-card__price">
                ${product.productInfo.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default All;
