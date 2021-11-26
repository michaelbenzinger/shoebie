import { connect } from 'react-redux';
import '../styles/Cart.css';

export function formatUSD(num, digits) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
    style: 'currency',
    currency: 'USD',
  }).format(num);
}

function Cart(props) {
  const { cart } = props;

  const subtotal =
    cart.length === 0
      ? 0
      : cart
          .map(item => item.productInfo.price)
          .reduce((prev, current) => prev + current);
  console.log(subtotal);

  const shipping = subtotal >= 50 ? 0 : 8;
  const tax = subtotal * 0.09;
  const total = subtotal + shipping + tax;

  return (
    <div className="cart-component">
      <div className="contained">
        <h1>Cart</h1>
        <div className="cart__container">
          <div className="cart__main">
            {cart.map(item => (
              <div className="cart__item">
                <div className="cart__item-img-container">
                  <img
                    alt={item.productInfo.name}
                    className="cart__item-img"
                    src={item.urls.small}
                  />
                </div>
                <div className="cart__item-info-container">
                  <div className="cart__item-info-title">
                    <h3 className="cart__item-name">{item.productInfo.name}</h3>
                    <h3 className="cart__item-price">
                      {formatUSD(item.productInfo.price)}
                    </h3>
                  </div>
                  <p className="cart__item-category">
                    {item.productInfo.brand} | {item.productInfo.category}
                  </p>
                  <p className="cart__item-size">
                    Size {item.size} M / {item.size + 1.5} W
                  </p>
                </div>
              </div>
            ))}
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
                {formatUSD(shipping || 0)}
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
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  cart: state.cart.cart,
});

export default connect(mapStateToProps)(Cart);
