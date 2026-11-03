const User = require('../models/User');
const Appointment = require('../models/Appointment');
const HealthLog = require('../models/HealthLog');
const MealLog = require('../models/MealLog');
const DietPlan = require('../models/DietPlan');
const { analyzeNaturalLanguageMeal } = require('../utils/nutritionAiService');
const { getMealSubstitutes, generateWeeklyGroceryList } = require('../utils/substitutionEngine');
const { checkMealContraindications } = require('../utils/contraindicationShield');
const { calculateDailyAdherence, getClinicalMetabolicStatus } = require('../utils/adherenceEngine');

// Safe session user ID getter
const getUserId = (req) => req.session?.user?._id || req.session?.user?.id;

// Calculate BMI helper
function calculateBMI(weight, height) {
  if (!weight || !height) return null;
  const h = Number(height) / 100; // cm → m
  const w = Number(weight);
  if (!h || !w || h === 0) return null;
  return (w / (h * h)).toFixed(1);
}

// Determine BMI clinical status
function determineStatus(bmi) {
  if (!bmi) return "No data";
  const n = parseFloat(bmi);
  if (n < 18.5) return "Underweight — Nourishment Focus 💛";
  if (n < 25)   return "Healthy Weight — Optimal Zone 💚";
  if (n < 30)   return "Overweight — Guided Calorie Deficit 🧡";
  return "Obese — Clinical Support Recommended ❤️";
}

// Calculate Basal Metabolic Rate (BMR) via Mifflin-St Jeor equation
function calculateBMR(weight, height, age, gender = 'female') {
  if (!weight || !height || !age) return 1800;
  const w = Number(weight);
  const h = Number(height);
  const a = Number(age);
  // BMR = 10W + 6.25H - 5A + S (S = +5 for male, -161 for female)
  let bmr = (10 * w) + (6.25 * h) - (5 * a);
  bmr += (gender.toLowerCase() === 'male' ? 5 : -161);
  return Math.round(bmr);
}

// -----------------------------------------------------
// USER PROFILE
// -----------------------------------------------------
exports.profile = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      req.session.error = "Please login first";
      return res.redirect('/login');
    }

    const user = await User.findById(userId).lean();
    if (!user) {
      req.session.error = "User not found";
      return res.redirect('/login');
    }

    const latestLog = await HealthLog.findOne({ user: user._id })
      .sort({ date: -1 })
      .lean();

    const bmi = calculateBMI(user.weight, user.height);
    const status = determineStatus(bmi);
    const bmr = calculateBMR(user.weight, user.height, user.age, user.gender);

    res.render('user-profile', { user, bmi, status, bmr, latestLog });
  } catch (err) {
    console.error('PROFILE ERROR:', err);
    res.redirect('/');
  }
};

// -----------------------------------------------------
// EDIT HEALTH PROFILE PAGE
// -----------------------------------------------------
exports.editHealthPage = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.redirect('/login');

    const user = await User.findById(userId).lean();
    if (!user) {
      req.session.error = "User not found";
      return res.redirect('/login');
    }

    res.render('edit-health', { user });
  } catch (err) {
    console.error('EDIT HEALTH PAGE ERROR:', err);
    res.redirect('/user/profile');
  }
};

// -----------------------------------------------------
// UPDATE HEALTH PROFILE
// -----------------------------------------------------
exports.updateHealth = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.redirect('/login');

    const { 
      height, 
      weight, 
      targetWeight, 
      age, 
      gender, 
      dietaryPreference, 
      allergies, 
      healthConditions, 
      dailyCalorieTarget 
    } = req.body;

    const allergiesArray = allergies 
      ? (Array.isArray(allergies) ? allergies : allergies.split(',').map(s => s.trim()).filter(Boolean))
      : [];

    const conditionsArray = healthConditions
      ? (Array.isArray(healthConditions) ? healthConditions : healthConditions.split(',').map(s => s.trim()).filter(Boolean))
      : [];

    await User.findByIdAndUpdate(userId, {
      height: Number(height),
      weight: Number(weight),
      targetWeight: targetWeight ? Number(targetWeight) : undefined,
      age: age ? Number(age) : undefined,
      gender: gender || 'female',
      dietaryPreference: dietaryPreference || 'vegetarian',
      allergies: allergiesArray,
      healthConditions: conditionsArray,
      dailyCalorieTarget: dailyCalorieTarget ? Number(dailyCalorieTarget) : 2000
    });

    req.session.success = "Health profile and dietary preferences updated!";
    res.redirect('/user/profile');
  } catch (err) {
    console.error('UPDATE HEALTH ERROR:', err);
    req.session.error = "Could not update health profile";
    res.redirect('/user/profile');
  }
};

