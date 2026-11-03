const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  day: { type: String, required: true },
  mealType: { type: String, required: true }, // 'Breakfast', 'Lunch', 'Evening Snack', 'Dinner'
  item: { type: String, required: true },
  portion: { type: String, default: '1 serving' },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 }, // in grams
  carbs: { type: Number, default: 0 },   // in grams
  fats: { type: Number, default: 0 },    // in grams
  fiber: { type: Number, default: 0 },   // in grams
  tags: { type: [String], default: [] }  // e.g. ['high-protein', 'dairy', 'gluten-free']
});

const dietPlanSchema = new mongoose.Schema({
  dietician: { type: mongoose.Schema.Types.ObjectId, ref: 'Dietician', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goal: { type: String, required: true },
  targetCaloriesDaily: { type: Number, default: 1800 },
  targetProteinDaily: { type: Number, default: 80 },
  targetCarbsDaily: { type: Number, default: 220 },
  targetFatsDaily: { type: Number, default: 50 },
  clinicalNotes: { type: String, default: '' },
  meals: [mealSchema],
  startDate: { type: Date, required: true },
  active: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('DietPlan', dietPlanSchema);
