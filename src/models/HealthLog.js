const mongoose = require('mongoose');

const healthLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  weight: { type: Number, required: true },
  waterIntakeMl: { type: Number, required: true, default: 0 },
  calories: { type: Number, required: true, default: 0 },
  adherenceScore: { type: Number, default: 100 }, // 0 to 100%
  loggedCalories: { type: Number, default: 0 },
  prescribedCalories: { type: Number, default: 2000 },
  mood: { type: String, default: 'Great' },
  note: { type: String, default: '' }
}, {
  timestamps: true
});

healthLogSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HealthLog', healthLogSchema);
