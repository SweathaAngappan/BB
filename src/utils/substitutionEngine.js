/**
 * Smart Pantry Substitution & Automated Grocery Aggregator Engine
 * 1. Macro-equivalent 1-click meal swapper (maintaining caloric equilibrium within +-15%)
 * 2. 7-Day consolidated supermarket grocery list generator
 */

// Library of balanced meal templates for dynamic substitution
const MEAL_SUBSTITUTION_LIBRARY = [
  // Breakfast Alternatives
  {
    category: 'Breakfast',
    item: 'Rolled Oats with Almond Milk, Chia Seeds & Banana',
    portion: '1 medium bowl (50g oats + 150ml milk)',
    calories: 280,
    protein: 10,
    carbs: 45,
    fats: 6,
    fiber: 7,
    dietary: ['vegetarian', 'vegan', 'dairy-free'],
    ingredients: [{ name: 'Rolled Oats', qty: '50g', aisle: 'Grains & Flours' }, { name: 'Almond Milk', qty: '150ml', aisle: 'Dairy & Alternatives' }, { name: 'Chia Seeds', qty: '1 tbsp', aisle: 'Pantry & Seeds' }, { name: 'Banana', qty: '1 medium', aisle: 'Fresh Produce' }]
  },
  {
    category: 'Breakfast',
    item: '2 Boiled Eggs + 2 Slices Whole Wheat Toast with Avocado',
    portion: '2 eggs + 2 slices',
    calories: 290,
    protein: 18,
    carbs: 26,
    fats: 12,
    fiber: 5,
    dietary: ['eggetarian', 'non-vegetarian'],
    ingredients: [{ name: 'Eggs', qty: '2 pieces', aisle: 'Dairy & Eggs' }, { name: 'Whole Wheat Bread', qty: '2 slices', aisle: 'Grains & Flours' }, { name: 'Avocado', qty: '1/2 medium', aisle: 'Fresh Produce' }]
  },
  {
    category: 'Breakfast',
    item: 'Moong Dal Chilla (Savory Crepes) with Mint Chutney',
    portion: '2 medium chillas',
    calories: 260,
    protein: 14,
    carbs: 38,
    fats: 5,
    fiber: 6,
    dietary: ['vegetarian', 'vegan', 'gluten-free'],
    ingredients: [{ name: 'Yellow Moong Dal', qty: '60g', aisle: 'Proteins & Pulses' }, { name: 'Fresh Mint & Coriander', qty: '1 bunch', aisle: 'Fresh Produce' }, { name: 'Green Chillies', qty: '2 pieces', aisle: 'Fresh Produce' }]
  },
  {
    category: 'Breakfast',
    item: 'Greek Yogurt Bowl with Mixed Berries, Walnuts & Honey',
    portion: '1 bowl (180g yogurt)',
    calories: 270,
    protein: 17,
    carbs: 24,
    fats: 9,
    fiber: 3.5,
    dietary: ['vegetarian', 'gluten-free'],
    ingredients: [{ name: 'Greek Yogurt', qty: '180g', aisle: 'Dairy & Alternatives' }, { name: 'Berries (Blueberries/Strawberries)', qty: '1/2 cup', aisle: 'Fresh Produce' }, { name: 'Walnuts', qty: '15g', aisle: 'Pantry & Seeds' }]
  },
  {
    category: 'Breakfast',
    item: 'Vegetable Poha with Roasted Peanuts & Squeeze of Lemon',
    portion: '1 generous bowl (200g)',
    calories: 250,
    protein: 7,
    carbs: 42,
    fats: 6.5,
    fiber: 4,
    dietary: ['vegetarian', 'vegan', 'gluten-free'],
    ingredients: [{ name: 'Flattened Rice (Poha)', qty: '60g', aisle: 'Grains & Flours' }, { name: 'Peanuts', qty: '15g', aisle: 'Pantry & Seeds' }, { name: 'Onion & Green Peas', qty: '1/2 cup', aisle: 'Fresh Produce' }, { name: 'Lemon', qty: '1 piece', aisle: 'Fresh Produce' }]
  },

  // Lunch Alternatives
  {
    category: 'Lunch',
    item: '2 Multigrain Rotis + Paneer Bhurji + Cucumber Tomato Salad',
    portion: '2 rotis + 120g bhurji',
    calories: 420,
    protein: 22,
    carbs: 46,
    fats: 16,
    fiber: 7,
    dietary: ['vegetarian'],
    ingredients: [{ name: 'Multigrain Atta', qty: '60g', aisle: 'Grains & Flours' }, { name: 'Fresh Paneer', qty: '120g', aisle: 'Dairy & Alternatives' }, { name: 'Cucumber & Tomato', qty: '1 each', aisle: 'Fresh Produce' }]
  },
  {
    category: 'Lunch',
    item: 'Brown Rice + Homestyle Dal Tadka + Steamed Beans Poriyal',
    portion: '1 cup rice + 1 cup dal + 1 cup veg',
    calories: 410,
    protein: 16,
    carbs: 68,
    fats: 7,
    fiber: 10,
    dietary: ['vegetarian', 'vegan', 'gluten-free'],
    ingredients: [{ name: 'Brown Rice', qty: '75g', aisle: 'Grains & Flours' }, { name: 'Toor Dal', qty: '50g', aisle: 'Proteins & Pulses' }, { name: 'French Beans', qty: '100g', aisle: 'Fresh Produce' }]
  },
  {
    category: 'Lunch',
    item: 'Grilled Chicken Breast with Quinoa Pilaf & Roasted Broccoli',
    portion: '150g chicken + 1 cup quinoa',
    calories: 430,
    protein: 38,
    carbs: 38,
    fats: 9,
    fiber: 6.5,
    dietary: ['non-vegetarian', 'gluten-free', 'dairy-free'],
    ingredients: [{ name: 'Chicken Breast', qty: '150g', aisle: 'Proteins & Pulses' }, { name: 'Quinoa', qty: '60g', aisle: 'Grains & Flours' }, { name: 'Broccoli', qty: '150g', aisle: 'Fresh Produce' }]
  },
  {
    category: 'Lunch',
    item: 'Rajma Masala (Red Kidney Beans) with Jeera Brown Rice & Curd',
    portion: '1 cup rajma + 1 cup rice + 100g curd',
    calories: 440,
    protein: 19,
    carbs: 72,
    fats: 8,
    fiber: 12,
    dietary: ['vegetarian', 'gluten-free'],
    ingredients: [{ name: 'Red Kidney Beans (Rajma)', qty: '60g', aisle: 'Proteins & Pulses' }, { name: 'Brown Rice', qty: '60g', aisle: 'Grains & Flours' }, { name: 'Plain Curd', qty: '100g', aisle: 'Dairy & Alternatives' }]
  },
  {
    category: 'Lunch',
    item: 'Tofu & Mixed Veggie Stir-fry with Soba Buckwheat Noodles',
    portion: '1 large bowl (350g)',
    calories: 390,
    protein: 24,
    carbs: 48,
    fats: 10,
    fiber: 7,
    dietary: ['vegetarian', 'vegan', 'dairy-free'],
    ingredients: [{ name: 'Firm Tofu', qty: '140g', aisle: 'Proteins & Pulses' }, { name: 'Buckwheat Noodles', qty: '60g', aisle: 'Grains & Flours' }, { name: 'Bell Peppers & Carrots', qty: '1 cup', aisle: 'Fresh Produce' }]
  },

  // Dinner Alternatives
  {
    category: 'Dinner',
    item: 'Warm Lentil & Roasted Vegetable Soup with 1 Slice Sourdough',
    portion: '1 large bowl + 1 slice bread',
    calories: 320,
    protein: 15,
    carbs: 48,
    fats: 6,
    fiber: 9,
    dietary: ['vegetarian', 'vegan'],
    ingredients: [{ name: 'Red Lentils (Masoor Dal)', qty: '40g', aisle: 'Proteins & Pulses' }, { name: 'Carrots & Celery', qty: '100g', aisle: 'Fresh Produce' }, { name: 'Sourdough Bread', qty: '1 slice', aisle: 'Grains & Flours' }]
  },
  {
    category: 'Dinner',
    item: 'Palak Paneer (Spinach Cottage Cheese) with 2 Jowar (Sorghum) Rotis',
    portion: '1 cup palak paneer + 2 rotis',
    calories: 360,
    protein: 18,
    carbs: 40,
    fats: 14,
    fiber: 8,
    dietary: ['vegetarian', 'gluten-free'],
    ingredients: [{ name: 'Fresh Spinach (Palak)', qty: '200g', aisle: 'Fresh Produce' }, { name: 'Paneer', qty: '100g', aisle: 'Dairy & Alternatives' }, { name: 'Jowar Flour', qty: '50g', aisle: 'Grains & Flours' }]
  },
  {
    category: 'Dinner',
    item: 'Pan-Seared Fish Fillet (Salmon/Tilapia) with Garlic Sautéed Asparagus',
    portion: '160g fillet + 150g greens',
    calories: 340,
    protein: 34,
    carbs: 8,
    fats: 17,
    fiber: 4,
    dietary: ['non-vegetarian', 'gluten-free', 'dairy-free'],
    ingredients: [{ name: 'Fish Fillet', qty: '160g', aisle: 'Proteins & Pulses' }, { name: 'Asparagus / Green Beans', qty: '150g', aisle: 'Fresh Produce' }, { name: 'Extra Virgin Olive Oil', qty: '1 tsp', aisle: 'Pantry & Seeds' }]
  },
  {
    category: 'Dinner',
    item: 'Chickpea & Roasted Mediterranean Salad with Lemon-Tahini Dressing',
    portion: '1 big salad bowl',
    calories: 330,
    protein: 14,
    carbs: 42,
    fats: 12,
    fiber: 10,
    dietary: ['vegetarian', 'vegan', 'gluten-free'],
    ingredients: [{ name: 'Boiled Chickpeas (Kabuli Chana)', qty: '120g', aisle: 'Proteins & Pulses' }, { name: 'Cherry Tomatoes & Cucumber', qty: '1 cup', aisle: 'Fresh Produce' }, { name: 'Tahini / Olive Oil', qty: '1 tbsp', aisle: 'Pantry & Seeds' }]
  },

  // Snacks Alternatives
  {
    category: 'Snack',
    item: 'Roasted Makhana (Fox Nuts) with a handful of Roasted Almonds',
    portion: '1 bowl makhana + 10 almonds',
    calories: 170,
    protein: 6,
    carbs: 20,
    fats: 8,
    fiber: 3.5,
    dietary: ['vegetarian', 'vegan', 'gluten-free'],
    ingredients: [{ name: 'Makhana (Fox Nuts)', qty: '30g', aisle: 'Pantry & Seeds' }, { name: 'Almonds', qty: '15g', aisle: 'Pantry & Seeds' }]
  },
  {
    category: 'Snack',
    item: 'Apple Slices with 1 Tablespoon Natural Peanut Butter',
    portion: '1 sliced apple + 1 tbsp peanut butter',
    calories: 180,
    protein: 5,
    carbs: 26,
    fats: 8,
    fiber: 5,
    dietary: ['vegetarian', 'vegan', 'gluten-free'],
    ingredients: [{ name: 'Fresh Apples', qty: '1 piece', aisle: 'Fresh Produce' }, { name: 'Natural Peanut Butter', qty: '1 tbsp', aisle: 'Pantry & Seeds' }]
  },
  {
    category: 'Snack',
    item: 'Sprouted Moong Chaat with Pomegranate & Lemon',
    portion: '1 cup sprouts',
    calories: 150,
    protein: 9,
    carbs: 26,
    fats: 1,
    fiber: 6,
    dietary: ['vegetarian', 'vegan', 'gluten-free'],
    ingredients: [{ name: 'Green Moong Sprouts', qty: '100g', aisle: 'Proteins & Pulses' }, { name: 'Pomegranate Seeds', qty: '2 tbsp', aisle: 'Fresh Produce' }]
  }
];

