import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Cart = () => {
  const { cart, removeFromCart, updateQty, clearCart, totalMRP, totalPrice, totalDiscount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || '');
  const [pincode, setPincode] = useState(user?.pincode || '');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceOrder = async () => {
    if (!address || !pincode) { setError('Please enter your address and pincode'); return; }
    setPlacing(true); setError('');
    try {
      await api.post('/orders', {
        items: cart.map(i => ({ product: i.product, quantity: i.quantity, size: i.size })),
        address, pincode, paymentMethod: 'netbanking',
      });
      clearCart();
      navigate('/orders');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) return (
    <div className="container py-5 text-center">
      <div style={{ fontSize: '4rem' }}>🛒</div>
      <h4 className="mt-3">Your cart is empty</h4>
      <p className="text-muted">Add items to your cart to see them here.</p>
      <Link to="/products" className="btn btn-primary mt-2">Shop Now</Link>
    </div>
  );

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Cart items */}
        <div className="col-lg-8">
          {cart.map(item => (
            <div className="cart-item-row d-flex gap-3" key={`${item.product}-${item.size}`}>
              {item.image
                ? <img src={item.image} alt={item.name} className="cart-item-img" />
                : <div className="cart-item-img d-flex align-items-center justify-content-center" style={{ fontSize: '2rem' }}>📦</div>
              }
              <div className="flex-grow-1">
                <div className="fw-bold">{item.name}</div>
                <div className="text-muted" style={{ fontSize: '0.82rem' }}>Size: {item.size}</div>
                <div className="fw-bold text-primary mt-1">₹{item.price.toLocaleString()}</div>
                <div className="d-flex align-items-center gap-2 mt-2">
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQty(item.product, item.size, item.quantity - 1)}>−</button>
                  <span className="fw-bold">{item.quantity}</span>
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => updateQty(item.product, item.size, item.quantity + 1)}>+</button>
                  <button className="btn btn-link text-danger btn-sm ms-2 p-0" onClick={() => removeFromCart(item.product, item.size)}>Remove</button>
                </div>
              </div>
            </div>
          ))}

          {/* Delivery address */}
          <div className="bg-white rounded-3 shadow-sm p-3 mt-3">
            <h6 className="fw-bold mb-3">Delivery Address</h6>
            <div className="mb-2">
              <label className="form-label text-muted" style={{ fontSize: '0.85rem' }}>Address</label>
              <input className="form-control" placeholder="Enter your full address"
                value={address} onChange={e => setAddress(e.target.value)} />
            </div>
            <div>
              <label className="form-label text-muted" style={{ fontSize: '0.85rem' }}>Pincode</label>
              <input className="form-control" placeholder="Enter pincode"
                value={pincode} onChange={e => setPincode(e.target.value)} style={{ maxWidth: 180 }} />
            </div>
          </div>
        </div>

        {/* Price box */}
        <div className="col-lg-4">
          <div className="price-box">
            <h6>Price Details</h6>
            <div className="price-row">
              <span>Total MRP</span>
              <span>₹{totalMRP.toLocaleString()}</span>
            </div>
            <div className="price-row">
              <span>Discount on MRP</span>
              <span className="text-success fw-semibold">- ₹{totalDiscount.toLocaleString()}</span>
            </div>
            <div className="price-row">
              <span>Delivery Charges</span>
              <span className="text-success fw-semibold">+ ₹0</span>
            </div>
            <hr className="price-divider" />
            <div className="price-row price-final">
              <span>Final Price</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>

            {error && <div className="alert alert-danger py-2 mt-3">{error}</div>}

            <button className="place-order-btn mt-3" onClick={handlePlaceOrder} disabled={placing}>
              {placing ? 'Placing Order...' : 'Place order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
