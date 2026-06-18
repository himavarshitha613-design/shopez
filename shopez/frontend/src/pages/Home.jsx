import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { label: 'Fashion', q: 'Fashion', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300' },
  { label: 'Electronics', q: 'Electronics', img: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=300' },
  { label: 'Mobiles', q: 'mobiles', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300' },
  { label: 'Groceries', q: 'Groceries', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300' },
  { label: 'Sports Equipments', q: 'Sports-Equipment', img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerUrl, setBannerUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products', { params: { limit: 8 } })
      .then(r => setProducts(r.data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
    api.get('/banner').then(r => setBannerUrl(r.data.imageUrl)).catch(() => {});
  }, []);

  return (
    <div className="container py-3">
      {/* Banner */}
      {bannerUrl ? (
        <img src={bannerUrl} alt="banner" className="w-100 rounded-3 mb-4" style={{ maxHeight: 220, objectFit: 'cover' }} />
      ) : (
        <div className="hero-banner p-4 p-md-5 mb-4">
          <div className="hero-blob1" /><div className="hero-blob2" />
          <div className="hero-banner-content">
            <div className="mb-1" style={{ fontSize: '0.75rem', letterSpacing: 3, fontWeight: 700, opacity: 0.85 }}>UP TO 50% OFF</div>
            <h1 className="fw-black mb-1" style={{ fontSize: '3rem', lineHeight: 1, textShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>
              SUPER<br /><span style={{ color: '#ffe44d' }}>SALE</span>
            </h1>
            <button className="btn btn-dark btn-sm mt-2 fw-bold px-4" onClick={() => navigate('/products')}>
              SHOP NOW
            </button>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="row g-3 mb-4">
        {CATEGORIES.map(cat => (
          <div className="col" key={cat.label} style={{ minWidth: 120 }}>
            <Link to={`/products?category=${encodeURIComponent(cat.q)}`} className="cat-card">
              <img src={cat.img} alt={cat.label} className="cat-img" />
              <div className="cat-label">{cat.label}</div>
            </Link>
          </div>
        ))}
      </div>

      {/* Featured products */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">Featured Products</h5>
        <Link to="/products" className="btn btn-sm btn-outline-primary">View all →</Link>
      </div>

      {loading && <p className="text-muted">Loading...</p>}

      <div className="row g-3">
        {products.map(p => (
          <div className="col-6 col-md-4 col-lg-3" key={p._id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      {!loading && products.length === 0 && (
        <div className="alert alert-info">No products yet. Run <code>npm run seed</code> in the backend.</div>
      )}
    </div>
  );
};

export default Home;
