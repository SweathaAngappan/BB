const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user','dietician','admin'], default: 'user' },
  
  // Shared fields
  phone: { type: String },

  // User fields
  age: { type: Number },
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'female' },
  height: { type: Number }, // in cm
  weight: { type: Number }, // in kg
  targetWeight: { type: Number },
  dietaryPreference: { 
    type: String, 
    enum: ['all', 'vegetarian', 'vegan', 'eggetarian', 'non-vegetarian', 'jain'], 
    default: 'vegetarian' 
  },
  allergies: { 
    type: [String], 
    default: [] // e.g. ['peanuts', 'lactose', 'gluten', 'soy', 'shellfish', 'eggs'] 
  },
  healthConditions: { 
    type: [String], 
    default: [] // e.g. ['diabetes', 'hypertension', 'pcos', 'thyroid', 'cholesterol'] 
  },
  dailyCalorieTarget: { type: Number, default: 2000 },

  // Generic profile
  profileImage: { type: String },
  bio: { type: String },
  location: { type: String },

  createdAt: { type: Date, default: Date.now }
});

// hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
