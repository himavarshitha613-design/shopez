import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['mobiles', 'Electronics', 'Sports-Equipment', 'Fashion', 'Groceries'];
const GENDERS = ['Men', 'Women', 'Unisex'];
const SORTS = [
  { label: 'Popular', value: '' },
  { label: 'Price (low to high)', value: 'price_asc' },
  { label: 'Price (high to low)', value: 'price_desc' },
  { label: 'Discount', value: 'discount' },
];

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('');
  const [categories, setCategories] = useState(searchParams.get('category') ? [searchParams.get('category')] : []);
  const [genders, setGenders] = useState([]);
  const [search, setSearch] = useState(searchParams.get('q') || '');

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (search) params.q = search;
    if (categories.length === 1) params.category = categories[0];
    if (genders.length === 1) params.gender = genders[0];
    if (sort && sort !== 'discount') params.sort = sort;

    api.get('/products', { params })
      .then(r => {
        let prods = r.data.products;
        if (sort === 'discount') prods = [...prods].sort((a, b) => {
          const da = ((a.mrp - a.price) / a.mrp) * 100;
          const db = ((b.mrp - b.price) / b.mrp) * 100;
          return db - da;
        });
        if (categories.length > 1) prods = prods.filter(p => categories.includes(p.category));
        if (genders.length > 1) prods = prods.filter(p => genders.includes(p.gender));
        setProducts(prods);
        setTotal(r.data.total);
        setPages(r.data.pages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, categories, genders, sort, page]);

  const toggleFilter = (arr, setArr, val) => {
    setArr(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
    setPage(1);
  };

  return (
    <div className="container py-3">
      <div className="row g-4">
        {/* Sidebar */}
        <div className="col-lg-2 col-md-3">
          <div className="filter-box">
            <h6>Sort By</h6>
            {SORTS.map(s => (
              <div className="form-check" key={s.value}>
                <input className="form-check-input" type="radio" name="sort" id={`s-${s.value}`}
                  checked={sort === s.value} onChange={() => { setSort(s.value); setPage(1); }} />
                <label className="form-check-label" htmlFor={`s-${s.value}`}>{s.label}</label>
              </div>
            ))}

            <h6>Categories</h6>
            {CATEGORIES.map(c => (
              <div className="form-check" key={c}>
                <input className="form-check-input" type="checkbox" id={`c-${c}`}
                  checked={categories.includes(c)} onChange={() => toggleFilter(categories, setCategories, c)} />
                <label className="form-check-label" htmlFor={`c-${c}`}>{c}</label>
              </div>
            ))}

            <h6>Gender</h6>
            {GENDERS.map(g => (
              <div className="form-check" key={g}>
                <input className="form-check-input" type="checkbox" id={`g-${g}`}
                  checked={genders.includes(g)} onChange={() => toggleFilter(genders, setGenders, g)} />
                <label className="form-check-label" htmlFor={`g-${g}`}>{g}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="col-lg-10 col-md-9">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <h5 className="fw-bold mb-0">
              All Products
              {total > 0 && <span className="text-muted fw-normal ms-1" style={{ fontSize: '0.88rem' }}>({total} items)</span>}
            </h5>
            <input type="text" className="form-control" style={{ maxWidth: 280 }}
              placeholder="Search products..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>

          {loading && <p className="text-muted">Loading products...</p>}

          <div className="row g-3">
            {products.map(p => (
              <div className="col-6 col-md-4 col-lg-3" key={p._id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          {!loading && products.length === 0 && (
            <div className="alert alert-info mt-2">No products match your filters.</div>
          )}

          {pages > 1 && (
            <nav className="d-flex justify-content-center mt-4">
              <ul className="pagination">
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
