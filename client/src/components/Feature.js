import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setProduct } from '../actions/productActions';
import '../styles/Feature.css';
import { formatUSD } from './Cart';

function Feature(props) {
  const { title, products, size } = props;
  const displayProducts = products.slice(0, size);
  const imageSize = 'regular';

  return (
    <div className="home__feature">
      <div className="contained feature-contained">
        <h2 className="home__feature-title">{title}</h2>
        <div
          style={{ gridTemplateColumns: '1fr '.repeat(size) }}
          className="feature__products"
        >
          {displayProducts.map(product => (
            <div key={product.id} className="feature__product">
              <div className="feature__attribution">
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
                key={product.id}
                to={`/product/${product.id}`}
              >
                <div className="feature__img-container">
                  {product.urls ? (
                    <img
                      className="feature__img"
                      alt={product.productInfo.name}
                      src={product.urls[imageSize]}
                    />
                  ) : (
                    <div className="feature__placeholder" />
                  )}
                  <div className="feature__content">
                    <h3 className="feature__name">
                      {product.productInfo.name}
                    </h3>
                    {product.productInfo.salePrice ? (
                      <p className="feature__price">
                        <span className="feature__sale-price">
                          {formatUSD(product.productInfo.salePrice)}
                        </span>
                        <span className="feature__price-slash">
                          {formatUSD(product.productInfo.price)}
                        </span>
                      </p>
                    ) : (
                      <p className="feature__price">
                        {formatUSD(product.productInfo.price)}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default connect(null, { setProduct })(Feature);
