/**
 * Nutrition AI & Natural Language Macro Parser Engine
 * Handles natural language food breakdown, macro calculation,
 * clinical health grading, and actionable nutritional tips.
 */

// Comprehensive database of common foods with per-serving / per-unit nutritional values
const FOOD_DATABASE = {
  // Breads & Grains
  'roti': { calories: 85, protein: 3, carbs: 18, fats: 0.5, fiber: 2.5, unit: 'piece', category: 'grains', tags: ['vegetarian', 'vegan'] },
  'chapati': { calories: 85, protein: 3, carbs: 18, fats: 0.5, fiber: 2.5, unit: 'piece', category: 'grains', tags: ['vegetarian', 'vegan'] },
  'paratha': { calories: 220, protein: 4.5, carbs: 28, fats: 10, fiber: 2.5, unit: 'piece', category: 'grains', tags: ['vegetarian'] },
  'brown bread': { calories: 75, protein: 3.5, carbs: 14, fats: 1, fiber: 2, unit: 'slice', category: 'grains', tags: ['vegetarian', 'vegan'] },
  'white bread': { calories: 70, protein: 2, carbs: 14, fats: 0.8, fiber: 0.6, unit: 'slice', category: 'grains', tags: ['vegetarian', 'vegan'] },
  'rice': { calories: 130, protein: 2.7, carbs: 28, fats: 0.3, fiber: 0.4, unit: 'cup', category: 'grains', tags: ['gluten-free', 'vegan'] },
  'brown rice': { calories: 120, protein: 3, carbs: 25, fats: 1, fiber: 2, unit: 'cup', category: 'grains', tags: ['gluten-free', 'vegan'] },
  'oats': { calories: 150, protein: 5, carbs: 27, fats: 2.5, fiber: 4, unit: 'bowl', category: 'grains', tags: ['high-fiber', 'vegan'] },
  'oatmeal': { calories: 160, protein: 6, carbs: 28, fats: 2.8, fiber: 4.2, unit: 'bowl', category: 'grains', tags: ['high-fiber', 'vegan'] },
  'quinoa': { calories: 120, protein: 4.4, carbs: 21, fats: 1.9, fiber: 2.8, unit: 'cup', category: 'grains', tags: ['high-protein', 'gluten-free'] },
  'dosa': { calories: 160, protein: 4, carbs: 29, fats: 3.5, fiber: 1.5, unit: 'piece', category: 'grains', tags: ['vegetarian'] },
  'idli': { calories: 60, protein: 2, carbs: 12, fats: 0.2, fiber: 0.8, unit: 'piece', category: 'grains', tags: ['low-fat', 'vegan', 'gluten-free'] },
  'upma': { calories: 190, protein: 4, carbs: 32, fats: 5, fiber: 2, unit: 'bowl', category: 'grains', tags: ['vegetarian'] },
  'poha': { calories: 180, protein: 3.5, carbs: 34, fats: 4, fiber: 1.8, unit: 'bowl', category: 'grains', tags: ['gluten-free', 'vegan'] },

  // Proteins & Legumes
  'dal': { calories: 150, protein: 9, carbs: 22, fats: 3, fiber: 6, unit: 'bowl', category: 'proteins', tags: ['high-protein', 'vegetarian', 'vegan'] },
  'dal tadka': { calories: 170, protein: 8.5, carbs: 22, fats: 5.5, fiber: 5.5, unit: 'bowl', category: 'proteins', tags: ['vegetarian'] },
  'sambar': { calories: 110, protein: 5, carbs: 18, fats: 2.5, fiber: 4, unit: 'bowl', category: 'proteins', tags: ['vegetarian', 'vegan'] },
  'chana': { calories: 210, protein: 11, carbs: 35, fats: 3.5, fiber: 10, unit: 'bowl', category: 'proteins', tags: ['high-protein', 'high-fiber'] },
  'chole': { calories: 240, protein: 10, carbs: 36, fats: 7, fiber: 9, unit: 'bowl', category: 'proteins', tags: ['vegetarian', 'vegan'] },
  'rajma': { calories: 230, protein: 12, carbs: 38, fats: 3, fiber: 11, unit: 'bowl', category: 'proteins', tags: ['high-protein', 'high-fiber'] },
  'paneer': { calories: 260, protein: 18, carbs: 4, fats: 20, fiber: 0, unit: '100g', category: 'proteins', tags: ['high-protein', 'dairy', 'vegetarian'] },
  'paneer bhurji': { calories: 220, protein: 15, carbs: 6, fats: 15, fiber: 1.5, unit: 'bowl', category: 'proteins', tags: ['high-protein', 'dairy'] },
  'paneer curry': { calories: 280, protein: 14, carbs: 12, fats: 20, fiber: 2, unit: 'bowl', category: 'proteins', tags: ['high-protein', 'dairy'] },
  'egg': { calories: 75, protein: 6.3, carbs: 0.6, fats: 5, fiber: 0, unit: 'piece', category: 'proteins', tags: ['high-protein', 'eggetarian'] },
  'boiled egg': { calories: 75, protein: 6.3, carbs: 0.6, fats: 5, fiber: 0, unit: 'piece', category: 'proteins', tags: ['high-protein', 'eggetarian'] },
  'scrambled egg': { calories: 100, protein: 6.5, carbs: 1, fats: 8, fiber: 0, unit: 'piece', category: 'proteins', tags: ['high-protein'] },
  'omelette': { calories: 160, protein: 12, carbs: 2, fats: 12, fiber: 0.5, unit: 'piece', category: 'proteins', tags: ['high-protein'] },
  'chicken breast': { calories: 165, protein: 31, carbs: 0, fats: 3.6, fiber: 0, unit: '100g', category: 'proteins', tags: ['high-protein', 'lean-meat'] },
  'grilled chicken': { calories: 190, protein: 29, carbs: 2, fats: 7, fiber: 0.5, unit: 'serving', category: 'proteins', tags: ['high-protein'] },
  'chicken curry': { calories: 260, protein: 24, carbs: 8, fats: 15, fiber: 1.5, unit: 'bowl', category: 'proteins', tags: ['high-protein'] },
  'fish': { calories: 140, protein: 22, carbs: 0, fats: 5, fiber: 0, unit: '100g', category: 'proteins', tags: ['high-protein', 'omega-3'] },
  'tofu': { calories: 110, protein: 12, carbs: 2.5, fats: 6, fiber: 1.5, unit: '100g', category: 'proteins', tags: ['high-protein', 'vegan', 'soy'] },
  'soya chunks': { calories: 170, protein: 26, carbs: 16, fats: 0.5, fiber: 6, unit: 'bowl', category: 'proteins', tags: ['high-protein', 'vegan', 'soy'] },

  // Dairy & Alternatives
  'milk': { calories: 120, protein: 8, carbs: 12, fats: 5, fiber: 0, unit: 'glass', category: 'dairy', tags: ['dairy', 'vegetarian'] },
  'skim milk': { calories: 85, protein: 8.5, carbs: 12, fats: 0.5, fiber: 0, unit: 'glass', category: 'dairy', tags: ['dairy', 'low-fat'] },
  'curd': { calories: 98, protein: 6, carbs: 7, fats: 4.5, fiber: 0, unit: 'bowl', category: 'dairy', tags: ['probiotic', 'dairy'] },
  'greek yogurt': { calories: 130, protein: 15, carbs: 6, fats: 4, fiber: 0, unit: 'cup', category: 'dairy', tags: ['high-protein', 'probiotic'] },
  'lassi': { calories: 160, protein: 5, carbs: 24, fats: 5, fiber: 0, unit: 'glass', category: 'dairy', tags: ['dairy'] },
  'buttermilk': { calories: 45, protein: 3, carbs: 5, fats: 1.5, fiber: 0, unit: 'glass', category: 'dairy', tags: ['probiotic', 'low-calorie'] },
  'cheese': { calories: 115, protein: 7, carbs: 0.5, fats: 9.5, fiber: 0, unit: 'slice', category: 'dairy', tags: ['dairy'] },

  // Vegetables & Salads
  'salad': { calories: 50, protein: 1.5, carbs: 9, fats: 0.5, fiber: 3, unit: 'bowl', category: 'vegetables', tags: ['low-calorie', 'high-fiber', 'vegan'] },
  'cucumber': { calories: 20, protein: 0.8, carbs: 4, fats: 0.2, fiber: 1.5, unit: 'piece', category: 'vegetables', tags: ['low-calorie', 'hydration', 'vegan'] },
  'spinach': { calories: 35, protein: 3, carbs: 4.5, fats: 0.5, fiber: 2.8, unit: 'cup', category: 'vegetables', tags: ['high-iron', 'vegan'] },
  'broccoli': { calories: 55, protein: 3.7, carbs: 11, fats: 0.6, fiber: 3.8, unit: 'cup', category: 'vegetables', tags: ['superfood', 'high-fiber'] },
  'sabzi': { calories: 140, protein: 3, carbs: 16, fats: 7, fiber: 4, unit: 'bowl', category: 'vegetables', tags: ['vegetarian'] },
  'mixed vegetables': { calories: 120, protein: 3.5, carbs: 18, fats: 4, fiber: 5, unit: 'bowl', category: 'vegetables', tags: ['vegan'] },

  // Fruits & Nuts
  'apple': { calories: 95, protein: 0.5, carbs: 25, fats: 0.3, fiber: 4.4, unit: 'piece', category: 'fruits', tags: ['vegan', 'antioxidants'] },
  'banana': { calories: 105, protein: 1.3, carbs: 27, fats: 0.3, fiber: 3.1, unit: 'piece', category: 'fruits', tags: ['potassium', 'vegan'] },
  'orange': { calories: 65, protein: 1.2, carbs: 15, fats: 0.2, fiber: 3, unit: 'piece', category: 'fruits', tags: ['vitamin-c', 'vegan'] },
  'papaya': { calories: 60, protein: 1, carbs: 15, fats: 0.4, fiber: 2.8, unit: 'bowl', category: 'fruits', tags: ['digestive-enzymes', 'vegan'] },
  'almonds': { calories: 160, protein: 6, carbs: 6, fats: 14, fiber: 3.5, unit: 'handful', category: 'nuts', tags: ['healthy-fats', 'high-protein'] },
  'walnuts': { calories: 185, protein: 4.3, carbs: 3.9, fats: 18.5, fiber: 1.9, unit: 'handful', category: 'nuts', tags: ['omega-3', 'brain-food'] },
  'peanut butter': { calories: 95, protein: 4, carbs: 3.5, fats: 8, fiber: 1, unit: 'tablespoon', category: 'nuts', tags: ['high-protein', 'nuts'] },
  'chia seeds': { calories: 70, protein: 2.5, carbs: 6, fats: 4.5, fiber: 5, unit: 'tablespoon', category: 'seeds', tags: ['high-fiber', 'omega-3'] },

  // Snacks & Beverages
  'green tea': { calories: 2, protein: 0, carbs: 0.5, fats: 0, fiber: 0, unit: 'cup', category: 'beverages', tags: ['antioxidants', 'zero-calorie'] },
  'coffee': { calories: 5, protein: 0.3, carbs: 0.8, fats: 0.1, fiber: 0, unit: 'cup', category: 'beverages', tags: ['beverages'] },
  'tea': { calories: 45, protein: 1.5, carbs: 6, fats: 1.8, fiber: 0, unit: 'cup', category: 'beverages', tags: ['beverages'] },
  'samosa': { calories: 260, protein: 3.5, carbs: 32, fats: 14, fiber: 2, unit: 'piece', category: 'snacks', tags: ['fried', 'cheat-meal'] },
  'cookie': { calories: 130, protein: 1.5, carbs: 19, fats: 6, fiber: 0.5, unit: 'piece', category: 'snacks', tags: ['sugar'] }
};

