const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const ensureLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) return next();
  req.session.error = "Please login first";
  res.redirect('/login');
};

// User Profile
router.get('/profile', ensureLoggedIn, userController.profile);

// Dashboard Page
router.get('/dashboard', ensureLoggedIn, userController.dashboardPage);

// Feature 2: Diet Plan & Smart Pantry
router.get('/diet-plan', ensureLoggedIn, userController.userDietPlanPage);
router.get('/substitutes', ensureLoggedIn, userController.getSubstitutes);
router.post('/swap-meal', ensureLoggedIn, userController.swapMeal);
router.get('/grocery-list', ensureLoggedIn, userController.getGroceryList);

// Feature 1: AI Natural Language Food Log
router.post('/ai-food-log', ensureLoggedIn, userController.aiFoodLog);
router.post('/nutrition-preview', ensureLoggedIn, userController.previewNutrition);

// Feature 3: Meal Compliance Check-in & Adherence
router.post('/meal-compliance', ensureLoggedIn, userController.markMealCompliance);

// Health Metrics Logging & Progress
router.get('/edit-health', ensureLoggedIn, userController.editHealthPage);
router.post('/edit-health', ensureLoggedIn, userController.updateHealth);
router.get('/log', ensureLoggedIn, userController.logPage);
router.post('/log', ensureLoggedIn, userController.logToday);
router.get('/progress', ensureLoggedIn, userController.getProgress);

module.exports = router;
