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
const shoeSizes = [
  { mens: 4, available: true },
  { mens: 5, available: true },
  { mens: 6, available: true },
  { mens: 7, available: true },
  { mens: 8, available: true },
  { mens: 9, available: true },
  { mens: 10, available: true },
  { mens: 11, available: true },
  { mens: 12, available: true },
  { mens: 13, available: true },
  { mens: 14, available: true },
];

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
        setNewProduct(n);
      });
  }

  function sizeHandler(e) {
    setSize(parseInt(e.target.dataset.size));
  }

  function addToCartHandler(useProduct) {
    const newProduct = JSON.parse(JSON.stringify(useProduct));
    newProduct.size = size;
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
            </div>
            <div className="product-page__sidebar">
              <h1 className="product-page__name">
                {useProduct.productInfo.name}
              </h1>
              <p className="product-page__category">
                {useProduct.productInfo.brand} –{' '}
                {useProduct.productInfo.category}
              </p>
              <p className="product-page__price">
                {formatUSD(useProduct.productInfo.price, 0)}
              </p>
              <div className="product-page__shoe-sizes">
                {shoeSizes.map(shoeSize => {
                  const selectedClass =
                    shoeSize.mens === size
                      ? 'product-page__shoe-size product-page__size-selected'
                      : 'product-page__shoe-size';
                  return (
                    <div
                      onClick={sizeHandler}
                      data-size={shoeSize.mens}
                      key={shoeSize.mens}
                      className={selectedClass}
                    >
                      M {shoeSize.mens} / W {shoeSize.mens + 1.5}
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => {
                  addToCartHandler(useProduct);
                }}
                className="product-page__button button-full-width button-red"
              >
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
