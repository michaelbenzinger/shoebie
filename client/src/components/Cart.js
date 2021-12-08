import axios from 'axios';
import { connect } from 'react-redux';
import { useState } from 'react';
import { modifyItem, deleteItem } from '../actions/cartActions';
import { updateProducts } from '../actions/productActions';
import Feature from './Feature';
import '../styles/Cart.css';
import { myProducts } from '../products';

export function formatUSD(num, digits) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
    style: 'currency',
    currency: 'USD',
  }).format(num);
}

function Cart(props) {
  const { cart, initialProducts } = props;

  const [products, setProducts] = useState(() => {
    return initialProducts.length > 0 ? initialProducts : myProducts;
  });
  const [fetching, setFetching] = useState(false);

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

  const freeShippingThreshold = 70;

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

  const quantities = [];
  for (let i = 1; i <= 12; i++) {
    quantities.push(i);
  }

  const subtotal =
    cart.length === 0
      ? 0
      : cart
          .map(item => {
            let price = item.productInfo.salePrice || item.productInfo.price;
            return price * item.quantity;
          })
          .reduce((prev, current) => prev + current);

  const shipping = subtotal >= freeShippingThreshold ? 0 : 8;
  const tax = subtotal * 0.09;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="cart-component">
        <div className="cart-contained contained">
          <h1>Cart</h1>
          <div className="cart__container">
            <div className="cart__main">
              <div>There are no items in your cart.</div>
            </div>
            <div className="cart__sidebar">
              <h2 className="cart__sidebar-title">Summary</h2>
              <div className="cart__sidebar-row cart__sidebar-row-title">
                <p className="cart__sidebar-subtotal-title">Subtotal</p>
                <p className="cart__sidebar-subtotal">{formatUSD(0)}</p>
              </div>
              <div className="cart__sidebar-row cart__sidebar-row-shipping">
                <p className="cart__sidebar-shipping-title">
                  {'Estimated Shipping & Handling'}
                </p>
                <p className="cart__sidebar-shipping">{formatUSD(0)}</p>
              </div>
              <div className="cart__sidebar-row cart__sidebar-row-tax">
                <p className="cart__sidebar-tax-title">Estimated Tax</p>
                <p className="cart__sidebar-tax">{formatUSD(0)}</p>
              </div>
              <div className="cart__sidebar-row cart__sidebar-row-total">
                <p className="cart__sidebar-total-title">Total</p>
                <p className="cart__sidebar-total">{formatUSD(0)}</p>
              </div>
              <button className="cart__button button-full-width button-red button-disabled">
                Checkout
              </button>
            </div>
          </div>
        </div>
        <Feature title="Hottest Deals" products={saleProducts} size={3} />
        <Feature
          title="Running Favorites"
          products={runningProducts}
          size={3}
        />
      </div>
    );
  }
  return (
    <div className="cart-component">
      <div className="cart-contained contained">
        <h1>Cart</h1>
        <div className="cart__container">
          <div className="cart__main">
            {cart.map((item, index) => {
              let itemQuantities = JSON.parse(JSON.stringify(quantities));
              if (!itemQuantities.includes(item.quantity)) {
                itemQuantities.push(item.quantity);
              }
              return (
                <div key={item.dateAdded} className="cart__item">
                  <div className="cart__item-img-container">
                    <img
                      alt={item.productInfo.name}
                      className="cart__item-img"
                      src={item.urls.small}
                    />
                  </div>
                  <div className="cart__item-info-container">
                    <div className="cart__item-info-title">
                      <h3 className="cart__item-name">
                        {item.productInfo.name}
                      </h3>
                      {item.productInfo.salePrice ? (
                        <h3 className="cart__item-price">
                          <span className="cart__item-price-slash">
                            {formatUSD(item.productInfo.price * item.quantity)}
                          </span>
                          <span className="cart__item-sale-price">
                            {formatUSD(
                              item.productInfo.salePrice * item.quantity
                            )}
                          </span>
                        </h3>
                      ) : (
                        <h3 className="cart__item-price">
                          {formatUSD(item.productInfo.price * item.quantity)}
                        </h3>
                      )}
                    </div>
                    <p className="cart__item-category">
                      {item.productInfo.brand} | {item.productInfo.category}
                    </p>
                    <div className="cart__item-options">
                      <select
                        value={item.size}
                        onChange={e => {
                          props.modifyItem(index, {
                            size: parseInt(e.target.value),
                          });
                        }}
                        className="cart__item-size select"
                        name="item-size"
                        id="item-size"
                      >
                        {item.productInfo.sizes.map(size => {
                          if (size.available) {
                            return (
                              <option key={size.mens} value={size.mens}>
                                {size.mens} M / {size.mens + 1.5} W
                              </option>
                            );
                          }
                          return null;
                        })}
                      </select>
                      <select
                        value={item.quantity}
                        onChange={e =>
                          props.modifyItem(index, {
                            quantity: parseInt(e.target.value),
                          })
                        }
                        className="cart__item-quantity select"
                        name="item-quantity"
                        id="item-quantity"
                      >
                        {itemQuantities.map(qty => {
                          return (
                            <option key={qty} value={qty}>
                              {qty}
                            </option>
                          );
                        })}
                      </select>
                      <i
                        onClick={() => {
                          props.deleteItem(index);
                        }}
                        className="cart__delete far fa-trash-alt"
                      ></i>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="cart__sidebar">
            <h2 className="cart__sidebar-title">Summary</h2>
            <div className="cart__sidebar-row cart__sidebar-row-title">
              <p className="cart__sidebar-subtotal-title">Subtotal</p>
              <p className="cart__sidebar-subtotal">
                {formatUSD(subtotal || 0)}
              </p>
            </div>
            <div className="cart__sidebar-row cart__sidebar-row-shipping">
              <p className="cart__sidebar-shipping-title">
                {'Estimated Shipping & Handling'}
              </p>
              <p className="cart__sidebar-shipping">
                {shipping === 0 ? 'Free' : formatUSD(shipping)}
              </p>
            </div>
            <div className="cart__sidebar-row cart__sidebar-row-tax">
              <p className="cart__sidebar-tax-title">Estimated Tax</p>
              <p className="cart__sidebar-tax">{formatUSD(tax || 0)}</p>
            </div>
            <div className="cart__sidebar-row cart__sidebar-row-total">
              <p className="cart__sidebar-total-title">Total</p>
              <p className="cart__sidebar-total">{formatUSD(total || 0)}</p>
            </div>
            <button className="cart__button button-full-width button-red">
              Checkout
            </button>
          </div>
        </div>
      </div>
      <Feature title="Hottest Deals" products={saleProducts} size={3} />
      <Feature title="Running Favorites" products={runningProducts} size={3} />
    </div>
  );
}

const mapStateToProps = state => ({
  cart: state.cart.cart,
  initialProducts: state.products.products,
});

export default connect(mapStateToProps, {
  modifyItem,
  deleteItem,
  updateProducts,
})(Cart);
