import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState('M');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    addToCart(product, size, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    addToCart(product, size, qty);
    navigate('/cart');
  };

  if (loading) return <div className="container py-5"><p className="text-muted">Loading...</p></div>;
  if (error || !product) return <div className="container py-5"><div className="alert alert-danger">{error || 'Not found'}</div></div>;

  const discount = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Image */}
        <div className="col-md-5">
          <div className="bg-white rounded-3 shadow-sm p-3 text-center">
            {product.image
              ? <img src={product.image} alt={product.name} className="img-fluid rounded-3" style={{ maxHeight: 340, objectFit: 'cover' }} />
              : <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>📦</div>
            }
          </div>
        </div>

        {/* Info */}
        <div className="col-md-4">
          <div className="bg-white rounded-3 shadow-sm p-4 h-100">
            <span className="badge mb-2" style={{ background: 'var(--primary)', fontSize: '0.75rem' }}>{product.category}</span>
            <h4 className="fw-bold">{product.name}</h4>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>{product.description}</p>

            <div className="d-flex align-items-baseline gap-2 mb-3">
              <span className="fw-bold fs-4">₹{product.price.toLocaleString()}</span>
              {discount > 0 && <>
                <span style={{ textDecoration: 'line-through', color: '#aaa' }}>₹{product.mrp.toLocaleString()}</span>
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>({discount}% off)</span>
              </>}
            </div>

            {/* Size selector */}
            <div className="mb-3">
              <label className="fw-semibold mb-2 d-block">Size: <span className="text-primary">{size}</span></label>
              <div className="d-flex gap-2 flex-wrap">
                {SIZES.map(s => (
                  <button key={s}
                    className={`btn btn-sm ${size === s ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setSize(s)}
                  >{s}</button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <label className="fw-semibold mb-2 d-block">Quantity</label>
              <div className="d-flex align-items-center gap-2">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span className="fw-bold px-2">{qty}</span>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => setQty(q => q + 1)}>+</button>
              </div>
            </div>

            <div className="d-grid gap-2">
              <button className="btn btn-warning fw-bold" onClick={handleAddToCart}>
                {added ? '✅ Added to Cart!' : '🛒 Add to Cart'}
              </button>
              <button className="place-order-btn" onClick={handleBuyNow}>Buy Now</button>
            </div>
          </div>
        </div>

        {/* Price summary */}
        <div className="col-md-3">
          <div className="price-box">
            <h6>Price Details</h6>
            <div className="price-row">
              <span>Price ({qty} item{qty > 1 ? 's' : ''})</span>
              <span>₹{(product.mrp * qty).toLocaleString()}</span>
            </div>
            <div className="price-row">
              <span>Discount</span>
              <span className="text-success fw-semibold">− ₹{((product.mrp - product.price) * qty).toLocaleString()}</span>
            </div>
            <div className="price-row">
              <span>Delivery Charges</span>
              <span className="text-success fw-semibold">+ ₹0</span>
            </div>
            <hr className="price-divider" />
            <div className="price-row price-final">
              <span>Total Amount</span>
              <span>₹{(product.price * qty).toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="mt-2 p-2 rounded" style={{ background: '#f0fdf4', color: '#166534', fontSize: '0.82rem', fontWeight: 600 }}>
                🎉 You save ₹{((product.mrp - product.price) * qty).toLocaleString()} on this order!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