// Word numbers to integers
const NUMBER_WORDS = {
  'one': 1, 'a': 1, 'an': 1, 'single': 1,
  'two': 2, 'couple': 2, 'double': 2,
  'three': 3, 'four': 4, 'five': 5,
  'six': 6, 'seven': 7, 'eight': 8, 'half': 0.5
};

/**
 * Parses natural language meal input and calculates nutrition metrics
 * @param {string} text - e.g. "2 rotis with 1 bowl dal tadka and cucumber salad"
 * @returns {object} Nutritional analysis
 */
function analyzeNaturalLanguageMeal(text) {
  if (!text || typeof text !== 'string') {
    return {
      success: false,
      error: 'Please enter what you ate (e.g. "2 chapatis, 1 bowl dal, cucumber salad")'
    };
  }

  const cleanText = text.toLowerCase().replace(/[,+&]/g, ' and ');
  const tokens = cleanText.split(/\band\b|\bwith\b|\bplus\b/).map(s => s.trim()).filter(Boolean);

  const matchedItems = [];
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFats = 0;
  let totalFiber = 0;

  // Sorted food keys by length descending to match compound words first ("paneer bhurji" before "paneer")
  const foodKeys = Object.keys(FOOD_DATABASE).sort((a, b) => b.length - a.length);

  tokens.forEach(phrase => {
    let matchedFoodKey = null;
    let matchedDbItem = null;

    for (const key of foodKeys) {
      const regex = new RegExp(`\\b${key}s?\\b`, 'i');
      if (regex.test(phrase)) {
        matchedFoodKey = key;
        matchedDbItem = FOOD_DATABASE[key];
        break;
      }
    }

    if (matchedFoodKey && matchedDbItem) {
      // Determine quantity / portion multiplier
      let quantity = 1;
      const numberMatch = phrase.match(/(\d+(\.\d+)?)/);
      if (numberMatch) {
        quantity = parseFloat(numberMatch[1]);
      } else {
        for (const [word, val] of Object.entries(NUMBER_WORDS)) {
          const wordRegex = new RegExp(`\\b${word}\\b`, 'i');
          if (wordRegex.test(phrase)) {
            quantity = val;
            break;
          }
        }
      }

      // If user specified 200g or 250ml
      const gramMatch = phrase.match(/(\d+)\s*(g|grams|ml)/i);
      if (gramMatch && matchedDbItem.unit === '100g') {
        quantity = parseFloat(gramMatch[1]) / 100;
      }

      const itemCalories = Math.round(matchedDbItem.calories * quantity);
      const itemProtein = parseFloat((matchedDbItem.protein * quantity).toFixed(1));
      const itemCarbs = parseFloat((matchedDbItem.carbs * quantity).toFixed(1));
      const itemFats = parseFloat((matchedDbItem.fats * quantity).toFixed(1));
      const itemFiber = parseFloat((matchedDbItem.fiber * quantity).toFixed(1));

      totalCalories += itemCalories;
      totalProtein += itemProtein;
      totalCarbs += itemCarbs;
      totalFats += itemFats;
      totalFiber += itemFiber;

      matchedItems.push({
        name: matchedFoodKey.charAt(0).toUpperCase() + matchedFoodKey.slice(1),
        quantity: `${quantity} ${matchedDbItem.unit}${quantity > 1 ? 's' : ''}`,
        calories: itemCalories,
        protein: itemProtein,
        carbs: itemCarbs,
        fats: itemFats,
        fiber: itemFiber,
        category: matchedDbItem.category,
        tags: matchedDbItem.tags
      });
    }
  });

  // Fallback if no specific food match in dictionary
  if (matchedItems.length === 0) {
    // Estimator based on generic meal heuristic
    totalCalories = 320;
    totalProtein = 12;
    totalCarbs = 42;
    totalFats = 11;
    totalFiber = 3.5;
    matchedItems.push({
      name: text.length > 30 ? text.substring(0, 30) + '...' : text,
      quantity: '1 standard meal portion',
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fats: totalFats,
      fiber: totalFiber,
      category: 'mixed',
      tags: ['custom-meal']
    });
  }

  // Calculate Quality Health Grade (A+, A, B, C, D)
  // Higher protein & fiber, balanced carbs = A/A+
  // Heavy saturated fat, refined carbs, very low protein = C/D
  const proteinRatio = (totalProtein * 4) / Math.max(totalCalories, 1);
  const fiberGrams = totalFiber;
  let healthGrade = 'B';
  let healthTip = '';

  if (proteinRatio >= 0.25 && fiberGrams >= 5) {
    healthGrade = 'A+';
    healthTip = 'Outstanding nutrient balance! High protein promotes satiety and muscle preservation, with excellent fiber content.';
  } else if (proteinRatio >= 0.18 || fiberGrams >= 4) {
    healthGrade = 'A';
    healthTip = 'Great nutritional profile! Good protein and micronutrient balance for steady energy.';
  } else if (proteinRatio >= 0.12) {
    healthGrade = 'B';
    healthTip = 'Solid everyday meal. Consider adding a side of raw greens or a boiled egg/sprouts to boost protein & fiber.';
  } else {
    healthGrade = 'C';
    healthTip = 'This meal is relatively high in carbohydrates or fats with limited protein. Try pairing with curd, dal, or paneer next time!';
  }

  return {
    success: true,
    rawInput: text,
    items: matchedItems,
    totals: {
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein),
      carbs: Math.round(totalCarbs),
      fats: Math.round(totalFats),
      fiber: Math.round(totalFiber)
    },
    healthGrade,
    healthTip
  };
}

module.exports = {
  FOOD_DATABASE,
  analyzeNaturalLanguageMeal
};
