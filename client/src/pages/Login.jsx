import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleFillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    let role = 'user';
    let name = 'Sweatha';

    if (email.toLowerCase().includes('sarah')) {
      role = 'dietician';
      name = 'Dr. Sarah';
    } else if (email.toLowerCase().includes('admin')) {
      role = 'admin';
      name = 'System Administrator';
    }

    onLogin({ name, email, role });
    navigate('/dashboard');
  };

  return (
    <div className="auth-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', maxWidth: '940px', margin: '32px auto', alignItems: 'center' }}>
      <div className="card-glass" style={{ padding: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--neutral-900)', margin: '0 0 6px' }}>
          Welcome Back
        </h1>
        <p className="meta" style={{ fontSize: '15px', color: 'var(--neutral-500)', margin: '0 0 20px' }}>
          Sign in to access your AI meal logger, diet plans, and clinical roster.
        </p>

        {/* 1-Click Role Login */}
        <div style={{ background: '#f8fafc', border: '1px solid var(--neutral-200)', borderRadius: '16px', padding: '14px', marginBottom: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--neutral-500)', textTransform: 'uppercase', marginBottom: '8px' }}>
            ⚡ 1-Click Demo Accounts (Instant Role Access):
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-sm-action btn-eaten"
              onClick={() => handleFillDemo('admin@balancedbowl.com', 'admin')}
              style={{ cursor: 'pointer', padding: '6px 10px', borderRadius: '8px', border: '1px solid #86efac', background: '#f0fdf4', color: '#166534', fontWeight: 700 }}
            >
              👑 Admin
            </button>
            <button
              type="button"
              className="btn-sm-action btn-swap"
              onClick={() => handleFillDemo('sarah@balancedbowl.com', 'sarah')}
              style={{ cursor: 'pointer', padding: '6px 10px', borderRadius: '8px', border: '1px solid #fde68a', background: '#fffbeb', color: '#b45309', fontWeight: 700 }}
            >
              🩺 Dietician (Dr. Sarah)
            </button>
            <button
              type="button"
              className="btn-sm-action btn-skip"
              onClick={() => handleFillDemo('sweatha@balancedbowl.com', 'user123')}
              style={{ cursor: 'pointer', padding: '6px 10px', borderRadius: '8px', border: '1px solid #bae6fd', background: '#f0f9ff', color: '#0369a1', fontWeight: 700 }}
            >
              🥗 User (Sweatha)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
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
              placeholder="Enter your password"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
            <button className="btn-ai" type="submit" style={{ padding: '14px 28px', border: 'none', cursor: 'pointer' }}>
              Sign In →
            </button>
            <Link to="/register" style={{ fontSize: '13px', color: 'var(--neutral-500)', textDecoration: 'none' }}>
              Need an account? <strong>Register</strong>
            </Link>
          </div>
        </form>
      </div>

      <div className="card-glass" style={{ padding: '32px', background: 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(5,150,105,0.02))' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 12px' }}>
          Role-Based Access Control (RBAC)
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--neutral-700)', lineHeight: 1.6, margin: '0 0 16px' }}>
          The Balanced Bowl provides customized dashboards depending on your clinical or client role:
        </p>
        <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '13px', color: 'var(--neutral-700)', lineHeight: 1.8 }}>
          <li><strong>Patient (Sweatha):</strong> Meal logger, 7-day adherence index, grocery list.</li>
          <li><strong>Dietician (Dr. Sarah):</strong> Clinical patient roster, plateau alerts, diet plan prescription.</li>
          <li><strong>Administrator:</strong> Governance, verification, and platform analytics.</li>
        </ul>
      </div>
    </div>
  );
}
