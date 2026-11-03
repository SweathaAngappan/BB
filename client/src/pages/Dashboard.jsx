import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [aiMealText, setAiMealText] = useState('');
  const [aiMealType, setAiMealType] = useState('Lunch');
  const [swapModalMeal, setSwapModalMeal] = useState(null);

  // Dynamic user macros and meals state
  const [meals, setMeals] = useState([
    { id: 'm1', mealType: 'Breakfast', item: '2 Moong Dal Chilla with Mint Chutney', calories: 290, protein: 14, carbs: 36, status: 'eaten' },
    { id: 'm2', mealType: 'Lunch', item: 'Quinoa Bowl with Steamed Tofu & Spinach', calories: 480, protein: 26, carbs: 54, status: 'pending' },
    { id: 'm3', mealType: 'Morning Snack', item: 'Roasted Makhana with Green Tea', calories: 140, protein: 4, carbs: 22, status: 'pending' },
    { id: 'm4', mealType: 'Dinner', item: 'Palak Soup with 2 Millet Rotis & Tadka Dal', calories: 420, protein: 18, carbs: 58, status: 'pending' }
  ]);

  const [targets] = useState({
    calories: 1750,
    protein: 75,
    carbs: 210,
    fats: 45
  });

  const eatenMeals = meals.filter(m => m.status === 'eaten');
  const consumed = {
    calories: eatenMeals.reduce((acc, m) => acc + (m.calories || 0), 0),
    protein: eatenMeals.reduce((acc, m) => acc + (m.protein || 0), 0),
    carbs: eatenMeals.reduce((acc, m) => acc + (m.carbs || 0), 0),
    fats: 16
  };
  const remainingCalories = Math.max(0, targets.calories - consumed.calories);
  const adherenceScore = Math.round((eatenMeals.length / meals.length) * 100);

  const handleAiLog = (e) => {
    e.preventDefault();
    if (!aiMealText.trim()) return;

    // Simulate AI parsing calories and macros from natural language
    const estimatedCals = Math.floor(Math.random() * 250) + 250;
    const estimatedProtein = Math.floor(Math.random() * 15) + 10;
    const estimatedCarbs = Math.floor(Math.random() * 25) + 30;

    const newMeal = {
      id: 'm-' + Date.now(),
      mealType: aiMealType,
      item: aiMealText,
      calories: estimatedCals,
      protein: estimatedProtein,
      carbs: estimatedCarbs,
      status: 'eaten'
    };

    setMeals([newMeal, ...meals]);
    setAiMealText('');
  };

  const setAiPrompt = (prompt) => {
    setAiMealText(prompt);
  };

  const recordCompliance = (id, newStatus) => {
    setMeals(meals.map(m => m.id === id ? { ...m, status: newStatus } : m));
  };

  const handleSwap = (swappedItem, newCals) => {
    if (!swapModalMeal) return;
    setMeals(meals.map(m => m.id === swapModalMeal.id ? { ...m, item: swappedItem, calories: newCals } : m));
    setSwapModalMeal(null);
  };

  return (
    <div>
      {/* Welcome & Quick Action Header */}
      <section className="section" style={{ marginBottom: '20px' }}>
        <div className="page-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'var(--neutral-900)', margin: 0 }}>
              Hi, Sweatha 👋
            </h1>
            <p className="meta" style={{ fontSize: '15px', color: 'var(--neutral-500)', margin: '4px 0 0' }}>
              Tuesday's Health & Nutrition Dashboard
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link className="button" to="/diet-plan" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
              🥗 7-Day Plan
            </Link>
            <Link className="btn btn-secondary" to="/grocery-list" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
              🛒 Grocery List
            </Link>
          </div>
        </div>
      </section>

      {/* Feature 3: Clinical Adherence & Metabolic Status Ribbon */}
      <div
        className="card-glass"
        style={{
          marginBottom: '24px',
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          borderLeft: '6px solid #10b981'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="health-grade-pill grade-A">
            {adherenceScore}%
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <strong style={{ fontSize: '16px', color: 'var(--neutral-900)' }}>7-Day Adherence Index</strong>
              <span className="badge-pill badge-success">Optimal Zone 💚</span>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--neutral-700)' }}>
              Consistent caloric intake within clinical target. No metabolic plateau detected.
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: 'var(--neutral-500)', textTransform: 'uppercase', fontWeight: 700 }}>
            Remaining Today
          </div>
          <strong style={{ fontSize: '20px', color: 'var(--primary-emerald-dark)' }}>
            {remainingCalories} kcal
          </strong>
        </div>
      </div>

      {/* Feature 1: AI Natural Language Food Plate Logger */}
      <section className="section" style={{ marginBottom: '28px' }}>
        <div className="ai-logger-box" id="aiFoodLogger">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--neutral-900)', margin: '0 0 2px' }}>
                🎙️ AI Food Plate Logger
              </h2>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--neutral-500)' }}>
                Log meals in natural words. Auto-calculates calories, protein, carbs, and fats.
              </p>
            </div>
          </div>

          <form onSubmit={handleAiLog} style={{ marginTop: '14px' }}>
            <div className="ai-input-row" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="ai-input"
                placeholder="e.g. 2 rotis with 1 bowl dal tadka and cucumber salad"
                value={aiMealText}
                onChange={(e) => setAiMealText(e.target.value)}
                required
                style={{ flex: 1, minWidth: '240px' }}
              />
              <select
                className="field-input"
                value={aiMealType}
                onChange={(e) => setAiMealType(e.target.value)}
                style={{ width: '140px', borderRadius: '18px', border: '2px solid rgba(16,185,129,0.2)', fontWeight: 600 }}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Morning Snack">Snack</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
              </select>
              <button type="submit" className="btn-ai" style={{ border: 'none', cursor: 'pointer' }}>
                <span>✨ Parse & Log</span>
              </button>
            </div>
          </form>

          {/* Quick AI Prompt Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--neutral-500)', textTransform: 'uppercase' }}>
              Quick try:
            </span>
            <button
              type="button"
              className="btn-sm-action"
              style={{ background: '#fff', border: '1px solid #d1d5db', fontSize: '12px', padding: '4px 10px', cursor: 'pointer' }}
              onClick={() => setAiPrompt('2 rotis with 1 bowl dal tadka and cucumber salad')}
            >
              2 rotis + dal + salad
            </button>
            <button
              type="button"
              className="btn-sm-action"
              style={{ background: '#fff', border: '1px solid #d1d5db', fontSize: '12px', padding: '4px 10px', cursor: 'pointer' }}
              onClick={() => setAiPrompt('Greek yogurt bowl with 1 banana, chia seeds and almonds')}
            >
              Greek yogurt + almonds
            </button>
            <button
              type="button"
              className="btn-sm-action"
              style={{ background: '#fff', border: '1px solid #d1d5db', fontSize: '12px', padding: '4px 10px', cursor: 'pointer' }}
              onClick={() => setAiPrompt('Grilled chicken breast with 1 cup brown rice and broccoli')}
            >
              Grilled chicken + rice
            </button>
            <button
              type="button"
              className="btn-sm-action"
              style={{ background: '#fff', border: '1px solid #d1d5db', fontSize: '12px', padding: '4px 10px', cursor: 'pointer' }}
              onClick={() => setAiPrompt('Moong dal chilla with mint chutney and buttermilk')}
            >
              Moong dal chilla
            </button>
          </div>
        </div>
      </section>

      {/* Daily Macro Breakdown (2 Columns) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Macro Nutritional Budget */}
        <div className="card-glass" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>Macronutrient Budget</h3>
              <span className="meta" style={{ fontSize: '12px' }}>Prescribed Daily Limits</span>
            </div>
            <span className="badge-pill badge-info">{consumed.calories} / {targets.calories} kcal</span>
          </div>

          {/* Calories Bar */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
              <span>Calories</span>
              <span>{Math.round((consumed.calories / targets.calories) * 100)}%</span>
            </div>
            <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(100, Math.round((consumed.calories / targets.calories) * 100))}%`,
                  background: 'var(--primary-emerald)',
                  borderRadius: '9999px',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>

          {/* Protein Bar */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
              <span style={{ color: '#166534' }}>Protein: {consumed.protein}g / {targets.protein}g</span>
              <span>{Math.round((consumed.protein / targets.protein) * 100)}%</span>
            </div>
            <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(100, Math.round((consumed.protein / targets.protein) * 100))}%`,
                  background: '#10b981',
                  borderRadius: '9999px',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>

          {/* Carbs Bar */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
              <span style={{ color: '#b45309' }}>Carbs: {consumed.carbs}g / {targets.carbs}g</span>
              <span>{Math.round((consumed.carbs / targets.carbs) * 100)}%</span>
            </div>
            <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(100, Math.round((consumed.carbs / targets.carbs) * 100))}%`,
                  background: '#f59e0b',
                  borderRadius: '9999px',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>
        </div>

        {/* Metabolic Status & Hydration */}
        <div className="card-glass" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>Metabolic Vitality</h3>
              <span className="meta" style={{ fontSize: '12px' }}>Current Biometric Profile</span>
            </div>
            <span className="badge-pill badge-success">BMI: 22.8 Optimal</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: 700 }}>CURRENT WEIGHT</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--neutral-900)', marginTop: '2px' }}>67.5 kg</div>
              <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '2px' }}>↓ 1.2 kg this month</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: 'var(--neutral-500)', fontWeight: 700 }}>BASAL BMR</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>1,680 kcal</div>
              <div style={{ fontSize: '11px', color: 'var(--neutral-500)', marginTop: '2px' }}>Mifflin-St Jeor</div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
              <span>💧 Daily Hydration: 2.4L / 3.0L</span>
              <span>80%</span>
            </div>
            <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '80%', background: '#0284c7', borderRadius: '9999px' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Feature 3: Today's Scheduled Meals Checklist & 1-Click Swap */}
      <section className="section" style={{ marginBottom: '28px' }}>
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h2 className="section-title" style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>
              📅 Today's Meals (Tuesday)
            </h2>
          </div>
          <Link to="/diet-plan" className="btn btn-secondary" style={{ fontSize: '13px', padding: '6px 14px', textDecoration: 'none' }}>
            7-Day Calendar
          </Link>
        </div>

        <div style={{ display: 'grid', gap: '12px' }}>
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="meal-check-card"
              style={{
                background: meal.status === 'eaten' ? 'rgba(240, 253, 244, 0.7)' : '#fff',
                border: '1px solid rgba(16,185,129,0.15)',
                borderRadius: '18px',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'var(--accent-soft)',
                    color: 'var(--accent-700)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}
                >
                  {meal.mealType === 'Breakfast' ? '🍳' : meal.mealType === 'Lunch' ? '🥗' : meal.mealType === 'Dinner' ? '🍲' : '🍎'}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge-pill badge-info" style={{ fontSize: '11px', padding: '2px 8px' }}>{meal.mealType}</span>
                    <strong
                      style={{
                        fontSize: '15px',
                        color: 'var(--neutral-900)',
                        textDecoration: meal.status === 'eaten' ? 'line-through' : 'none'
                      }}
                    >
                      {meal.item}
                    </strong>
                  </div>
                  <div className="macro-group" style={{ marginTop: '4px', display: 'flex', gap: '6px' }}>
                    <span className="macro-chip calories" style={{ fontSize: '11px', padding: '2px 6px' }}>⚡ {meal.calories} kcal</span>
                    <span className="macro-chip protein" style={{ fontSize: '11px', padding: '2px 6px' }}>🥩 {meal.protein}g P</span>
                    <span className="macro-chip carbs" style={{ fontSize: '11px', padding: '2px 6px' }}>🌾 {meal.carbs}g C</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="meal-action-btns" style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-sm-action btn-eaten"
                  onClick={() => recordCompliance(meal.id, meal.status === 'eaten' ? 'pending' : 'eaten')}
                  style={{
                    background: meal.status === 'eaten' ? '#10b981' : '#f0fdf4',
                    color: meal.status === 'eaten' ? '#fff' : '#15803d',
                    border: '1px solid #86efac',
                    padding: '6px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 700
                  }}
                >
                  {meal.status === 'eaten' ? '✓ Logged' : '✅ Eaten'}
                </button>
                <button
                  type="button"
                  className="btn-sm-action btn-swap"
                  onClick={() => setSwapModalMeal(meal)}
                  style={{
                    background: '#fffbeb',
                    color: '#b45309',
                    border: '1px solid #fde68a',
                    padding: '6px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 700
                  }}
                >
                  🔄 Swap
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 1-Click Swap Modal */}
      {swapModalMeal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div className="card-glass" style={{ background: '#fff', maxWidth: '480px', width: '100%', padding: '28px', borderRadius: '24px' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '19px', fontWeight: 800 }}>
              🔄 Smart Meal Swapper
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--neutral-500)' }}>
              Pantry-friendly macro equivalents for <strong>{swapModalMeal.item}</strong> (Target: ~{swapModalMeal.calories} kcal)
            </p>

            <div style={{ display: 'grid', gap: '10px' }}>
              <div
                style={{ padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <strong style={{ fontSize: '14px', display: 'block' }}>Steamed Paneer Salad with Bell Peppers</strong>
                  <span style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>460 kcal • ±5% equivalence</span>
                </div>
                <button
                  className="btn-sm-action"
                  onClick={() => handleSwap('Steamed Paneer Salad with Bell Peppers', 460)}
                  style={{ background: 'var(--primary-emerald)', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
                >
                  Choose
                </button>
              </div>

              <div
                style={{ padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <strong style={{ fontSize: '14px', display: 'block' }}>Chickpea Sundal & Boiled Sweet Corn</strong>
                  <span style={{ fontSize: '12px', color: 'var(--neutral-500)' }}>490 kcal • High fiber</span>
                </div>
                <button
                  className="btn-sm-action"
                  onClick={() => handleSwap('Chickpea Sundal & Boiled Sweet Corn', 490)}
                  style={{ background: 'var(--primary-emerald)', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
                >
                  Choose
                </button>
              </div>
            </div>

            <button
              className="btn btn-secondary"
              onClick={() => setSwapModalMeal(null)}
              style={{ marginTop: '18px', width: '100%', padding: '10px', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
