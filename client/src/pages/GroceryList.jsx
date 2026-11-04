import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function GroceryList() {
  const [aisles, setAisles] = useState({
    "Fresh Produce (Vegetables & Fruits)": [
      { name: "Fresh Spinach / Palak", qty: "2 bunches", checked: false },
      { name: "Cucumbers", qty: "4 pcs", checked: true },
      { name: "Tomatoes & Bell Peppers", qty: "500g", checked: false },
      { name: "Fresh Mint & Coriander", qty: "1 bunch", checked: true }
    ],
    "Grains & Millets": [
      { name: "Organic Quinoa", qty: "500g", checked: false },
      { name: "Foxtail Millet Grain", qty: "1 kg", checked: false },
      { name: "Yellow Moong Dal", qty: "500g", checked: true },
      { name: "Rolled Oats (Gluten-Free)", qty: "400g", checked: false }
    ],
    "Dairy & Plant Proteins": [
      { name: "Extra Firm Tofu / Paneer", qty: "400g", checked: false },
      { name: "Unsweetened Almond Milk", qty: "1 Liter", checked: false },
      { name: "Greek Yogurt / Curd", qty: "500g", checked: true }
    ],
    "Healthy Fats & Pantry": [
      { name: "Roasted Makhana (Fox Nuts)", qty: "250g", checked: true },
      { name: "Chia Seeds & Flaxseeds", qty: "150g", checked: false },
      { name: "Cold Pressed Olive Oil", qty: "500ml", checked: false }
    ]
  });

  const toggleItem = (aisleName, idx) => {
    setAisles(prev => {
      const updatedList = [...prev[aisleName]];
      updatedList[idx] = { ...updatedList[idx], checked: !updatedList[idx].checked };
      return { ...prev, [aisleName]: updatedList };
    });
  };

  const totalItems = Object.values(aisles).flat().length;
  const checkedItems = Object.values(aisles).flat().filter(i => i.checked).length;
  const progressPercent = Math.round((checkedItems / totalItems) * 100);

  return (
    <div>
      {/* Header Section */}
      <section className="section" style={{ marginBottom: '20px' }}>
        <div className="page-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--neutral-900)', margin: 0 }}>
                🛒 7-Day Supermarket Grocery List
              </h1>
              <span className="badge-pill badge-success">{totalItems} Unique Items</span>
            </div>
            <p className="meta" style={{ fontSize: '14px', color: 'var(--neutral-500)', margin: '4px 0 0' }}>
              Aisle-categorized ingredients from your weekly meal plan
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => window.print()}
              style={{ fontSize: '13px', padding: '8px 14px', cursor: 'pointer' }}
            >
              🖨️ Print / Save PDF
            </button>
            <Link className="button" to="/diet-plan" style={{ fontSize: '13px', padding: '8px 14px', textDecoration: 'none' }}>
              🥗 Back to Meal Plan
            </Link>
          </div>
        </div>
      </section>

      {/* Summary Banner */}
      <div
        className="card-glass"
        style={{
          marginBottom: '24px',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ fontSize: '14px' }}>
          <strong style={{ color: 'var(--neutral-900)' }}>Prescribed by:</strong> Dr. Ananya Sharma
          <span style={{ margin: '0 8px', color: 'var(--neutral-300)' }}>|</span>
          <strong style={{ color: 'var(--neutral-900)' }}>Goal:</strong> Metabolic Reset & Anti-Inflammatory
        </div>
        <div style={{ fontSize: '13px', color: 'var(--primary-emerald-dark)', fontWeight: 700 }}>
          {checkedItems} of {totalItems} items gathered ({progressPercent}%)
        </div>
      </div>

      {/* Supermarket Aisles Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {Object.keys(aisles).map((aisleName) => (
          <div key={aisleName} className="card-glass" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 14px', color: 'var(--neutral-900)', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
              📦 {aisleName}
            </h3>

            <div style={{ display: 'grid', gap: '10px' }}>
              {aisles[aisleName].map((item, idx) => (
                <label
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    color: item.checked ? 'var(--muted)' : 'var(--neutral-900)',
                    textDecoration: item.checked ? 'line-through' : 'none'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItem(aisleName, idx)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary-emerald)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span>{item.name}</span>
                    <span className="macro-chip" style={{ fontSize: '11px', padding: '2px 6px' }}>{item.qty}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