// -----------------------------------------------------
// USER DASHBOARD (Central Health Command Center)
// -----------------------------------------------------
exports.dashboardPage = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      req.session.error = "Please login first";
      return res.redirect('/login');
    }

    const today = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDayName = daysOfWeek[today.getDay()];

    const [user, appts, activePlan, adherenceSummary, clinicalStatus] = await Promise.all([
      User.findById(userId).lean(),
      Appointment.find({ user: userId })
        .populate({ path: 'dietician', populate: { path: 'user', select: 'name email phone profileImage' } })
        .sort({ date: 1 })
        .lean(),
      DietPlan.findOne({ user: userId, active: true })
        .populate({ path: 'dietician', populate: { path: 'user', select: 'name email' } })
        .lean(),
      calculateDailyAdherence(userId, today),
      getClinicalMetabolicStatus(userId)
    ]);

    // Today's scheduled meals from active plan
    let todaysPrescribedMeals = [];
    if (activePlan && activePlan.meals) {
      todaysPrescribedMeals = activePlan.meals.filter(m => m.day === currentDayName);
    }

    // Targets
    const targetCalories = activePlan?.targetCaloriesDaily || user?.dailyCalorieTarget || 2000;
    const targetProtein = activePlan?.targetProteinDaily || 75;
    const targetCarbs = activePlan?.targetCarbsDaily || 220;
    const targetFats = activePlan?.targetFatsDaily || 50;

    // Consumed today
    const consumedCalories = adherenceSummary.macroTotals.calories;
    const consumedProtein = adherenceSummary.macroTotals.protein;
    const consumedCarbs = adherenceSummary.macroTotals.carbs;
    const consumedFats = adherenceSummary.macroTotals.fats;

    res.render('dashboard', {
      user,
      appts,
      activePlan,
      currentDayName,
      todaysPrescribedMeals,
      loggedMeals: adherenceSummary.loggedMeals,
      adherenceScore: adherenceSummary.adherenceScore,
      clinicalStatus,
      targets: {
        calories: targetCalories,
        protein: targetProtein,
        carbs: targetCarbs,
        fats: targetFats
      },
      consumed: {
        calories: consumedCalories,
        protein: consumedProtein,
        carbs: consumedCarbs,
        fats: consumedFats,
        remainingCalories: Math.max(0, targetCalories - consumedCalories)
      }
    });
  } catch (err) {
    console.error('DASHBOARD PAGE ERROR:', err);
    req.session.error = "Could not load dashboard";
    res.redirect('/user/profile');
  }
};

// -----------------------------------------------------
// FEATURE 1: AI NATURAL LANGUAGE FOOD LOG
// -----------------------------------------------------
exports.aiFoodLog = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, error: 'Login required' });

    const { mealText, mealType, status, planMealId, substituteFor } = req.body;
    if (!mealText || !mealText.trim()) {
      return res.status(400).json({ success: false, error: 'Please describe what you ate.' });
    }

    // Run AI NLP Nutritional Analysis
    const analysis = analyzeNaturalLanguageMeal(mealText);
    if (!analysis.success) {
      return res.status(400).json(analysis);
    }

    const today = new Date();
    const startOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[today.getDay()];

    // Create MealLog
    const mealLog = await MealLog.create({
      user: userId,
      date: startOfDay,
      dayOfWeek,
      mealType: mealType || 'Lunch',
      foodName: analysis.items.map(i => i.name).join(', ') || mealText,
      rawInput: mealText,
      portion: analysis.items.map(i => i.quantity).join(', '),
      calories: analysis.totals.calories,
      protein: analysis.totals.protein,
      carbs: analysis.totals.carbs,
      fats: analysis.totals.fats,
      fiber: analysis.totals.fiber,
      healthGrade: analysis.healthGrade,
      healthTip: analysis.healthTip,
      breakdown: analysis.items,
      status: status || 'eaten',
      planMealId: planMealId || null,
      substituteFor: substituteFor || null
    });

    // Update today's HealthLog
    const user = await User.findById(userId).lean();
    const adherence = await calculateDailyAdherence(userId, today);

    await HealthLog.findOneAndUpdate(
      { user: userId, date: startOfDay },
      {
        user: userId,
        date: startOfDay,
        weight: user?.weight || 65,
        loggedCalories: adherence.macroTotals.calories,
        calories: adherence.macroTotals.calories,
        adherenceScore: adherence.adherenceScore,
        $setOnInsert: { waterIntakeMl: 1000, mood: 'Good' }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({
        success: true,
        message: `Meal logged! +${analysis.totals.calories} kcal (${analysis.healthGrade} Grade)`,
        analysis,
        mealLog
      });
    }

    req.session.success = `Meal successfully logged! +${analysis.totals.calories} kcal recorded with Health Grade ${analysis.healthGrade}.`;
    res.redirect('/dashboard');
  } catch (err) {
    console.error('AI FOOD LOG ERROR:', err);
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.status(500).json({ success: false, error: 'Could not log meal: ' + err.message });
    }
    req.session.error = 'Could not log meal';
    res.redirect('/dashboard');
  }
};

