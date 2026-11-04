import React from 'react';
import { Link } from 'react-router-dom';

export default function Consultations() {
  const appointments = [
    {
      id: 'apt-1',
      dieticianName: 'Dr. Ananya Sharma',
      status: 'confirmed',
      date: 'Thursday, Nov 05, 2026',
      time: '10:00 AM - 10:45 AM',
      mode: 'ONLINE VIDEO',
      fee: 600,
      notes: 'Initial consultation for metabolic reset and PCOS guidance.'
    },
    {
      id: 'apt-2',
      dieticianName: 'Dr. Rajesh Varma',
      status: 'completed',
      date: 'Monday, Oct 20, 2026',
      time: '04:00 PM - 04:45 PM',
      mode: 'ONLINE VIDEO',
      fee: 750,
      notes: 'Athletic endurance macro check and hydration protocol.'
    }
  ];

  return (
    <div>
      <section className="section" style={{ marginBottom: '24px' }}>
        <div className="page-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--neutral-900)', margin: '0 0 6px' }}>
              📑 Consultation Bookings & History
            </h1>
            <p className="meta" style={{ fontSize: '16px', color: 'var(--neutral-500)', margin: 0 }}>
              Track your consultations, join virtual telehealth rooms, and manage bookings.
            </p>
          </div>
          <Link className="button" to="/dieticians" style={{ textDecoration: 'none' }}>
            Schedule New Session
          </Link>
        </div>
      </section>

      <div style={{ display: 'grid', gap: '18px' }}>
        {appointments.map((a) => (
          <div key={a.id} className="card-glass" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <h3 style={{ margin: 0, fontSize: '19px', fontWeight: 800, color: 'var(--neutral-900)' }}>
                    {a.dieticianName}
                  </h3>
                  <span className={`badge-pill ${a.status === 'completed' ? 'badge-success' : 'badge-info'}`}>
                    {a.status.toUpperCase()}
                  </span>
                </div>

                <div style={{ fontSize: '14px', color: 'var(--neutral-500)', marginBottom: '8px' }}>
                  <span>🗓️ {a.date} ({a.time})</span>
                  <span style={{ margin: '0 8px' }}>•</span>
                  <span>Mode: <strong>{a.mode}</strong></span>
                  <span style={{ margin: '0 8px' }}>•</span>
                  <strong style={{ color: 'var(--primary-emerald-dark)' }}>Fee: ₹{a.fee}</strong>
                </div>

                {a.notes && (
                  <p style={{ margin: '6px 0 0', fontSize: '14px', color: 'var(--neutral-700)' }}>
                    <strong>Notes:</strong> {a.notes}
                  </p>
                )}
              </div>

              {a.status === 'confirmed' && (
                <button
                  className="btn-ai"
                  style={{ padding: '10px 18px', fontSize: '13px', border: 'none', cursor: 'pointer' }}
                  onClick={() => alert('Launching Virtual Telehealth Room...')}
                >
                  📹 Join Video Room
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

