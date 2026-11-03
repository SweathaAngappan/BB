import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;
    onLogin({ name, email, role });
    navigate('/dashboard');
  };

  return (
    <div className="auth-layout" style={{ maxWidth: '600px', margin: '32px auto' }}>
      <div className="card-glass" style={{ padding: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--neutral-900)', margin: '0 0 6px' }}>
          Start Your Health Journey
        </h1>
        <p className="meta" style={{ fontSize: '15px', color: 'var(--neutral-500)', margin: '0 0 20px' }}>
          Create an account to track meals, avoid allergens, and access verified dieticians.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <div className="field">
            <label style={{ fontWeight: 700, fontSize: '13px' }}>Full Name</label>
            <input
              type="text"
              className="field-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sweatha A M"
              required
            />
          </div>

          <div className="field">
            <label style={{ fontWeight: 700, fontSize: '13px' }}>Email Address</label>
            <input
              type="email"
              className="field-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. sweatha@balancedbowl.com"
              required
            />
          </div>

          <div className="field">
            <label style={{ fontWeight: 700, fontSize: '13px' }}>Password</label>
            <input
              type="password"
              className="field-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              required
            />
          </div>

          <div className="field">
            <label style={{ fontWeight: 700, fontSize: '13px' }}>Account Role</label>
            <select className="field-input" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">Patient / Client</option>
              <option value="dietician">Certified Dietician</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
            <button className="btn-ai" type="submit" style={{ padding: '14px 28px', border: 'none', cursor: 'pointer' }}>
              Create Account →
            </button>
            <Link to="/login" style={{ fontSize: '13px', color: 'var(--neutral-500)', textDecoration: 'none' }}>
              Have an account? <strong>Login</strong>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