// Real-time Preview API for AI Food Logger
exports.previewNutrition = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, error: 'No food text provided' });

    const analysis = analyzeNaturalLanguageMeal(text);
    res.json(analysis);
  } catch (err) {
    console.error('PREVIEW NUTRITION ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// -----------------------------------------------------
// FEATURE 2: MEAL SUBSTITUTION & GROCERY LIST
// -----------------------------------------------------
exports.userDietPlanPage = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.redirect('/login');

    const [user, plan] = await Promise.all([
      User.findById(userId).lean(),
      DietPlan.findOne({ user: userId, active: true })
        .populate({ path: 'dietician', populate: { path: 'user', select: 'name email phone' } })
        .lean()
    ]);

    // Scan for potential contraindications
    const warnings = plan && plan.meals
      ? checkMealContraindications(plan.meals, user?.allergies, user?.healthConditions)
      : [];

    res.render('user-diet-plan', { 
      user,
      plan, 
      warnings,
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    });
  } catch (err) {
    console.error('USER DIET PLAN PAGE ERROR:', err);
    req.session.error = 'Could not load your diet plan';
    res.redirect('/dashboard');
  }
};

// API: Get 3 Smart Substitutes for a meal
exports.getSubstitutes = async (req, res) => {
  try {
    const userId = getUserId(req);
    const user = await User.findById(userId).lean();
    const { item, calories, mealType } = req.query;

    const currentMeal = {
      item: item || 'Standard Meal',
      calories: Number(calories) || 300,
      mealType: mealType || 'Lunch'
    };

    const substitutes = getMealSubstitutes(currentMeal, user?.dietaryPreference || 'all');
    res.json({ success: true, substitutes, currentMeal });
  } catch (err) {
    console.error('GET SUBSTITUTES ERROR:', err);
    res.status(500).json({ success: false, error: 'Could not fetch substitutes' });
  }
};

// POST: 1-Click Swap Meal in Active Diet Plan
exports.swapMeal = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { mealId, newItem, newCalories, newPortion, newProtein, newCarbs, newFats } = req.body;

    const plan = await DietPlan.findOne({ user: userId, active: true });
    if (!plan) {
      req.session.error = "No active diet plan found to swap.";
      return res.redirect('/user/diet-plan');
    }

    const meal = plan.meals.id(mealId);
    if (!meal) {
      req.session.error = "Meal item not found in diet plan.";
      return res.redirect('/user/diet-plan');
    }

    const oldItem = meal.item;
    meal.item = newItem;
    meal.calories = Number(newCalories) || meal.calories;
    if (newPortion) meal.portion = newPortion;
    if (newProtein) meal.protein = Number(newProtein);
    if (newCarbs) meal.carbs = Number(newCarbs);
    if (newFats) meal.fats = Number(newFats);

    await plan.save();

    req.session.success = `Meal swapped! Replaced "${oldItem}" with "${newItem}".`;
    res.redirect('/user/diet-plan');
  } catch (err) {
    console.error('SWAP MEAL ERROR:', err);
    req.session.error = "Could not swap meal: " + err.message;
    res.redirect('/user/diet-plan');
  }
};

