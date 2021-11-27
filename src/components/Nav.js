import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import '../styles/Nav.css';

function Nav(props) {
  const { cart } = props;

  let cartSizeClasses = 'nav-links__cart-size';
  let navLinksClasses = 'nav-links';
  if (cart.length === 0) {
    cartSizeClasses += ' nav-links__hidden';
    navLinksClasses += ' nav-links__has-hidden';
  }

  let cartSize =
    cart.length > 0
      ? cart
          .map(item => item.quantity)
          .reduce((prev, current) => prev + current)
      : 0;

  return (
    <section className="nav-component">
      <div className="contained">
        <div className="nav">
          <Link to="/">
            <h2>Shoebie</h2>
          </Link>
          <div className={navLinksClasses}>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <div className="nav-links__cart-container">
              <Link to="/cart">
                <span>Cart</span>
                <span className={cartSizeClasses}>{cartSize}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const mapStateToProps = state => ({
  cart: state.cart.cart,
});

export default connect(mapStateToProps)(Nav);
