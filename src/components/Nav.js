import { Link } from 'react-router-dom';
import '../styles/Nav.css';

function Nav() {
  return (
    <section className="nav-component">
      <div className="contained">
        <div className="nav">
          <Link to="/">
            <h2>Shoebie</h2>
          </Link>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/all">All Products</Link>
            <Link to="/cart">Cart</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Nav;