// 7-Day Consolidated Supermarket Grocery List
exports.getGroceryList = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.redirect('/login');

    const plan = await DietPlan.findOne({ user: userId, active: true })
      .populate({ path: 'dietician', populate: { path: 'user', select: 'name' } })
      .lean();

    const groceryData = plan && plan.meals ? generateWeeklyGroceryList(plan.meals) : { aisles: {}, totalUniqueItems: 0 };

    res.render('grocery-list', {
      plan,
      groceryAisles: groceryData.aisles,
      totalUniqueItems: groceryData.totalUniqueItems
    });
  } catch (err) {
    console.error('GROCERY LIST ERROR:', err);
    req.session.error = 'Could not load grocery list';
    res.redirect('/user/diet-plan');
  }
};

// -----------------------------------------------------
// FEATURE 3: MEAL COMPLIANCE & CHECK-IN
// -----------------------------------------------------
exports.markMealCompliance = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, error: 'Login required' });

    const { planMealId, status, foodName, calories, protein, carbs, fats } = req.body;
    const today = new Date();
    const startOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[today.getDay()];

    // Upsert or update meal log
    await MealLog.findOneAndUpdate(
      { user: userId, date: startOfDay, planMealId },
      {
        user: userId,
        date: startOfDay,
        dayOfWeek,
        planMealId,
        foodName: foodName || 'Scheduled Meal',
        calories: Number(calories) || 0,
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fats: Number(fats) || 0,
        status: status || 'eaten',
        loggedAt: new Date()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Recalculate daily adherence score
    const adherence = await calculateDailyAdherence(userId, today);

    // Sync with HealthLog
    const user = await User.findById(userId).lean();
    await HealthLog.findOneAndUpdate(
      { user: userId, date: startOfDay },
      {
        user: userId,
        date: startOfDay,
        weight: user?.weight || 65,
        loggedCalories: adherence.macroTotals.calories,
        calories: adherence.macroTotals.calories,
        adherenceScore: adherence.adherenceScore,
        $setOnInsert: { waterIntakeMl: 1000, mood: 'Good' }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({
        success: true,
        adherenceScore: adherence.adherenceScore,
        status
      });
    }

    req.session.success = `Meal marked as ${status}! Adherence updated to ${adherence.adherenceScore}%.`;
    res.redirect('/dashboard');
  } catch (err) {
    console.error('MARK MEAL COMPLIANCE ERROR:', err);
    res.status(500).json({ success: false, error: 'Could not record meal compliance' });
  }
};

// -----------------------------------------------------
// HEALTH LOG UI & SAVING
// -----------------------------------------------------
exports.logPage = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.redirect('/login');

    const user = await User.findById(userId).lean();
    res.render('health-log', { user });
  } catch (err) {
    console.error('LOG PAGE ERROR:', err);
    res.redirect('/user/profile');
  }
};

exports.logToday = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.redirect('/login');

    const today = new Date();
    const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const { weight, waterIntakeMl, calories, mood, note } = req.body;

    // Fetch user and adherence
    const adherence = await calculateDailyAdherence(userId, today);

    await HealthLog.findOneAndUpdate(
      { user: userId, date },
      {
        user: userId,
        date,
        weight: Number(weight),
        waterIntakeMl: Number(waterIntakeMl),
        calories: calories ? Number(calories) : adherence.macroTotals.calories,
        loggedCalories: adherence.macroTotals.calories,
        adherenceScore: adherence.adherenceScore,
        mood: String(mood || 'Good'),
        note: note || ''
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Also sync weight to User profile
    if (weight) {
      await User.findByIdAndUpdate(userId, { weight: Number(weight) });
    }

    req.session.success = "Today's health metrics saved successfully!";
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({ success: true, message: "Health log saved." });
    }

    return res.redirect('/dashboard');
  } catch (err) {
    console.error('LOG TODAY ERROR:', err);
    req.session.error = "Could not save health log";
    res.redirect('/dashboard');
  }
};

exports.getProgress = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ success: false, error: "Login required" });

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const logs = await HealthLog.find({
      user: userId,
      date: { $gte: ninetyDaysAgo }
    })
      .sort({ date: 1 })
      .lean();

    res.json({ success: true, data: logs });
  } catch (err) {
    console.error('GET PROGRESS ERROR:', err);
    res.status(500).json({ success: false, error: 'Could not load progress data' });
  }
};
