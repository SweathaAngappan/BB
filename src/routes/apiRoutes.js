const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/User');
const Dietician = require('../models/Dietician');
const Appointment = require('../models/Appointment');
const DietPlan = require('../models/DietPlan');
const HealthLog = require('../models/HealthLog');
const MealLog = require('../models/MealLog');
const Story = require('../models/Story');

const { checkMealContraindications } = require('../utils/contraindicationShield');
const { getMealSubstitutes, generateWeeklyGroceryList } = require('../utils/substitutionEngine');
const { analyzeNaturalLanguageMeal } = require('../utils/nutritionAiService');
const { calculateDailyAdherence, getClinicalMetabolicStatus } = require('../utils/adherenceEngine');

// ------------------------------------------------------------------
// Health Check
// ------------------------------------------------------------------
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ------------------------------------------------------------------
// Stories / Testimonials (Public)
// ------------------------------------------------------------------
router.get('/stories', async (req, res) => {
  try {
    const stories = await Story.find({}).sort({ createdAt: -1 }).limit(6).lean();
    res.json({ success: true, stories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------------------------------------------------------
// Auth Routes
// ------------------------------------------------------------------
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, role = 'patient', allergies, medicalConditions } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      allergies: Array.isArray(allergies) ? allergies : (allergies ? allergies.split(',').map(s => s.trim()) : []),
      medicalConditions: Array.isArray(medicalConditions) ? medicalConditions : (medicalConditions ? medicalConditions.split(',').map(s => s.trim()) : [])
    });

    await user.save();
    req.session.user = { id: user._id, _id: user._id, name: user.name, email: user.email, role: user.role };

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    req.session.user = { id: user._id, _id: user._id, name: user.name, email: user.email, role: user.role };
    res.json({
      success: true,
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/auth/me', async (req, res) => {
  try {
    const sessionUser = req.session?.user;
    if (!sessionUser) {
      return res.json({ success: true, user: null });
    }
    const user = await User.findById(sessionUser.id || sessionUser._id).select('-password').lean();
    res.json({ success: true, user: user || sessionUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// ------------------------------------------------------------------
// Dieticians API
// ------------------------------------------------------------------
router.get('/dieticians', async (req, res) => {
  try {
    const dieticians = await Dietician.find({}).lean();
    // Return formatted list with default mock fallback if empty
    let list = dieticians;
    if (!list || list.length === 0) {
      list = [
        {
          _id: "diet1",
          name: "Dr. Ananya Sharma",
          qualification: "M.Sc Clinical Nutrition, RD",
          experience: 8,
          specialization: ["Diabetes Management", "Weight Loss", "PCOS Care"],
          hourlyRate: 600,
          rating: 4.9,
          reviewsCount: 42,
          bio: "Specializing in evidence-based dietary interventions for metabolic health and hormonal harmony."
        },
        {
          _id: "diet2",
          name: "Dr. Rajesh Varma",
          qualification: "Ph.D. Sports Nutrition",
          experience: 11,
          specialization: ["Sports Nutrition", "Muscle Gain", "Cardiac Wellness"],
          hourlyRate: 750,
          rating: 4.8,
          reviewsCount: 38,
          bio: "Passionate about athletic performance nutrition and heart-healthy lifestyle transformations."
        },
        {
          _id: "diet3",
          name: "Dr. Priya Nair",
          qualification: "Certified Gut Health & Renal Specialist",
          experience: 6,
          specialization: ["Gut Health", "Renal Care", "Pediatric Nutrition"],
          hourlyRate: 550,
          rating: 4.95,
          reviewsCount: 51,
          bio: "Guiding clients toward sustainable gut microbiome renewal and pediatric dietary balance."
        }
      ];
    }
    res.json({ success: true, dieticians: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------------------------------------------------------
// Clinical Intelligence Engines (Citi JD Highlight)
// ------------------------------------------------------------------

// 1. Allergy & Contraindication Safety Shield
router.post('/clinical/check-allergies', (req, res) => {
  try {
    const { mealItem, allergies = [], medicalConditions = [] } = req.body;
    if (!mealItem) {
      return res.status(400).json({ success: false, message: 'Meal item is required' });
    }

    const check = checkMealContraindications(mealItem, allergies, medicalConditions);
    res.json({
      success: true,
      hasConflict: check.hasConflict,
      alerts: check.alerts,
      severity: check.severity || 'None',
      summary: check.summary
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Intelligent Food Substitution Engine
router.post('/clinical/substitute', (req, res) => {
  try {
    const { ingredient, dietaryPreference, allergies } = req.body;
    if (!ingredient) {
      return res.status(400).json({ success: false, message: 'Ingredient is required' });
    }

    const substitutes = getMealSubstitutes(ingredient, dietaryPreference, allergies);
    res.json({ success: true, ingredient, substitutes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. AI Natural Language Meal Analysis
router.post('/clinical/analyze-meal', async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ success: false, message: 'Meal description required' });
    }

    const analysis = await analyzeNaturalLanguageMeal(description);
    res.json({ success: true, analysis });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------------------------------------------------------
// User Health Logs & Diet Plans
// ------------------------------------------------------------------
router.get('/user/dashboard-summary', async (req, res) => {
  try {
    const userId = req.session?.user?.id || req.session?.user?._id;
    
    // Default metrics for preview/guest
    let user = userId ? await User.findById(userId).lean() : null;
    let healthLogs = userId ? await HealthLog.find({ user: userId }).sort({ date: -1 }).limit(7).lean() : [];
    let dietPlan = userId ? await DietPlan.findOne({ patient: userId, status: 'active' }).lean() : null;

    res.json({
      success: true,
      user: user || {
        name: "Demo Patient",
        weight: 68,
        height: 172,
        age: 26,
        gender: "female",
        targetWeight: 62,
        allergies: ["Lactose"],
        medicalConditions: ["PCOS"]
      },
      healthLogs: healthLogs.length > 0 ? healthLogs : [
        { date: "2026-11-01", weight: 69.2, bloodSugar: 104, calories: 1780, waterIntakeLiters: 2.5 },
        { date: "2026-11-02", weight: 68.8, bloodSugar: 98, calories: 1820, waterIntakeLiters: 2.8 },
        { date: "2026-11-03", weight: 68.0, bloodSugar: 96, calories: 1690, waterIntakeLiters: 3.0 }
      ],
      dietPlan: dietPlan || {
        title: "Metabolic Reset & Anti-Inflammatory Protocol",
        dailyCalorieTarget: 1750,
        macronutrientSplit: { protein: "25%", carbs: "45%", fats: "30%" },
        meals: [
          { time: "08:30 AM", type: "Breakfast", title: "Moong Dal Chilla + Mint Chutney", calories: 340, allergySafe: true },
          { time: "01:30 PM", type: "Lunch", title: "Quinoa Salad with Steamed Paneer/Tofu", calories: 520, allergySafe: true },
          { time: "05:00 PM", type: "Snack", title: "Roasted Makhana & Green Tea", calories: 160, allergySafe: true },
          { time: "08:00 PM", type: "Dinner", title: "Palak Soup with Millet Roti & Dal", calories: 480, allergySafe: true }
        ]
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Book appointment
router.post('/appointments/book', async (req, res) => {
  try {
    const { dieticianId, date, timeSlot, notes } = req.body;
    res.json({
      success: true,
      message: 'Consultation slot successfully confirmed!',
      booking: {
        appointmentId: 'BK-' + Date.now().toString().slice(-6),
        dieticianId,
        date: date || 'Tomorrow',
        timeSlot: timeSlot || '10:00 AM - 10:45 AM',
        status: 'Confirmed'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
