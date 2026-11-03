import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header({ currentUser, onLogout }) {
  const location = useLocation();

  return (
    <header className="header" style={{ marginBottom: '24px' }}>
      <div className="brand">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
          <div
            className="logo"
            style={{
              width: '38px',
              height: '38px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '20px',
              boxShadow: '0 6px 14px rgba(16,185,129,0.25)'
            }}
          >
            🥗
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', margin: 0, color: 'var(--neutral-900)' }}>
              The Balanced Bowl
            </h1>
          </div>
        </Link>
      </div>

      <nav className="nav" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <Link to="/dieticians" id="nav-dieticians">Dieticians</Link>
        <Link to="/dashboard" id="nav-dashboard">Dashboard</Link>
        <Link to="/diet-plan" id="nav-dietplan">Diet Plan</Link>
        <Link to="/grocery-list" id="nav-grocery">Grocery List</Link>
        <Link to="/consultations" id="nav-appointments">Consultations</Link>

        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '6px' }}>
            <span
              className="nav-pill"
              style={{
                background: 'var(--neutral-100)',
                color: 'var(--neutral-800)',
                fontWeight: 700,
                borderRadius: '10px',
                padding: '6px 10px',
                fontSize: '12px'
              }}
            >
              {currentUser.name ? currentUser.name.split(' ')[0] : 'User'}
            </span>
            <button
              onClick={onLogout}
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '10px', cursor: 'pointer' }}
              id="nav-logout"
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link to="/login" id="nav-login">Login</Link>
            <Link
              to="/register"
              id="nav-register"
              className="button"
              style={{ background: 'var(--primary-emerald)', color: '#fff', padding: '8px 16px', fontSize: '13px' }}
            >
              Sign Up
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
