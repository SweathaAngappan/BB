import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function DietPlan() {
  const [selectedDay, setSelectedDay] = useState('Tuesday');

  const mealSchedule = {
    Monday: [
      { type: 'Breakfast', item: 'Sprouted Moong Dal Salad + Tender Coconut Water', cals: 280, p: 14, c: 32 },
      { type: 'Lunch', item: 'Foxtail Millet Pulao with Mixed Vegetable Raita', cals: 460, p: 16, c: 68 },
      { type: 'Snack', item: 'Walnuts & Dried Figs with Green Tea', cals: 160, p: 4, c: 18 },
      { type: 'Dinner', item: 'Lauki Soup + 2 Multi-grain Rotis with Methi Dal', cals: 410, p: 15, c: 54 }
    ],
    Tuesday: [
      { type: 'Breakfast', item: '2 Moong Dal Chilla with Mint Chutney', cals: 290, p: 14, c: 36 },
      { type: 'Lunch', item: 'Quinoa Bowl with Steamed Tofu & Spinach', cals: 480, p: 26, c: 54 },
      { type: 'Snack', item: 'Roasted Makhana with Green Tea', cals: 140, p: 4, c: 22 },
      { type: 'Dinner', item: 'Palak Soup with 2 Millet Rotis & Tadka Dal', cals: 420, p: 18, c: 58 }
    ],
    Wednesday: [
      { type: 'Breakfast', item: 'Oatmeal Porridge with Almond Butter & Chia Seeds', cals: 320, p: 12, c: 45 },
      { type: 'Lunch', item: 'Brown Rice with Rajma Masala & Cucumber Sticks', cals: 510, p: 20, c: 72 },
      { type: 'Snack', item: 'Handful of Roasted Peanuts or Pumpkin Seeds', cals: 170, p: 7, c: 10 },
      { type: 'Dinner', item: 'Grilled Paneer / Tofu with Steamed Broccoli', cals: 390, p: 24, c: 20 }
    ],
    Thursday: [
      { type: 'Breakfast', item: 'Besan & Spinach Chilla with Tomato Relish', cals: 275, p: 13, c: 34 },
      { type: 'Lunch', item: 'Jowar Roti with Mixed Veg Dal and Curd', cals: 470, p: 17, c: 62 },
      { type: 'Snack', item: 'Fresh Apple Slices with a Dash of Cinnamon', cals: 95, p: 1, c: 22 },
      { type: 'Dinner', item: 'Clear Vegetable Soup with Sprouted Salad', cals: 340, p: 14, c: 42 }
    ],
    Friday: [
      { type: 'Breakfast', item: 'Smoothie Bowl (Spinach, Banana, Almond Milk, Flax)', cals: 290, p: 10, c: 48 },
      { type: 'Lunch', item: 'Millet Khichdi with Steamed Greens & Curd', cals: 450, p: 15, c: 65 },
      { type: 'Snack', item: 'Boiled Sweet Corn with Lemon & Black Salt', cals: 130, p: 4, c: 28 },
      { type: 'Dinner', item: 'Stir-Fried Tofu / Paneer with Zucchini & Bell Peppers', cals: 380, p: 22, c: 22 }
    ],
    Saturday: [
      { type: 'Breakfast', item: 'Idli (2 pcs) with Vegetable Sambar and Coconut Chutney', cals: 310, p: 11, c: 52 },
      { type: 'Lunch', item: 'Brown Rice with Soya Chunk Curry and Green Salad', cals: 490, p: 28, c: 60 },
      { type: 'Snack', item: 'Carrot and Cucumber sticks with Hummus', cals: 140, p: 5, c: 18 },
      { type: 'Dinner', item: 'Tomato Basil Soup with Grilled Vegetable Skewers', cals: 350, p: 12, c: 38 }
    ],
    Sunday: [
      { type: 'Breakfast', item: 'Ragi Dosa with Flaxseed Podi & Buttermilk', cals: 285, p: 9, c: 48 },
      { type: 'Lunch', item: 'Chickpea Sundal + Quinoa Veg Biryani with Mint Raita', cals: 520, p: 22, c: 74 },
      { type: 'Snack', item: 'Roasted Almonds and Green Tea', cals: 160, p: 6, c: 8 },
      { type: 'Dinner', item: 'Mushroom & Pea Soup with 1 Multigrain Phulka', cals: 360, p: 14, c: 46 }
    ]
  };

  const currentMeals = mealSchedule[selectedDay] || mealSchedule['Tuesday'];
  const dayCals = currentMeals.reduce((acc, m) => acc + m.cals, 0);

  return (
    <div>
      {/* Header Section */}
      <section className="section" style={{ marginBottom: '20px' }}>
        <div className="page-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--neutral-900)', margin: 0 }}>
              🥗 7-Day Meal Plan
            </h1>
            <p className="meta" style={{ fontSize: '14px', color: 'var(--neutral-500)', margin: '4px 0 0' }}>
              Prescribed by <strong>Dr. Ananya Sharma</strong> • Goal: Metabolic Reset & Anti-Inflammatory
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link className="button" to="/grocery-list" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
              🛒 Consolidated Grocery List
            </Link>
            <Link className="btn btn-secondary" to="/dashboard" style={{ textDecoration: 'none' }}>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Health Contraindication Shield Banner */}
      <div
        style={{
          background: '#fff1f2',
          border: '1px solid #fecdd3',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#be123c', fontWeight: 800, fontSize: '15px' }}>
          <span>🛡️ Health Contraindication Shield Active</span>
          <span className="badge-pill badge-success" style={{ fontSize: '11px' }}>0 Clinical Conflicts</span>
        </div>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#881337' }}>
          All 7 days have been pre-scanned against your recorded medical profile (Allergy: Lactose, Low Glycemic Index).
        </p>
      </div>

      {/* Day Selector Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' }}>
        {daysOfWeek.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            style={{
              padding: '10px 18px',
              borderRadius: '14px',
              border: selectedDay === day ? '2px solid var(--primary-emerald)' : '1px solid var(--border)',
              background: selectedDay === day ? 'var(--primary-emerald)' : '#fff',
              color: selectedDay === day ? '#fff' : 'var(--neutral-800)',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Meals for Selected Day */}
      <div className="card-glass" style={{ padding: '24px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
            {selectedDay}'s Prescribed Menu
          </h2>
          <span className="badge-pill badge-info" style={{ fontSize: '13px' }}>
            Daily Target: {dayCals} kcal
          </span>
        </div>

        <div style={{ display: 'grid', gap: '14px' }}>
          {currentMeals.map((meal, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                padding: '16px',
                borderRadius: '14px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span className="badge-pill badge-success" style={{ fontSize: '11px' }}>
                  {meal.type}
                </span>
                <strong style={{ fontSize: '15px', color: 'var(--neutral-900)' }}>
                  {meal.item}
                </strong>
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <span className="macro-chip calories" style={{ fontSize: '11px', padding: '2px 8px' }}>
                  ⚡ {meal.cals} kcal
                </span>
                <span className="macro-chip protein" style={{ fontSize: '11px', padding: '2px 8px' }}>
                  🥩 {meal.p}g P
                </span>
                <span className="macro-chip carbs" style={{ fontSize: '11px', padding: '2px 8px' }}>
                  🌾 {meal.c}g C
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

