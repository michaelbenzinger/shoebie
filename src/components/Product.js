import { UNSPLASH_ACCESS_KEY } from '../config';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { imageSizes } from './All.js';
import { myProducts } from '../products';
import '../styles/Product.css';
import { addToCart } from '../actions/cartActions';
import { formatUSD } from './Cart';

const featureImageSize = imageSizes[2];

function Product(props) {
  let { product } = props;
  const [newProduct, setNewProduct] = useState({});
  const [size, setSize] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    // If there is no product stored in state, fetch it from the API
    if (!product.productInfo && !newProduct.productInfo) {
      getData();
    }
  });

  function getData() {
    console.log('Querying API');

    fetch(
      `https://api.unsplash.com/photos/${id}/?client_id=${UNSPLASH_ACCESS_KEY}`
    )
      .then(res => res.json())
      .then(json => {
        const n = myProducts.find(product => product.id === json.id);
        n.urls = json.urls;
        n.user = json.user.name;
        n.userLink = json.user.links.html;
        setNewProduct(n);
      });
  }

  function sizeHandler(e) {
    setSize(parseFloat(e.target.dataset.size));
  }

  function addToCartHandler(useProduct) {
    const newProduct = JSON.parse(JSON.stringify(useProduct));
    newProduct.size = size;
    newProduct.quantity = 1;
    newProduct.dateAdded = Date.now();
    props.addToCart(newProduct);
  }

  if (!product.productInfo && !newProduct.productInfo) {
    return (
      <div className="product-component">
        <div className="contained">
          <p>Loading Product</p>
        </div>
      </div>
    );
  } else {
    let useProduct = null;
    if (newProduct.id) useProduct = newProduct;
    else useProduct = product;

    // Disable button if size is not yet selected
    let addToCartClasses = 'product-page__button button-full-width button-red';
    let addToCartMethod = () => {
      addToCartHandler(useProduct);
    };
    if (size === null) {
      addToCartClasses += ' button-disabled';
      addToCartMethod = null;
    }

    return (
      <div className="product-component">
        <div className="contained">
          <div className="product-page__page-container">
            <div className="product-page__main">
              <div className="product-page__img-container">
                <img
                  className="product-page__img"
                  alt={useProduct.productInfo.name}
                  src={useProduct.urls[featureImageSize]}
                />
              </div>
              <div className="product-page__attribution">
                Photo by{' '}
                <a
                  href={`${useProduct.userLink}?utm_source=michaelbenzinger_shopping_cart&utm_medium=referral`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {useProduct.user}
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
            </div>
            <div className="product-page__sidebar">
              <h1 className="product-page__name">
                {useProduct.productInfo.name}
              </h1>
              <p className="product-page__category">
                {useProduct.productInfo.brand} –{' '}
                {useProduct.productInfo.category}
              </p>
              {useProduct.productInfo.salePrice ? (
                <h3 className="product-page__price">
                  <span className="product-page__sale-price">
                    {formatUSD(useProduct.productInfo.salePrice, 0)}
                  </span>
                  <span className="product-page__price-slash">
                    {formatUSD(useProduct.productInfo.price, 0)}
                  </span>
                </h3>
              ) : (
                <h3 className="product-page__price">
                  {formatUSD(useProduct.productInfo.price, 0)}
                </h3>
              )}
              <div className="product-page__shoe-sizes">
                {useProduct.productInfo.sizes.map(shoeSize => {
                  let selectedClass = 'product-page__shoe-size';
                  let clickHandler = sizeHandler;
                  if (shoeSize.available === false) {
                    clickHandler = null;
                    selectedClass += ' product-page__shoe-size-unavailable';
                  }
                  if (shoeSize.mens === size)
                    selectedClass += ' product-page__shoe-size-selected';

                  return (
                    <div
                      onClick={clickHandler}
                      data-size={shoeSize.mens}
                      key={shoeSize.mens}
                      className={selectedClass}
                    >
                      M {shoeSize.mens} / W {shoeSize.mens + 1.5}
                    </div>
                  );
                })}
              </div>
              <button onClick={addToCartMethod} className={addToCartClasses}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  product: state.products.product,
});

export default connect(mapStateToProps, { addToCart })(Product);
