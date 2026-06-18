import React from 'react';
import { Link } from 'react-router-dom';

const EMOJI = {
  mobiles: '📱', Electronics: '💻', 'Sports-Equipment': '🏏',
  Fashion: '👗', Groceries: '🛒',
};

const ProductCard = ({ product }) => {
  const discount = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      {product.image
        ? <img src={product.image} alt={product.name} className="product-img" onError={e => { e.target.style.display='none'; }} />
        : <div className="product-img-placeholder">{EMOJI[product.category] || '📦'}</div>
      }
      <div className="product-body">
        <div className="product-name">{product.name}</div>
        <div className="product-desc">{product.description}</div>
        <div className="d-flex align-items-baseline flex-wrap">
          <span className="product-price">₹ {product.price.toLocaleString()}</span>
          {product.mrp > product.price && (
            <>
              <span className="product-mrp">₹{product.mrp.toLocaleString()}</span>
              <span className="product-discount">({discount}% off)</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
