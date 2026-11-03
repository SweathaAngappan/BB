import React from 'react';

export default function Footer() {
  return (
    <footer className="footer" style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--muted)', fontSize: '14px' }}>
      <div>© {new Date().getFullYear()} The Balanced Bowl — All Rights Reserved</div>
    </footer>
  );
}
