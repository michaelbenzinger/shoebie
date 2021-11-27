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
  const [filters, setFilters] = useState({});
  const [filteredProducts, setFilteredProducts] = useState(products);

  const productCategories = [
    ...new Set(products.map(item => item.productInfo.category)),
  ];
  productCategories.sort();
  const productBrands = [
    ...new Set(products.map(item => item.productInfo.brand)),
  ];
  productBrands.sort();

  useEffect(() => {
    if (products.find(product => !product.urls)) {
      getPhotos();
    }
  });

  useEffect(() => {
    // setFilteredProducts() by appling filters state to products state
    const filterEntries = Object.entries(filters);
    const productsTemp = [];
    myProducts.forEach(product => {
      let include = true;
      filterEntries.forEach(filter => {
        const [category, array] = filter;
        if (!array.includes(product.productInfo[category])) include = false;
      });
      if (include) {
        productsTemp.push(product);
      }
    });
    setFilteredProducts(productsTemp);
  }, [filters]);

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

  function toggleFilter(newFilter) {
    // filters = {
    //   brand: ['Puma', 'Nike'],
    //   category: ['Boot']
    // }
    const filtersTemp = JSON.parse(JSON.stringify(filters));
    const [key, value] = Object.entries(newFilter)[0];
    if (!Object.keys(filtersTemp).includes(key)) {
      filtersTemp[key] = [value];
    } else {
      if (filtersTemp[key].includes(value)) {
        filtersTemp[key] = filtersTemp[key].filter(x => x !== value);
        if (filtersTemp[key].length === 0) {
          delete filtersTemp[key];
        }
      } else {
        filtersTemp[key].push(value);
      }
    }
    setFilters(filtersTemp);
  }

  return (
    <div className="products-component">
      <div className="contained">
        <h1>Products</h1>
        <div className="products-container">
          <div className="products-sidebar">
            <div className="products-filter-container products-filter-categories">
              <h3 className="products-filter-label products-filter-categories-label">
                Category
              </h3>
              {productCategories.map(cat => {
                let categoryClassNames =
                  'products-filter products-filter-category';
                if (filters.category && filters.category.includes(cat)) {
                  categoryClassNames += ' products-filter-active';
                }
                return (
                  <div
                    onClick={() => toggleFilter({ category: cat })}
                    key={cat}
                    className={categoryClassNames}
                  >
                    {cat}
                  </div>
                );
              })}
            </div>
            <div className="products-filter-container products-filter-brands">
              <h3 className="products-filter-label products-filter-brands-label">
                Brand
              </h3>
              {productBrands.map(brand => {
                let brandClassNames = 'products-filter products-filter-brand';
                if (filters.brand && filters.brand.includes(brand)) {
                  brandClassNames += ' products-filter-active';
                }
                return (
                  <div
                    onClick={() => toggleFilter({ brand: brand })}
                    key={brand}
                    className={brandClassNames}
                  >
                    {brand}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="products-main">
            <div className="products-grid">
              {filteredProducts.map(product => (
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
                        {product.productInfo.brand} –{' '}
                        {product.productInfo.category}
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
      </div>
    </div>
  );
}

export default connect(null, { setProduct })(All);
