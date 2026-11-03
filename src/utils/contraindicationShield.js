/**
 * Dietary Contraindication & Allergy Safety Shield
 * Scans meal items against user medical conditions and allergies,
 * generating clinical alerts for dieticians and patients.
 */

const ALLERGY_TRIGGERS = {
  'lactose': {
    label: 'Lactose / Dairy',
    regex: /\b(milk|paneer|curd|yogurt|cheese|butter|ghee|cream|lassi|whey)\b/i,
    severity: 'High',
    advice: 'Replace with plant-based alternatives like almond milk, soy milk, or tofu.'
  },
  'peanuts': {
    label: 'Peanut',
    regex: /\b(peanut|peanuts|groundnut|peanut butter)\b/i,
    severity: 'Severe',
    advice: 'Replace with tree nuts (almonds, walnuts) or sunflower seed butter.'
  },
  'gluten': {
    label: 'Gluten / Wheat',
    regex: /\b(wheat|roti|chapati|bread|maida|atta|paratha|naan|pasta|sewai|sooji|semolina)\b/i,
    severity: 'High',
    advice: 'Substitute with gluten-free grains like brown rice, quinoa, millet (jowar/bajra), or oats.'
  },
  'eggs': {
    label: 'Egg',
    regex: /\b(egg|eggs|omelette|scrambled|boiled egg|mayonnaise)\b/i,
    severity: 'High',
    advice: 'Substitute with paneer, tofu, sprouts, or moong dal chilla for high protein.'
  },
  'soy': {
    label: 'Soy',
    regex: /\b(soy|soya|tofu|edamame|soy milk|soy sauce)\b/i,
    severity: 'Moderate',
    advice: 'Replace with lentils, chickpeas, or dairy proteins.'
  },
  'shellfish': {
    label: 'Shellfish / Seafood',
    regex: /\b(prawn|shrimp|crab|lobster|shellfish)\b/i,
    severity: 'Severe',
    advice: 'Avoid all marine crustaceans. Substitute with white fish or plant proteins.'
  }
};

const CONDITION_TRIGGERS = {
  'diabetes': {
    label: 'Diabetes (Type 1 & 2)',
    regex: /\b(sugar|sweet|jaggery|honey|soda|syrup|white bread|juice|candy|pastry|dessert)\b/i,
    severity: 'High',
    advice: 'High Glycemic Index risk. Prioritize complex carbs, high-fiber legumes, and unrefined grains.'
  },
  'hypertension': {
    label: 'Hypertension (High BP)',
    regex: /\b(pickle|papad|processed cheese|salted nuts|chips|processed meat|soya sauce)\b/i,
    severity: 'Moderate',
    advice: 'High Sodium warning. Limit sodium to < 2000mg/day. Emphasize potassium-rich foods (banana, spinach).'
  },
  'cholesterol': {
    label: 'Hyperlipidemia / High Cholesterol',
    regex: /\b(fried|samosa|deep-fried|butter|pakora|mutton|processed meat|palm oil)\b/i,
    severity: 'High',
    advice: 'Saturated and trans fat warning. Prioritize MUFA/PUFA sources (olive oil, walnuts, chia seeds).'
  },
  'pcos': {
    label: 'PCOS / PCOD',
    regex: /\b(refined flour|maida|sugar|fried|sweet|pastry)\b/i,
    severity: 'Moderate',
    advice: 'Insulin resistance trigger. Favor low-GI whole foods, anti-inflammatory greens, and lean proteins.'
  }
};

/**
 * Checks a list of meals against user allergies and health conditions
 * @param {Array} meals - [{ item, day, mealType }]
 * @param {Array} userAllergies - ['peanuts', 'lactose', ...]
 * @param {Array} userConditions - ['diabetes', 'hypertension', ...]
 * @returns {Array} Array of clinical contraindication warnings
 */
function checkMealContraindications(meals, userAllergies = [], userConditions = []) {
  if (!meals || !Array.isArray(meals)) return [];

  const warnings = [];
  const normalizedAllergies = (userAllergies || []).map(a => a.toLowerCase().trim());
  const normalizedConditions = (userConditions || []).map(c => c.toLowerCase().trim());

  meals.forEach(meal => {
    const itemText = (meal.item || '').toLowerCase();

    // Check allergies
    normalizedAllergies.forEach(allergyKey => {
      const trigger = ALLERGY_TRIGGERS[allergyKey];
      if (trigger && trigger.regex.test(itemText)) {
        warnings.push({
          type: 'allergy',
          severity: trigger.severity,
          title: `Allergy Conflict: ${trigger.label}`,
          mealDay: meal.day || 'Scheduled Meal',
          mealType: meal.mealType || '',
          item: meal.item,
          message: `Item "${meal.item}" contains or triggers ${trigger.label}, which is recorded as an active patient allergy.`,
          advice: trigger.advice
        });
      }
    });

    // Check conditions
    normalizedConditions.forEach(condKey => {
      const trigger = CONDITION_TRIGGERS[condKey];
      if (trigger && trigger.regex.test(itemText)) {
        warnings.push({
          type: 'condition',
          severity: trigger.severity,
          title: `Clinical Flag: ${trigger.label}`,
          mealDay: meal.day || 'Scheduled Meal',
          mealType: meal.mealType || '',
          item: meal.item,
          message: `Item "${meal.item}" is contraindicated for ${trigger.label}.`,
          advice: trigger.advice
        });
      }
    });
  });

  return warnings;
}

module.exports = {
  ALLERGY_TRIGGERS,
  CONDITION_TRIGGERS,
  checkMealContraindications
};
