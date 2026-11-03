/**
 * Closed-Loop Diet Adherence & Clinical Alert Engine
 * 1. Calculates daily, weekly, and monthly adherence indices
 * 2. Correlates meal compliance with weight trajectory
 * 3. Detects metabolic plateaus and patient disengagement
 */

const MealLog = require('../models/MealLog');
const HealthLog = require('../models/HealthLog');
const DietPlan = require('../models/DietPlan');

/**
 * Calculates today's adherence score for a user
 * @param {ObjectId} userId
 * @param {Date} date
 * @returns {object} Adherence summary
 */
async function calculateDailyAdherence(userId, date = new Date()) {
  const startOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = daysOfWeek[date.getDay()];

  // Find active diet plan
  const plan = await DietPlan.findOne({ user: userId, active: true }).lean();
  let prescribedMealsCount = 4; // default
  let prescribedToday = [];

  if (plan && plan.meals && plan.meals.length > 0) {
    prescribedToday = plan.meals.filter(m => m.day === dayName);
    if (prescribedToday.length > 0) {
      prescribedMealsCount = prescribedToday.length;
    }
  }

  // Find user's logged meals today
  const logs = await MealLog.find({
    user: userId,
    date: { $gte: startOfDay, $lt: endOfDay }
  }).lean();

  const eatenCount = logs.filter(l => l.status === 'eaten').length;
  const swappedCount = logs.filter(l => l.status === 'swapped').length;
  const skippedCount = logs.filter(l => l.status === 'skipped').length;

  // Weighting: Eaten = 100%, Swapped = 90%, Skipped = 0%
  const effectivePoints = (eatenCount * 1.0) + (swappedCount * 0.9);
  const rawScore = prescribedMealsCount > 0 
    ? Math.min(100, Math.round((effectivePoints / prescribedMealsCount) * 100))
    : 100;

  const totalLoggedCalories = logs.reduce((sum, l) => sum + (l.calories || 0), 0);
  const totalLoggedProtein = logs.reduce((sum, l) => sum + (l.protein || 0), 0);
  const totalLoggedCarbs = logs.reduce((sum, l) => sum + (l.carbs || 0), 0);
  const totalLoggedFats = logs.reduce((sum, l) => sum + (l.fats || 0), 0);

  return {
    date: startOfDay,
    dayName,
    prescribedMealsCount,
    prescribedToday,
    loggedMeals: logs,
    eatenCount,
    swappedCount,
    skippedCount,
    adherenceScore: rawScore,
    macroTotals: {
      calories: totalLoggedCalories,
      protein: totalLoggedProtein,
      carbs: totalLoggedCarbs,
      fats: totalLoggedFats
    }
  };
}

/**
 * Evaluates patient status across 14-30 days to flag metabolic plateaus or adherence drops
 * @param {ObjectId} userId
 * @returns {object} Clinical insight for Dietician & Patient
 */
async function getClinicalMetabolicStatus(userId) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [healthLogs, recentMealLogs, plan] = await Promise.all([
    HealthLog.find({ user: userId, date: { $gte: thirtyDaysAgo } }).sort({ date: 1 }).lean(),
    MealLog.find({ user: userId, date: { $gte: thirtyDaysAgo } }).sort({ date: 1 }).lean(),
    DietPlan.findOne({ user: userId, active: true }).lean()
  ]);

  if (!healthLogs || healthLogs.length === 0) {
    return {
      status: 'insufficient_data',
      badgeClass: 'badge-gray',
      label: 'Needs Baseline Logs',
      adherenceRate7Day: 0,
      weightChangeKg: 0,
      clinicalAlert: 'Encourage client to record daily weigh-ins and meal logs to generate metabolic insights.'
    };
  }

  // Calculate 7-day adherence average
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recent7DayLogs = healthLogs.filter(h => new Date(h.date) >= sevenDaysAgo);
  
  let adherenceRate7Day = 85; // baseline assumption if no logs
  if (recent7DayLogs.length > 0) {
    const sum = recent7DayLogs.reduce((acc, h) => acc + (h.adherenceScore || 80), 0);
    adherenceRate7Day = Math.round(sum / recent7DayLogs.length);
  } else if (recentMealLogs.length > 0) {
    // calculate from meal logs
    const completed = recentMealLogs.filter(m => m.status === 'eaten' || m.status === 'swapped').length;
    adherenceRate7Day = Math.min(100, Math.round((completed / Math.max(recentMealLogs.length, 1)) * 100));
  }

  // Calculate weight trajectory
  const firstWeight = healthLogs[0].weight;
  const lastWeight = healthLogs[healthLogs.length - 1].weight;
  const weightChangeKg = parseFloat((lastWeight - firstWeight).toFixed(1));

  // Determine clinical status
  if (adherenceRate7Day < 50) {
    return {
      status: 'at_risk',
      badgeClass: 'badge-danger',
      label: '⚠️ Low Adherence (<50%)',
      adherenceRate7Day,
      weightChangeKg,
      clinicalAlert: 'Patient compliance has dipped significantly. Review recent meal logs or schedule a brief check-in to adjust caloric flexibility.'
    };
  }

  // Plateau check: 10+ entries, adherence >= 75%, but weight delta between -0.2 and +0.2 kg
  if (healthLogs.length >= 7 && adherenceRate7Day >= 75 && Math.abs(weightChangeKg) <= 0.3) {
    return {
      status: 'plateau_warning',
      badgeClass: 'badge-warning',
      label: '⚡ Metabolic Plateau Detected',
      adherenceRate7Day,
      weightChangeKg,
      clinicalAlert: 'Patient demonstrates excellent plan compliance, but weight trajectory has stalled over 14 days. Suggest 10% caloric reduction or a 48h refeed cycle.'
    };
  }

  return {
    status: 'on_track',
    badgeClass: 'badge-success',
    label: '✅ On Track & Progressing',
    adherenceRate7Day,
    weightChangeKg,
    clinicalAlert: 'Patient exhibits steady adherence and healthy metabolic progression. Keep current macro prescription.'
  };
}

module.exports = {
  calculateDailyAdherence,
  getClinicalMetabolicStatus
};
