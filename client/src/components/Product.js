import axios from 'axios';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { imageSizes } from './All.js';
import { myProducts } from '../products';
import '../styles/Product.css';
import { addToCart } from '../actions/cartActions';
import { formatUSD } from './Cart';

const featureImageSize = imageSizes[2];
let hideTimeout;

function Product(props) {
  let { product } = props;
  const [newProduct, setNewProduct] = useState({});
  const [size, setSize] = useState(null);
  const [viewingModal, setViewingModal] = useState(false);
  const { id } = useParams();

  window.scrollTo(0, 0);

  useEffect(() => {
    // If there is no product stored in state, fetch it from the API
    if (!product.productInfo && !newProduct.productInfo) {
      getData();
    }
  });

  function getData() {
    console.log('Querying API');
    axios.get(`/api/products/${id}`).then(res => {
      let json = res.data;
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
    displayModal();
    const newProduct = JSON.parse(JSON.stringify(useProduct));
    newProduct.size = size;
    newProduct.quantity = 1;
    newProduct.dateAdded = Date.now();
    props.addToCart(newProduct);
  }

  function displayModal() {
    setViewingModal(true);
    hideTimeout = setTimeout(() => {
      hideModal();
    }, 5000);
  }

  function hideModal() {
    const modal = document.querySelector('.added-modal');
    const modalBackground = document.querySelector('.added-modal-background');
    if (!modal || !modalBackground) return;
    modal.style = 'opacity:0;';
    modalBackground.style = 'opacity:0;';
    clearTimeout(hideTimeout);
    setTimeout(() => {
      setViewingModal(false);
    }, 250);
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

    // let productComponentClasses = viewingModal
    //   ? 'product-component product-component-darkened'
    //   : 'product-component';
    let productComponentClasses = 'product-component';

    return (
      <div className={productComponentClasses}>
        {!viewingModal ? null : <div className="added-modal-background" />}
        <div className="contained">
          <div className="product-page__page-container">
            {!viewingModal ? null : (
              <div className="added-modal">
                <h3 className="added-modal__title-bar">
                  <span className="added-modal__title">Added item to cart</span>
                  <span onClick={hideModal} className="added-modal__quit">
                    ×
                  </span>
                </h3>
                <div className="added-modal__product-info">
                  <div className="added-modal__img-container">
                    <img
                      alt={useProduct.productInfo.name}
                      className="added-modal__img"
                      src={useProduct.urls.thumb}
                    />
                  </div>
                  <div className="added-modal__info-container">
                    <h4 className="added-modal__product-name">
                      {useProduct.productInfo.name}
                    </h4>
                    <p className="added-modal__product-category">
                      {useProduct.productInfo.brand} –{' '}
                      {useProduct.productInfo.category}
                    </p>
                    <p className="added-modal__product-size">
                      M {size} / W {size + 1.5}
                    </p>
                    {useProduct.productInfo.salePrice ? (
                      <p className="added-modal__product-price">
                        <span className="added-modal__product-sale-price">
                          {formatUSD(useProduct.productInfo.salePrice, 0)}
                        </span>
                        <span className="added-modal__product-price-slash">
                          {formatUSD(useProduct.productInfo.price, 0)}
                        </span>
                      </p>
                    ) : (
                      <p className="added-modal__product-price">
                        {formatUSD(useProduct.productInfo.price, 0)}
                      </p>
                    )}
                  </div>
                </div>
                <Link to="/cart">
                  <button className="added-modal__cart-button button-gray">
                    View Cart
                  </button>
                </Link>
              </div>
            )}

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
