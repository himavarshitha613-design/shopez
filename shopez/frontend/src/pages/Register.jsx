import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '85vh' }}>
      <div className="auth-card">
        <div className="text-center mb-4">
          <h4 className="fw-black" style={{ color: 'var(--primary)' }}>ShopEZ</h4>
          <p className="text-muted mb-0">Create your account</p>
        </div>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <form onSubmit={handleSubmit}>
          {[
            { label: 'Full Name', val: name, set: setName, type: 'text', ph: 'Jane Doe' },
            { label: 'Email', val: email, set: setEmail, type: 'email', ph: 'you@example.com' },
            { label: 'Password', val: password, set: setPassword, type: 'password', ph: 'At least 6 characters' },
            { label: 'Confirm Password', val: confirm, set: setConfirm, type: 'password', ph: '••••••••' },
          ].map(f => (
            <div className="mb-3" key={f.label}>
              <label className="form-label fw-semibold">{f.label}</label>
              <input type={f.type} className="form-control" value={f.val}
                onChange={e => f.set(e.target.value)} placeholder={f.ph} required />
            </div>
          ))}
          <button type="submit" className="place-order-btn mt-1" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="text-center mt-3 mb-0" style={{ fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
