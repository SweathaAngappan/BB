const mongoose = require('mongoose');

const mealLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true }, // Normalized to UTC start of day
  dayOfWeek: { type: String, required: true },
  mealType: { 
    type: String, 
    enum: ['Breakfast', 'Morning Snack', 'Lunch', 'Evening Snack', 'Dinner', 'Snack', 'Other'], 
    default: 'Other' 
  },
  foodName: { type: String, required: true },
  rawInput: { type: String }, // User's natural language input
  portion: { type: String, default: '1 serving' },
  calories: { type: Number, required: true, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fats: { type: Number, default: 0 },
  fiber: { type: Number, default: 0 },
  healthGrade: { type: String, default: 'A' }, // 'A+', 'A', 'B', 'C', 'D'
  healthTip: { type: String, default: '' },
  breakdown: [{
    item: String,
    quantity: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number
  }],
  status: { 
    type: String, 
    enum: ['eaten', 'swapped', 'skipped', 'extra'], 
    default: 'eaten' 
  },
  planMealId: { type: String }, // Links to a DietPlan meal if tracked against prescribed plan
  substituteFor: { type: String }, // If swapped, what original item it replaced
  loggedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

mealLogSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('MealLog', mealLogSchema);