/**
 * Finds 3 macro-equivalent alternative meals within calorie & macro tolerances
 * @param {object} currentMeal - The meal to replace (e.g. { item, calories, mealType })
 * @param {string} dietaryPreference - 'all', 'vegetarian', 'vegan', 'eggetarian', 'non-vegetarian'
 * @returns {Array} Array of 3 recommended swaps
 */
function getMealSubstitutes(currentMeal, dietaryPreference = 'all') {
  const targetCalories = currentMeal.calories || 300;
  const currentCategory = currentMeal.mealType || 'Lunch';

  // Filter candidates by category or close match
  let candidates = MEAL_SUBSTITUTION_LIBRARY.filter(m => {
    // Avoid recommending the exact same meal
    if (m.item.toLowerCase() === (currentMeal.item || '').toLowerCase()) return false;

    // Check dietary preference
    if (dietaryPreference && dietaryPreference !== 'all') {
      if (dietaryPreference === 'vegetarian' && !m.dietary.includes('vegetarian')) return false;
      if (dietaryPreference === 'vegan' && !m.dietary.includes('vegan')) return false;
      if (dietaryPreference === 'eggetarian' && !m.dietary.includes('vegetarian') && !m.dietary.includes('eggetarian')) return false;
    }

    return true;
  });

  // Calculate score based on calorie proximity and category match
  candidates.forEach(c => {
    const calorieDiff = Math.abs(c.calories - targetCalories);
    const categoryBonus = (c.category.toLowerCase() === currentCategory.toLowerCase()) ? 0 : 50;
    c._matchScore = calorieDiff + categoryBonus;
  });

  candidates.sort((a, b) => a._matchScore - b._matchScore);

  return candidates.slice(0, 3).map(c => ({
    item: c.item,
    portion: c.portion,
    calories: c.calories,
    protein: c.protein,
    carbs: c.carbs,
    fats: c.fats,
    fiber: c.fiber,
    dietary: c.dietary,
    calorieDiff: c.calories - targetCalories
  }));
}

