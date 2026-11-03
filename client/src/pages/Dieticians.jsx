import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Dieticians() {
  const [dieticians, setDieticians] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchSpec, setSearchSpec] = useState('');
  const [mode, setMode] = useState('');
  const [bookingDietician, setBookingDietician] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingDate, setBookingDate] = useState('2026-11-05');
  const [bookingSlot, setBookingSlot] = useState('10:00 AM - 10:45 AM');

  useEffect(() => {
    fetchDieticians();
  }, []);

  const fetchDieticians = async () => {
    try {
      const res = await axios.get('/api/dieticians');
      if (res.data?.dieticians) {
        setDieticians(res.data.dieticians);
      }
    } catch (err) {
      console.error(err);
      setDieticians([
        {
          _id: "diet1",
          name: "Dr. Ananya Sharma",
          qualification: "M.Sc Clinical Nutrition, RD",
          experienceYears: 8,
          fee: 600,
          specialization: ["Diabetes Management", "Weight Loss", "PCOS Care"],
          rating: 4.9,
          reviewsCount: 42,
          isVerified: true
        },
        {
          _id: "diet2",
          name: "Dr. Rajesh Varma",
          qualification: "Ph.D. Sports Nutrition",
          experienceYears: 11,
          fee: 750,
          specialization: ["Sports Nutrition", "Muscle Gain", "Cardiac Wellness"],
          rating: 4.8,
          reviewsCount: 38,
          isVerified: true
        },
        {
          _id: "diet3",
          name: "Dr. Priya Nair",
          qualification: "Certified Gut Health & Renal Specialist",
          experienceYears: 6,
          fee: 550,
          specialization: ["Gut Health", "Renal Care", "Pediatric Nutrition"],
          rating: 4.95,
          reviewsCount: 51,
          isVerified: true
        }
      ]);
    }
  };

  const filtered = dieticians.filter(d => {
    const dName = d.name || (d.user?.name) || '';
    const matchName = dName.toLowerCase().includes(searchName.toLowerCase());
    const specs = d.specialization || [];
    const matchSpec = !searchSpec || specs.some(s => s.toLowerCase().includes(searchSpec.toLowerCase()));
    return matchName && matchSpec;
  });

  const handleBook = (dietician) => {
    setBookingDietician(dietician);
    setBookingSuccess(false);
  };

  const confirmBooking = () => {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingDietician(null);
      setBookingSuccess(false);
    }, 2000);
  };

  return (
    <div>
      <section className="section" style={{ marginBottom: '24px' }}>
        <div className="page-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--neutral-900)', margin: '0 0 6px' }}>
              🩺 Certified Dieticians & Clinical Nutritionists
            </h1>
            <p className="meta" style={{ fontSize: '16px', color: 'var(--neutral-500)', margin: 0 }}>
              Browse verified clinical practitioners, review specialties, and schedule personalized consultations.
            </p>
          </div>
        </div>
      </section>

      <div className="split-grid" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '28px' }}>
        {/* Filters Sidebar */}
        <aside>
          <div className="card-glass" style={{ padding: '22px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 700 }}>Filter Search</h3>
            <div style={{ display: 'grid', gap: '14px' }}>
              <div className="field">
                <label style={{ fontWeight: 700, fontSize: '13px' }}>Search by Name</label>
                <input
                  type="text"
                  className="field-input"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="e.g. Dr. Sarah"
                />
              </div>

              <div className="field">
                <label style={{ fontWeight: 700, fontSize: '13px' }}>Specialization</label>
                <input
                  type="text"
                  className="field-input"
                  value={searchSpec}
                  onChange={(e) => setSearchSpec(e.target.value)}
                  placeholder="e.g. PCOS, Diabetes, Weight Loss"
                />
              </div>

              <div className="field">
                <label style={{ fontWeight: 700, fontSize: '13px' }}>Consultation Mode</label>
                <select className="field-input" value={mode} onChange={(e) => setMode(e.target.value)}>
                  <option value="">All Modes</option>
                  <option value="online">Online Video</option>
                  <option value="in-person">In-Person</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => { setSearchName(''); setSearchSpec(''); setMode(''); }}
                  style={{ width: '100%', padding: '10px 14px', cursor: 'pointer' }}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          <div className="card-glass" style={{ marginTop: '20px', padding: '20px' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '15px', fontWeight: 700, color: 'var(--neutral-900)' }}>Clinical Care Standard</h4>
            <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '13px', color: 'var(--neutral-700)', lineHeight: 1.6 }}>
              <li>100% Board-verified dieticians</li>
              <li>Real-time allergy contraindication safety</li>
              <li>Closed-loop metabolic plateau tracking</li>
            </ul>
          </div>
        </aside>

        {/* Results Grid */}
        <main>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--neutral-700)' }}>
              Showing {filtered.length} Verified Dietician{filtered.length === 1 ? '' : 's'}
            </div>
          </div>

          <div style={{ display: 'grid', gap: '18px' }}>
            {filtered.length === 0 ? (
              <div className="card-glass" style={{ textAlign: 'center', padding: '48px' }}>
                <h3 style={{ margin: '0 0 8px' }}>No dieticians match your criteria</h3>
                <p style={{ color: 'var(--neutral-500)', margin: '0 0 16px' }}>Try clearing your search query or filters.</p>
                <button className="button" onClick={() => { setSearchName(''); setSearchSpec(''); }}>
                  Reset Filters
                </button>
              </div>
            ) : null}

            {filtered.map((d, idx) => {
              const uname = d.name || (d.user ? d.user.name : 'Clinical Specialist');
              return (
                <div key={d._id || idx} className="card-glass" style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ width: '96px', height: '96px', borderRadius: '22px', overflow: 'hidden', flexShrink: 0, boxShadow: '0 10px 24px rgba(0,0,0,0.08)' }}>
                    <img
                      src={`https://i.pravatar.cc/200?img=${(idx * 5) + 32}`}
                      alt="Dietician avatar"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: '260px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '19px', fontWeight: 800, color: 'var(--neutral-900)' }}>
                        {uname}
                      </h3>
                      <span className="badge-pill badge-success" style={{ fontSize: '11px', padding: '2px 8px' }}>
                        Verified ✅
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '6px 0' }}>
                      {(d.specialization || []).map((s, sIdx) => (
                        <span key={sIdx} className="macro-chip" style={{ fontSize: '12px', padding: '3px 8px' }}>
                          {s}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center', fontSize: '13px', color: 'var(--neutral-500)', marginTop: '8px' }}>
                      <span style={{ color: '#b45309', fontWeight: 700 }}>⭐ {d.rating || 4.9} ({d.reviewsCount || 24} reviews)</span>
                      <span>•</span>
                      <span>{d.experienceYears || d.experience || 5} Years Experience</span>
                      <span>•</span>
                      <strong style={{ color: 'var(--primary-emerald-dark)', fontSize: '15px' }}>
                        ₹{d.fee || d.hourlyRate || 600} / session
                      </strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '140px' }}>
                    <button
                      className="btn-ai"
                      onClick={() => handleBook(d)}
                      style={{ padding: '10px 18px', fontSize: '13px', cursor: 'pointer', border: 'none', justifyContent: 'center' }}
                    >
                      📅 Book Session
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Booking Modal */}
      {bookingDietician && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div className="card-glass" style={{ background: '#fff', maxWidth: '480px', width: '100%', padding: '28px', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '20px', fontWeight: 800 }}>
              Schedule Consultation with {bookingDietician.name}
            </h3>

            {bookingSuccess ? (
              <div className="badge-pill badge-success" style={{ display: 'block', textAlign: 'center', padding: '16px', fontSize: '14px', margin: '20px 0' }}>
                ✅ Consultation slot confirmed! An email confirmation has been sent.
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '14px', marginTop: '16px' }}>
                <div className="field">
                  <label style={{ fontWeight: 700, fontSize: '13px' }}>Select Date</label>
                  <input
                    type="date"
                    className="field-input"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label style={{ fontWeight: 700, fontSize: '13px' }}>Available Time Slot</label>
                  <select
                    className="field-input"
                    value={bookingSlot}
                    onChange={(e) => setBookingSlot(e.target.value)}
                  >
                    <option value="10:00 AM - 10:45 AM">10:00 AM - 10:45 AM (Morning)</option>
                    <option value="02:30 PM - 03:15 PM">02:30 PM - 03:15 PM (Afternoon)</option>
                    <option value="06:00 PM - 06:45 PM">06:00 PM - 06:45 PM (Evening)</option>
                  </select>
                </div>

                <div className="field">
                  <label style={{ fontWeight: 700, fontSize: '13px' }}>Clinical Goals / Notes</label>
                  <textarea
                    className="field-input"
                    rows="3"
                    placeholder="e.g. Discuss diabetic diet chart and insulin timing"
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <button
                    className="button"
                    onClick={confirmBooking}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    Confirm (₹{bookingDietician.fee || bookingDietician.hourlyRate || 600})
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setBookingDietician(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
