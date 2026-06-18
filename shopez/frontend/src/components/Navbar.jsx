import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(search.trim() ? `/products?q=${encodeURIComponent(search.trim())}` : '/products');
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shopez-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">ShopEZ</Link>

        {/* Search — desktop */}
        <form className="navbar-search-wrap d-none d-md-flex" onSubmit={handleSearch}>
          <div className="input-group">
            <input
              className="form-control"
              placeholder="Search Electronics, Fashion, mobiles, etc.,"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="btn-search" type="submit">🔍</button>
          </div>
        </form>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="nav">
          {/* Search — mobile */}
          <form className="navbar-search-wrap d-flex d-md-none my-2" onSubmit={handleSearch}>
            <div className="input-group">
              <input className="form-control" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
              <button className="btn-search" type="submit">🔍</button>
            </div>
          </form>

          <ul className="navbar-nav ms-auto align-items-lg-center gap-2">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <span className="user-pill">👤 {user?.name}</span>
                </li>
                <li className="nav-item">
                  <Link to="/orders" className="nav-link">Orders</Link>
                </li>
                {isAdmin && (
                  <li className="nav-item">
                    <Link to="/admin" className="nav-link">Admin</Link>
                  </li>
                )}
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="btn btn-outline-light btn-sm">Login</Link>
              </li>
            )}
            <li className="nav-item">
              <Link to="/cart" className="nav-link">
                <div className="cart-icon-wrap">
                  🛒
                  {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
