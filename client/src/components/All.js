import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setProduct, updateProducts } from '../actions/productActions';
import { formatUSD } from './Cart';

import { myProducts } from '../products';
import '../styles/All.css';

export const imageSizes = ['raw', 'full', 'regular', 'small', 'thumb'];
export const imageSize = imageSizes[2];

function sortProducts(array, sort) {
  const [criteria, direction] = sort.split(',');
  array.sort((first, second) => {
    let val1 = first.productInfo[criteria];
    let val2 = second.productInfo[criteria];
    // Sort by salePrice if the product has one
    if (criteria === 'price') {
      if (first.productInfo.salePrice) val1 = first.productInfo.salePrice;
      if (second.productInfo.salePrice) val2 = second.productInfo.salePrice;
    }
    if (val1 < val2) {
      return -1 * direction;
    } else if (val1 > val2) {
      return 1 * direction;
    }
    return 0;
  });
}

function All(props) {
  const [products, setProducts] = useState(myProducts);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('dateListed,-1');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [fetching, setFetching] = useState(false);
  const [showingFilters, setShowingFilters] = useState(() => {
    if (window.innerWidth <= 768) {
      return false;
    } else {
      return true;
    }
  });
  const [showingFiltersOverride, setShowingFiltersOverride] = useState(false);

  window.onresize = handleResize;

  function handleResize() {
    let width = window.innerWidth;
    if (width <= 768 && showingFilters) {
      setShowingFilters(false);
    } else if (width > 768 && !showingFilters) {
      setShowingFilters(true);
    }
  }

  const productCategories = [
    ...new Set(products.map(item => item.productInfo.category)),
  ];
  productCategories.sort();
  const productBrands = [
    ...new Set(products.map(item => item.productInfo.brand)),
  ];
  productBrands.sort();

  if (products.find(product => !product.urls) && !fetching) {
    setFetching(true);
    getPhotos();
  }

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
    sortProducts(productsTemp, sort);
    setFilteredProducts(productsTemp);
  }, [filters, sort]);

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

  function toggleShowFiltersOverride() {
    if (showingFiltersOverride) {
      setShowingFiltersOverride(false);
    } else {
      setShowingFiltersOverride(true);
    }
  }

  return (
    <div className="products-component">
      <div className="contained">
        <h1 className="products-title">Products</h1>
        <div className="products-container">
          <div className="products-sidebar">
            <button
              onClick={toggleShowFiltersOverride}
              className="filters-button button-gray button-full-width"
            >
              {!showingFiltersOverride ? 'Show Filters' : 'Hide Filters'}
            </button>
            {!showingFilters && !showingFiltersOverride ? (
              <div />
            ) : (
              <div className="products-filters-container">
                <div className="products-filter-container products-filter-sorts">
                  <h3 className="products-filter-label products-filter-sort-label">
                    Sort By
                  </h3>
                  <select
                    name="filter-sort"
                    id="filter-sort"
                    value={sort}
                    className="products-filter-sort"
                    onChange={e => {
                      setSort(e.target.value);
                    }}
                  >
                    <option key={'dateListed,1'} value={'dateListed,-1'}>
                      Newest
                    </option>
                    <option key={'name,1'} value={'name,1'}>
                      Alphabetical
                    </option>
                    <option key={'price,1'} value={'price,1'}>
                      Price Low to High
                    </option>
                    <option key={'price,-1'} value={'price,-1'}>
                      Price High to Low
                    </option>
                  </select>
                </div>
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
                    let brandClassNames =
                      'products-filter products-filter-brand';
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
            )}
          </div>
          <div className="products-main">
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-card__attribution">
                    Photo by{' '}
                    <a
                      href={`${product.userLink}?utm_source=michaelbenzinger_shopping_cart&utm_medium=referral`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {product.user}
                    </a>{' '}
                    on{' '}
                    <a
                      href={
                        'https://unsplash.com/?utm_source=michaelbenzinger_shopping_cart&utm_medium=referral'
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      Unsplash
                    </a>
                  </div>
                  <Link
                    onClick={() => {
                      props.setProduct(product);
                    }}
                    to={`/product/${product.id}`}
                  >
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
                      {product.productInfo.salePrice ? (
                        <p className="product-card__price">
                          <span className="product-card__sale-price">
                            {formatUSD(product.productInfo.salePrice, 0)}
                          </span>
                          <span className="product-card__price-slash">
                            {formatUSD(product.productInfo.price, 0)}
                          </span>
                        </p>
                      ) : (
                        <p className="product-card__price">
                          {formatUSD(product.productInfo.price, 0)}
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(null, { setProduct, updateProducts })(All);