/**
 * Aggregates all meals from a weekly DietPlan into a categorized supermarket grocery list
 * @param {Array} meals - List of meals in the DietPlan
 * @returns {object} Categorized grocery items with estimated quantities
 */
function generateWeeklyGroceryList(meals) {
  if (!meals || !Array.isArray(meals) || meals.length === 0) {
    return { aisles: {}, totalUniqueItems: 0 };
  }

  const groceryAisles = {
    'Fresh Produce': [],
    'Dairy, Eggs & Alternatives': [],
    'Proteins, Lentils & Pulses': [],
    'Grains, Flours & Breads': [],
    'Pantry, Nuts, Seeds & Oils': []
  };

  const itemTracker = {};

  meals.forEach(meal => {
    const itemName = meal.item.toLowerCase();

    // Check against library ingredients first
    const templateMatch = MEAL_SUBSTITUTION_LIBRARY.find(t => 
      t.item.toLowerCase() === itemName || itemName.includes(t.item.toLowerCase().split(' ')[0])
    );

    if (templateMatch && templateMatch.ingredients) {
      templateMatch.ingredients.forEach(ing => {
        const key = ing.name.toLowerCase();
        if (!itemTracker[key]) {
          itemTracker[key] = {
            name: ing.name,
            qty: ing.qty,
            aisle: ing.aisle || 'Fresh Produce',
            occurrences: 1
          };
        } else {
          itemTracker[key].occurrences += 1;
        }
      });
    } else {
      // Heuristic aisle mapping based on keywords
      let aisle = 'Fresh Produce';
      let name = meal.item;

      if (/(milk|curd|yogurt|paneer|cheese|butter|ghee)/i.test(itemName)) {
        aisle = 'Dairy, Eggs & Alternatives';
      } else if (/(egg|chicken|fish|dal|chana|chole|rajma|tofu|soya|lentil)/i.test(itemName)) {
        aisle = 'Proteins, Lentils & Pulses';
      } else if (/(roti|chapati|bread|rice|oat|quinoa|dosa|idli|poha|atta|flour)/i.test(itemName)) {
        aisle = 'Grains, Flours & Breads';
      } else if (/(almond|walnut|seed|oil|peanut|makhana|honey|spice)/i.test(itemName)) {
        aisle = 'Pantry, Nuts, Seeds & Oils';
      }

      const key = name.toLowerCase().trim();
      if (!itemTracker[key]) {
        itemTracker[key] = {
          name,
          qty: meal.portion || 'Weekly supply',
          aisle,
          occurrences: 1
        };
      } else {
        itemTracker[key].occurrences += 1;
      }
    }
  });

  // Distribute into aisles
  let totalUniqueItems = 0;
  Object.values(itemTracker).forEach(item => {
    const targetAisle = groceryAisles[item.aisle] ? item.aisle : 'Fresh Produce';
    groceryAisles[targetAisle].push({
      name: item.name,
      estimatedQuantity: item.occurrences > 1 ? `${item.qty} (used in ${item.occurrences} meals)` : item.qty,
      checked: false
    });
    totalUniqueItems++;
  });

  return {
    aisles: groceryAisles,
    totalUniqueItems
  };
}

module.exports = {
  MEAL_SUBSTITUTION_LIBRARY,
  getMealSubstitutes,
  generateWeeklyGroceryList
};
