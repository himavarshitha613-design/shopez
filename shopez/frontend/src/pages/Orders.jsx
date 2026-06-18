import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_CLASS = {
  'order placed': 'status-placed',
  'In-transit': 'status-transit',
  'delivered': 'status-delivered',
  'cancelled': 'status-cancelled',
};

const Orders = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const fetchOrders = () => {
    api.get('/orders/mine')
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCancel = async (orderId) => {
    setCancelling(orderId);
    try {
      await api.put(`/orders/${orderId}/cancel`);
      fetchOrders();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to cancel');
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Sidebar */}
        <div className="col-md-3">
          <div className="profile-card">
            <dl>
              <dt>Username</dt>
              <dd>{user?.name}</dd>
              <dt>Email</dt>
              <dd>{user?.email}</dd>
              <dt>Orders</dt>
              <dd>{orders.length}</dd>
            </dl>
            <button className="btn btn-danger btn-sm w-100" onClick={logout}>Logout</button>
          </div>
        </div>

        {/* Orders */}
        <div className="col-md-9">
          <h5 className="fw-bold mb-3">Orders</h5>

          {loading && <p className="text-muted">Loading orders...</p>}

          {!loading && orders.length === 0 && (
            <div className="alert alert-info">
              No orders yet. <Link to="/products">Start shopping!</Link>
            </div>
          )}

          {orders.map(order => (
            <div key={order._id}>
              {order.items.map((item, idx) => (
                <div className="order-item-card d-flex gap-3" key={idx}>
                  {item.image
                    ? <img src={item.image} alt={item.name} className="order-thumb" />
                    : <div className="order-thumb-placeholder">📦</div>
                  }
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start flex-wrap">
                      <div className="fw-bold">{item.name}</div>
                      <span className={`status-badge ${STATUS_CLASS[order.status] || 'status-placed'}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-muted mt-1" style={{ fontSize: '0.82rem', lineHeight: 1.9 }}>
                      <span className="me-3"><strong>Size:</strong> {item.size}</span>
                      <span className="me-3"><strong>Quantity:</strong> {item.quantity}</span>
                      <span className="me-3"><strong>Price:</strong> ₹{item.price.toLocaleString()}</span>
                      <span className="me-3"><strong>Payment method:</strong> {order.paymentMethod}</span>
                      <br />
                      <span className="me-3"><strong>Address:</strong> {order.address}</span>
                      <span className="me-3"><strong>Pincode:</strong> {order.pincode}</span>
                      <span><strong>Ordered on:</strong> {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <button
                        className="btn btn-danger btn-sm mt-2"
                        onClick={() => handleCancel(order._id)}
                        disabled={cancelling === order._id}
                      >
                        {cancelling === order._id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
