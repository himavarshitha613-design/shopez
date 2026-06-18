import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const TABS = ['Overview', 'Products', 'Users', 'Orders'];
const CATS = ['mobiles', 'Electronics', 'Sports-Equipment', 'Fashion', 'Groceries'];
const EMPTY = { name: '', description: '', category: 'mobiles', gender: 'Unisex', price: '', mrp: '', image: '' };

const Admin = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [bannerUrl, setBannerUrl] = useState('');

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [s, p, u, o, b] = await Promise.all([
        api.get('/admin/stats'), api.get('/products', { params: { limit: 100 } }),
        api.get('/admin/users'), api.get('/admin/orders'), api.get('/banner'),
      ]);
      setStats(s.data); setProducts(p.data.products);
      setUsers(u.data); setOrders(o.data);
      setBannerUrl(b.data.imageUrl || '');
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadAll(); }, []);

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), mrp: Number(form.mrp) };
    try {
      if (editId) { await api.put(`/products/${editId}`, payload); flash('Product updated'); }
      else { await api.post('/products', payload); flash('Product created'); }
      setForm(EMPTY); setEditId(null); loadAll();
    } catch (er) { flash(er.response?.data?.message || 'Failed'); }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await api.delete(`/products/${id}`); flash('Deleted'); loadAll(); }
    catch (er) { flash(er.response?.data?.message || 'Failed'); }
  };

  const updateUser = async (id, data) => {
    try { await api.put(`/admin/users/${id}`, data); loadAll(); }
    catch (er) { flash(er.response?.data?.message || 'Failed'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete user?')) return;
    try { await api.delete(`/admin/users/${id}`); flash('User deleted'); loadAll(); }
    catch (er) { flash(er.response?.data?.message || 'Failed'); }
  };

  const updateOrder = async (id, status) => {
    try { await api.put(`/admin/orders/${id}`, { status }); loadAll(); }
    catch (er) { flash(er.response?.data?.message || 'Failed'); }
  };

  const handleBannerUpdate = async () => {
    try { await api.put('/banner', { imageUrl: bannerUrl }); flash('Banner updated!'); }
    catch (er) { flash('Failed to update banner'); }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="admin-layout">
      {/* Admin Navbar */}
      <nav className="navbar admin-nav px-4 sticky-top">
        <span className="navbar-brand">ShopEZ (admin)</span>
        <div className="d-flex gap-4 align-items-center flex-wrap">
          {TABS.map(t => (
            <button key={t} className={`admin-nav-link ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
          <button className="admin-nav-link" onClick={() => { setTab('Products'); setForm(EMPTY); setEditId(null); }}>New Product</button>
          <button className="admin-nav-link" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="container py-4">
        {msg && <div className="alert alert-success py-2 mb-3">{msg}</div>}
        {loading && <p className="text-secondary">Loading...</p>}

        {/* OVERVIEW */}
        {!loading && tab === 'Overview' && stats && (
          <>
            <div className="row g-3 mb-4">
              {[
                { label: 'Total users', val: stats.userCount, btn: 'View all', go: () => setTab('Users') },
                { label: 'All Products', val: stats.productCount, btn: 'View all', go: () => setTab('Products') },
                { label: 'All Orders', val: stats.orderCount, btn: 'View all', go: () => setTab('Orders') },
                { label: 'Add Product', val: '(new)', btn: 'Add now', go: () => { setTab('Products'); setForm(EMPTY); setEditId(null); } },
              ].map(c => (
                <div className="col-sm-6 col-md-3" key={c.label}>
                  <div className="admin-stat">
                    <h6>{c.label}</h6>
                    <div className="stat-num">{c.val}</div>
                    <button className="admin-outline-btn mt-2" onClick={c.go}>{c.btn}</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Banner */}
            <div className="admin-panel" style={{ maxWidth: 420 }}>
              <h5>Update banner</h5>
              <input className="form-control admin-input mb-3" placeholder="Banner url"
                value={bannerUrl} onChange={e => setBannerUrl(e.target.value)} />
              <button className="admin-outline-btn" onClick={handleBannerUpdate}>Update</button>
            </div>
          </>
        )}

        {/* PRODUCTS */}
        {!loading && tab === 'Products' && (
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="admin-panel">
                <h5>{editId ? 'Edit Product' : 'New Product'}</h5>
                <form onSubmit={handleProductSubmit}>
                  {[
                    { label: 'Product Name', key: 'name', type: 'text' },
                    { label: 'Description', key: 'description', type: 'text' },
                    { label: 'Price (₹)', key: 'price', type: 'number' },
                    { label: 'MRP (₹)', key: 'mrp', type: 'number' },
                    { label: 'Image URL', key: 'image', type: 'text' },
                  ].map(f => (
                    <div className="mb-2" key={f.key}>
                      <label className="admin-label">{f.label}</label>
                      <input className="form-control admin-input" type={f.type} value={form[f.key]}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        required={['name', 'description', 'price', 'mrp'].includes(f.key)} />
                    </div>
                  ))}
                  <div className="mb-2">
                    <label className="admin-label">Category</label>
                    <select className="form-select admin-input" value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}>
                      {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="admin-label">Gender</label>
                    <select className="form-select admin-input" value={form.gender}
                      onChange={e => setForm({ ...form, gender: e.target.value })}>
                      {['Men', 'Women', 'Unisex'].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="submit" className="admin-outline-btn">{editId ? 'Update' : 'Create'}</button>
                    {editId && <button type="button" className="admin-outline-btn" style={{ borderColor: '#aaa', color: '#aaa' }}
                      onClick={() => { setForm(EMPTY); setEditId(null); }}>Cancel</button>}
                  </div>
                </form>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="admin-panel">
                <h5>Products ({products.length})</h5>
                <div className="table-responsive">
                  <table className="table admin-table">
                    <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>MRP</th><th></th></tr></thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p._id}>
                          <td>{p.name}</td>
                          <td>{p.category}</td>
                          <td>₹{p.price.toLocaleString()}</td>
                          <td>₹{p.mrp.toLocaleString()}</td>
                          <td className="text-end">
                            <button className="admin-outline-btn me-2" onClick={() => {
                              setEditId(p._id);
                              setForm({ name: p.name, description: p.description, category: p.category, gender: p.gender, price: p.price, mrp: p.mrp, image: p.image || '' });
                            }}>Edit</button>
                            <button className="admin-outline-btn" style={{ borderColor: '#e74c3c', color: '#e74c3c' }}
                              onClick={() => deleteProduct(p._id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USERS */}
        {!loading && tab === 'Users' && (
          <div className="admin-panel">
            <h5>Users ({users.length})</h5>
            <div className="table-responsive">
              <table className="table admin-table">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <select className="form-select form-select-sm admin-input" style={{ width: 110 }}
                          value={u.role} onChange={e => updateUser(u._id, { role: e.target.value })}>
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td><span className={`badge ${u.isActive ? 'bg-success' : 'bg-secondary'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td className="text-end">
                        <button className="admin-outline-btn me-2" onClick={() => updateUser(u._id, { isActive: !u.isActive })}>
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button className="admin-outline-btn" style={{ borderColor: '#e74c3c', color: '#e74c3c' }}
                          onClick={() => deleteUser(u._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {!loading && tab === 'Orders' && (
          <div className="admin-panel">
            <h5>All Orders ({orders.length})</h5>
            <div className="table-responsive">
              <table className="table admin-table">
                <thead><tr><th>Date</th><th>User</th><th>Items</th><th>Total</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o._id}>
                      <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td>{o.user?.name}<br /><small className="text-secondary">{o.user?.email}</small></td>
                      <td>{o.items.map(i => i.name).join(', ')}</td>
                      <td>₹{o.totalPrice.toLocaleString()}</td>
                      <td>
                        <select className="form-select form-select-sm admin-input" style={{ width: 140 }}
                          value={o.status} onChange={e => updateOrder(o._id, e.target.value)}>
                          {['order placed', 'In-transit', 'delivered', 'cancelled'].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
