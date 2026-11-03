import React from 'react';
import { Link } from 'react-router-dom';

export default function Home({ currentUser }) {
  const stories = [
    {
      name: "Rohan M.",
      beforeWeight: 84.5,
      afterWeight: 76.0,
      duration: "3 mo",
      story: "The smart meal swapper kept me consistent even during busy office weeks. Lost 8.5 kg without starving!"
    },
    {
      name: "Sneha P.",
      beforeWeight: 71.0,
      afterWeight: 64.2,
      duration: "4 mo",
      story: "My dietician adjusted my macros when I hit a plateau. The adherence index and meal logging made all the difference."
    },
    {
      name: "Karthik R.",
      beforeWeight: 92.0,
      afterWeight: 83.5,
      duration: "3.5 mo",
      story: "The conversational AI logger takes 5 seconds after each meal. Highly recommended for sustainable health changes."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="hero" style={{ padding: '40px 0' }}>
        <div className="hero-copy">
          <span className="badge-pill badge-success" style={{ marginBottom: '12px' }}>
            🥗 Clinical & AI-Powered Nutrition
          </span>
          <h1 style={{ fontSize: 'clamp(36px, 4.5vw, 52px)', fontWeight: 800, lineHeight: 1.1, color: 'var(--neutral-900)', margin: '0 0 16px' }}>
            Eat Intelligently.<br />Live Powerfully.
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--neutral-500)', lineHeight: 1.5, margin: '0 0 24px' }}>
            Certified dieticians, conversational AI food plate logging, dynamic macro-matched pantry swaps, and automated clinical adherence monitoring.
          </p>

          <div className="hero-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {!currentUser ? (
              <>
                <Link to="/register" className="btn-ai" style={{ padding: '14px 26px', textDecoration: 'none' }}>
                  🚀 Start Your Health Journey
                </Link>
                <Link to="/dieticians" className="btn btn-secondary" style={{ padding: '14px 22px', textDecoration: 'none' }}>
                  Find Dieticians
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="btn-ai" style={{ padding: '14px 26px', textDecoration: 'none' }}>
                  📊 Open Health Dashboard →
                </Link>
                <Link to="/diet-plan" className="btn btn-secondary" style={{ padding: '14px 22px', textDecoration: 'none' }}>
                  My Diet Plan
                </Link>
              </>
            )}
          </div>

          {/* Metric highlights */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '28px', borderTop: '1px solid var(--neutral-200)', paddingTop: '16px', flexWrap: 'wrap' }}>
            <div>
              <strong style={{ fontSize: '20px', color: 'var(--neutral-900)', fontWeight: 800 }}>100%</strong>
              <div style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>Verified Clinicians</div>
            </div>
            <div>
              <strong style={{ fontSize: '20px', color: 'var(--primary-emerald-dark)', fontWeight: 800 }}>±10%</strong>
              <div style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>Macro Equivalence</div>
            </div>
            <div>
              <strong style={{ fontSize: '20px', color: '#0284c7', fontWeight: 800 }}>Real-time</strong>
              <div style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>Plateau Alerts</div>
            </div>
          </div>
        </div>

        <div className="hero-media">
          <div style={{ position: 'relative', width: '100%', borderRadius: '28px', overflow: 'hidden', boxShadow: '0 24px 50px rgba(16,185,129,0.16)' }}>
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&q=80&auto=format&fit=crop"
              alt="Healthy balanced bowl"
              style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
            />

            {/* Floating interactive badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                right: '16px',
                background: 'rgba(255,255,255,0.96)',
                backdropFilter: 'blur(10px)',
                borderRadius: '18px',
                padding: '14px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 10px 24px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>🥗</span>
                <div>
                  <strong style={{ fontSize: '14px', color: 'var(--neutral-900)', display: 'block' }}>Smart Food Plate AI</strong>
                  <span style={{ fontSize: '12px', color: 'var(--primary-emerald-dark)', fontWeight: 700 }}>280 kcal • 18g Protein (A+ Grade)</span>
                </div>
              </div>
              <span className="badge-pill badge-success" style={{ fontSize: '11px' }}>Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Golden Features Architecture Showcase */}
      <section className="section" style={{ margin: '40px 0' }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 30px' }}>
          <span className="badge-pill badge-purple" style={{ marginBottom: '8px' }}>INNOVATION HIGHLIGHTS</span>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--neutral-900)', margin: '0 0 8px' }}>
            The 3 Pillars of The Balanced Bowl
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--neutral-500)', margin: 0 }}>
            Eliminating friction in nutrition: automated macro logging, flexible recipe swaps, and closed-loop adherence.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Pillar 1 */}
          <div className="card-glass" style={{ borderTop: '4px solid var(--primary-emerald)', padding: '24px' }}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>🎙️</div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--neutral-900)', margin: '0 0 6px' }}>
              1. AI Natural Language Macro Logger
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--neutral-700)', lineHeight: 1.5, margin: '0 0 14px' }}>
              Type meals naturally in plain English. The NLP engine parses ingredients, calculates macros (calories, protein, carbs, fats), and grades your plate.
            </p>
            <span className="badge-pill badge-info" style={{ fontSize: '11px' }}>Zero Manual Entry</span>
          </div>

          {/* Pillar 2 */}
          <div className="card-glass" style={{ borderTop: '4px solid #f59e0b', padding: '24px' }}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>🔄</div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--neutral-900)', margin: '0 0 6px' }}>
              2. Smart Pantry Swapper & Grocery List
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--neutral-700)', lineHeight: 1.5, margin: '0 0 14px' }}>
              Missing ingredients? 1-Click "Swap Meal" finds macro-equivalent alternatives within ±10% calories. Consolidates a 7-day grocery list by supermarket aisle.
            </p>
            <span className="badge-pill badge-warning" style={{ fontSize: '11px' }}>Zero Diet Abandonment</span>
          </div>

          {/* Pillar 3 */}
          <div className="card-glass" style={{ borderTop: '4px solid #0284c7', padding: '24px' }}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>📊</div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--neutral-900)', margin: '0 0 6px' }}>
              3. Adherence & Metabolic Plateau Alerts
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--neutral-700)', lineHeight: 1.5, margin: '0 0 14px' }}>
              Daily check-ins compute a 7-day compliance score. The engine flags metabolic plateaus (&gt;80% adherence with static weight) for proactive dietician adjustments.
            </p>
            <span className="badge-pill badge-success" style={{ fontSize: '11px' }}>Clinical Provider Loop</span>
          </div>
        </div>
      </section>

      {/* Community Transformations */}
      <section className="section" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--neutral-900)', margin: 0 }}>
              ⭐ Patient Transformations
            </h2>
            <span className="meta" style={{ fontSize: '13px', color: 'var(--neutral-500)' }}>Real patient results achieved with our dieticians</span>
          </div>
          <Link to="/register" className="btn btn-secondary" style={{ fontSize: '13px', padding: '6px 14px', textDecoration: 'none' }}>
            + Start Your Journey
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
          {stories.map((s, idx) => (
            <div key={idx} className="card-glass" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <strong style={{ fontSize: '15px', color: 'var(--neutral-900)' }}>{s.name}</strong>
                <span className="badge-pill badge-success" style={{ fontSize: '11px' }}>
                  -{(s.beforeWeight - s.afterWeight).toFixed(1)} kg in {s.duration}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--neutral-700)', lineHeight: 1.5, margin: 0 }}>
                "{s.story}"
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
